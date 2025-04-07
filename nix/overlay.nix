{ ... }:

let
  nameTable = {
    discord = "Discord";
    discord-ptb = "DiscordPTB";
    discord-canary = "DiscordCanary";
    discord-development = "DiscordDevelopment";
  };

  darwinNameTable = {
    discord = "Discord";
    discord-ptb = "Discord PTB";
    discord-canary = "Discord Canary";
    discord-development = "Discord Development";
  };

  mkOverride = prev: moonlight: name:
    let discord = prev.${name};
    in discord.overrideAttrs (old: {
      installPhase = let
        folderName = nameTable.${name};
        darwinFolderName = darwinNameTable.${name};

        injected = ''
          require("${moonlight}/injector").inject(
            require("path").join(__dirname, "../_app.asar")
          );
        '';

        packageJson = ''
          {"name":"discord","main":"./injector.js","private":true}
        '';

      in old.installPhase + "\n" + ''
        resources="$out/opt/${folderName}/resources"
        if [ ! -d "$resources" ]; then
          resources="$out/Applications/${darwinFolderName}.app/Contents/Resources"
        fi

        mv "$resources/app.asar" "$resources/_app.asar"
        mkdir -p "$resources/app"

        cat > "$resources/app/injector.js" <<EOF
        ${injected}
        EOF

        echo '${packageJson}' > "$resources/app/package.json"
      '';
    });
in final: prev: rec {
  moonlight-mod = final.callPackage ./default.nix { };
  discord = mkOverride prev moonlight-mod "discord";
  discord-ptb = mkOverride prev moonlight-mod "discord-ptb";
  discord-canary = mkOverride prev moonlight-mod "discord-canary";
  discord-development = mkOverride prev moonlight-mod "discord-development";
}
