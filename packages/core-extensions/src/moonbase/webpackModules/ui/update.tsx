import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import { UpdateState } from "../../types";
import HelpMessage from "./HelpMessage";
import { MoonlightBranch } from "@moonlight-mod/types";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import {
  ThemeDarkIcon,
  Button,
  Text,
  ModalRoot,
  ModalSize,
  ModalContent,
  ModalHeader,
  Heading,
  ModalCloseButton,
  openModal
} from "@moonlight-mod/wp/discord/components/common/index";
import MarkupClasses from "@moonlight-mod/wp/discord/modules/messages/web/Markup.css";

const strings: Record<UpdateState, string> = {
  [UpdateState.Ready]: "A new version of moonlight is available.",
  [UpdateState.Working]: "Updating moonlight...",
  [UpdateState.Installed]: "Updated. Restart Discord to apply changes.",
  [UpdateState.Failed]: "Failed to update moonlight. Please use the installer instead."
};

function MoonlightChangelog({
  changelog,
  version,
  transitionState,
  onClose
}: {
  changelog: string;
  version: string;
  transitionState: number | null;
  onClose: () => void;
}) {
  return (
    <ModalRoot transitionState={transitionState} size={ModalSize.DYNAMIC}>
      <ModalHeader>
        <Flex.Child grow={1} shrink={1}>
          <Heading variant="heading-lg/semibold">moonlight</Heading>
          <Text variant="text-xs/normal">{version}</Text>
        </Flex.Child>

        <Flex.Child grow={0}>
          <ModalCloseButton onClick={onClose} />
        </Flex.Child>
      </ModalHeader>

      <ModalContent>
        <Text variant="text-md/normal" className={MarkupClasses.markup} style={{ padding: "1rem" }}>
          {MarkupUtils.parse(changelog, true, {
            allowHeading: true,
            allowList: true,
            allowLinks: true
          })}
        </Text>
      </ModalContent>
    </ModalRoot>
  );
}

export default function Update() {
  const [newVersion, state] = useStateFromStores([MoonbaseSettingsStore], () => [
    MoonbaseSettingsStore.newVersion,
    MoonbaseSettingsStore.updateState
  ]);

  if (newVersion == null) return null;

  return (
    <HelpMessage text={strings[state]} className="moonbase-update-section" icon={ThemeDarkIcon}>
      <div className="moonbase-help-message-buttons">
        {moonlight.branch === MoonlightBranch.STABLE && (
          <Button
            look={Button.Looks.OUTLINED}
            color={Button.Colors.CUSTOM}
            size={Button.Sizes.TINY}
            onClick={() => {
              fetch(`https://raw.githubusercontent.com/moonlight-mod/moonlight/refs/tags/${newVersion}/CHANGELOG.md`)
                .then((r) => r.text())
                .then((changelog) =>
                  openModal((modalProps) => {
                    return <MoonlightChangelog {...modalProps} changelog={changelog} version={newVersion} />;
                  })
                );
            }}
          >
            View changelog
          </Button>
        )}

        {state === UpdateState.Installed && (
          <Button
            look={Button.Looks.OUTLINED}
            color={Button.Colors.CUSTOM}
            size={Button.Sizes.TINY}
            onClick={() => {
              MoonbaseSettingsStore.restartDiscord();
            }}
          >
            Restart Discord
          </Button>
        )}

        <Button
          look={Button.Looks.OUTLINED}
          color={Button.Colors.CUSTOM}
          size={Button.Sizes.TINY}
          disabled={state !== UpdateState.Ready}
          onClick={() => {
            MoonbaseSettingsStore.updateMoonlight();
          }}
        >
          Update
        </Button>
      </div>
    </HelpMessage>
  );
}
