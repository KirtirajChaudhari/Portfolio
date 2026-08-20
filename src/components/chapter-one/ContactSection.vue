<template>
  <section id="contact" class="section tile--parchment">
    <div class="container container--text">
      <p class="eyebrow-label eyebrow rise" :class="{ 'is-in': vis }">Contact</p>
      <div class="section-head rise" :class="{ 'is-in': vis }" style="--d: 90ms">
        <h2 class="display-md">Let's build something accountable</h2>
        <p>Open to AI/ML roles, research collaborations, and problems where the answer has to be defensible.</p>
      </div>

      <!-- edit-profile: header bar, form | live preview, footer meta + actions. -->
      <form class="panel" :class="{ 'is-in': vis }" novalidate @submit.prevent="send">
        <header class="panel__head">
          <h3>Send me a message</h3>
          <span class="panel__status"><span class="pulse-dot"></span> Open to work</span>
        </header>

        <div class="panel__body">
          <div class="panel__form">
            <label class="field">
              <span class="field__label">Full name</span>
              <input v-model.trim="form.name" type="text" name="name" placeholder="Kirtiraj Chaudhari" />
            </label>

            <label class="field">
              <span class="field__label">Email</span>
              <input v-model.trim="form.email" type="email" name="email" placeholder="you@company.com" />
            </label>

            <div class="field-row">
              <label class="field">
                <span class="field__label">Reason</span>
                <span class="field__wrap">
                  <select v-model="form.reason" name="reason">
                    <option v-for="r in reasons" :key="r">{{ r }}</option>
                  </select>
                  <svg class="field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </span>
              </label>

              <label class="field">
                <span class="field__label">Subject</span>
                <input v-model.trim="form.subject" type="text" name="subject" placeholder="Short summary" />
              </label>
            </div>

            <label class="field">
              <span class="field__label">Message</span>
              <textarea v-model.trim="form.message" name="message" rows="5" placeholder="What are you building?"></textarea>
            </label>

            <p v-if="error" class="panel__error" role="alert">{{ error }}</p>
            <p v-else-if="sent" class="panel__ok" role="status">
              Your mail client should be open with the message ready — hit send there.
            </p>
          </div>

          <div class="panel__divider" aria-hidden="true"></div>

          <aside class="panel__preview">
            <span class="panel__preview-label mono-xs">Goes to</span>

            <div class="panel__avatar">
              <img src="/avatars/professional-full.png" :alt="meta.fullName" />
              <span class="panel__avatar-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </span>
            </div>

            <h4>{{ meta.fullName }}</h4>
            <p class="panel__role">{{ meta.role }}</p>

            <div class="panel__chips">
              <span class="panel__chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Replies within a day
              </span>
              <span class="panel__chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                {{ meta.location }}
              </span>
            </div>

            <div class="panel__direct">
              <a :href="`mailto:${meta.email}`">{{ meta.email }}</a>
              <a :href="`tel:${meta.phone}`">{{ prettyPhone }}</a>
            </div>
          </aside>
        </div>

        <footer class="panel__foot">
          <div class="panel__foot-left">
            <span class="mono-xs">Or reach me on</span>
            <ConnectButtons />
          </div>
          <div class="panel__foot-right">
            <a :href="meta.resumeUrl" target="_blank" rel="noopener" class="btn btn--ghost">Résumé</a>
            <button type="submit" class="btn btn--primary">Send message</button>
          </div>
        </footer>
      </form>
    </div>

    <footer class="footer">
      <div class="container footer__inner">
        <div>
          <div class="footer__name">{{ meta.fullName }}</div>
          <p class="footer__tagline">{{ tagline }}</p>
        </div>
        <ConnectButtons />
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { siteMeta as meta } from '../../content/shared';
import { useReveal } from '../../composables/motion';
import ConnectButtons from '../ui/ConnectButtons.vue';

const vis = useReveal('contact', 0.06);

const tagline = 'Machine learning that shows its work — built for the rooms where a wrong answer costs something.';
const reasons = ['A role', 'Collaboration', 'Research', 'Something else'];

const form = reactive({ name: '', email: '', reason: reasons[0], subject: '', message: '' });
const error = ref('');
const sent = ref(false);

const prettyPhone = computed(() => meta.phone.replace(/^(\+\d{2})(\d{5})(\d{5})$/, '$1 $2 $3'));

/*
 * ponytail: no backend — submit composes a mailto: draft in the user's client.
 * Swap for a Formspree/Resend POST here if you want delivery without a mail app.
 */
function send() {
  error.value = '';
  sent.value = false;

  if (!form.name || !form.email || !form.subject || !form.message) {
    error.value = 'Please fill in every field before sending.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
    error.value = 'That email address does not look right.';
    return;
  }

  const body = `${form.message}\n\n—\nFrom: ${form.name}\nEmail: ${form.email}\nReason: ${form.reason}`;
  window.location.href =
    `mailto:${meta.email}?subject=${encodeURIComponent(`[${form.reason}] ${form.subject}`)}&body=${encodeURIComponent(body)}`;
  sent.value = true;
}
</script>

<style scoped>
.rise {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
              transform var(--dur-reveal) var(--ease-out);
  transition-delay: var(--d, 0ms);
}
.rise.is-in { opacity: 1; transform: none; }

