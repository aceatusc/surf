import uniqolor from "uniqolor";

const palette = [
  "hsl(19, 56%, 85%)" /* #a0522d */,
  "hsl(80, 60%, 85%)" /* #6b8e23 */,
  // "hsl(60, 100%, 70%)" /* #ffff00 */,
  "hsl(210, 100%, 90%)" /* #1e90ff */,
  "hsl(328, 100%, 90%)" /* #ff1493 */,
  "hsl(39, 100%, 80%)" /* #ffa500 */,
  "hsl(181, 100%, 80%)" /* #00ced1 */,
  // "hsl(300, 100%, 90%)" /* #ff00ff */,
  "hsl(180, 25%, 70%)" /* #2f4f4f */,
  "hsl(157, 100%, 80%)" /* #00fa9a */,
  "hsl(275, 100%, 85%)" /* #4b0082 */,
  "hsl(240, 100%, 80%)" /* #0000ff */,
  "hsl(300, 47%, 80%)" /* #dda0dd */,
  "hsl(120, 100%, 80%)" /* #00ff00 */,
];

const nameToColor: { [key: string]: string } = {};

export function getColor(loc: string | undefined, ligher: boolean = true) {
  // return uniqolor(loc || "default", { lightness: ligher ? 90 : 80 }).color;
  loc = loc || "default";
  if (!nameToColor[loc]) {
    nameToColor[loc] =
      palette.shift() || uniqolor(loc, { lightness: ligher ? 90 : 80 }).color;
  }
  return nameToColor[loc];
}
