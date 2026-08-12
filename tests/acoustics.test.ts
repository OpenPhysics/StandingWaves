/**
 * acoustics.test.ts
 *
 * The sign conventions, checked against an analytic travelling wave rather than
 * against the implementation. The load-bearing assertion is the last group:
 * velocity and pressure are in phase in a forward-going wave and antiphase in a
 * backward-going one. Screen 2 exists to show that, so a sign slip here would
 * quietly teach the opposite of the intended lesson.
 */

import { describe, expect, it } from "vitest";
import {
  BULK_MODULUS,
  CHARACTERISTIC_IMPEDANCE,
  directionSign,
  frequencyForWavelength,
  pressureFromGradient,
  pressureFromVelocity,
  WaveDirection,
  wavelengthFor,
  wavenumberFor,
} from "../src/common/model/acoustics.js";
import { AIR_DENSITY_KGPM3, SOUND_SPEED_MPS } from "../src/StandingWavesConstants.js";

const AMPLITUDE = 1e-6; // m
const FREQUENCY = 343; // Hz

/**
 * Analytic plane wave ξ(x,t) = A·cos(ωt ∓ kx), with the upper sign for a
 * forward-going wave. Returns displacement and its two exact derivatives.
 */
function planeWave(x: number, t: number, direction: WaveDirection) {
  const k = wavenumberFor(FREQUENCY);
  const omega = 2 * Math.PI * FREQUENCY;
  const sign = directionSign(direction);
  const phase = omega * t - sign * k * x;
  return {
    displacement: AMPLITUDE * Math.cos(phase),
    // ∂ξ/∂t
    velocity: -AMPLITUDE * omega * Math.sin(phase),
    // ∂ξ/∂x
    gradient: sign * AMPLITUDE * k * Math.sin(phase),
  };
}

describe("medium constants", () => {
  it("computes the characteristic impedance of air as ρc ≈ 413 Pa·s/m", () => {
    expect(CHARACTERISTIC_IMPEDANCE).toBeCloseTo(AIR_DENSITY_KGPM3 * SOUND_SPEED_MPS, 9);
    // Published value for air at 20 °C is about 413 rayl.
    expect(CHARACTERISTIC_IMPEDANCE).toBeGreaterThan(405);
    expect(CHARACTERISTIC_IMPEDANCE).toBeLessThan(420);
  });

  it("computes the bulk modulus as ρc² ≈ 1.4×10⁵ Pa", () => {
    expect(BULK_MODULUS).toBeCloseTo(CHARACTERISTIC_IMPEDANCE * SOUND_SPEED_MPS, 6);
    // γP for air at 1 atm is about 1.42×10⁵ Pa.
    expect(BULK_MODULUS).toBeGreaterThan(1.3e5);
    expect(BULK_MODULUS).toBeLessThan(1.5e5);
  });
});

describe("wavenumber and wavelength", () => {
  it("relates k, λ and f through c", () => {
    expect(wavelengthFor(FREQUENCY)).toBeCloseTo(SOUND_SPEED_MPS / FREQUENCY, 9);
    expect(wavenumberFor(FREQUENCY)).toBeCloseTo((2 * Math.PI) / wavelengthFor(FREQUENCY), 9);
  });

  it("round-trips a wavelength back to its frequency", () => {
    expect(frequencyForWavelength(wavelengthFor(FREQUENCY))).toBeCloseTo(FREQUENCY, 6);
  });

  it("gives the 0.5 m open pipe a 1 m fundamental wavelength", () => {
    // f₁ = c/2L = 343 Hz for L = 0.5 m, so λ₁ = 2L = 1 m.
    expect(wavelengthFor(343)).toBeCloseTo(1, 6);
  });
});

describe("pressure from a displacement gradient", () => {
  it("makes a compression a positive pressure", () => {
    // Particles ahead displaced backward relative to those behind ⇒ ∂ξ/∂x < 0
    // ⇒ the air is squeezed together ⇒ p > 0.
    expect(pressureFromGradient(-1e-6)).toBeGreaterThan(0);
  });

  it("makes a rarefaction a negative pressure", () => {
    expect(pressureFromGradient(1e-6)).toBeLessThan(0);
  });

  it("is zero where the displacement is uniform", () => {
    expect(pressureFromGradient(0)).toBeCloseTo(0, 12);
  });

  it("scales as −ρc²·∂ξ/∂x", () => {
    expect(pressureFromGradient(2.5e-6)).toBeCloseTo(-BULK_MODULUS * 2.5e-6, 9);
  });
});

describe("p = ±ρc·u in a travelling plane wave", () => {
  const samplePoints = [
    { x: 0, t: 0 },
    { x: 0.13, t: 0.0004 },
    { x: 0.5, t: 0.0011 },
    { x: 0.87, t: 0.0021 },
  ];

  it("agrees with the gradient definition for a forward-going wave", () => {
    for (const { x, t } of samplePoints) {
      const wave = planeWave(x, t, WaveDirection.FORWARD);
      expect(pressureFromVelocity(wave.velocity, WaveDirection.FORWARD)).toBeCloseTo(
        pressureFromGradient(wave.gradient),
        6,
      );
    }
  });

  it("agrees with the gradient definition for a backward-going wave", () => {
    for (const { x, t } of samplePoints) {
      const wave = planeWave(x, t, WaveDirection.BACKWARD);
      expect(pressureFromVelocity(wave.velocity, WaveDirection.BACKWARD)).toBeCloseTo(
        pressureFromGradient(wave.gradient),
        6,
      );
    }
  });

  it("puts velocity and pressure IN phase in a forward-going wave", () => {
    // Same sign everywhere: the air moves fastest toward +x exactly where it is
    // most compressed.
    for (const { x, t } of samplePoints) {
      const wave = planeWave(x, t, WaveDirection.FORWARD);
      const pressure = pressureFromGradient(wave.gradient);
      expect(Math.sign(pressure)).toBe(Math.sign(wave.velocity));
    }
  });

  it("puts velocity and pressure 180° OUT of phase in a backward-going wave", () => {
    for (const { x, t } of samplePoints) {
      const wave = planeWave(x, t, WaveDirection.BACKWARD);
      const pressure = pressureFromGradient(wave.gradient);
      expect(Math.sign(pressure)).toBe(-Math.sign(wave.velocity));
    }
  });

  it("keeps |p| = ρc·|u| regardless of direction", () => {
    for (const direction of [WaveDirection.FORWARD, WaveDirection.BACKWARD]) {
      for (const { x, t } of samplePoints) {
        const wave = planeWave(x, t, direction);
        expect(Math.abs(pressureFromGradient(wave.gradient))).toBeCloseTo(
          CHARACTERISTIC_IMPEDANCE * Math.abs(wave.velocity),
          6,
        );
      }
    }
  });

  it("signs the direction +1 forward and −1 backward", () => {
    expect(directionSign(WaveDirection.FORWARD)).toBe(1);
    expect(directionSign(WaveDirection.BACKWARD)).toBe(-1);
  });
});
