import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const mod = spacepack.findByCode("connectStores:")[0].exports;

const useStateFromStores = spacepack.findFunctionByStrings(
  mod,
  '"useStateFromStores"'
)!;

module.exports = {
  BatchedStoreListener: spacepack.findFunctionByStrings(
    mod,
    " tried to load a non-existent store."
  ),
  Dispatcher: spacepack.findFunctionByStrings(mod, "_dispatchWithDevtools("),
  Store: spacepack.findFunctionByStrings(mod, "registerActionHandlers("),
  default: mod.ZP,
  statesWillNeverBeEqual: spacepack.findFunctionByStrings(mod, "return!1"),
  useStateFromStores,
  useStateFromStoresArray: spacepack.findFunctionByStrings(
    mod,
    new RegExp(`return ${useStateFromStores.name}\\(.+?\\.[^Z]\\)`)
  ),
  useStateFromStoresObject: spacepack.findFunctionByStrings(
    mod,
    new RegExp(`return ${useStateFromStores.name}\\(.+?\\.Z\\)`)
  )
};
