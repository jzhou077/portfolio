import styles from "./Oscilloscope.module.css";

// One period of the trace, in SVG user units. The path is drawn twice this wide and
// translated left by exactly PERIOD, so the animation loops with no visible seam.
const PERIOD = 600;
const SAMPLES = 300;
const HEIGHT = 90;

/** Small seeded PRNG so the "noise" is identical on every render. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds one period of a signal as a sum of sines. Each component uses an integer
 * number of cycles per period, which is what makes the loop seamless.
 */
function buildSignal(
  components: { cycles: number; amp: number; phase?: number }[],
  noise: number,
  seed: number,
  bursts: { at: number; width: number; cycles: number; amp: number }[] = [],
): number[] {
  const rand = mulberry32(seed);
  const out: number[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / SAMPLES;
    let v = 0;
    for (const c of components) v += c.amp * Math.sin(2 * Math.PI * c.cycles * t + (c.phase ?? 0));
    for (const b of bursts) {
      const envelope = Math.exp(-(((t - b.at) / b.width) ** 2));
      v += b.amp * envelope * Math.sin(2 * Math.PI * b.cycles * t);
    }
    v += (rand() - 0.5) * noise;
    out.push(v);
  }
  return out;
}

function toPath(signal: number[]): string {
  const step = PERIOD / SAMPLES;
  const mid = HEIGHT / 2;
  const doubled = [...signal, ...signal, signal[0] ?? 0];
  return doubled
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(mid - v * mid * 0.8).toFixed(1)}`)
    .join("");
}

// EEG-ish: background rhythm plus slow drift, with two sleep-spindle-like bursts.
const EEG_PATH = toPath(
  buildSignal(
    [
      { cycles: 3, amp: 0.18 },
      { cycles: 22, amp: 0.32 },
      { cycles: 47, amp: 0.1, phase: 1.3 },
    ],
    0.28,
    7,
    [
      { at: 0.3, width: 0.05, cycles: 70, amp: 0.45 },
      { at: 0.74, width: 0.04, cycles: 70, amp: 0.35 },
    ],
  ),
);

// Telemetry-ish: a smoother "speed" trace.
const SPEED_PATH = toPath(
  buildSignal(
    [
      { cycles: 2, amp: 0.55 },
      { cycles: 5, amp: 0.22, phase: 0.8 },
      { cycles: 11, amp: 0.06 },
    ],
    0.04,
    42,
  ),
);

/** Two synthetic, scrolling traces. Decorative, so hidden from screen readers. */
export function Oscilloscope() {
  return (
    <div className={styles.scope} aria-hidden="true">
      <div className={styles.channel}>
        <span className={styles.label}>EEG</span>
        <svg className={styles.trace} viewBox={`0 0 ${PERIOD} ${HEIGHT}`} preserveAspectRatio="none">
          <path className={styles.eeg} d={EEG_PATH} />
        </svg>
      </div>
      <div className={styles.channel}>
        <span className={styles.label}>speed</span>
        <svg className={styles.trace} viewBox={`0 0 ${PERIOD} ${HEIGHT}`} preserveAspectRatio="none">
          <path className={styles.speed} d={SPEED_PATH} />
        </svg>
      </div>
    </div>
  );
}
