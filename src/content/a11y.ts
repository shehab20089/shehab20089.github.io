// Accessible names from the reference markup that content.json doesn't carry.
export const a11y = {
  sectionsNav: 'Sections',
  /** Hidden after the theme button's visible label, so it reads "Dark theme" / "Light theme". */
  themeSuffix: ' theme',
  openCase: (name: string) => `Open case study: ${name}`,
  caseDialog: (name: string) => `${name} case study`,
  showScreenshot: (caption: string) => `Show screenshot: ${caption}`,
  fullSize: (caption: string) => `Open full size: ${caption} (new tab)`,
  palette: 'Command menu',
  paletteInput: 'Search commands',
};
