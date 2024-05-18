{
  description = "Yet another Discord mod";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
    pnpm2nix.url = "github:mojotech/pnpm2nix-nzbr";
  };

  outputs = { self, nixpkgs, flake-utils, pnpm2nix }:
    let
      mkMoonlight = { pkgs, mkPnpmPackage }:
        mkPnpmPackage rec {
          workspace = ./.;
          src = ./.;
          components = [
            "packages/core"
            "packages/core-extensions"
            "packages/injector"
            "packages/node-preload"
            "packages/types"
            "packages/web-preload"
          ];
          distDirs = [ "dist" ];

          copyNodeModules = true;
          buildPhase = "pnpm run build";
          installPhase = "cp -r dist $out";

          meta = with pkgs.lib; {
            description = "Yet another Discord mod";
            homepage = "https://moonlight-mod.github.io/";
            license = licenses.lgpl3;
            maintainers = with maintainers; [ notnite ];
          };
        };

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

      overlay = final: prev: rec {
        moonlight-mod = mkMoonlight {
          pkgs = final;
          mkPnpmPackage = pnpm2nix.packages.${final.system}.mkPnpmPackage;
        };
        discord = mkOverride prev moonlight-mod "discord";
        discord-ptb = mkOverride prev moonlight-mod "discord-ptb";
        discord-canary = mkOverride prev moonlight-mod "discord-canary";
        discord-development =
          mkOverride prev moonlight-mod "discord-development";
      };
    in flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [ overlay ];
        };
      in {
        packages.default = pkgs.moonlight-mod;
        packages.moonlight-mod = pkgs.moonlight-mod;

        packages.discord = pkgs.discord;
        packages.discord-ptb = pkgs.discord-ptb;
        packages.discord-canary = pkgs.discord-canary;
        packages.discord-development = pkgs.discord-development;
      }) // {
        overlays.default = overlay;
      };
}
