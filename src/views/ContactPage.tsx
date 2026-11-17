import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import Page from '../components/site/Page';
import { siteMeta as meta } from '../content/shared';

const REASONS = ['A role', 'Collaboration', 'Research', 'Something else'];
const prettyPhone = meta.phone.replace(/^(\+\d{2})(\d{5})(\d{5})$/, '$1 $2 $3');

const ELSEWHERE = [
  { label: 'GitHub', href: meta.socials.github },
  { label: 'LinkedIn', href: meta.socials.linkedin },
  { label: 'Instagram', href: meta.socials.instagram },
  { label: 'YouTube', href: meta.socials.youtube },
  { label: 'Résumé', href: meta.resumeUrl },
].filter((l): l is { label: string; href: string } => !!l.href);

type Fields = { name: string; email: string; reason: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const trimmed = (f: Fields): Fields => ({
  ...f, name: f.name.trim(), email: f.email.trim(), subject: f.subject.trim(), message: f.message.trim(),
});

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name) e.name = 'Add your name.';
  if (!f.email) e.email = 'Add an email address I can reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'That address is missing something. It should look like name@example.com.';
  if (!f.subject) e.subject = 'Add a subject.';
  if (!f.message) e.message = 'Write a line or two about what you have in mind.';
  return e;
}

export default function ContactPage() {
  const [form, setForm] = useState<Fields>({ name: '', email: '', reason: REASONS[0], subject: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyAttempt = useRef(0);
  const copied = copyState === 'copied';

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyAttempt.current++;
  }, []);

  const bind = (k: keyof Fields) => ({
    id: `contact-${k}`,
    name: k,
    value: form[k],
    required: k !== 'reason',
    onChange: (e: { target: { value: string } }) => {
      const next = { ...form, [k]: e.target.value };
      setForm(next);
      setSent(false);
      // Keep partial/invalid input marked until it passes the submit validator.
      if (errors[k] && !validate(trimmed(next))[k]) {
        setErrors((current) => {
          const remaining = { ...current };
          delete remaining[k];
          return remaining;
        });
      }
    },
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `contact-${k}-error` : undefined,
  });
  const problem = (k: keyof Fields) => errors[k] && <p id={`contact-${k}-error`} className="field-error">{errors[k]}</p>;

  /* No backend: this opens a pre-filled draft in the visitor's mail app. */
  const send = (e: FormEvent) => {
    e.preventDefault();
    setSent(false);
    const f = trimmed(form);
    const found = validate(f);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    const body = `${f.message}\n\n-\nFrom: ${f.name}\nEmail: ${f.email}\nReason: ${f.reason}`;
    window.location.href = `mailto:${meta.email}?subject=${encodeURIComponent(`[${f.reason}] ${f.subject}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copy = async () => {
    const attempt = ++copyAttempt.current;
    if (copyTimer.current) clearTimeout(copyTimer.current);
    setCopyState('idle');
    try {
      await navigator.clipboard.writeText(meta.email);
      if (attempt !== copyAttempt.current) return;
      setCopyState('copied');
      copyTimer.current = setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      if (attempt === copyAttempt.current) setCopyState('error');
    }
  };

  return (
    <Page close={false}>
      <header className="wrap intro pb-16 pt-14 sm:pt-20">
        <h1 className="t-display" style={{ '--i': 0 } as React.CSSProperties}>Let's talk.</h1>
        <p className="t-lede mt-6" style={{ '--i': 1 } as React.CSSProperties}>
          I'm open to AI/ML roles, and happy to work on research or product problems with other people. Email is the
          quickest way to reach me, and I usually reply within a day.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4" style={{ '--i': 2 } as React.CSSProperties}>
          <a href={`mailto:${meta.email}`} className="t-h2 link break-all [text-decoration-thickness:2px] sm:break-normal">
            {meta.email}
          </a>
          <button type="button" onClick={copy} aria-describedby="copy-address-status" className="button button-line">
            {copied ? <Check size={16} strokeWidth={1.75} aria-hidden="true" /> : <Copy size={16} strokeWidth={1.75} aria-hidden="true" />}
            <span>{copied ? 'Copied' : 'Copy address'}</span>
          </button>
        </div>
        <p id="copy-address-status" role="status" className="mt-3 min-h-6 text-sm text-fg-2">
          {copied && 'Email address copied.'}
          {copyState === 'error' && "Copy failed. Select the address above."}
        </p>
      </header>

      <div className="wrap grid gap-x-16 gap-y-16 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section aria-labelledby="elsewhere-title">
          <h2 id="elsewhere-title" className="t-h3">Elsewhere</h2>
          <ul className="ledger mt-6">
            <li>
              <a href={`tel:${meta.phone}`} className="row-link flex min-h-14 items-center justify-between gap-4 py-3">
                <span>Phone</span>
                <span className="font-data text-[0.9375rem] text-fg-2">{prettyPhone}</span>
              </a>
            </li>
            <li className="flex min-h-14 items-center justify-between gap-4 py-3">
              <span>Based in</span>
              <span className="text-fg-2">{meta.location}</span>
            </li>
            {ELSEWHERE.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener" className="row-link flex min-h-14 items-center justify-between gap-4 py-3">
                  <span>{l.label}<span className="sr-only"> (opens in a new tab)</span></span>
                  <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" className="row-arrow text-fg-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <form noValidate onSubmit={send} aria-labelledby="form-title">
          <h2 id="form-title" className="t-h3">Write to me</h2>
          <p className="mt-2 text-[0.9375rem] text-fg-2">
            This opens a draft in your mail app. If nothing opens, use the address above.
          </p>

          <div className="mt-7 grid gap-5">
            <div>
              <label className="field-label" htmlFor="contact-name">Your name</label>
              <input className="field-input" type="text" autoComplete="name" {...bind('name')} />
              {problem('name')}
            </div>
            <div>
              <label className="field-label" htmlFor="contact-email">Your email</label>
              <input className="field-input" type="email" autoComplete="email" inputMode="email" {...bind('email')} />
              {problem('email')}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="contact-reason">What it's about</label>
                <select className="field-input" {...bind('reason')}>
                  {REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="contact-subject">Subject</label>
                <input className="field-input" type="text" {...bind('subject')} />
                {problem('subject')}
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="contact-message">Message</label>
              <textarea className="field-input resize-y" rows={6} {...bind('message')} />
              {problem('message')}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="submit" className="button">
              Open the draft
              <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <p role="status" className="text-[0.9375rem] text-fg-2">
              {sent && 'Your mail app should have opened with the message ready. Press send there.'}
            </p>
          </div>
        </form>
      </div>
    </Page>
  );
}
