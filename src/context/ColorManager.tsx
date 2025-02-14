import uniqolor from "uniqolor";

function stringToHash(str: string): number {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashArray = new Uint32Array(1);
  hashArray[0] = data.reduce((hash, byte) => {
    return (hash << 5) - hash + byte;
  }, 0);
  return Math.abs(hashArray[0]);
}

export function getColor(loc: string | undefined, ligher: boolean = true) {
  return uniqolor(stringToHash(loc?.repeat(5) || "default"), {
    lightness: ligher ? 80 : 60,
    saturation: [30, 100],
  }).color;
  // loc = loc || "default";
  // if (!nameToColor[loc]) {
  //   nameToColor[loc] =
  //     palette.shift() || uniqolor(loc, { lightness: ligher ? 90 : 80 }).color;
  // }
  // return nameToColor[loc];
}
