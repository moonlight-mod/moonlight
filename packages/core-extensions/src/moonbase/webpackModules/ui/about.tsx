import {
  Card,
  Text,
  useThemeContext,
  Button,
  AngleBracketsIcon,
  BookCheckIcon,
  ClydeIcon
} from "@moonlight-mod/wp/discord/components/common/index";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import React from "@moonlight-mod/wp/react";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import AppCardClasses from "@moonlight-mod/wp/discord/modules/guild_settings/web/AppCard.css";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const wordmark = "https://raw.githubusercontent.com/moonlight-mod/moonlight/refs/heads/main/img/wordmark.png";
const wordmarkLight =
  "https://raw.githubusercontent.com/moonlight-mod/moonlight/refs/heads/main/img/wordmark-light.png";

function parse(str: string) {
  return MarkupUtils.parse(str, true, {
    allowHeading: true,
    allowLinks: true,
    allowList: true
  });
}

function Dev({ name, picture, link }: { name: string; picture: string; link: string }) {
  return (
    <Card editable={true} className={AppCardClasses.card}>
      <div className={AppCardClasses.cardHeader + " moonbase-dev"}>
        <Flex direction={Flex.Direction.HORIZONTAL} align={Flex.Align.CENTER}>
          <img src={picture} alt={name} className="moonbase-dev-avatar" />

          <Flex direction={Flex.Direction.VERTICAL} align={Flex.Align.CENTER}>
            <a href={link} rel="noreferrer noopener" target="_blank" tabIndex={-1}>
              <Text variant="text-md/semibold">{name}</Text>
            </a>
          </Flex>
        </Flex>
      </div>
    </Card>
  );
}

function IconButton({
  text,
  link,
  icon,
  openInClient
}: {
  text: string;
  link: string;
  icon: React.FC<any>;
  openInClient?: boolean;
}) {
  return (
    <Button
      onClick={() => {
        if (openInClient) {
          try {
            const { handleClick } = spacepack.require("discord/utils/MaskedLinkUtils");
            handleClick({ href: link });
          } catch {
            window.open(link);
          }
        } else {
          // Will open externally in the user's browser
          window.open(link);
        }
      }}
    >
      <Flex direction={Flex.Direction.HORIZONTAL} align={Flex.Align.CENTER} className="moonbase-gap">
        {React.createElement(icon, {
          size: "sm",
          color: "currentColor"
        })}
        {text}
      </Flex>
    </Button>
  );
}

export default function AboutPage() {
  const darkTheme = useThemeContext()?.theme !== "light";

  return (
    <div>
      <Flex direction={Flex.Direction.VERTICAL} align={Flex.Align.CENTER}>
        <img src={darkTheme ? wordmarkLight : wordmark} alt="moonlight wordmark" className="moonbase-wordmark" />
        <Text variant="heading-lg/medium">created by:</Text>
        <div className="moonbase-devs">
          <Dev name="Cynosphere" picture="https://github.com/Cynosphere.png" link="https://github.com/Cynosphere" />
          <Dev name="NotNite" picture="https://github.com/NotNite.png" link="https://github.com/NotNite" />
          <Dev name="adryd" picture="https://github.com/adryd325.png" link="https://github.com/adryd325" />
          <Dev
            name="redstonekasi"
            picture="https://github.com/redstonekasi.png"
            link="https://github.com/redstonekasi"
          />
        </div>

        <Flex direction={Flex.Direction.HORIZONTAL} align={Flex.Align.CENTER} className="moonbase-gap">
          <IconButton text="View source" icon={AngleBracketsIcon} link="https://github.com/moonlight-mod/moonlight" />
          <IconButton text="Open the docs" icon={BookCheckIcon} link="https://moonlight-mod.github.io/" />
          <IconButton
            text="Join the server"
            icon={ClydeIcon}
            link="https://discord.gg/FdZBTFCP6F"
            openInClient={true}
          />
        </Flex>
      </Flex>

      <Flex direction={Flex.Direction.VERTICAL} align={Flex.Align.START} className="moonbase-about-text">
        <Text variant="text-sm/normal">
          {parse(`moonlight \`${window.moonlight.version}\` on \`${window.moonlight.branch}\``)}
        </Text>

        <Text variant="text-sm/normal">
          {parse(
            "moonlight is licensed under the [GNU Lesser General Public License](https://www.gnu.org/licenses/lgpl-3.0.html) (`LGPL-3.0-or-later`)."
          )}
        </Text>
      </Flex>
    </div>
  );
}
