// TODO: clean up the styling here
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import React from "@moonlight-mod/wp/react";
import { MoonbaseExtension } from "core-extensions/src/moonbase/types";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import { ExtensionLoadSource } from "types/src";

const {
  openModalLazy,
  closeModal
} = require("@moonlight-mod/wp/discord/components/common/index");
const Popup = spacepack.findByCode(".minorContainer", "secondaryAction")[0]
  .exports.default;

const presentableLoadSources: Record<ExtensionLoadSource, string> = {
  [ExtensionLoadSource.Developer]: "Local extension", // should never show up
  [ExtensionLoadSource.Core]: "Core extension",
  [ExtensionLoadSource.Normal]: "Extension repository"
};

function ExtensionSelect({
  id,
  candidates,
  option,
  setOption
}: {
  id: string;
  candidates: MoonbaseExtension[];
  option: string | undefined;
  setOption: (pick: string | undefined) => void;
}) {
  const { SingleSelect } = Components;

  return (
    <SingleSelect
      key={id}
      autofocus={false}
      value={option}
      options={candidates.map((candidate) => {
        return {
          value: candidate.uniqueId.toString(),
          label:
            candidate.source.url ??
            presentableLoadSources[candidate.source.type] ??
            candidate.manifest.version ??
            ""
        };
      })}
      onChange={(value: string) => {
        setOption(value);
      }}
    />
  );
}

function OurPopup({
  deps,
  transitionState,
  id
}: {
  deps: Record<string, MoonbaseExtension[]>;
  transitionState: number | null;
  id: string;
}) {
  const { Text } = Components;

  const amountNotAvailable = Object.values(deps).filter(
    (candidates) => candidates.length === 0
  ).length;

  const [options, setOptions] = React.useState<
    Record<string, string | undefined>
  >(
    Object.fromEntries(
      Object.entries(deps).map(([id, candidates]) => [
        id,
        candidates.length > 0 ? candidates[0].uniqueId.toString() : undefined
      ])
    )
  );

  return (
    <Popup
      body={
        <>
          <Text variant="text-md/normal">
            This extension depends on other extensions which are not downloaded.
            Choose which extensions to download.
          </Text>

          {amountNotAvailable > 0 && (
            <Text variant="text-md/normal">
              {amountNotAvailable} extension
              {amountNotAvailable > 1 ? "s" : ""} could not be found, and must
              be installed manually.
            </Text>
          )}

          {Object.entries(deps).map(([id, candidates], i) => (
            <>
              <span>{MoonbaseSettingsStore.tryGetExtensionName(id)}</span>
              <ExtensionSelect
                key={i}
                id={id}
                candidates={candidates}
                option={options[id]}
                setOption={(pick) =>
                  setOptions((prev) => ({
                    ...prev,
                    [id]: pick
                  }))
                }
              />
            </>
          ))}
        </>
      }
      cancelText="Cancel"
      confirmText="Install"
      onConfirm={() => {
        closeModal(id);

        for (const pick of Object.values(options)) {
          if (pick != null) {
            MoonbaseSettingsStore.installExtension(parseInt(pick));
          }
        }
      }}
      title="Extension dependencies"
      transitionState={transitionState}
    />
  );
}

export async function doPopup(deps: Record<string, MoonbaseExtension[]>) {
  const id: string = await openModalLazy(async () => {
    // eslint-disable-next-line react/display-name
    return ({ transitionState }: { transitionState: number | null }) => {
      return <OurPopup transitionState={transitionState} deps={deps} id={id} />;
    };
  });
}

export default async function installWithDependencyPopup(uniqueId: number) {
  await MoonbaseSettingsStore.installExtension(uniqueId);
  const deps = await MoonbaseSettingsStore.getDependencies(uniqueId);
  if (deps != null) {
    await doPopup(deps);
  }
}
