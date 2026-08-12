/**
 * StandingWavesPreferencesModel.ts
 *
 * Model for the simulation-specific preferences shown in Preferences →
 * Simulation. Each preference Property takes its initial value from the
 * corresponding query parameter in standingWavesQueryParameters.
 *
 * Remove the example preference (and its query parameter / UI control) if the
 * sim has no sim-specific preferences.
 */

import { BooleanProperty } from "scenerystack/axon";
import type { Tandem } from "scenerystack/tandem";
import StandingWavesNamespace from "../StandingWavesNamespace.js";
import standingWavesQueryParameters from "./standingWavesQueryParameters.js";

export class StandingWavesPreferencesModel {
  /** Example preference; initial value comes from the `showVelocityTrace` query parameter. */
  public readonly showVelocityTraceProperty: BooleanProperty;

  public constructor(tandem?: Tandem) {
    this.showVelocityTraceProperty = new BooleanProperty(
      standingWavesQueryParameters.showVelocityTrace,
      tandem ? { tandem: tandem.createTandem("showVelocityTraceProperty") } : undefined,
    );
  }

  public reset(): void {
    this.showVelocityTraceProperty.reset();
  }
}

StandingWavesNamespace.register("StandingWavesPreferencesModel", StandingWavesPreferencesModel);
