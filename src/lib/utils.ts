import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const loadingScripts: Map<string, Promise<string>> = new Map();

export function loadBrowserScript(url: string): Promise<string> {
  if (loadingScripts.has(url)) {
    return Promise.resolve(url);
  } else if (document.querySelectorAll(`script[src="${url}"]`).length !== 0) {
    return Promise.resolve(url);
  } else {
    const promise: Promise<string> = new Promise((resolve, reject) => {
      const head = document.head;
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      const scriptEl = head.appendChild(script);
      const onLoadedOrError = (event: Event): void => {
        loadingScripts.delete(url);
        scriptEl.removeEventListener('load', onLoadedOrError);
        scriptEl.removeEventListener('error', onLoadedOrError);
        if (event.type === 'load') {
          resolve(url);
        } else {
          reject(url);
        }
      };
      scriptEl.addEventListener('load', onLoadedOrError);
      scriptEl.addEventListener('error', onLoadedOrError);
    });
    loadingScripts.set(url, promise);
    return promise;
  }
}