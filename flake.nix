{
  description = "Yet another Discord mod";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    let
      overlay = import ./nix/overlay.nix { inherit self; };
    in
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        # https://discourse.nixos.org/t/different-ways-of-populating-pkgs-variable/29109/2
        pkgs = nixpkgs.legacyPackages.${system};

        # Deprecated
        overlay-pkgs = import nixpkgs {
          inherit system;
          overlays = [ overlay ];
          # Workaround to accept discord package license on user's behalf
          config.allowUnfree = true;
        };
      in
      {
        packages = {
          default = self.packages.${system}.moonlight;
          moonlight = pkgs.callPackage ./nix { };

          # Deprecated alias
          moonlight-mod =
            builtins.warn
              "The moonlight package 'moonlight-mod' is deprecated and will be removed in a future release. Use 'moonlight' instead"
              self.packages.${system}.moonlight;

          # Deprecated packages
          inherit (overlay-pkgs)
            discord
            discord-ptb
            discord-canary
            discord-development
            ;
        };

        formatter = pkgs.nixfmt-rfc-style;
      }
    )
    // {
      homeModules.default = ./nix/home-manager.nix;
      # Deprecated overlay
      overlays.default = builtins.warn "The moonlight overlay is deprecated and will be removed in a future release." overlay;
    };
}
