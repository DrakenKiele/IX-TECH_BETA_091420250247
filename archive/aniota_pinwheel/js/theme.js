import { renderGrid } from "../maqnetix/grid.js";

export function applyTheme(themeNum = 1) {
  const workspace = document.getElementById("snapgrid-workspace");
  if (!workspace) return;
  const theme = getTheme(themeNum);
  // Set background image and color separately to preserve CSS background-size, repeat, and position
  const [imgPart, colorPart] = theme.background.split(') ');
  const imgUrl = imgPart + ')';
  const color = colorPart ? colorPart.trim() : '';
  workspace.style.backgroundImage = imgUrl;
  workspace.style.backgroundColor = color;
  workspace.style.backgroundSize = 'cover';
  workspace.style.backgroundRepeat = 'no-repeat';
  workspace.style.backgroundPosition = 'center';
}

export function renderForTheme(themeNum = 1) {
  renderGrid(themeNum);
  applyTheme(themeNum);
}
export const THEME_REF = {
  AREA_NAMES: {
    1: "NW",
    2: "N",
    3: "NE",
    4: "W",
    5: "C",
    6: "E",
    7: "SW",
    8: "S",
    9: "SE",
  },
  LAYER_COLORS: [
    "#ff0000ff", // red
    "#FF7B00ff", // orange
    "#fffb00ff", // yellow
    "#1eff00ff", // green
    "#808080ff", // gray
    "#003cffff", // blue
    "#8400ffff", // indigo
    "#f700ffff", // violet
    "#353535ff", // dark gray
  ],
  AREA_NUMS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

export function getThemeName(themeNum) {
  return THEME_REF.AREA_NAMES[themeNum] || "Unknown";
}

export function getTheme(themeNum = 1) {
  const color = THEME_REF.LAYER_COLORS[(themeNum - 1) % THEME_REF.LAYER_COLORS.length];
  // SVG backgrounds for each area
  const svgThemes = {
    1: "svg-themes/nw-corner.svg",
    2: "svg-themes/n-edge.svg",
    3: "svg-themes/ne-corner.svg",
    4: "svg-themes/w-edge.svg",
    5: "svg-themes/c-center.svg",
    6: "svg-themes/e-edge.svg",
    7: "svg-themes/sw-corner.svg",
    8: "svg-themes/s-edge.svg",
    9: "svg-themes/se-corner.svg",
  };
  const svg = svgThemes[themeNum] || "svg-themes/c-center.svg";
  // Path is relative to HTML file
  let basePath = window.location.pathname.includes('/MAQNETIX/') ? '../assets/' : './assets/';
  let background = `url('${basePath}${svg}') rgba(0,0,0,0.3)`;
  return {
    gridColor: color,
    background,
  };
}
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------
