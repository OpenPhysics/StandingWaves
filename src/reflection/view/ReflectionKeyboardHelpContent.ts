/**
 * ReflectionKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 *
 * This screen's controls are a push button, a radio group and a checkbox — all covered
 * by the basic-actions section — plus the playback controls, which get their own
 * section because stepping frame by frame is genuinely useful here: it is how a learner
 * freezes the pulse at the instant it is touching the far end.
 */

import {
  BasicActionsKeyboardHelpSection,
  TimeControlsKeyboardHelpSection,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";

export class ReflectionKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    super([new TimeControlsKeyboardHelpSection()], [new BasicActionsKeyboardHelpSection()]);
  }
}
