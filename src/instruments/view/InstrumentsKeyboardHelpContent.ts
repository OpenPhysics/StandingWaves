/**
 * InstrumentsKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 *
 * The only control here is the instrument radio group, so basic actions cover it; the
 * playback section is included because pausing is how a learner holds the standing wave
 * still to compare its shape with the next instrument's.
 */

import {
  BasicActionsKeyboardHelpSection,
  TimeControlsKeyboardHelpSection,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";

export class InstrumentsKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    super([new TimeControlsKeyboardHelpSection()], [new BasicActionsKeyboardHelpSection()]);
  }
}
