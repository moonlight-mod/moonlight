{
  description = "Yet another Discord mod";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    let overlay = import ./nix/overlay.nix { };
    in flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [ overlay ];
        };
      in {
        # Don't use these unless you're testing things
        packages.default = pkgs.moonlight-mod;
        packages.moonlight-mod = pkgs.moonlight-mod;

        packages.discord = pkgs.discord;
        packages.discord-ptb = pkgs.discord-ptb;
        packages.discord-canary = pkgs.discord-canary;
        packages.discord-development = pkgs.discord-development;
      }) // {
        overlays.default = overlay;
        homeModules.default = ./nix/home-manager.nix;
      };
}
