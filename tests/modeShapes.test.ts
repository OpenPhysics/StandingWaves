/**
 * modeShapes.test.ts
 *
 * The central claim of the sim: in every mode of every termination, a pressure
 * antinode sits exactly where the displacement has a node, and vice versa.
 *
 * The boundary assertions are the ones that matter most — a closed end must pin
 * displacement and peak pressure, an open end the reverse — because that is what
 * a learner reads off the screen.
 */

import { describe, expect, it } from "vitest";
import {
  displacementNodePositions,
  displacementShape,
  pressureNodePositions,
  pressureShape,
} from "../src/common/model/modeShapes.js";
import {
  allowedHarmonics,
  modeWavenumber,
  PipeTermination,
  PipeTerminationValues,
} from "../src/common/model/PipeTermination.js";

const L = 0.5; // m

/** Compares node positions elementwise, tolerating floating-point drift. */
function expectPositions(actual: number[], expected: number[]): void {
  expect(actual).toHaveLength(expected.length);
  for (const [index, value] of expected.entries()) {
    expect(actual[index]).toBeCloseTo(value, 9);
  }
}

/** Samples a shape densely across the pipe. */
function sample(shape: (x: number) => number, count = 401): { x: number; value: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const x = (i / (count - 1)) * L;
    return { x, value: shape(x) };
  });
}

describe("boundary conditions", () => {
  it("pins displacement to zero at a closed end", () => {
    for (const termination of [PipeTermination.CLOSED_CLOSED, PipeTermination.CLOSED_OPEN]) {
      for (const h of allowedHarmonics(termination, 6)) {
        expect(displacementShape(h, termination, L, 0)).toBeCloseTo(0, 9);
      }
    }
    // Closed–closed is closed at x = L too.
    for (const h of allowedHarmonics(PipeTermination.CLOSED_CLOSED, 6)) {
      expect(displacementShape(h, PipeTermination.CLOSED_CLOSED, L, L)).toBeCloseTo(0, 9);
    }
  });

  it("peaks pressure at a closed end", () => {
    for (const termination of [PipeTermination.CLOSED_CLOSED, PipeTermination.CLOSED_OPEN]) {
      for (const h of allowedHarmonics(termination, 6)) {
        expect(Math.abs(pressureShape(h, termination, L, 0))).toBeCloseTo(1, 9);
      }
    }
  });

  it("pins pressure to zero at an open end", () => {
    for (const h of allowedHarmonics(PipeTermination.OPEN_OPEN, 6)) {
      expect(pressureShape(h, PipeTermination.OPEN_OPEN, L, 0)).toBeCloseTo(0, 9);
      expect(pressureShape(h, PipeTermination.OPEN_OPEN, L, L)).toBeCloseTo(0, 9);
    }
    for (const h of allowedHarmonics(PipeTermination.CLOSED_OPEN, 6)) {
      expect(pressureShape(h, PipeTermination.CLOSED_OPEN, L, L)).toBeCloseTo(0, 9);
    }
  });

  it("peaks displacement at an open end", () => {
    for (const h of allowedHarmonics(PipeTermination.OPEN_OPEN, 6)) {
      expect(Math.abs(displacementShape(h, PipeTermination.OPEN_OPEN, L, 0))).toBeCloseTo(1, 9);
      expect(Math.abs(displacementShape(h, PipeTermination.OPEN_OPEN, L, L))).toBeCloseTo(1, 9);
    }
    for (const h of allowedHarmonics(PipeTermination.CLOSED_OPEN, 6)) {
      expect(Math.abs(displacementShape(h, PipeTermination.CLOSED_OPEN, L, L))).toBeCloseTo(1, 9);
    }
  });
});

describe("normalisation", () => {
  it("keeps both shapes inside [−1, 1] and reaching ±1", () => {
    for (const termination of PipeTerminationValues) {
      for (const h of allowedHarmonics(termination, 6)) {
        for (const shape of [
          (x: number) => displacementShape(h, termination, L, x),
          (x: number) => pressureShape(h, termination, L, x),
        ]) {
          const peak = Math.max(...sample(shape).map((s) => Math.abs(s.value)));
          expect(peak).toBeLessThanOrEqual(1 + 1e-9);
          expect(peak).toBeCloseTo(1, 4);
        }
      }
    }
  });
});

