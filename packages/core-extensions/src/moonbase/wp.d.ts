declare module "@moonlight-mod/wp/moonbase_ui" {
  export * from "src/moonbase/webpackModules/ui";
}

declare module "@moonlight-mod/wp/moonbase_stores" {
  export * from "src/moonbase/webpackModules/stores";
}

declare module "@moonlight-mod/wp/moonbase_ThemeDarkIcon" {
  import ThemeDarkIcon from "src/moonbase/webpackModules/ThemeDarkIcon";
  export = ThemeDarkIcon;
}
