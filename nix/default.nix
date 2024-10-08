{ pkgs, mkPnpmPackage }:

mkPnpmPackage rec {
  workspace = ./..;
  src = ./..;

  # Work around a bug with how it expects dist
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
}
