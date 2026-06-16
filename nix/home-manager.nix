{
  config,
  lib,
  pkgs,
  ...
}:

let
  cfg = config.programs.moonlight;
in
{
  imports = [
    (lib.mkRenamedOptionModule [ "programs" "moonlight-mod" ] [ "programs" "moonlight" ])
  ];

  options.programs.moonlight = {
    enable = lib.mkEnableOption "Yet another Discord mod";

    configs =
      let
        # TODO: type this
        type = lib.types.nullOr lib.types.attrs;
        default = null;
      in
      {
        stable = lib.mkOption {
          inherit type default;
          description = "Configuration for Discord Stable";
        };

        ptb = lib.mkOption {
          inherit type default;
          description = "Configuration for Discord PTB";
        };

        canary = lib.mkOption {
          inherit type default;
          description = "Configuration for Discord Canary";
        };

        development = lib.mkOption {
          inherit type default;
          description = "Configuration for Discord Development";
        };
      };
  };

  config = lib.mkIf cfg.enable (
    let
      file = value:
        lib.mkIf (value != null) {
          text = builtins.toJSON value;
        };
    in
    lib.mkMerge [
      (lib.mkIf pkgs.stdenv.isDarwin {
        home.file = {
          "Library/Application Support/moonlight-mod/stable.json" = file cfg.configs.stable;
          "Library/Application Support/moonlight-mod/ptb.json" = file cfg.configs.ptb;
          "Library/Application Support/moonlight-mod/canary.json" = file cfg.configs.canary;
          "Library/Application Support/moonlight-mod/development.json" = file cfg.configs.development;
        };
      })
      (lib.mkIf (!pkgs.stdenv.isDarwin) {
        xdg.configFile = {
          "moonlight-mod/stable.json" = file cfg.configs.stable;
          "moonlight-mod/ptb.json" = file cfg.configs.ptb;
          "moonlight-mod/canary.json" = file cfg.configs.canary;
          "moonlight-mod/development.json" = file cfg.configs.development;
        };
      })
    ]
  );
}
