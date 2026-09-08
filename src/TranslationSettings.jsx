import { useState } from 'react';
import { languageDetails } from './i18n.js';

export function TranslationSettings({ language, translations = {}, onChange }) {
  const [source, setSource] = useState('');
  const [translation, setTranslation] = useState('');
  const entries = translations[language] || [];
  const save = (event) => {
    event.preventDefault();
    if (!source.trim() || !translation.trim()) return;
    const next = entries.filter((entry) => entry.source !== source.trim());
    onChange({ ...translations, [language]: [...next, { source: source.trim(), translation: translation.trim() }] });
    setSource(''); setTranslation('');
  };
  return <section className="module-card translation-settings"><h2>Offline translation corrections</h2><p>No text is sent to a translation provider. Built-in phrases translate on this device. Unfamiliar names and sentences remain in their original language until a translation is supplied.</p><p>Add an exact display translation for {languageDetails(language).nativeName}. Originals, search values and editable records remain unchanged. Corrections sync securely with your ledger account.</p><form onSubmit={save} className="payment-filter-grid" data-no-translate><label>Original text<input value={source} onChange={(event) => setSource(event.target.value)} maxLength={300} required /></label><label>Display translation ({languageDetails(language).nativeName})<input value={translation} onChange={(event) => setTranslation(event.target.value)} maxLength={600} required dir="auto" /></label><button className="secondary-button" disabled={entries.length >= 500 && !entries.some((entry) => entry.source === source.trim())}>Save translation</button></form><div className="translation-corrections" data-no-translate>{entries.map((entry) => <div key={entry.source}><span dir="auto">{entry.source} → {entry.translation}</span><button className="text-button" onClick={() => { setSource(entry.source); setTranslation(entry.translation); }}>Edit</button><button className="text-button" onClick={() => onChange({ ...translations, [language]: entries.filter((item) => item.source !== entry.source) })}>Remove</button></div>)}</div></section>;
}