describe("pressure is the displacement gradient", () => {
  it("matches −(1/kₕ)·dφ/dx computed numerically", () => {
    const dx = 1e-7;
    for (const termination of PipeTerminationValues) {
      for (const h of allowedHarmonics(termination, 4)) {
        const k = modeWavenumber(h, termination, L);
        for (const fraction of [0.13, 0.37, 0.5, 0.71, 0.94]) {
          const x = fraction * L;
          const gradient =
            (displacementShape(h, termination, L, x + dx) - displacementShape(h, termination, L, x - dx)) / (2 * dx);
          expect(pressureShape(h, termination, L, x)).toBeCloseTo(-gradient / k, 5);
        }
      }
    }
  });
});

describe("the quarter-wave offset", () => {
  it("puts a pressure antinode at every displacement node", () => {
    for (const termination of PipeTerminationValues) {
      for (const h of allowedHarmonics(termination, 6)) {
        for (const x of displacementNodePositions(h, termination, L)) {
          expect(displacementShape(h, termination, L, x)).toBeCloseTo(0, 8);
          expect(Math.abs(pressureShape(h, termination, L, x))).toBeCloseTo(1, 8);
        }
      }
    }
  });

  it("puts a displacement antinode at every pressure node", () => {
    for (const termination of PipeTerminationValues) {
      for (const h of allowedHarmonics(termination, 6)) {
        for (const x of pressureNodePositions(h, termination, L)) {
          expect(pressureShape(h, termination, L, x)).toBeCloseTo(0, 8);
          expect(Math.abs(displacementShape(h, termination, L, x))).toBeCloseTo(1, 8);
        }
      }
    }
  });

  it("separates neighbouring displacement and pressure nodes by a quarter wavelength", () => {
    for (const termination of PipeTerminationValues) {
      for (const h of allowedHarmonics(termination, 6)) {
        const k = modeWavenumber(h, termination, L);
        const quarterWavelength = Math.PI / (2 * k);
        const displacementNodes = displacementNodePositions(h, termination, L);
        for (const pressureNode of pressureNodePositions(h, termination, L)) {
          const nearest = Math.min(...displacementNodes.map((x) => Math.abs(x - pressureNode)));
          expect(nearest).toBeCloseTo(quarterWavelength, 8);
        }
      }
    }
  });
});

describe("node counting", () => {
  it("gives the fundamental of each termination its textbook node pattern", () => {
    // Closed–closed h=1: displacement nodes at both ends, pressure node at the centre.
    expectPositions(displacementNodePositions(1, PipeTermination.CLOSED_CLOSED, L), [0, L]);
    expectPositions(pressureNodePositions(1, PipeTermination.CLOSED_CLOSED, L), [L / 2]);

    // Open–open h=1: the mirror image.
    expectPositions(pressureNodePositions(1, PipeTermination.OPEN_OPEN, L), [0, L]);
    expectPositions(displacementNodePositions(1, PipeTermination.OPEN_OPEN, L), [L / 2]);

    // Stopped h=1 is a single quarter wave: one displacement node (the closed
    // end) and one pressure node (the open end), and nothing in between.
    expectPositions(displacementNodePositions(1, PipeTermination.CLOSED_OPEN, L), [0]);
    expectPositions(pressureNodePositions(1, PipeTermination.CLOSED_OPEN, L), [L]);
  });

  it("adds one displacement node per harmonic step in a matched pipe", () => {
    for (const h of [1, 2, 3, 4, 5]) {
      expect(displacementNodePositions(h, PipeTermination.CLOSED_CLOSED, L)).toHaveLength(h + 1);
      expect(pressureNodePositions(h, PipeTermination.OPEN_OPEN, L)).toHaveLength(h + 1);
    }
  });
});
