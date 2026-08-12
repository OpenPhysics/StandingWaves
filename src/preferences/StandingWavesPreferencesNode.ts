/**
 * StandingWavesPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Controls are bound
 * to StandingWavesPreferencesModel Properties (whose initial values come from
 * standingWavesQueryParameters).
 */

import { Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { Checkbox } from "scenerystack/sun";
import type { Tandem } from "scenerystack/tandem";
import { StringManager } from "../i18n/StringManager.js";
import StandingWavesColors from "../StandingWavesColors.js";
import StandingWavesNamespace from "../StandingWavesNamespace.js";
import type { StandingWavesPreferencesModel } from "./StandingWavesPreferencesModel.js";

export class StandingWavesPreferencesNode extends VBox {
  public constructor(preferencesModel: StandingWavesPreferencesModel, tandem?: Tandem) {
    const prefStrings = StringManager.getInstance().getPreferences();

    // The Preferences dialog is always white, so use the dark "light control surface"
    // colors (readable on white in both default and projector profiles), not textColorProperty
    // (which is near-white in default mode and would be invisible on the white dialog).
    const header = new Text(prefStrings.titleStringProperty, {
      font: new PhetFont({ size: 18, weight: "bold" }),
      fill: StandingWavesColors.controlSurfaceTextColorProperty,
    });

    const showVelocityTraceCheckbox = new Checkbox(
      preferencesModel.showVelocityTraceProperty,
      new Text(prefStrings.showVelocityTraceStringProperty, {
        font: new PhetFont(14),
        fill: StandingWavesColors.controlSurfaceTextColorProperty,
      }),
      {
        checkboxColor: StandingWavesColors.controlSurfaceTextColorProperty,
        checkboxColorBackground: StandingWavesColors.controlSurfaceColorProperty,
        spacing: 8,
        ...(tandem && { tandem: tandem.createTandem("showVelocityTraceCheckbox") }),
      },
    );

    super({
      align: "left",
      spacing: 12,
      children: [header, showVelocityTraceCheckbox],
    });
  }
}

StandingWavesNamespace.register("StandingWavesPreferencesNode", StandingWavesPreferencesNode);
