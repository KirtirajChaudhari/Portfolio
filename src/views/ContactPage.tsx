import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { siteMeta as meta } from '../content/shared';
import PageShell from '../components/shell/PageShell';
import Reveal from '../components/shell/Reveal';

const REASONS = ['A role', 'Collaboration', 'Research', 'Something else'];
const prettyPhone = meta.phone.replace(/^(\+\d{2})(\d{5})(\d{5})$/, '$1 $2 $3');

const ELSEWHERE = [
  { label: 'GitHub', href: meta.socials.github },
  { label: 'LinkedIn', href: meta.socials.linkedin },
  { label: 'Instagram', href: meta.socials.instagram },
  { label: 'YouTube', href: meta.socials.youtube },
].filter((l): l is { label: string; href: string } => !!l.href);

const field =
  'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-[15px] text-white placeholder:text-white/40 transition-colors duration-300 focus:border-white/50 focus:outline-none';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', reason: REASONS[0], subject: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const bind = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  /* No backend: this opens a pre-filled draft in the visitor's mail app. */
  const send = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSent(false);
    const f = { ...form, name: form.name.trim(), email: form.email.trim(), subject: form.subject.trim(), message: form.message.trim() };
    if (!f.name || !f.email || !f.subject || !f.message) {
      setError('Please fill in every field first.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) {
      setError("That email address doesn't look right.");
      return;
    }
    const body = `${f.message}\n\n-\nFrom: ${f.name}\nEmail: ${f.email}\nReason: ${f.reason}`;
    window.location.href =
      `mailto:${meta.email}?subject=${encodeURIComponent(`[${f.reason}] ${f.subject}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <PageShell title="Contact">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-20">
        <div>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
            Let's talk.
          </h1>
          <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-[#f7ece7]/80">
            I'm open to AI/ML roles, and happy to work on research or product problems with other people.
            Email is the quickest way to reach me, and I usually reply within a day.
          </p>

          <dl className="mt-12 space-y-7">
            <div>
              <dt className="text-sm text-[#f7ece7]/55">Email</dt>
              <dd className="mt-1 text-xl sm:text-2xl">
                <a className="underline decoration-white/30 underline-offset-8 transition-colors hover:decoration-white" href={`mailto:${meta.email}`}>
                  {meta.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[#f7ece7]/55">Phone</dt>
              <dd className="mt-1 text-xl"><a className="hover:underline" href={`tel:${meta.phone}`}>{prettyPhone}</a></dd>
            </div>
            <div>
              <dt className="text-sm text-[#f7ece7]/55">Based in</dt>
              <dd className="mt-1 text-xl">{meta.location}</dd>
            </div>
          </dl>

          <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-8">
            {ELSEWHERE.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-[#f7ece7]/80 hover:text-white"
                >
                  {l.label}
                  <ArrowUpRight size={14} strokeWidth={1.75} />
                </a>
              </li>
            ))}
            <li>
              <a href={meta.resumeUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[#f7ece7]/80 hover:text-white">
                Resume
                <ArrowUpRight size={14} strokeWidth={1.75} />
              </a>
            </li>
          </ul>
        </div>

        <Reveal delay={0.1}>
          {/* The one glass surface on this page: it is the thing you act on. */}
          <form
            noValidate
            onSubmit={send}
            className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_30px_60px_-30px_rgb(0_0_0/0.6)] backdrop-blur-xl sm:p-8"
          >
            <h2 className="text-xl font-semibold text-white">Write to me</h2>
            <p className="mt-1 text-sm text-[#f7ece7]/60">This opens a draft in your mail app.</p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm text-[#f7ece7]/80">Your name</span>
                <input className={field} type="text" name="name" autoComplete="name" {...bind('name')} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-[#f7ece7]/80">Your email</span>
                <input className={field} type="email" name="email" autoComplete="email" placeholder="you@company.com" {...bind('email')} />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-[#f7ece7]/80">What it's about</span>
                  <select className={`${field} appearance-none`} name="reason" {...bind('reason')}>
                    {REASONS.map((r) => <option key={r} className="text-neutral-900">{r}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-[#f7ece7]/80">Subject</span>
                  <input className={field} type="text" name="subject" {...bind('subject')} />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm text-[#f7ece7]/80">Message</span>
                <textarea className={`${field} resize-y`} name="message" rows={5} placeholder="What are you working on?" {...bind('message')} />
              </label>
            </div>

            {error && <p role="alert" className="mt-5 text-sm text-[#ffb4a8]">{error}</p>}
            {!error && sent && (
              <p role="status" className="mt-5 text-sm text-[#f7ece7]/80">
                Your mail app should have opened with the message ready. Just press send there.
              </p>
            )}

            <button
              type="submit"
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-semibold text-neutral-900 transition-transform duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
            >
              Send message
              <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </span>
            </button>
          </form>
        </Reveal>
      </div>
    </PageShell>
  );
}