.eyebrow-label { margin-bottom: var(--sp-3); }

/* ============================================================
   Panel — a white utility card, not a floating slab.
   ============================================================ */
.panel {
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface-solid);
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--dur-reveal) var(--ease-out),
              transform var(--dur-reveal) var(--ease-out);
}
.panel.is-in { opacity: 1; transform: none; }

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-6);
  border-bottom: 1px solid var(--border);
}
.panel__head h3 {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.022em;
}
.panel__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  letter-spacing: -0.016em;
  color: var(--accent);
  border: 1px solid var(--border-accent);
  border-radius: var(--r-pill);
  padding: 4px 14px;
}
.panel__status .pulse-dot { width: 6px; height: 6px; }

.panel__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 0.62fr);
  gap: var(--sp-6);
  padding: var(--sp-6);
}
@media (max-width: 880px) {
  .panel__body { grid-template-columns: minmax(0, 1fr); }
  .panel__divider { display: none; }
}
.panel__divider { background: var(--border); }

/* --- Fields --- */
.panel__form { display: flex; flex-direction: column; gap: var(--sp-4); }
.field { display: flex; flex-direction: column; gap: 7px; }
.field__label {
  font-size: 12px;
  letter-spacing: -0.01em;
  color: var(--text-faint);
}
/* search-input grammar: 17px body, hairline, pill for the single-line
   fields; the textarea keeps a radius it can actually hold. */
.field input,
.field select,
.field textarea {
  width: 100%;
  font-family: var(--font-body);
  font-size: 17px;
  letter-spacing: -0.022em;
  color: var(--text);
  background: var(--surface-solid);
  border: 1px solid var(--border-hair);
  border-radius: var(--r-pill);
  padding: 11px 20px;
  min-height: 44px;
  outline: none;
  transition: border-color 240ms var(--ease-out);
}
.field textarea {
  resize: vertical;
  min-height: 120px;
  border-radius: var(--r-md);
}
.field input::placeholder,
.field textarea::placeholder { color: var(--text-faint); }
.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: var(--accent-focus);
  box-shadow: inset 0 0 0 1px var(--accent-focus);
}
.field select { appearance: none; cursor: pointer; }
.field select option { background: var(--surface-solid); color: var(--text); }
.field__wrap { position: relative; display: block; }
.field__icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px; height: 16px;
  color: var(--text-faint);
  pointer-events: none;
}

.field-row {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: var(--sp-4);
}
@media (max-width: 560px) { .field-row { grid-template-columns: minmax(0, 1fr); } }

.panel__error { color: #b3261e; font-size: 14px; letter-spacing: -0.016em; }
.panel__ok { color: var(--accent); font-size: 14px; letter-spacing: -0.016em; }

/* --- Preview --- */
.panel__preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--sp-3);
  padding: var(--sp-5);
  border-radius: var(--r-lg);
  background: var(--surface-2);
}
.panel__preview-label { color: var(--text-faint); }

.panel__avatar { position: relative; margin-top: var(--sp-2); }
.panel__avatar img {
  width: 96px; height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.panel__avatar-badge {
  position: absolute;
  right: 0;
  bottom: 2px;
  display: grid;
  place-items: center;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  border: 2px solid var(--surface-solid);
}
.panel__avatar-badge svg { width: 14px; height: 14px; }

.panel__preview h4 {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.022em;
  color: var(--text);
}
.panel__role {
  font-size: 14px;
  letter-spacing: -0.016em;
  color: var(--text-muted);
}
.panel__chips { display: flex; flex-direction: column; gap: 7px; width: 100%; margin-top: var(--sp-2); }
.panel__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 12px;
  letter-spacing: -0.01em;
  color: var(--text-muted);
  background: var(--surface-solid);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 6px 14px;
}
.panel__chip svg { width: 12px; height: 12px; flex-shrink: 0; }

.panel__direct {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: var(--sp-3);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--border);
  width: 100%;
}
.panel__direct a {
  font-size: 14px;
  letter-spacing: -0.016em;
  color: var(--accent);
  word-break: break-word;
}
.panel__direct a:hover { text-decoration: underline; }

/* --- Footer --- */
.panel__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-5);
  flex-wrap: wrap;
  padding: var(--sp-5) var(--sp-6);
  border-top: 1px solid var(--border);
  background: var(--surface-2);
}
.panel__foot-left { display: flex; align-items: center; gap: var(--sp-4); flex-wrap: wrap; }
.panel__foot-left span { color: var(--text-faint); }
.panel__foot-right { display: flex; align-items: center; gap: var(--sp-3); }

/* --- Site footer ---
   The parchment close of the stack; deliberately the densest area on the
   page, so the whole information architecture is visible at a glance. */
.footer {
  border-top: 1px solid var(--border);
  margin-top: var(--sp-9);
  padding-top: var(--sp-7);
}
.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-6);
  flex-wrap: wrap;
}
.footer__name {
  font-family: var(--font-display);
  font-size: 1.3125rem;
  font-weight: 600;
  letter-spacing: 0.011em;
  color: var(--text);
}
.footer__tagline {
  color: var(--text-faint);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: -0.016em;
  max-width: 56ch;
  margin-top: var(--sp-2);
}

@media (prefers-reduced-motion: reduce) {
  .rise, .panel { transform: none; transition: opacity 300ms ease; }
}
</style>
