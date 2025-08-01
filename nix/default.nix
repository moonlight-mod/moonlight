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

  outputs = [
    "out"
    "firefox"
  ];

  nativeBuildInputs = [
    nodejs_22
    pnpm_10.configHook
  ];

  pnpmDeps = pnpm_10.fetchDeps {
    inherit (finalAttrs) pname version src;
    fetcherVersion = 1;
    hash = "sha256-RZfSLy7/wD3C9HaU+ituTz1JHjRb1w+NJFPs5PqF1qQ=";
  };

  env = {
    NODE_ENV = "production";
    MOONLIGHT_VERSION = "v${finalAttrs.version}";
  };

  buildPhase = ''
    runHook preBuild

    pnpm run build
    pnpm run browser-mv2

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    cp -r dist $out

    mkdir -p $firefox/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}/
    mv $out/browser-mv2 $firefox/share/mozilla/extensions/{ec8030f7-c20a-464f-9b0e-13a3a9e97384}/{0fb6d66f-f22d-4555-a87b-34ef4bea5e2a}

    runHook postInstall
  '';

  meta = with lib; {
    description = "Yet another Discord mod";
    homepage = "https://moonlight-mod.github.io/";
    license = licenses.lgpl3;
    maintainers = with maintainers; [ notnite ];
  };
})
