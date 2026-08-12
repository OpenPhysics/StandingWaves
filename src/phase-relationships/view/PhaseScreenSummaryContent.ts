/**
 * PhaseScreenSummaryContent.ts
 *
 * The accessible screen summary for the Phase screen. Its live paragraph states
 * the phase relationship in words, because that relationship is the only thing on
 * the screen and it is carried visually by the alignment of two curves — which is
 * exactly what a non-visual reader cannot see.
 */
import { DerivedProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { ScreenSummaryContent } from "scenerystack/sim";
import { WaveDirection } from "../../common/model/acoustics.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { PhaseModel } from "../model/PhaseModel.js";

export class PhaseScreenSummaryContent extends ScreenSummaryContent {
  private readonly currentDetailsProperty: TReadOnlyProperty<string>;

  public constructor(model: PhaseModel) {
    const a11y = StringManager.getInstance().getPhaseA11yStrings();

    const currentDetailsProperty = new DerivedProperty(
      [model.directionProperty, a11y.currentDetails.forwardStringProperty, a11y.currentDetails.backwardStringProperty],
      (direction: WaveDirection, forward: string, backward: string) =>
        direction === WaveDirection.FORWARD ? forward : backward,
    );

    super({
      playAreaContent: a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: a11y.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsProperty,
      interactionHintContent: a11y.screenSummary.interactionHintStringProperty,
    });

    this.currentDetailsProperty = currentDetailsProperty;
  }

  public override dispose(): void {
    this.currentDetailsProperty.dispose();
    super.dispose();
  }
}
