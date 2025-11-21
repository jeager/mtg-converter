/**
 * Map of condition codes to their display names
 */
export const CONDITION_MAP = {
  nm: "Near Mint",
  sp: "Slightly Played",
  mp: "Moderately Played",
  hp: "Heavily Played",
  dm: "Damaged",
} as const;

/**
 * Default conversion options
 */
export const DEFAULT_OPTIONS = {
  condition: "nm",
  ignoreEdition: false,
  forceCondition: false,
  addToList: false,
} as const;

/**
 * Available condition options for dropdown selection
 */
export const CONDITION_OPTIONS = [
  { key: "nm", label: "Near Mint" },
  { key: "sp", label: "Slightly Played" },
  { key: "mp", label: "Moderately Played" },
  { key: "hp", label: "Heavily Played" },
  { key: "dm", label: "Damaged" },
] as const;
