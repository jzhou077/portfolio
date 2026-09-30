/**
 * Pure pursuit on a figure-eight: the path-following demo in the MASLAB figure.
 *
 * The robot is a differential drive. Every frame it finds the path point one
 * lookahead distance away and steers along the circular arc that reaches it.
 *
 * Plain TypeScript with no DOM or React, so it can be unit tested. Units are canvas
 * CSS pixels (y points down, like the canvas), and every length scales with S, the
 * canvas's shorter side, so the demo behaves the same at any size.
 */

export type Vec = { x: number; y: number };
/** `th` is the heading in radians; `idx` is the nearest path sample. */
export type Robot = Vec & { th: number; idx: number };
/** Goal point, commanded curvature (1/px), and distance from the path (px). */
export type Steering = { goal: Vec; k: number; err: number };

export const SAMPLES = 720;
/** The canvas's shorter side represents this many meters in the readout. */
export const FIELD_METERS = 3;
const TRAIL_LEN = 110;
const TAU = Math.PI * 2;

export const dist = (p: Vec, q: Vec) => Math.hypot(p.x - q.x, p.y - q.y);

export class PursuitDemo {
  width = 0;
  height = 0;
  /** The canvas's shorter side; every length in the demo is a fraction of it. */
  S = 0;
  path: Vec[] = [];
  robot: Robot = { x: 0, y: 0, th: 0, idx: 0 };
  trail: Vec[] = [];

  get lookahead() {
    return this.S * 0.16;
  }

  /** Rebuilds the path for a new canvas size and puts the robot back at the start. */
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.S = Math.min(width, height);
    this.buildPath();
    this.reset();
  }

  /** Start inside the left loop, off the path, so visitors see it merge on. */
  reset() {
    this.place(this.width * 0.31, this.height * 0.5, -Math.PI / 2);
  }

  /** Drops the robot somewhere new (a click "knocks" it there). */
  place(x: number, y: number, th: number) {
    this.robot = { x, y, th, idx: 0 };
    this.trail = [];
    this.nearest(true);
  }

  steer(): Steering {
    const err = this.nearest(false);
    const goal = this.goalPoint(this.lookahead);
    const { robot } = this;
    const dx = goal.x - robot.x;
    const dy = goal.y - robot.y;
    // The goal in the robot's frame: how far ahead (fx), and how far to the side (ly).
    const fx = Math.cos(robot.th) * dx + Math.sin(robot.th) * dy;
    const ly = -Math.sin(robot.th) * dx + Math.cos(robot.th) * dy;
    const kMax = 1 / (this.S * 0.05);
    // Lateral offset -> curvature of the arc through the goal. But a goal behind the
    // robot gives an arc so wide it barely turns and drives off the canvas (easy to hit
    // after a knock), so in that case turn as hard as allowed toward the goal instead.
    const k =
      fx < 0 ? Math.sign(ly || 1) * kMax : Math.max(-kMax, Math.min(kMax, (2 * ly) / (dx * dx + dy * dy || 1)));
    return { goal, k, err };
  }

  /** Drives along curvature `k` for `dt` seconds at constant speed. */
  advance(k: number, dt: number) {
    const v = this.S * 0.34;
    const { robot } = this;
    robot.th += v * k * dt;
    robot.x += v * Math.cos(robot.th) * dt;
    robot.y += v * Math.sin(robot.th) * dt;
    this.trail.push({ x: robot.x, y: robot.y });
    if (this.trail.length > TRAIL_LEN) this.trail.shift();
  }

  private at(i: number): Vec {
    return this.path[((i % SAMPLES) + SAMPLES) % SAMPLES]!;
  }

  /** Lemniscate of Gerono plus a gentle wobble: it curves both ways and crosses itself. */
  private buildPath() {
    const { width: W, height: H } = this;
    const cx = W / 2;
    const cy = H / 2;
    const a = W * 0.38;
    const b = H * 0.6;
    this.path = [];
    for (let i = 0; i < SAMPLES; i++) {
      const t = (i / SAMPLES) * TAU;
      this.path.push({
        x: cx + a * Math.cos(t),
        y: cy + b * Math.sin(t) * Math.cos(t) + H * 0.035 * Math.sin(3 * t),
      });
    }
  }

  /**
   * Updates robot.idx to the nearest path sample and returns the distance to it.
   * Normally searches a short forward window from the last index, so the robot
   * doesn't jump branches where the figure-eight crosses itself. After a knock we
   * don't know where we are, so `full` searches the whole path.
   */
  nearest(full: boolean): number {
    const { robot } = this;
    let best = robot.idx;
    let bestD = Infinity;
    const start = full ? 0 : robot.idx - 8;
    const count = full ? SAMPLES : 80;
    for (let k = 0; k < count; k++) {
      const i = (((start + k) % SAMPLES) + SAMPLES) % SAMPLES;
      const d = dist(robot, this.path[i]!);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    robot.idx = best;
    return bestD;
  }

  /**
   * First path point ahead of the nearest one that's at least L away. If the robot
   * is farther than L from the path, that's the nearest point itself, so it drives
   * straight back before resuming normal tracking.
   */
  goalPoint(L: number): Vec {
    for (let k = 0; k < SAMPLES / 2; k++) {
      const p = this.at(this.robot.idx + k);
      if (dist(this.robot, p) >= L) return p;
    }
    return this.at(this.robot.idx + 1);
  }
}

/** The corner readout: curvature in 1/m and distance from the path in cm. */
export function formatReadout(S: number, { k, err }: Steering): string {
  const metersPerPx = FIELD_METERS / S;
  const kappa = k / metersPerPx;
  const sign = kappa < 0 ? "−" : "+";
  return `κ ${sign}${Math.abs(kappa).toFixed(2)} m⁻¹ · e ${Math.round(err * metersPerPx * 100)} cm`;
}
