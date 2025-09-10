{
  description = "Yet another Discord mod";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      overlay = import ./nix/overlay.nix { inherit self; };
      inherit (nixpkgs) lib;
      systems = [
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
        "x86_64-linux"
      ];
      forAllSystems = lib.genAttrs systems;
    in
    let
      # Deprecated
      overlay-pkgs = forAllSystems (
        system:
        import nixpkgs {
          inherit system;
          overlays = [ overlay ];
          # Workaround to accept discord package license on user's behalf
          config.allowUnfree = true;
        }
      );
    in
    {
      packages = forAllSystems (system: {
        default = self.packages.${system}.moonlight;
        moonlight = nixpkgs.legacyPackages.${system}.callPackage ./nix { };

        # Deprecated alias
        moonlight-mod =
          lib.warn
            "The moonlight package 'moonlight-mod' is deprecated and will be removed in a future release. Use 'moonlight' instead"
            self.packages.${system}.moonlight;

        # Deprecated packages
        inherit (overlay-pkgs)
          discord
          discord-ptb
          discord-canary
          discord-development
          ;
      });

      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixfmt-rfc-style);
    }
    // {
      homeModules.default = ./nix/home-manager.nix;
      # Deprecated overlay
      overlays.default = lib.warn "The moonlight overlay is deprecated and will be removed in a future release." overlay;
    };
}
