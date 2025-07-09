{ self }:

final: prev:
prev.lib.genAttrs
  [
    "discord"
    "discord-ptb"
    "discord-canary"
    "discord-development"
  ]
  (name: {
    inherit name;
    value =
      builtins.warn
        ''
          The moonlight package '${name}' is deprecated and will be removed in a future release.
          Please use 'discord.override {withMoonlight = true;}' instead.
          For instructions see: https://moonlight-mod.github.io/using/install/#nixpkgs
        ''
        prev.${name}.override
        {
          withMoonlight = true;
          moonlight = self.packages.${prev.system}.moonlight;
        };
  })
