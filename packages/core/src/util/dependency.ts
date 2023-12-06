import Logger from "./logger";

export type Dependency<T, D> = {
  id: T;
  data: D;
};

const logger = new Logger("core/util/dependency");

export default function calculateDependencies<T, D>(
  origItems: Dependency<T, D>[],
  fetchDep: (id: T) => D | null,
  getDeps: (item: Dependency<T, D>) => T[],
  getIncompatible?: (item: Dependency<T, D>) => T[]
): [Dependency<T, D>[], Map<T, Set<T> | null>] {
  logger.trace("sortDependencies begin", origItems);
  let items = [...origItems];

  if (getIncompatible != null) {
    for (const item of items) {
      const incompatibleItems = getIncompatible(item);
      for (const incompatibleItem of incompatibleItems) {
        if (items.find((x) => x.id === incompatibleItem) != null) {
          logger.warn(
            `Incompatible dependency detected: "${item.id}" and "${incompatibleItem}" - removing "${incompatibleItem}"`
          );

          items = items.filter((x) => x.id !== incompatibleItem);
        }
      }
    }
  }

  const dependencyGraph = new Map<T, Set<T> | null>();
  for (const item of items) {
    const fullDeps: Set<T> = new Set();
    let failed = false;

    // eslint-disable-next-line no-inner-declarations
    function resolveDeps(id: T, root: boolean) {
      if (id === item.id && !root) {
        logger.warn(`Circular dependency detected: "${item.id}"`);
        failed = true;
        return;
      }

      const obj = fetchDep(id);
      if (obj == null) {
        logger.warn(`Missing dependency detected`, id);
        failed = true;
        return;
      }

      if (!root) fullDeps.add(id);

      for (const dep of getDeps({ id, data: obj })) {
        resolveDeps(dep, false);
      }
    }

    resolveDeps(item.id, true);
    dependencyGraph.set(item.id, failed ? null : fullDeps);
  }

  logger.trace("Failed stage", items);
  function isFailed(id: T) {
    const deps = dependencyGraph.get(id);
    if (deps === null) return true;

    // For some reason this can be undefined. If it is, it's not null, so we
    // didn't explicitly fail. FIXME too tired to investigate
    if (deps === undefined) return false;

    for (const dep of deps) {
      if (isFailed(dep)) return true;
    }

    return false;
  }

  const failed = items.filter((item) => isFailed(item.id));
  if (failed.length > 0) {
    logger.warn("Skipping failed items", failed);
    items = items.filter((item) => !failed.includes(item));
  }

  logger.trace("Sorting stage", items);
  const sorted: Dependency<T, D>[] = [];

  // Clone the dependency graph to return it later
  const backupDependencyGraph = new Map(dependencyGraph);
  for (const item of items) {
    dependencyGraph.set(item.id, new Set(dependencyGraph.get(item.id)));
  }

  while (
    Array.from(dependencyGraph.values()).filter((x) => x != null).length > 0
  ) {
    const noDependents = items.filter(
      (e) => dependencyGraph.get(e.id)?.size === 0
    );

    if (noDependents.length === 0) {
      logger.warn("Stuck dependency graph detected", dependencyGraph);
      break;
    }

    for (const item of noDependents) {
      sorted.push(item);
      dependencyGraph.delete(item.id);
    }

    for (const deps of dependencyGraph.values()) {
      for (const item of noDependents) {
        deps?.delete(item.id);
      }
    }
  }

  logger.trace("sortDependencies end", sorted);
  return [sorted, backupDependencyGraph];
}
