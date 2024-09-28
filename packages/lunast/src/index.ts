import { RemapField, RemapModule, RemapType } from "./types";
import { Remapped } from "./modules";
import { getProcessors, parseFixed } from "./utils";
import { Processor, ProcessorState } from "./remap";
import { generate } from "astring";

export default class LunAST {
  private modules: Record<string, RemapModule>;
  private types: Record<string, RemapType>;
  private successful: Set<string>;

  private typeCache: Record<string, RemapType | null>;
  private fieldCache: Record<
    string,
    Record<string | symbol, RemapField | null>
  >;
  private processors: Processor[];
  private defaultRequire?: (id: string) => any;
  private getModuleSource?: (id: string) => string;

  elapsed: number;

  constructor() {
    this.modules = {};
    this.types = {};
    this.successful = new Set();

    this.typeCache = {};
    this.fieldCache = {};
    this.processors = getProcessors();

    this.elapsed = 0;
  }

  public static getVersion() {
    // TODO: embed version in build when we move this to a new repo
    // this is here for caching based off of the lunast commit ID
    return "dev";
  }

  public parseScript(id: string, code: string): Record<string, string> {
    const start = performance.now();

    const available = [...this.processors]
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
      .filter((x) => {
        if (x.find == null) return true;
        const finds = Array.isArray(x.find) ? x.find : [x.find];
        return finds.every((find) =>
          typeof find === "string" ? code.indexOf(find) !== -1 : find.test(code)
        );
      })
      .filter((x) => x.manual !== true);

    const ret = this.parseScriptInternal(id, code, available);

    const end = performance.now();
    this.elapsed += end - start;

    return ret;
  }

  // This is like this so processors can trigger other processors while they're parsing
  private parseScriptInternal(
    id: string,
    code: string,
    processors: Processor[]
  ) {
    const ret: Record<string, string> = {};
    if (processors.length === 0) return ret;

    // Wrap so the anonymous function is valid JS
    const module = parseFixed(`(\n${code}\n)`);
    let dirty = false;
    const state: ProcessorState = {
      id,
      ast: module,
      lunast: this,
      markDirty: () => {
        dirty = true;
      },
      trigger: (id, tag) => {
        const source = this.getModuleSourceById(id);
        if (source == null) return;
        if (this.successful.has(tag)) return;
        const processor = this.processors.find((x) => x.name === tag);
        if (processor == null) return;
        const theirRet = this.parseScriptInternal(id, source, [processor]);
        Object.assign(ret, theirRet);
      }
    };

    for (const processor of processors) {
      if (processor.process(state)) {
        this.processors.splice(this.processors.indexOf(processor), 1);
        this.successful.add(processor.name);
      }
    }

    const str = dirty ? generate(module) : null;
    if (str != null) ret[id] = str;

    return ret;
  }

  public getType(name: string) {
    return (
      this.typeCache[name] ?? (this.typeCache[name] = this.types[name] ?? null)
    );
  }

  public getIdForModule(name: string) {
    return Object.values(this.modules).find((x) => x.name === name)?.id ?? null;
  }

  public addModule(module: RemapModule) {
    if (!this.modules[module.name]) {
      this.modules[module.name] = module;
    } else {
      throw new Error(
        `Module ${module.name} already registered (${
          this.modules[module.name].id
        })`
      );
    }
  }

  public addType(type: RemapType) {
    if (!this.types[type.name]) {
      this.types[type.name] = type;
    } else {
      throw new Error(`Type ${type.name} already registered`);
    }
  }

  public proxy(obj: any, type: RemapType): any {
    const fields =
      this.fieldCache[type.name] ?? (this.fieldCache[type.name] = {});

    return new Proxy(obj, {
      get: (target, prop) => {
        const field =
          fields[prop] ??
          (fields[prop] = type.fields.find((x) => x.name === prop) ?? null);
        if (field) {
          const fieldType =
            field.type != null ? this.getType(field.type) : null;
          const name = field.unmapped ?? field.name;
          if (fieldType != null) {
            return this.proxy(target[name], fieldType);
          } else {
            return target[name];
          }
        } else {
          return target[prop];
        }
      }
    });
  }

  // TODO: call this with require we obtain from the webpack entrypoint
  public setDefaultRequire(require: (id: string) => any) {
    this.defaultRequire = require;
  }

  public setModuleSourceGetter(getSource: (id: string) => string) {
    this.getModuleSource = getSource;
  }

  public getModuleSourceById(id: string) {
    return this.getModuleSource?.(id) ?? null;
  }

  public remap<Id extends keyof Remapped>(
    id: Id,
    require?: (id: string) => any
  ): Remapped[Id] | null {
    const mappedModule = this.modules[id];
    if (!mappedModule) return null;

    const realRequire = require ?? this.defaultRequire;
    if (!realRequire) return null;

    const module = realRequire(mappedModule.id);
    if (module == null) return null;

    const type = this.getType(mappedModule.type);
    if (type != null) {
      return this.proxy(module, type);
    } else {
      return module;
    }
  }
}

export { Remapped } from "./modules";
