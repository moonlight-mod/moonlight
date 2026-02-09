/** biome-ignore-all lint/suspicious/noConsole: devtools snippet */

(() => {
  const icons = [];
  const constants = [];
  const functions = [];
  const components = [];
  const typeDefs = [];
  const types = [];
  const enums = [];

  function formatObject(name, obj) {
    const ret = [];
    const keys = Object.keys(obj);
    if (keys.some((k) => obj[obj[k]] != null)) {
      for (const [key, value] of Object.entries(obj)) {
        if (!Number.isNaN(parseInt(key, 10))) continue;

        if (key === value) {
          ret.push(`${key} = "${value}";`);
        } else {
          ret.push(`${key} = ${value};`);
        }
      }
      enums.push(`export enum ${name} {\n  ${ret.join("\n  ")}\n}`);

      return `${name}: ${name};`;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "function") {
        ret.push(`${key}: any;`);
      } else if (typeof value === "string") {
        if (/^[A-Z0-9]+_[A-Z0-9]+$/.test(value)) {
          ret.push(`${key}: "${value}";`);
        } else if (/^[a-zA-Z0-9]+_[a-z0-9]+(\s|$)/.test(value)) {
          ret.push(`${key}: string;`);
        } else {
          ret.push(`${key}: "${value}";`);
        }
      } else if (typeof value === "object") {
        const subObj = [];
        for (const [k, v] of Object.entries(value)) {
          if (typeof v === "string") {
            subObj.push(`${k}: "${v}";`);
          } else if (typeof v === "number") {
            subObj.push(`${k}: ${v};`);
          } else {
            subObj.push(`${k}: any;`);
          }
        }
        ret.push(`${key}: {\n    ${subObj.join("\n    ")}\n  };`);
      } else {
        ret.push(`${key}: ${value};`);
      }
    }
    typeDefs.push(`export type ${name} = {\n  ${ret.join("\n  ")}\n}`);

    return `${name}: ${name};`;
  }

  const Components = spacepack.require("discord/components/common/index");
  const keys = Object.keys(Components).filter((key) => Components[key] != null);
  for (const key of keys) {
    if (key === "tokens") continue;

    const value = Components[key];
    if (key.endsWith("Icon")) {
      icons.push(key);
    } else if (/^[A-Z_]+$/.test(key) && typeof value !== "function") {
      if (typeof value === "object") {
        types.push(formatObject(key, value));
      } else {
        constants.push(`${key}: ${typeof value === "string" ? `"${value}"` : value};`);
      }
    } else if (typeof value === "function") {
      if (/^[a-z]/.test(key)) {
        functions.push(key);
      } else {
        components.push(key);
      }
    } else if (typeof value === "object") {
      if (value.$$typeof) {
        components.push(key);
      } else {
        types.push(formatObject(key, value));
      }
    } else if (typeof value === "string") {
      let realValue = `"${value}"`;
      if (/[a-zA-Z0-9]+_[a-z0-9]/.test(value)) {
        realValue = "string";
      }
      constants.push(`${key}: ${realValue};`);
    }
  }

  console.log(`
${enums.join("\n")}

${typeDefs.join("\n")}

type IconNames = ${icons.map(JSON.stringify).join(" | ")};
type IconComponents = Record<IconNames, IconComponent>;

type ComponentNames = ${components.map(JSON.stringify).join(" | ")};
type UntypedComponents = Record<ComponentNames, React.ComponentType<any>>;

type FunctionNames = ${functions.map(JSON.stringify).join(" | ")};
type ComponentFunctions = Record<FunctionNames, any>;

type ComponentTypes = {
  ${types.join("\n  ")}
};
type ComponentConstants = {
  ${constants.join("\n  ")}
};
`);
})();
