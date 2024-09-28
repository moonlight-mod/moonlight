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

  constructor() {
    this.modules = {};
    this.types = {};
    this.successful = new Set();

    this.typeCache = {};
    this.fieldCache = {};
    this.processors = getProcessors();
  }

  public static getVersion() {
    // TODO: embed version in build when we move this to a new repo
    // this is here for caching based off of the lunast commit ID
    return "dev";
  }

  public parseScript(id: string, code: string): string | null {
    const available = [...this.processors]
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
      .filter((x) =>
        x.find != null
          ? typeof x.find === "string"
            ? code.indexOf(x.find) !== -1
            : x.find.test(code)
          : true
      )
      .filter((x) =>
        x.dependencies != null
          ? x.dependencies.every((dep) => this.successful.has(dep))
          : true
      );
    if (available.length === 0) return null;

    const module = parseFixed(code);
    let dirty = false;
    const state: ProcessorState = {
      id,
      ast: module,
      lunast: this,
      markDirty: () => {
        dirty = true;
      }
    };

    for (const processor of available) {
      if (processor.process(state)) {
        this.processors.splice(this.processors.indexOf(processor), 1);
        this.successful.add(processor.name);
      }
    }

    if (dirty) {
      return generate(module);
    } else {
      return null;
    }
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
