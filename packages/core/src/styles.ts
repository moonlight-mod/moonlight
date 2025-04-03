const styles: string[] = [];

export function registerStyles(style: string[]) {
  styles.push(...style);
}

export function installStyles() {
  for (const style of styles) {
    const el = document.createElement("style");
    el.textContent = style;
    document.documentElement.append(el);
  }
}
