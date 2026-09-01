import { useState } from "react";
import { Eye, EyeSlash, LockKey, Wallet } from "@phosphor-icons/react";
import { authClient } from "./auth-client.js";

export function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const result = mode === "signup"
      ? await authClient.signUp.email({ name: String(data.get("name") || "").trim(), email, password })
      : await authClient.signIn.email({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message || "We could not complete that request.");
  };

  const resetPassword = async () => {
    const email = document.getElementById("auth-email")?.value.trim();
    if (!email) { setMessage("Enter your email address first."); return; }
    setBusy(true);
    const result = await authClient.requestPasswordReset({ email, redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false); setMessage(result.error ? (result.error.message || "Could not send the reset email.") : "If that account exists, a reset link has been sent.");
  };

  return <main className="auth-shell"><section className="auth-story"><div className="auth-brand"><span><Wallet weight="fill" /></span><div><strong>Pocket Ledger</strong><small>Indian Daily Expense Tracker</small></div></div><div><span className="eyebrow">Private household finance</span><h1>Every rupee,<br />clearly accounted for.</h1><p>Your expenses, merchant advances, credit limits and monthly budgets now stay securely connected to your account.</p></div><div className="auth-trust"><LockKey size={20} weight="duotone" /><span><strong>Account-protected ledger</strong><small>Your records are separated from every other user.</small></span></div></section><section className="auth-panel"><div className="auth-card"><span className="eyebrow">Welcome to Pocket Ledger</span><h2>{mode === "signup" ? "Create your account" : "Sign in to your ledger"}</h2><p>{mode === "signup" ? "Use at least 12 characters for your password." : "Continue where you left off on any connected device."}</p><div className="auth-tabs" role="tablist" aria-label="Authentication mode"><button type="button" role="tab" aria-selected={mode === "signin"} onClick={() => { setMode("signin"); setMessage(""); }}>Sign in</button><button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => { setMode("signup"); setMessage(""); }}>Create account</button></div><form onSubmit={submit}>{mode === "signup" && <label htmlFor="auth-name"><span>Your name</span><input id="auth-name" name="name" autoComplete="name" maxLength="80" required /></label>}<label htmlFor="auth-email"><span>Email address</span><input id="auth-email" name="email" type="email" inputMode="email" autoComplete="username" required /></label><label htmlFor="auth-password"><span>Password</span><span className="password-field"><input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength="12" maxLength="128" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeSlash /> : <Eye />}</button></span></label>{mode === "signin" && <button className="auth-link" type="button" onClick={resetPassword}>Forgot password?</button>}<button className="primary-button auth-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create secure account" : "Sign in"}</button><p className="auth-message" aria-live="polite">{message}</p></form></div></section></main>;
}

export function ImportChoice({ state, onImport, onFresh, busy, message }) {
  return <main className="auth-shell import-shell"><section className="auth-story"><div className="auth-brand"><span><Wallet weight="fill" /></span><div><strong>Pocket Ledger</strong><small>Secure setup</small></div></div><div><span className="eyebrow">One-time data choice</span><h1>Bring your existing ledger with you.</h1><p>We found expense data saved on this device. Choose whether to move it into your new account or begin with an empty ledger.</p></div></section><section className="auth-panel"><div className="auth-card"><span className="eyebrow">Ready to connect</span><h2>Choose your starting point</h2><div className="import-summary"><strong>{state.expenses.length} expenses</strong><span>{state.archivedExpenses?.length || 0} archived changes · 10 merchant ledgers</span></div><button className="primary-button auth-submit" type="button" onClick={onImport} disabled={busy}>Import this device’s data</button><button className="secondary-button auth-submit" type="button" onClick={onFresh} disabled={busy}>Start with an empty ledger</button><p className="auth-message" aria-live="polite">{message}</p></div></section></main>;
}

export function ResetPasswordScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const token = new URLSearchParams(window.location.search).get("token");
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setMessage("");
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const result = await authClient.resetPassword({ newPassword: password, token });
    setBusy(false);
    if (result.error) setMessage(result.error.message || "This reset link is invalid or expired.");
    else { window.history.replaceState({}, "", "/"); setMessage("Password updated. You can now sign in."); window.setTimeout(() => window.location.reload(), 900); }
  };
  return <main className="auth-shell"><section className="auth-story"><div className="auth-brand"><span><Wallet weight="fill" /></span><div><strong>Pocket Ledger</strong><small>Secure account recovery</small></div></div><div><span className="eyebrow">Password reset</span><h1>Choose a new secure password.</h1><p>Your other signed-in sessions will be revoked when the password changes.</p></div></section><section className="auth-panel"><div className="auth-card"><span className="eyebrow">Account recovery</span><h2>Reset your password</h2>{token ? <form onSubmit={submit}><label htmlFor="new-password"><span>New password</span><span className="password-field"><input id="new-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength="12" maxLength="128" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeSlash /> : <Eye />}</button></span></label><button className="primary-button auth-submit" type="submit" disabled={busy}>{busy ? "Updating…" : "Set new password"}</button></form> : <p>This reset link is incomplete or expired. Return to sign in and request a new link.</p>}<p className="auth-message" aria-live="polite">{message}</p><a className="auth-link" href="/">Return to sign in</a></div></section></main>;
}
