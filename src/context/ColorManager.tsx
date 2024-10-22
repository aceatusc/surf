declare const randomColor: (options?: any) => string;
const predefinedColors = [
  "#636EFA",
  "#EF553B",
  "#00CC96",
  "#8c564b",
  //   "#AB63FA",
  "#FFA15A",
  "#AF0048",
  "#19D3F3",
  "#FF6692",
  "#B6E880",
  "#FF97FF",
  "#FECB52",
];
const colors: { [key: string]: string } = {};

export function getColorForGroup(pgroup: string) {
  if (colors[pgroup]) {
    return colors[pgroup];
  }
  if (Object.keys(colors).length < predefinedColors.length) {
    colors[pgroup] = predefinedColors[Object.keys(colors).length];
    return colors[pgroup];
  }
  colors[pgroup] = randomColor();
  return colors[pgroup];
}
