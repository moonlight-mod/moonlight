const styles: string[] = [];

export function registerStyles(style: string[]) {
  styles.push(...style);
}

export function installStyles(doc: Document) {
  for (const style of styles) {
    const el = doc.createElement("style");
    el.textContent = style;
    doc.documentElement.appendChild(el);
  }
}
