import uniqolor from "uniqolor";

export function getColor(loc: string | undefined, ligher: boolean = true) {
  return uniqolor(loc || "default", { lightness: ligher ? 90 : 80 }).color;
}
