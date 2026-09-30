import type { PursuitDemo, Steering } from "./purePursuit";

const TAU = Math.PI * 2;

/** Colors come from CSS variables so the canvas follows the site's light/dark theme. */
export type Colors = { accent: string; path: string; text: string; surface: string };

export function readColors(el: Element): Colors {
  const style = getComputedStyle(el);
  const v = (name: string) => style.getPropertyValue(name).trim();
  return { accent: v("--red"), path: v("--ink-3"), text: v("--ink"), surface: v("--paper-2") };
}

export function drawFrame(ctx: CanvasRenderingContext2D, demo: PursuitDemo, steering: Steering, colors: Colors) {
  ctx.clearRect(0, 0, demo.width, demo.height); // the graph-paper grid is a CSS background
  drawPath(ctx, demo, colors);
  drawTrail(ctx, demo, colors);
  drawSteering(ctx, demo, steering, colors);
  drawRobot(ctx, demo, colors);
}

function drawPath(ctx: CanvasRenderingContext2D, { path }: PursuitDemo, colors: Colors) {
  ctx.save();
  ctx.setLineDash([6, 7]);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = colors.path;
  ctx.beginPath();
  path.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

/** Recent positions, fading out toward the oldest. */
function drawTrail(ctx: CanvasRenderingContext2D, { trail }: PursuitDemo, colors: Colors) {
  ctx.save();
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = colors.accent;
  for (let i = 1; i < trail.length; i++) {
    ctx.globalAlpha = (i / trail.length) * 0.9;
    ctx.beginPath();
    ctx.moveTo(trail[i - 1]!.x, trail[i - 1]!.y);
    ctx.lineTo(trail[i]!.x, trail[i]!.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSteering(ctx: CanvasRenderingContext2D, demo: PursuitDemo, { goal, k }: Steering, colors: Colors) {
  const { robot } = demo;
  ctx.save();
  ctx.strokeStyle = colors.accent;

  // Lookahead circle.
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(robot.x, robot.y, demo.lookahead, 0, TAU);
  ctx.stroke();

  // The arc pure pursuit commands: tangent to the heading, passing through the goal.
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  if (Math.abs(k) < 1e-5) {
    ctx.moveTo(robot.x, robot.y);
    ctx.lineTo(goal.x, goal.y);
  } else {
    const r = 1 / k;
    const cx = robot.x - Math.sin(robot.th) * r;
    const cy = robot.y + Math.cos(robot.th) * r;
    const a0 = Math.atan2(robot.y - cy, robot.x - cx);
    const a1 = Math.atan2(goal.y - cy, goal.x - cx);
    ctx.arc(cx, cy, Math.abs(r), a0, a1, k < 0);
  }
  ctx.stroke();

  // Goal point.
  ctx.globalAlpha = 1;
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(goal.x, goal.y, 4.5, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawRobot(ctx: CanvasRenderingContext2D, { robot, S }: PursuitDemo, colors: Colors) {
  const s = S * 0.045; // half-length of the chassis
  ctx.save();
  ctx.translate(robot.x, robot.y);
  ctx.rotate(robot.th);

  // Two drive wheels.
  ctx.fillStyle = colors.text;
  ctx.fillRect(-s * 0.55, -s * 1.05, s * 1.1, s * 0.35);
  ctx.fillRect(-s * 0.55, s * 0.7, s * 1.1, s * 0.35);

  // Chassis.
  ctx.fillStyle = colors.surface;
  ctx.strokeStyle = colors.text;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-s, -s * 0.72, s * 2, s * 1.44, s * 0.3);
  ctx.fill();
  ctx.stroke();

  // Heading arrow.
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(s * 0.75, 0);
  ctx.lineTo(s * 0.05, -s * 0.4);
  ctx.lineTo(s * 0.05, s * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
