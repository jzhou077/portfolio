import { describe, expect, it } from "vitest";
import { PursuitDemo, SAMPLES, dist, formatReadout } from "./purePursuit";

const W = 800;
const H = 400; // the desktop 2:1 canvas
const DT = 1 / 60;

function demo(width = W, height = H) {
  const d = new PursuitDemo();
  d.resize(width, height);
  return d;
}

/** Steps the demo like the animation loop does, returning the last steering result. */
function run(d: PursuitDemo, seconds: number) {
  for (let t = 0; t < seconds; t += DT) d.advance(d.steer().k, DT);
  return d.steer();
}

describe("path", () => {
  it("is a closed figure-eight that crosses itself in the middle", () => {
    const d = demo();
    expect(d.path).toHaveLength(SAMPLES);
    expect(dist(d.path[0]!, d.path.at(-1)!)).toBeLessThan(10); // closes on itself

    const center = { x: W / 2, y: H / 2 };
    const indices = d.path.flatMap((p, i) => (dist(p, center) < 15 ? [i] : []));
    // Two separate passes through the middle, about half a lap apart.
    expect(Math.max(...indices) - Math.min(...indices)).toBeGreaterThan(SAMPLES / 3);
  });
});

describe("steer", () => {
  it("commands the arc that passes through the goal point", () => {
    const d = demo();
    run(d, 3); // settle onto the path so the curvature isn't clamped
    const { goal, k } = d.steer();
    const { x, y, th } = d.robot;
    const dx = goal.x - x;
    const dy = goal.y - y;
    const fx = Math.cos(th) * dx + Math.sin(th) * dy;
    const ly = -Math.sin(th) * dx + Math.cos(th) * dy;
    // A circle tangent to the heading with curvature k passes through (fx, ly) iff k(fx² + ly²) = 2·ly.
    expect(k * (fx * fx + ly * ly)).toBeCloseTo(2 * ly, 6);
  });

  it("merges onto the path from its off-path start", () => {
    const d = demo();
    expect(d.steer().err).toBeGreaterThan(0.05 * d.S);
    expect(run(d, 4).err).toBeLessThan(0.02 * d.S);
  });

  it("follows the eight through the crossing instead of jumping branches", () => {
    const d = demo();
    let laps = 0;
    let prev = d.robot.idx;
    for (let t = 0; t < 30; t += DT) {
      d.advance(d.steer().k, DT);
      // Forward progress along the path this step, in samples (wrapped to ±half a lap).
      const step = ((d.robot.idx - prev + SAMPLES * 1.5) % SAMPLES) - SAMPLES / 2;
      expect(step).toBeGreaterThanOrEqual(-8);
      expect(step).toBeLessThan(80);
      laps += step / SAMPLES;
      prev = d.robot.idx;
    }
    expect(laps).toBeGreaterThan(1.5);
  });
});

describe("knocks", () => {
  // Desktop is 2:1; phones switch the canvas to 4:3, which reshapes the path.
  it.each([
    [800, 400],
    [360, 270],
  ])("finds its way back from anywhere on a %ix%i canvas, facing any direction", (W, H) => {
    const failures: string[] = [];
    for (let x = 0.05; x < 1; x += 0.15) {
      for (let y = 0.1; y < 1; y += 0.2) {
        for (let h = 0; h < 8; h++) {
          const d = demo(W, H);
          d.place(x * W, y * H, (h / 8) * Math.PI * 2);
          let farthestOut = 0;
          for (let t = 0; t < 8; t += DT) {
            d.advance(d.steer().k, DT);
            const { x: rx, y: ry } = d.robot;
            farthestOut = Math.max(farthestOut, -rx, rx - W, -ry, ry - H);
          }
          const err = d.steer().err;
          // Back to normal tracking: pure pursuit cuts the tight 4:3 loops by up to 3.5% of S
          // even without a knock, so allow a little more than that.
          if (err > 0.045 * d.S || farthestOut > 0.1 * d.S) {
            failures.push(
              `(${x.toFixed(2)}, ${y.toFixed(2)}) heading ${h}/8: err ${err.toFixed(0)}px, left canvas by ${farthestOut.toFixed(0)}px`,
            );
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });
});

describe("formatReadout", () => {
  it("converts to meters using the shorter side as 3 m", () => {
    // S = 300 px -> 1 cm per px. k = 0.02 /px = 2 /m.
    expect(formatReadout(300, { goal: { x: 0, y: 0 }, k: -0.02, err: 5 })).toBe("κ −2.00 m⁻¹ · e 5 cm");
  });
});
