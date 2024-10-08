{
  description = "Yet another Discord mod";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";
    pnpm2nix.url = "github:NotNite/pnpm2nix-nzbr";
  };

  outputs = { self, nixpkgs, flake-utils, pnpm2nix }:
    let overlay = import ./nix/overlay.nix { inherit pnpm2nix; };
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
