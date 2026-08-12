/**
 * StandingWavesColors.ts
 *
 * Defines all dynamic colors for the simulation using ProfileColorProperty.
 *
 * Each color has two profiles:
 *   - "default"   — used in standard (dark) mode
 *   - "projector" — used when the user enables Projector Mode in Preferences
 *
 * SceneryStack switches profiles automatically; no manual toggling is needed.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 * Import StandingWavesColors and pass properties directly to Node's fillProperty or
 * strokeProperty options:
 *
 *   import StandingWavesColors from "../../StandingWavesColors.js";
 *
 *   new Rectangle( 0, 0, 100, 50, {
 *     fillProperty: StandingWavesColors.backgroundColorProperty,
 *   });
 *
 * ── How to add a color ────────────────────────────────────────────────────────
 * Add a new ProfileColorProperty entry to the StandingWavesColors object below.
 * Always provide both "default" and "projector" values.
 */
import { ProfileColorProperty } from "scenerystack/scenery";
import StandingWavesNamespace from "./StandingWavesNamespace.js";

const StandingWavesColors = {
  /**
   * Background color for the simulation screen.
   * Deep navy in default mode; white in projector mode.
   */
  backgroundColorProperty: new ProfileColorProperty(StandingWavesNamespace, "background", {
    default: "#1a1a2e",
    projector: "#ffffff",
  }),

  /**
   * Primary accent color for highlights, selected items, and key UI elements.
   * Sky blue in default mode; dark navy in projector mode.
   */
  accentColorProperty: new ProfileColorProperty(StandingWavesNamespace, "accent", {
    default: "#4fc3f7",
    projector: "#1a1a2e",
  }),

  /**
   * Background fill for control panels and dialogs.
   * Deep blue in default mode; light gray in projector mode.
   */
  panelBackgroundColorProperty: new ProfileColorProperty(StandingWavesNamespace, "panelBackground", {
    default: "#16213e",
    projector: "#f5f5f5",
  }),

  /**
   * Border/stroke color for control panels and dialogs.
   * Teal-navy in default mode; medium gray in projector mode.
   */
  panelBorderColorProperty: new ProfileColorProperty(StandingWavesNamespace, "panelBorder", {
    default: "#0f3460",
    projector: "#999999",
  }),

  /**
   * Text color for labels, readouts, and general UI text.
   * Near-white in default mode; near-black in projector mode.
   */
  textColorProperty: new ProfileColorProperty(StandingWavesNamespace, "text", {
    default: "#e0e0e0",
    projector: "#1a1a1a",
  }),

  // ── Light control surfaces ───────────────────────────────────────────────────
  // White chrome (combo boxes, flat push buttons, editable input fields) stays light
  // in both profiles; its text stays dark. Same values in default and projector mode,
  // but defined here so every color lives in one themeable place.

  /** Fill of light control surfaces: combo-box button/list, editable input fields. */
  controlSurfaceColorProperty: new ProfileColorProperty(StandingWavesNamespace, "controlSurface", {
    default: "#ffffff",
    projector: "#ffffff",
  }),

  /** Fill of a disabled control surface (grayed-out editable input field). */
  controlSurfaceDisabledColorProperty: new ProfileColorProperty(StandingWavesNamespace, "controlSurfaceDisabled", {
    default: "#cccccc",
    projector: "#cccccc",
  }),

  /** Text on light control surfaces: combo items, flat-button labels, field values, preferences. */
  controlSurfaceTextColorProperty: new ProfileColorProperty(StandingWavesNamespace, "controlSurfaceText", {
    default: "#1a1a1a",
    projector: "#1a1a1a",
  }),

  // ── The three acoustic quantities ────────────────────────────────────────────
  // One convention, used on every screen and in every legend, arrow, trace and
  // envelope:
  //
  //   displacement ξ → black / grey      velocity u → red      pressure p → blue
  //
  // This is the palette on Dan Russell's acoustics demos
  // (https://www.acs.psu.edu/drussell/demos.html), which is where many learners
  // will have met these curves first. Never colour one of these three by
  // anything else (screen, mode number, termination) — the whole point is that
  // the colour identifies the physical quantity and nothing else.

  /**
   * Particle displacement ξ. Near-black on white; light grey on the dark
   * profile, since Russell's black only works against his white background.
   */
  displacementColorProperty: new ProfileColorProperty(StandingWavesNamespace, "displacement", {
    default: "#e8e8e8",
    projector: "#1a1a1a",
  }),

  /** Particle velocity u = ∂ξ/∂t. Red in both profiles; lightness shifts, hue does not. */
  velocityColorProperty: new ProfileColorProperty(StandingWavesNamespace, "velocity", {
    default: "#ff6b6b",
    projector: "#c62828",
  }),

  /** Acoustic pressure p = −ρc²·∂ξ/∂x. Blue in both profiles. */
  pressureColorProperty: new ProfileColorProperty(StandingWavesNamespace, "pressure", {
    default: "#64b5f6",
    projector: "#1565c0",
  }),

  // ── Chart chrome ─────────────────────────────────────────────────────────────

  /** Plot-area fill behind a trace strip. */
  chartBackgroundColorProperty: new ProfileColorProperty(StandingWavesNamespace, "chartBackground", {
    default: "#101a30",
    projector: "#fbfbfb",
  }),

  /** Major grid lines inside a trace strip. */
  gridLineColorProperty: new ProfileColorProperty(StandingWavesNamespace, "gridLine", {
    default: "#24354f",
    projector: "#e0e0e0",
  }),

  /** Axis lines, tick marks and tick labels. */
  axisColorProperty: new ProfileColorProperty(StandingWavesNamespace, "axis", {
    default: "#8fa3bf",
    projector: "#616161",
  }),

  // ── The pipe ─────────────────────────────────────────────────────────────────

  /** Pipe walls, drawn as a pair of horizontal bars enclosing the bore. */
  pipeWallColorProperty: new ProfileColorProperty(StandingWavesNamespace, "pipeWall", {
    default: "#7a8ba3",
    projector: "#546e7a",
  }),

  /** Fill of the bore — the air column itself. */
  pipeBoreColorProperty: new ProfileColorProperty(StandingWavesNamespace, "pipeBore", {
    default: "#0d1526",
    projector: "#eceff1",
  }),

  /**
   * Cap across a closed end. Deliberately heavier than the walls: "rigid" is the
   * whole content of the closed boundary condition, so the end has to look
   * immovable rather than merely drawn.
   */
  pipeCapColorProperty: new ProfileColorProperty(StandingWavesNamespace, "pipeCap", {
    default: "#cfd8dc",
    projector: "#263238",
  }),

  /** Air-particle markers oscillating inside the bore. */
  particleColorProperty: new ProfileColorProperty(StandingWavesNamespace, "particle", {
    default: "#9e9e9e",
    projector: "#757575",
  }),

  // ── Modes, nodes and resonance ───────────────────────────────────────────────

  /** Shading behind harmonics the current termination allows. */
  allowedHarmonicBandColorProperty: new ProfileColorProperty(StandingWavesNamespace, "allowedHarmonicBand", {
    default: "#1f3a5f",
    projector: "#e3f2fd",
  }),

  /** Label and tick colour for a harmonic the termination forbids. */
  forbiddenHarmonicColorProperty: new ProfileColorProperty(StandingWavesNamespace, "forbiddenHarmonic", {
    default: "#4a5568",
    projector: "#bdbdbd",
  }),

  /**
   * Node / antinode markers along the pipe. Neutral on purpose: a marker labels
   * a *position*, and colouring it by quantity would collide with the curve it
   * is annotating.
   */
  nodeMarkerColorProperty: new ProfileColorProperty(StandingWavesNamespace, "nodeMarker", {
    default: "#ffd54f",
    projector: "#f57f17",
  }),

  /** Badge shown while the drive frequency sits inside a mode's resonance band. */
  resonanceBadgeColorProperty: new ProfileColorProperty(StandingWavesNamespace, "resonanceBadge", {
    default: "#66bb6a",
    projector: "#2e7d32",
  }),
};

export default StandingWavesColors;
