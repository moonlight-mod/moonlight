declare module "@moonlight-mod/wp/moonbase_ui" {
  export * from "core-extensions/src/moonbase/webpackModules/ui";
}

declare module "@moonlight-mod/wp/moonbase_stores" {
  export * from "core-extensions/src/moonbase/webpackModules/stores";
}

declare module "@moonlight-mod/wp/moonbase_ThemeDarkIcon" {
  import ThemeDarkIcon from "core-extensions/src/moonbase/webpackModules/ThemeDarkIcon";
  export = ThemeDarkIcon;
}
