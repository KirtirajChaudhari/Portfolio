/**
 * One-shot gate between the boot overlay and the hero timeline.
 * The hero awaits `bootDone` so its reveal starts on the frame the
 * curtain clears, not on mount.
 */
let resolve!: () => void;

export const bootDone = new Promise<void>((r) => {
  resolve = r;
});

export function finishBoot() {
  resolve();
}
