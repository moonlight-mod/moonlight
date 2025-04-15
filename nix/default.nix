{
  lib,
  stdenv,
  nodejs_22,
  pnpm_10,
}:

stdenv.mkDerivation (finalAttrs: {
  pname = "moonlight";
  version = (builtins.fromJSON (builtins.readFile ./../package.json)).version;

  src = ./..;

  nativeBuildInputs = [
    nodejs_22
    pnpm_10.configHook
  ];

  pnpmDeps = pnpm_10.fetchDeps {
    inherit (finalAttrs) pname version src;
    hash = "sha256-uCuA4Fuquv1qXqSY+kDP2Jp01yZDYG2H3ruOBQMhYtw=";
  };

  env = {
    NODE_ENV = "production";
    MOONLIGHT_VERSION = "v${finalAttrs.version}";
  };

  buildPhase = ''
    runHook preBuild

    pnpm run build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    cp -r dist $out

    runHook postInstall
  '';

  meta = with lib; {
    description = "Yet another Discord mod";
    homepage = "https://moonlight-mod.github.io/";
    license = licenses.lgpl3;
    maintainers = with maintainers; [ notnite ];
  };
})
