/**
 * StandingWavesNumberControl.ts
 *
 * A NumberControl themed for this sim's panels: title left, value right, slider
 * underneath.
 *
 * It exists to make two things decisions rather than defaults:
 *
 *   - **an accessible name is required**, because a slider nobody can name is a
 *     slider a screen-reader user cannot use;
 *   - **the keyboard steps are explicit.** The drive-frequency slider in
 *     particular spans several harmonics, and a resonance is narrower than a
 *     hundredth of that range — so arrow keys have to move in useful jumps while
 *     shift-arrow can still land inside a resonance peak.
 */

import type { PhetioProperty, TReadOnlyProperty } from "scenerystack/axon";
import { Dimension2, type Range } from "scenerystack/dot";
import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import { NumberControl, type NumberControlOptions, PhetFont } from "scenerystack/scenery-phet";
import StandingWavesColors from "../../StandingWavesColors.js";
import { FLAT_RECTANGULAR_BUTTON_OPTIONS } from "../StandingWavesButtonOptions.js";

/** Track size shared by every slider in the sim, view pixels. */
const TRACK_SIZE = new Dimension2(140, 3);

/** Thumb size shared by every slider in the sim, view pixels. */
const THUMB_SIZE = new Dimension2(13, 24);

const TITLE_FONT = new PhetFont(13);
const VALUE_FONT = new PhetFont({ size: 13, weight: "bold" });

type SelfOptions = {
  /** Accessible name; required, since every control needs one. */
  readonly accessibleName: TReadOnlyProperty<string>;

  /** Unit pattern containing `{{value}}`; omit for a bare number. */
  readonly valuePattern?: TReadOnlyProperty<string>;

  /** Digits after the decimal point in the readout. */
  readonly decimals?: number;

  /** Value change per arrow key press. Defaults to a fiftieth of the range. */
  readonly keyboardStep?: number;

  /** Value change per shift-arrow press, for fine adjustment. */
  readonly shiftKeyboardStep?: number;

  /** Value change per page up / page down press. */
  readonly pageKeyboardStep?: number;

  /** Granularity the value snaps to while dragging. 0 for continuous. */
  readonly delta?: number;

  /** Width of the slider track, view pixels. */
  readonly trackWidth?: number;
};

export type StandingWavesNumberControlOptions = SelfOptions & NumberControlOptions;

export class StandingWavesNumberControl extends NumberControl {
  public constructor(
    title: TReadOnlyProperty<string> | string,
    valueProperty: PhetioProperty<number>,
    range: Range,
    providedOptions: StandingWavesNumberControlOptions,
  ) {
    const keyboardStep = providedOptions.keyboardStep ?? range.getLength() / 50;

    const options = optionize<StandingWavesNumberControlOptions, EmptySelfOptions, NumberControlOptions>()(
      {
        layoutFunction: NumberControl.createLayoutFunction4({ verticalSpacing: 2 }),
        delta: providedOptions.delta ?? 0,
        titleNodeOptions: {
          font: TITLE_FONT,
          fill: StandingWavesColors.textColorProperty,
          maxWidth: 130,
        },
        numberDisplayOptions: {
          decimalPlaces: providedOptions.decimals ?? 1,
          textOptions: {
            font: VALUE_FONT,
            fill: StandingWavesColors.accentColorProperty,
          },
          backgroundFill: null,
          backgroundStroke: null,
          ...(providedOptions.valuePattern && { valuePattern: providedOptions.valuePattern }),
        },
        arrowButtonOptions: FLAT_RECTANGULAR_BUTTON_OPTIONS,
        sliderOptions: {
          trackSize: new Dimension2(providedOptions.trackWidth ?? TRACK_SIZE.width, TRACK_SIZE.height),
          thumbSize: THUMB_SIZE,
          trackFillEnabled: StandingWavesColors.textColorProperty,
          thumbFill: StandingWavesColors.accentColorProperty,
          keyboardStep,
          shiftKeyboardStep: providedOptions.shiftKeyboardStep ?? keyboardStep / 10,
          pageKeyboardStep: providedOptions.pageKeyboardStep ?? keyboardStep * 5,
        },
      },
      providedOptions,
    );

    super(title, valueProperty, range, options);
  }
}
