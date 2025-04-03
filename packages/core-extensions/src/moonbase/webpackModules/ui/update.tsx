import { MoonlightBranch } from "@moonlight-mod/types";
import {
  Button,
  Heading,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalRoot,
  ModalSize,
  openModal,
  Text,
  ThemeDarkIcon
} from "@moonlight-mod/wp/discord/components/common/index";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import MarkupClasses from "@moonlight-mod/wp/discord/modules/messages/web/Markup.css";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import { UpdateState } from "../../types";
import HelpMessage from "./HelpMessage";

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
    <ModalRoot size={ModalSize.DYNAMIC} transitionState={transitionState}>
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
        <Text className={MarkupClasses.markup} style={{ padding: "1rem" }} variant="text-md/normal">
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
    <HelpMessage className="moonbase-update-section" icon={ThemeDarkIcon} text={strings[state]}>
      <div className="moonbase-help-message-buttons">
        {moonlight.branch === MoonlightBranch.STABLE && (
          <Button
            color={Button.Colors.CUSTOM}
            look={Button.Looks.OUTLINED}
            onClick={() => {
              fetch(`https://raw.githubusercontent.com/moonlight-mod/moonlight/refs/tags/${newVersion}/CHANGELOG.md`)
                .then(r => r.text())
                .then(changelog =>
                  openModal((modalProps) => {
                    return <MoonlightChangelog {...modalProps} changelog={changelog} version={newVersion} />;
                  })
                );
            }}
            size={Button.Sizes.TINY}
          >
            View changelog
          </Button>
        )}

        {state === UpdateState.Installed && (
          <Button
            color={Button.Colors.CUSTOM}
            look={Button.Looks.OUTLINED}
            onClick={() => {
              MoonbaseSettingsStore.restartDiscord();
            }}
            size={Button.Sizes.TINY}
          >
            Restart Discord
          </Button>
        )}

        <Button
          color={Button.Colors.CUSTOM}
          disabled={state !== UpdateState.Ready}
          look={Button.Looks.OUTLINED}
          onClick={() => {
            MoonbaseSettingsStore.updateMoonlight();
          }}
          size={Button.Sizes.TINY}
        >
          Update
        </Button>
      </div>
    </HelpMessage>
  );
}
