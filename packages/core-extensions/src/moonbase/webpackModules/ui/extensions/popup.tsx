// TODO: clean up the styling here
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import React from "@moonlight-mod/wp/react";
import { MoonbaseExtension } from "core-extensions/src/moonbase/types";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import { ExtensionLoadSource } from "@moonlight-mod/types";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";

const { openModalLazy, useModalsStore, closeModal } = Components;
// discord/components/modals/ConfirmModal
const ConfirmModal = spacepack.findByCode(".minorContainer", "secondaryAction")[0].exports.default;

function close() {
  const ModalStore = useModalsStore.getState();
  closeModal(ModalStore.default[0].key);
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
  transitionState
}: {
  deps: Record<string, MoonbaseExtension[]>;
  transitionState: number | null;
}) {
  const { Text } = Components;

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
      body={
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
            {Object.entries(deps).map(([id, candidates], i) => (
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
                    setOptions((prev) => ({
                      ...prev,
                      [id]: pick
                    }))
                  }
                />
              </>
            ))}
          </div>
        </Flex>
      }
      cancelText="Cancel"
      confirmText="Install"
      onCancel={close}
      onConfirm={() => {
        close();

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

export async function doMissingExtensionPopup(deps: Record<string, MoonbaseExtension[]>) {
  await openModalLazy(async () => {
    return ({ transitionState }: { transitionState: number | null }) => {
      return <MissingExtensionPopup transitionState={transitionState} deps={deps} />;
    };
  });
}

function GenericExtensionPopup({
  title,
  content,
  transitionState,
  uniqueId,
  cb
}: {
  title: string;
  content: string;
  transitionState: number | null;
  uniqueId: number;
  cb: () => void;
}) {
  const { Text } = Components;

  return (
    <ConfirmModal
      title={title}
      body={
        <Flex>
          <Text variant="text-md/normal">{content}</Text>
        </Flex>
      }
      confirmText="Yes"
      cancelText="No"
      onCancel={close}
      onConfirm={() => {
        close();
        cb();
      }}
      transitionState={transitionState}
    />
  );
}

export async function doGenericExtensionPopup(title: string, content: string, uniqueId: number, cb: () => void) {
  await openModalLazy(async () => {
    return ({ transitionState }: { transitionState: number | null }) => {
      return (
        <GenericExtensionPopup
          title={title}
          content={content}
          transitionState={transitionState}
          uniqueId={uniqueId}
          cb={cb}
        />
      );
    };
  });
}
