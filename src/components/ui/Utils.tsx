import { getColorForGroup } from "@/context/ColorManager";

export function isColorDark(color: string | undefined): boolean {
  if (!color) return false;
  color = color.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 180;
}

export function getContrastColor(color: string | undefined): string {
  return isColorDark(color) ? "#f8fafc" : "#27272a";
}

export function getStylesForQuote(quote: number) {
  const bgColor = getColorForGroup(quote);
  return { backgroundColor: bgColor, color: getContrastColor(bgColor) };
}
