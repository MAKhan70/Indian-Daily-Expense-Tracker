import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import path from "node:path";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth, trustedOrigins } from "./auth.js";
import { emptyLedgerState } from "./defaults.js";
import { replaceLedgerState, readLedgerState, userHasLedgerData } from "./state-repository.js";
import { stateSchema } from "./validation.js";

declare global { namespace Express { interface Request { userId?: string } } }

export function createServer() {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: { directives: { imgSrc: ["'self'", "data:"], connectSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"] } }, crossOriginResourcePolicy: { policy: "same-origin" } }));
  app.use((req, _res, next) => {
    if (!req.headers["x-forwarded-for"] && req.socket.remoteAddress) req.headers["x-forwarded-for"] = req.socket.remoteAddress;
    next();
  });
  app.all("/api/auth/*splat", toNodeHandler(auth));
  app.use(express.json({ limit: "1mb" }));
  app.use("/api", (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    const origin = req.get("origin");
    if (origin && !trustedOrigins.includes(origin)) return res.status(403).json({ error: "Untrusted request origin" });
    return next();
  });
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  const requireSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
      if (!session?.user?.id) return res.status(401).json({ error: "Authentication required" });
      req.userId = session.user.id;
      return next();
    } catch { return res.status(401).json({ error: "Authentication required" }); }
  };
  app.get("/api/state", requireSession, async (req, res, next) => { try { res.json(await readLedgerState(req.userId!)); } catch (error) { next(error); } });
  app.post("/api/state/import", requireSession, async (req, res, next) => { try { if (await userHasLedgerData(req.userId!)) return res.status(409).json({ error: "Cloud data already exists; import was not applied." }); return res.status(201).json(await replaceLedgerState(req.userId!, stateSchema.parse(req.body), true)); } catch (error) { return next(error); } });
  app.put("/api/state", requireSession, async (req, res, next) => { try { res.json(await replaceLedgerState(req.userId!, stateSchema.parse(req.body), true)); } catch (error) { next(error); } });
  app.post("/api/state/start-fresh", requireSession, async (req, res, next) => { try { if (await userHasLedgerData(req.userId!)) return res.status(409).json({ error: "Cloud data already exists." }); res.status(201).json(await replaceLedgerState(req.userId!, stateSchema.parse(emptyLedgerState()), true)); } catch (error) { next(error); } });

  if (process.env.NODE_ENV === "production") {
    const clientDirectory = path.resolve(process.cwd(), "dist/client");
    app.use(express.static(clientDirectory, { index: false, maxAge: "1y", immutable: true }));
    app.get("/{*splat}", (req, res, next) => req.path.startsWith("/api/") ? next() : res.sendFile(path.join(clientDirectory, "index.html")));
  }
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error && typeof error === "object" && "issues" in error) return res.status(400).json({ error: "Invalid ledger data", details: (error as { issues: unknown }).issues });
    console.error("Request failed", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ error: "Something went wrong" });
  });
  return app;
}

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT || 3001);
  createServer().listen(port, "0.0.0.0", () => console.log(`Pocket Ledger API listening on ${port}`));
}
