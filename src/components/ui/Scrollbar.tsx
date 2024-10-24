export let scrollbarWidth: number | undefined;

export function getScrollbarWidth() {
  if (scrollbarWidth !== undefined) {
    return scrollbarWidth;
  }

  const container = document.createElement("div");
  document.body.appendChild(container);

  container.style.overflow = "scroll";
  container.style.width = "30px";
  container.style.height = "1px";

  const inner = document.createElement("div");
  inner.style.width = "100%";
  inner.style.height = "100%";
  container.appendChild(inner);

  scrollbarWidth = container.offsetWidth - inner.offsetWidth;
  document.body.removeChild(container);

  return scrollbarWidth;
}
