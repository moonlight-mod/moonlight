{
  config,
  lib,
  ...
}:

let
  cfg = config.programs.moonlight-mod;
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

  config = lib.mkIf cfg.enable {
    xdg.configFile."moonlight-mod/stable.json" = lib.mkIf (cfg.configs.stable != null) {
      text = builtins.toJSON cfg.configs.stable;
    };

    xdg.configFile."moonlight-mod/ptb.json" = lib.mkIf (cfg.configs.ptb != null) {
      text = builtins.toJSON cfg.configs.ptb;
    };

    xdg.configFile."moonlight-mod/canary.json" = lib.mkIf (cfg.configs.canary != null) {
      text = builtins.toJSON cfg.configs.canary;
    };

    xdg.configFile."moonlight-mod/development.json" = lib.mkIf (cfg.configs.development != null) {
      text = builtins.toJSON cfg.configs.development;
    };
  };
}
