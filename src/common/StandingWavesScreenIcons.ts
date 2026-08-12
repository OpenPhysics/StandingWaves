/**
 * StandingWavesScreenIcons.ts
 *
 * Programmatic home-screen / navigation-bar icons for each screen, drawn on the
 * standard PhET 548 × 373 canvas with StandingWavesColors and the same PipeNode
 * the screens draw. Each icon is the screen's signature image:
 *
 *   Reflection     — a pipe with a localised pulse travelling along it
 *   Phase          — a pipe over three phase-shifted sinusoids (ξ, u, p)
 *   Standing Waves — a pipe over a standing-wave envelope with node markers
 *   Instruments    — a stopped pipe beside its odd-harmonic spectrum
 *
 * The colour contract holds inside the icons too (ξ grey, u red, p blue): an icon
 * is the first place a learner sees the palette, so it must not teach a different
 * one.
 */
import { Shape } from "scenerystack/kite";
import { Circle, Line, Node, Path, Rectangle } from "scenerystack/scenery";
import { ScreenIcon } from "scenerystack/sim";
import StandingWavesColors from "../StandingWavesColors.js";
import { EndCondition } from "./model/PipeTermination.js";
import { PipeNode } from "./view/PipeNode.js";

const W = 548;
const H = 373;

/** Samples along each drawn curve; enough that a spindle reads as smooth. */
const CURVE_SAMPLES = 96;

// ── Layout for the three pipe-over-trace icons ────────────────────────────────
const PIPE_LENGTH = 440;
const PIPE_X = (W - PIPE_LENGTH) / 2;
const PIPE_Y = 128;
const TRACE_Y = 262;

// ── Layout for the Instruments icon ───────────────────────────────────────────
const INST_PIPE_LENGTH = 240;
const INST_PIPE_X = 60;
const INST_PIPE_Y = 150;
const SPECTRUM_X = 350;
const SPECTRUM_BASELINE_Y = 300;
const SPECTRUM_BAR_WIDTH = 22;
const SPECTRUM_BAR_GAP = 6;
const SPECTRUM_STEP = SPECTRUM_BAR_WIDTH + SPECTRUM_BAR_GAP;

function background(): Rectangle {
  return new Rectangle(0, 0, W, H, { fill: StandingWavesColors.backgroundColorProperty });
}

function iconFrom(content: Node): ScreenIcon {
  return new ScreenIcon(content, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1,
    fill: StandingWavesColors.backgroundColorProperty,
  });
}

/** Places a PipeNode with its bore centreline at the given canvas point. */
function pipeAt(length: number, leftEnd: EndCondition, rightEnd: EndCondition, x: number, y: number): PipeNode {
  const pipe = new PipeNode({ viewLength: length, leftEnd, rightEnd });
  pipe.x = x;
  pipe.y = y;
  return pipe;
}

/** A faint zero-baseline, the same one the trace strips draw inside themselves. */
function baseline(width: number): Line {
  return new Line(0, 0, width, 0, {
    stroke: StandingWavesColors.axisColorProperty,
    lineWidth: 1,
  });
}

// ── Curve primitives (local coords: x in [0, width], y about 0) ───────────────

