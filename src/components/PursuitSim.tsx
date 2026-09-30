import { useEffect, useRef } from "react";
import { PursuitDemo, formatReadout, type Steering } from "../sim/purePursuit";
import { drawFrame, readColors } from "../sim/render";
import styles from "./PursuitSim.module.css";

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PursuitSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const stat = statRef.current;
    const reduceMotion = reducedMotion();
    const demo = new PursuitDemo();

    let colors = readColors(canvas);
    let visible = true;
    let rafId = 0;
    let lastT = 0;
    let frame = 0;

    const draw = (s: Steering = demo.steer()) => drawFrame(ctx, demo, s, colors);

    const updateStat = (s: Steering, force = false) => {
      if (!stat || (!force && frame++ % 6)) return; // ~10 Hz is plenty for text
      stat.textContent = formatReadout(demo.S, s);
    };

    const tick = (t: number) => {
      const dt = Math.min((t - lastT) / 1000, 1 / 30); // clamp so a stalled tab doesn't teleport the robot
      lastT = t;
      const s = demo.steer();
      draw(s);
      updateStat(s);
      demo.advance(s.k, dt);
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduceMotion || rafId || !visible || document.hidden || !demo.width) return;
      lastT = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    // Reduced motion: simulate a few seconds silently, then show a single still frame.
    const renderStatic = () => {
      for (let i = 0; i < 360; i++) demo.advance(demo.steer().k, 1 / 60);
      const s = demo.steer();
      draw(s);
      updateStat(s, true);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
      demo.resize(rect.width, rect.height); // the path is sized to the canvas, so rebuild it
      if (reduceMotion) renderStatic();
      else {
        draw();
        start();
      }
    };

    const knock = (e: PointerEvent) => {
      if (reduceMotion || !demo.width) return;
      demo.place(e.offsetX, e.offsetY, Math.random() * Math.PI * 2);
    };
    canvas.addEventListener("pointerdown", knock);

    // The theme toggle swaps CSS variables; re-read them so the canvas follows.
    const themeObserver = new MutationObserver(() => {
      colors = readColors(canvas);
      if (!rafId && demo.width) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    });
    visibilityObserver.observe(canvas);

    const onVisibilityChange = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      canvas.removeEventListener("pointerdown", knock);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="Animated simulation of a robot following a figure-eight path"
      />
      <span ref={statRef} className={styles.readout} aria-hidden="true" />
    </>
  );
}

/** The caption's last sentence, which depends on whether the demo is animating. */
export function PursuitHint() {
  return (
    <span>
      {reducedMotion()
        ? "(Paused because your system asks for reduced motion.)"
        : "Click anywhere in the box to knock it off course."}
    </span>
  );
}
