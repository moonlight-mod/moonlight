// TODO: clean up the styling here

import { ExtensionLoadSource } from "@moonlight-mod/types";
import { Text } from "@moonlight-mod/wp/discord/components/common/index";
import { SingleSelect } from "@moonlight-mod/wp/discord/components/common/Select";
import { openModalLazy } from "@moonlight-mod/wp/discord/modules/modals/Modals";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import type { MoonbaseExtension } from "../../../types";

let ConfirmModal: typeof import("@moonlight-mod/wp/discord/components/modals/ConfirmModal").ConfirmModal;

// do this to avoid a hard dependency
function lazyLoad() {
  if (!ConfirmModal) {
    ConfirmModal = (spacepack.require("discord/components/modals/ConfirmModal") as any).ConfirmModal;
  }
}

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
  return (
    <SingleSelect
      key={id}
      autofocus={false}
      value={option}
      options={candidates.map((candidate) => {
        return {
          value: candidate.uniqueId.toString(),
          label:
            candidate.source.url ?? presentableLoadSources[candidate.source.type] ?? candidate.manifest.version ?? ""
        };
      })}
      onChange={(value: string) => {
        setOption(value);
      }}
      placeholder="Missing extension"
    />
  );
}

function MissingExtensionPopup({
  deps,
  transitionState,
  onClose
}: {
  deps: Record<string, MoonbaseExtension[]>;
  transitionState: number | null;
  onClose: () => void;
}) {
  lazyLoad();
  const amountNotAvailable = Object.values(deps).filter((candidates) => candidates.length === 0).length;

  const [options, setOptions] = React.useState<Record<string, string | undefined>>(
    Object.fromEntries(
      Object.entries(deps).map(([id, candidates]) => [
        id,
        candidates.length > 0 ? candidates[0].uniqueId.toString() : undefined
      ])
    )
  );

  return (
    <ConfirmModal
      cancelText="Cancel"
      confirmText="Install"
      onConfirm={() => {
        for (const pick of Object.values(options)) {
          if (pick != null) {
            MoonbaseSettingsStore.installExtension(parseInt(pick as string, 10));
          }
        }
      }}
      header="Extension dependencies"
      transitionState={transitionState}
      onClose={onClose}
    >
      <Flex
        style={{
          gap: "20px"
        }}
        direction={Flex.Direction.VERTICAL}
      >
        <Text variant="text-md/normal">
          This extension depends on other extensions which are not downloaded. Choose which extensions to download.
        </Text>

        {amountNotAvailable > 0 && (
          <Text variant="text-md/normal">
            {amountNotAvailable} extension
            {amountNotAvailable > 1 ? "s" : ""} could not be found, and must be installed manually.
          </Text>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "10px"
          }}
        >
          {Object.entries(deps).map(([id, candidates]) => (
            <>
              <Text
                variant="text-md/normal"
                style={{
                  alignSelf: "center",
                  wordBreak: "break-word"
                }}
              >
                {MoonbaseSettingsStore.tryGetExtensionName(id)}
              </Text>

              <ExtensionSelect
                id={id}
                candidates={candidates}
                option={options[id]}
                setOption={(pick) =>
                  setOptions((prev: any) => ({
                    ...prev,
                    [id]: pick
                  }))
                }
              />
            </>
          ))}
        </div>
      </Flex>
    </ConfirmModal>
  );
}

export async function doMissingExtensionPopup(deps: Record<string, MoonbaseExtension[]>) {
  await openModalLazy(async () => {
    return ({ transitionState, onClose }: { transitionState: number | null; onClose: () => void }) => {
      return <MissingExtensionPopup transitionState={transitionState} onClose={onClose} deps={deps} />;
    };
  });
}

function GenericExtensionPopup({
  title,
  content,
  transitionState,
  onClose,
  cb
}: {
  title: string;
  content: string;
  transitionState: number | null;
  onClose: () => void;
  uniqueId: number;
  cb: () => void;
}) {
  lazyLoad();

  return (
    <ConfirmModal
      header={title}
      confirmText="Yes"
      cancelText="No"
      onClose={onClose}
      onConfirm={cb}
      transitionState={transitionState}
    >
      <Flex>
        <Text variant="text-md/normal">{content}</Text>
      </Flex>
    </ConfirmModal>
  );
}

export async function doGenericExtensionPopup(title: string, content: string, uniqueId: number, cb: () => void) {
  await openModalLazy(async () => {
    return ({ transitionState, onClose }: { transitionState: number | null; onClose: () => void }) => {
      return (
        <GenericExtensionPopup
          title={title}
          content={content}
          transitionState={transitionState}
          uniqueId={uniqueId}
          cb={cb}
          onClose={onClose}
        />
      );
    };
  });
}
