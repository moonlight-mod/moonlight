import Logger from "./logger";

const logger = new Logger("core/util/dependency");

export type Dependency<T, D> = {
  id: T;
  data: D;
};
type Dependencies<T, D> = Dependency<T, D>[];
type DependencyGraph<T> = Map<T, Set<T> | null>;

type FetchDep<T, D> = (id: T) => D | null;
type GetDeps<T, D> = (item: Dependency<T, D>) => T[];
type GetIncompatible<T, D> = (item: Dependency<T, D>) => T[];
type GetEnabled<T, D> = (item: Dependency<T, D>) => boolean;

function buildDependencyGraph<T, D>(
  origItems: Dependencies<T, D>,
  {
    fetchDep,
    getDeps,
    getIncompatible,
    getEnabled
  }: {
    fetchDep: FetchDep<T, D>;
    getDeps: GetDeps<T, D>;
    getIncompatible?: GetIncompatible<T, D>;
    getEnabled?: GetEnabled<T, D>;
  }
): [Dependencies<T, D>, DependencyGraph<T>] {
  let items = [...origItems];
  const dependencyGraph: DependencyGraph<T> = new Map();

  for (const item of items) {
    const fullDeps: Set<T> = new Set();
    let failed = false;

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

  return [items, dependencyGraph];
}

export default function calculateDependencies<T, D>(
  origItems: Dependencies<T, D>,
  {
    fetchDep,
    getDeps,
    getIncompatible,
    getEnabled
  }: {
    fetchDep: FetchDep<T, D>;
    getDeps: GetDeps<T, D>;
    getIncompatible?: GetIncompatible<T, D>;
    getEnabled?: GetEnabled<T, D>;
  }
): [Dependencies<T, D>, DependencyGraph<T>] {
  logger.trace("sortDependencies begin", origItems);
  // eslint-disable-next-line prefer-const
  let [itemsOrig, dependencyGraphOrig] = buildDependencyGraph(origItems, {
    fetchDep,
    getDeps,
    getIncompatible,
    getEnabled
  });

  if (getEnabled != null) {
    logger.trace("Enabled stage", itemsOrig);
    const implicitlyEnabled: T[] = [];

    function validateDeps(dep: Dependency<T, D>) {
      if (getEnabled!(dep)) {
        const deps = dependencyGraphOrig.get(dep.id)!;
        for (const id of deps.values()) {
          const data = fetchDep(id)!;
          validateDeps({ id, data });
        }
      } else {
        const dependsOnMe = Array.from(dependencyGraphOrig.entries()).filter(
          ([, v]) => v?.has(dep.id)
        );

        if (dependsOnMe.length > 0) {
          logger.debug("Implicitly enabling dependency", dep.id);
          implicitlyEnabled.push(dep.id);
        }
      }
    }

    for (const dep of itemsOrig) validateDeps(dep);
    itemsOrig = itemsOrig.filter(
      (x) => getEnabled(x) || implicitlyEnabled.includes(x.id)
    );
  }

  if (getIncompatible != null) {
    logger.trace("Incompatible stage", itemsOrig);

    for (const item of itemsOrig) {
      // JavaScript iterator moment
      if (!itemsOrig.includes(item)) continue;

      const incompatibleItems = getIncompatible(item);
      for (const incompatibleItem of incompatibleItems) {
        if (itemsOrig.find((x) => x.id === incompatibleItem) != null) {
          logger.warn(
            `Incompatible dependency detected: "${item.id}" and "${incompatibleItem}" - removing "${incompatibleItem}"`
          );

          itemsOrig = itemsOrig.filter((x) => x.id !== incompatibleItem);
        }
      }
    }
  }

  logger.trace("Verification stage", itemsOrig);
  const [items, dependencyGraph] = buildDependencyGraph(itemsOrig, {
    fetchDep,
    getDeps,
    getIncompatible,
    getEnabled
  });

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
