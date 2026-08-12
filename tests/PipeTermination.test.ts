/**
 * PipeTermination.test.ts
 *
 * The harmonic series of each termination, and the two facts about the stopped
 * pipe that the whole sim exists to make visible: its fundamental is an octave
 * below an open pipe of the same length, and it supports only odd harmonics.
 *
 * Assertions are anchored to textbook results (c/2L, c/4L, the odd series) and
 * to published pipe-length arithmetic rather than to the implementation, so a
 * wrong constant fails instead of being locked in.
 */

import { describe, expect, it } from "vitest";
import {
  allowedHarmonics,
  createPipeTerminationProperty,
  EndCondition,
  fundamentalFrequency,
  isModeAllowed,
  isSymmetric,
  leftEnd,
  modeFrequency,
  modeWavenumber,
  PipeTermination,
  PipeTerminationValues,
  rightEnd,
} from "../src/common/model/PipeTermination.js";
import { SOUND_SPEED_MPS } from "../src/StandingWavesConstants.js";

const L = 0.5; // m

describe("end conditions", () => {
  it("gives closed–closed two rigid ends", () => {
    expect(leftEnd(PipeTermination.CLOSED_CLOSED)).toBe(EndCondition.CLOSED);
    expect(rightEnd(PipeTermination.CLOSED_CLOSED)).toBe(EndCondition.CLOSED);
  });

  it("gives open–open two open ends", () => {
    expect(leftEnd(PipeTermination.OPEN_OPEN)).toBe(EndCondition.OPEN);
    expect(rightEnd(PipeTermination.OPEN_OPEN)).toBe(EndCondition.OPEN);
  });

  it("closes only the left end of a stopped pipe", () => {
    expect(leftEnd(PipeTermination.CLOSED_OPEN)).toBe(EndCondition.CLOSED);
    expect(rightEnd(PipeTermination.CLOSED_OPEN)).toBe(EndCondition.OPEN);
  });

  it("reports the stopped pipe as the only asymmetric case", () => {
    expect(isSymmetric(PipeTermination.CLOSED_CLOSED)).toBe(true);
    expect(isSymmetric(PipeTermination.OPEN_OPEN)).toBe(true);
    expect(isSymmetric(PipeTermination.CLOSED_OPEN)).toBe(false);
  });
});

describe("which harmonics exist", () => {
  it("allows every harmonic when the ends match", () => {
    for (const termination of [PipeTermination.CLOSED_CLOSED, PipeTermination.OPEN_OPEN]) {
      expect(allowedHarmonics(termination, 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    }
  });

  it("allows only odd harmonics in a stopped pipe", () => {
    expect(allowedHarmonics(PipeTermination.CLOSED_OPEN, 8)).toEqual([1, 3, 5, 7]);
    expect(isModeAllowed(2, PipeTermination.CLOSED_OPEN)).toBe(false);
    expect(isModeAllowed(3, PipeTermination.CLOSED_OPEN)).toBe(true);
  });

  it("rejects non-positive and fractional harmonic numbers", () => {
    for (const termination of PipeTerminationValues) {
      expect(isModeAllowed(0, termination)).toBe(false);
      expect(isModeAllowed(-1, termination)).toBe(false);
      expect(isModeAllowed(1.5, termination)).toBe(false);
    }
  });
});

describe("mode frequencies", () => {
  it("puts a matched pipe's fundamental at c/2L", () => {
    for (const termination of [PipeTermination.CLOSED_CLOSED, PipeTermination.OPEN_OPEN]) {
      expect(fundamentalFrequency(termination, L)).toBeCloseTo(SOUND_SPEED_MPS / (2 * L), 9);
    }
  });

  it("puts a stopped pipe's fundamental at c/4L", () => {
    expect(fundamentalFrequency(PipeTermination.CLOSED_OPEN, L)).toBeCloseTo(SOUND_SPEED_MPS / (4 * L), 9);
  });

  it("sounds a stopped pipe exactly an octave below an open pipe of equal length", () => {
    const open = fundamentalFrequency(PipeTermination.OPEN_OPEN, L);
    const stopped = fundamentalFrequency(PipeTermination.CLOSED_OPEN, L);
    expect(open / stopped).toBeCloseTo(2, 9);
  });

  it("spaces a matched pipe's modes as integer multiples of f₁", () => {
    const f1 = fundamentalFrequency(PipeTermination.OPEN_OPEN, L);
    for (const h of [1, 2, 3, 4, 5]) {
      expect(modeFrequency(h, PipeTermination.OPEN_OPEN, L)).toBeCloseTo(h * f1, 9);
    }
  });

  it("spaces a stopped pipe's modes as the odd multiples of c/4L", () => {
    const quarterWave = SOUND_SPEED_MPS / (4 * L);
    for (const [index, h] of [1, 3, 5, 7].entries()) {
      const expected = (2 * (index + 1) - 1) * quarterWave;
      expect(modeFrequency(h, PipeTermination.CLOSED_OPEN, L)).toBeCloseTo(expected, 9);
    }
  });

  it("halves every frequency when the pipe is twice as long", () => {
    for (const termination of PipeTerminationValues) {
      expect(modeFrequency(3, termination, 2 * L)).toBeCloseTo(modeFrequency(3, termination, L) / 2, 9);
    }
  });

  it("reproduces the 0.5 m default: 343 Hz open, 171.5 Hz stopped", () => {
    expect(fundamentalFrequency(PipeTermination.OPEN_OPEN, 0.5)).toBeCloseTo(343, 6);
    expect(fundamentalFrequency(PipeTermination.CLOSED_OPEN, 0.5)).toBeCloseTo(171.5, 6);
  });
});

describe("mode wavenumbers", () => {
  it("fits whole half-wavelengths into a matched pipe: kₕ = hπ/L", () => {
    for (const termination of [PipeTermination.CLOSED_CLOSED, PipeTermination.OPEN_OPEN]) {
      for (const h of [1, 2, 3, 4]) {
        expect(modeWavenumber(h, termination, L)).toBeCloseTo((h * Math.PI) / L, 9);
      }
    }
  });

  it("fits odd quarter-wavelengths into a stopped pipe: kₕ = hπ/2L", () => {
    for (const h of [1, 3, 5]) {
      expect(modeWavenumber(h, PipeTermination.CLOSED_OPEN, L)).toBeCloseTo((h * Math.PI) / (2 * L), 9);
    }
  });

  it("stays consistent with the frequency it was derived from", () => {
    for (const termination of PipeTerminationValues) {
      for (const h of allowedHarmonics(termination, 5)) {
        const k = modeWavenumber(h, termination, L);
        const f = modeFrequency(h, termination, L);
        // k = 2πf/c, i.e. the wave travels at c.
        expect((2 * Math.PI * f) / k).toBeCloseTo(SOUND_SPEED_MPS, 6);
      }
    }
  });
});

describe("termination Property", () => {
  it("defaults to open–open and validates its values", () => {
    const property = createPipeTerminationProperty();
    expect(property.value).toBe(PipeTermination.OPEN_OPEN);
    property.value = PipeTermination.CLOSED_OPEN;
    expect(property.value).toBe(PipeTermination.CLOSED_OPEN);
    property.dispose();
  });

  it("declares exactly the three terminations as valid", () => {
    // The Property enforces this only when assertions are enabled, so assert the
    // declared set rather than a throw — that is what holds in a release build.
    const property = createPipeTerminationProperty();
    expect(property.validValues).toEqual([...PipeTerminationValues]);
    property.dispose();
  });
});
