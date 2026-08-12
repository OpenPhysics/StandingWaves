/**
 * standingWavesQueryParameters.ts
 *
 * Sim-specific startup query parameters. This is the single place where every
 * sim-specific query parameter is declared and documented. Public-facing
 * parameters (intended for end users / sharing links) must set `public: true`.
 *
 * ── How to add a query parameter ──────────────────────────────────────────────
 * 1. Add an entry below with a `type`, `defaultValue`, and (if user-facing)
 *    `public: true`. Add `isValidValue` to bound numeric ranges.
 * 2. If it should also be user-editable at runtime, surface it as a preference
 *    in StandingWavesPreferencesModel (initialize that Property from this query parameter).
 *
 * Usage: append e.g. `?showVelocityTrace=true` to the sim URL.
 */

import { logGlobal } from "scenerystack/phet-core";
import { QueryStringMachine } from "scenerystack/query-string-machine";
import StandingWavesNamespace from "../StandingWavesNamespace.js";

const standingWavesQueryParameters = QueryStringMachine.getAll({
  /**
   * Whether to draw the particle-velocity curve alongside displacement and
   * pressure.
   *
   * Off by default. Velocity is the quantity the Phase screen needs — it is what
   * `p = ±ρc·u` is about — but on the other screens a third curve competes with
   * the displacement/pressure pair those screens exist to contrast. So the
   * default is the two-curve view, and this turns the third one on everywhere.
   */
  showVelocityTrace: {
    type: "boolean",
    defaultValue: false,
    public: true,
  },
});

StandingWavesNamespace.register("standingWavesQueryParameters", standingWavesQueryParameters);

// Log query parameters (for the console / PhET-iO).
logGlobal("phet.chipper.queryParameters");

export default standingWavesQueryParameters;
