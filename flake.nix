{
  description = "Yet another Discord mod";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    let
      version = "1.0.7";
      hash = "sha256-jqy9RM2/9i/o4TTzKG1FvnoUCjwslBaHVG2tIx/T2f4=";

      # pnpm2nix is unmaintained, forks of it don't support pnpm workspaces
      # Downloading tarballs from GitHub releases will have to do
      mkMoonlight = { pkgs }:
        pkgs.stdenv.mkDerivation {
          name = "moonlight";
          version = version;
          src = pkgs.fetchurl {
            url =
              "https://github.com/moonlight-mod/moonlight/releases/download/v${version}/dist.tar.gz";
            sha256 = hash;
          };

          buildInputs = [ pkgs.gnutar ];
          buildPhase = ''
            mkdir -p $out
            tar -xzf $src -C $out
          '';

          meta = with pkgs.lib; {
            description = "Yet another Discord mod";
            homepage = "https://moonlight-mod.github.io/";
            license = licenses.agpl3;
            maintainers = with maintainers; [ notnite ];
          };
        };

      mkOverride = discord: name: moonlight:
        discord.overrideAttrs (old: {
          installPhase = let
            origAsar = "$out/opt/${name}/resources/app.asar";
            movedAsar = "$out/opt/${name}/resources/_app.asar";
            app = "$out/opt/${name}/resources/app";

            injected = ''
              require("${moonlight}/injector").inject(
                require("path").join(__dirname, "../_app.asar")
              );
            '';

            packageJson = ''
              {"name":"discord","main":"./injector.js","private":true}
            '';

          in old.installPhase + "\n" + ''
            mv ${origAsar} ${movedAsar}
            mkdir -p ${app}

            cat > ${app}/injector.js <<EOF
            ${injected}
            EOF

            echo '${packageJson}' > ${app}/package.json
          '';
        });

      overlay = final: prev: rec {
        moonlight-mod = mkMoonlight { pkgs = final; };
        discord = mkOverride prev.discord "Discord" moonlight-mod;
        discord-ptb = mkOverride prev.discord-ptb "DiscordPTB" moonlight-mod;
        discord-canary =
          mkOverride prev.discord-canary "DiscordCanary" moonlight-mod;
        discord-development =
          mkOverride prev.discord-development "DiscordDevelopment"
          moonlight-mod;
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
