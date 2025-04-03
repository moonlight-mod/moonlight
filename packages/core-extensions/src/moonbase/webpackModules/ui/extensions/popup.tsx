import type { MoonbaseExtension } from "core-extensions/src/moonbase/types";
import { ExtensionLoadSource } from "@moonlight-mod/types";
import { SingleSelect, Text } from "@moonlight-mod/wp/discord/components/common/index";
import { closeModal, openModalLazy, useModalsStore } from "@moonlight-mod/wp/discord/modules/modals/Modals";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
// TODO: clean up the styling here
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

let ConfirmModal: typeof import("@moonlight-mod/wp/discord/components/modals/ConfirmModal").default;

function close() {
  const ModalStore = useModalsStore.getState();
  closeModal(ModalStore.default[0].key);
}

// do this to avoid a hard dependency
function lazyLoad() {
  if (!ConfirmModal) {
    ConfirmModal = spacepack.require("discord/components/modals/ConfirmModal").default;
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
      autofocus={false}
      key={id}
      onChange={(value: string) => {
        setOption(value);
      }}
      options={candidates.map((candidate) => {
        return {
          value: candidate.uniqueId.toString(),
          label:
            candidate.source.url ?? presentableLoadSources[candidate.source.type] ?? candidate.manifest.version ?? ""
        };
      })}
      placeholder="Missing extension"
      value={option}
    />
  );
}

function MissingExtensionPopup({
  deps,
  transitionState
}: {
  deps: Record<string, MoonbaseExtension[]>;
  transitionState: number | null;
}) {
  lazyLoad();
  const amountNotAvailable = Object.values(deps).filter(candidates => candidates.length === 0).length;

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
      body={(
        <Flex
          direction={Flex.Direction.VERTICAL}
          style={{
            gap: "20px"
          }}
        >
          <Text variant="text-md/normal">
            This extension depends on other extensions which are not downloaded. Choose which extensions to download.
          </Text>

          {amountNotAvailable > 0 && (
            <Text variant="text-md/normal">
              {amountNotAvailable}
              {" "}
              extension
              {amountNotAvailable > 1 ? "s" : ""}
              {" "}
              could not be found, and must be installed manually.
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
                  style={{
                    alignSelf: "center",
                    wordBreak: "break-word"
                  }}
                  variant="text-md/normal"
                >
                  {MoonbaseSettingsStore.tryGetExtensionName(id)}
                </Text>

                <ExtensionSelect
                  candidates={candidates}
                  id={id}
                  option={options[id]}
                  setOption={pick =>
                    setOptions(prev => ({
                      ...prev,
                      [id]: pick
                    }))}
                />
              </>
            ))}
          </div>
        </Flex>
      )}
      cancelText="Cancel"
      confirmText="Install"
      onCancel={close}
      onConfirm={() => {
        close();

        for (const pick of Object.values(options)) {
          if (pick != null) {
            MoonbaseSettingsStore.installExtension(Number.parseInt(pick));
          }
        }
      }}
      title="Extension dependencies"
      transitionState={transitionState}
    />
  );
}

export async function doMissingExtensionPopup(deps: Record<string, MoonbaseExtension[]>) {
  await openModalLazy(async () => {
    return ({ transitionState }: { transitionState: number | null }) => {
      return <MissingExtensionPopup deps={deps} transitionState={transitionState} />;
    };
  });
}

function GenericExtensionPopup({
  title,
  content,
  transitionState,
  uniqueId: _uniqueId,
  cb
}: {
  title: string;
  content: string;
  transitionState: number | null;
  uniqueId: number;
  cb: () => void;
}) {
  lazyLoad();

  return (
    <ConfirmModal
      body={(
        <Flex>
          <Text variant="text-md/normal">{content}</Text>
        </Flex>
      )}
      cancelText="No"
      confirmText="Yes"
      onCancel={close}
      onConfirm={() => {
        close();
        cb();
      }}
      title={title}
      transitionState={transitionState}
    />
  );
}

export async function doGenericExtensionPopup(title: string, content: string, uniqueId: number, cb: () => void) {
  await openModalLazy(async () => {
    return ({ transitionState }: { transitionState: number | null }) => {
      return (
        <GenericExtensionPopup
          cb={cb}
          content={content}
          title={title}
          transitionState={transitionState}
          uniqueId={uniqueId}
        />
      );
    };
  });
}
