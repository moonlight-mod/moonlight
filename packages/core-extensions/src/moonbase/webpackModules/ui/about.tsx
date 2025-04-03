import {
  AngleBracketsIcon,
  BookCheckIcon,
  Button,
  Card,
  ClydeIcon,
  Text,
  useThemeContext
} from "@moonlight-mod/wp/discord/components/common/index";
import AppCardClasses from "@moonlight-mod/wp/discord/modules/guild_settings/web/AppCard.css";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const wordmark = "https://raw.githubusercontent.com/moonlight-mod/moonlight/refs/heads/main/img/wordmark.png";
const wordmarkLight
  = "https://raw.githubusercontent.com/moonlight-mod/moonlight/refs/heads/main/img/wordmark-light.png";

function parse(str: string) {
  return MarkupUtils.parse(str, true, {
    allowHeading: true,
    allowLinks: true,
    allowList: true
  });
}

function Dev({ name, picture, link }: { name: string; picture: string; link: string }) {
  return (
    <Card className={AppCardClasses.card} editable={true}>
      <div className={`${AppCardClasses.cardHeader} moonbase-dev`}>
        <Flex align={Flex.Align.CENTER} direction={Flex.Direction.HORIZONTAL}>
          <img alt={name} className="moonbase-dev-avatar" src={picture} />

          <Flex align={Flex.Align.CENTER} direction={Flex.Direction.VERTICAL}>
            <a href={link} rel="noreferrer noopener" tabIndex={-1} target="_blank">
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
          }
          catch {
            window.open(link);
          }
        }
        else {
          // Will open externally in the user's browser
          window.open(link);
        }
      }}
    >
      <Flex align={Flex.Align.CENTER} className="moonbase-gap" direction={Flex.Direction.HORIZONTAL}>
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
  const darkTheme = useThemeContext()?.theme === "dark";

  return (
    <div>
      <Flex align={Flex.Align.CENTER} direction={Flex.Direction.VERTICAL}>
        <img alt="moonlight wordmark" className="moonbase-wordmark" src={darkTheme ? wordmarkLight : wordmark} />
        <Text variant="heading-lg/medium">created by:</Text>
        <div className="moonbase-devs">
          <Dev link="https://github.com/Cynosphere" name="Cynosphere" picture="https://github.com/Cynosphere.png" />
          <Dev link="https://github.com/NotNite" name="NotNite" picture="https://github.com/NotNite.png" />
          <Dev link="https://github.com/adryd325" name="adryd" picture="https://github.com/adryd325.png" />
          <Dev
            link="https://github.com/redstonekasi"
            name="redstonekasi"
            picture="https://github.com/redstonekasi.png"
          />
        </div>

        <Flex align={Flex.Align.CENTER} className="moonbase-gap" direction={Flex.Direction.HORIZONTAL}>
          <IconButton icon={AngleBracketsIcon} link="https://github.com/moonlight-mod/moonlight" text="View source" />
          <IconButton icon={BookCheckIcon} link="https://moonlight-mod.github.io/" text="Open the docs" />
          <IconButton
            icon={ClydeIcon}
            link="https://discord.gg/FdZBTFCP6F"
            openInClient={true}
            text="Join the server"
          />
        </Flex>
      </Flex>

      <Flex align={Flex.Align.START} className="moonbase-about-text" direction={Flex.Direction.VERTICAL}>
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
