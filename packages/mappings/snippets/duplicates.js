/** biome-ignore-all lint/suspicious/noConsole: devtools snippet */

(() => {
  const ids = Object.values(moonlight.moonmap.modules);
  const duplicates = ids.filter((id) => ids.filter((id2) => id2 === id).length > 1);
  const dedupedDuplicates = duplicates.filter((id, i) => duplicates.indexOf(id) === i);
  for (const id of dedupedDuplicates) {
    const using = Object.entries(moonlight.moonmap.modules)
      .filter(([_, v]) => v === id)
      .map(([k, _]) => k);
    console.log(id, using);
  }
})();