/** A sinusoid of `cycles` full periods across [0, width]. */
function sinePath(width: number, amplitude: number, cycles: number, phase: number): Shape {
  const shape = new Shape();
  for (let i = 0; i <= CURVE_SAMPLES; i++) {
    const t = i / CURVE_SAMPLES;
    const x = t * width;
    const y = amplitude * Math.sin(2 * Math.PI * cycles * t + phase);
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  return shape;
}

/** A Gaussian pulse bump peaking at `centerFrac` of the width. */
function gaussianPulsePath(width: number, amplitude: number, centerFrac: number, widthFrac: number): Shape {
  const shape = new Shape();
  for (let i = 0; i <= CURVE_SAMPLES; i++) {
    const t = i / CURVE_SAMPLES;
    const x = t * width;
    const d = (t - centerFrac) / widthFrac;
    const y = -amplitude * Math.exp(-(d * d));
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  return shape;
}

/**
 * Upper and lower envelope curves of a standing wave with `antinodes` antinodes
 * (i.e. the `antinodes`-th harmonic). The two curves meet at every node, so the
 * pair reads at a glance as the spindle pattern that is the icon for "standing
 * wave".
 */
function standingEnvelopePaths(width: number, amplitude: number, antinodes: number): { upper: Shape; lower: Shape } {
  const upper = new Shape();
  const lower = new Shape();
  for (let i = 0; i <= CURVE_SAMPLES; i++) {
    const t = i / CURVE_SAMPLES;
    const x = t * width;
    const env = amplitude * Math.sin(antinodes * Math.PI * t);
    if (i === 0) {
      upper.moveTo(x, -env);
      lower.moveTo(x, env);
    } else {
      upper.lineTo(x, -env);
      lower.lineTo(x, env);
    }
  }
  return { upper, lower };
}

export function createReflectionIcon(): ScreenIcon {
  const trace = new Node({ x: PIPE_X, y: TRACE_Y });
  trace.addChild(baseline(PIPE_LENGTH));
  trace.addChild(
    new Path(gaussianPulsePath(PIPE_LENGTH, 50, 0.38, 0.09), {
      stroke: StandingWavesColors.displacementColorProperty,
      lineWidth: 3,
      lineJoin: "round",
    }),
  );

  return iconFrom(
    new Node({
      children: [background(), pipeAt(PIPE_LENGTH, EndCondition.CLOSED, EndCondition.OPEN, PIPE_X, PIPE_Y), trace],
    }),
  );
}

export function createPhaseIcon(): ScreenIcon {
  const trace = new Node({ x: PIPE_X, y: TRACE_Y });
  trace.addChild(baseline(PIPE_LENGTH));
  // Velocity and pressure are drawn nearly in phase with each other and a quarter
  // period ahead of displacement — the very relationship the screen exists to show.
  // Three crossing coloured curves is the icon for "phase relationships".
  trace.addChild(
    new Path(sinePath(PIPE_LENGTH, 48, 2, 0), {
      stroke: StandingWavesColors.displacementColorProperty,
      lineWidth: 3,
      lineJoin: "round",
    }),
  );
  trace.addChild(
    new Path(sinePath(PIPE_LENGTH, 48, 2, Math.PI / 2), {
      stroke: StandingWavesColors.velocityColorProperty,
      lineWidth: 3,
      lineJoin: "round",
    }),
  );
  trace.addChild(
    new Path(sinePath(PIPE_LENGTH, 48, 2, Math.PI / 2 + 0.45), {
      stroke: StandingWavesColors.pressureColorProperty,
      lineWidth: 3,
      lineJoin: "round",
    }),
  );

  return iconFrom(
    new Node({
      children: [background(), pipeAt(PIPE_LENGTH, EndCondition.OPEN, EndCondition.OPEN, PIPE_X, PIPE_Y), trace],
    }),
  );
}

export function createStandingWavesIcon(): ScreenIcon {
  const antinodes = 2;
  const { upper, lower } = standingEnvelopePaths(PIPE_LENGTH, 62, antinodes);

  const trace = new Node({ x: PIPE_X, y: TRACE_Y });
  trace.addChild(baseline(PIPE_LENGTH));
  trace.addChild(
    new Path(upper, {
      stroke: StandingWavesColors.displacementColorProperty,
      lineWidth: 3,
      lineJoin: "round",
    }),
  );
  trace.addChild(
    new Path(lower, {
      stroke: StandingWavesColors.displacementColorProperty,
      lineWidth: 3,
      lineJoin: "round",
    }),
  );
  // Node markers where the envelope closes to zero — the feature that gives this
  // screen its name and distinguishes its icon from the travelling-wave sinusoids.
  for (let n = 0; n <= antinodes; n++) {
    trace.addChild(
      new Circle(4, {
        fill: StandingWavesColors.nodeMarkerColorProperty,
        centerX: (n / antinodes) * PIPE_LENGTH,
        centerY: 0,
      }),
    );
  }

  return iconFrom(
    new Node({
      children: [background(), pipeAt(PIPE_LENGTH, EndCondition.OPEN, EndCondition.OPEN, PIPE_X, PIPE_Y), trace],
    }),
  );
}

export function createInstrumentsIcon(): ScreenIcon {
  // The clarinet's signature: a stopped pipe sounding only its odd harmonics. The
  // spectrum draws every slot but fills only the ones the pipe has, so the gaps
  // themselves carry the "odd-only" lesson the screen teaches.
  const barHeights = [110, 0, 64, 0, 40, 0];

  const spectrum = new Node({ x: SPECTRUM_X, y: SPECTRUM_BASELINE_Y });
  spectrum.addChild(baseline(barHeights.length * SPECTRUM_STEP));
  for (const [index, height] of barHeights.entries()) {
    if (height > 0) {
      spectrum.addChild(
        new Rectangle(index * SPECTRUM_STEP, -height, SPECTRUM_BAR_WIDTH, height, {
          fill: StandingWavesColors.pressureColorProperty,
        }),
      );
    }
  }

  return iconFrom(
    new Node({
      children: [
        background(),
        pipeAt(INST_PIPE_LENGTH, EndCondition.CLOSED, EndCondition.OPEN, INST_PIPE_X, INST_PIPE_Y),
        spectrum,
      ],
    }),
  );
}
