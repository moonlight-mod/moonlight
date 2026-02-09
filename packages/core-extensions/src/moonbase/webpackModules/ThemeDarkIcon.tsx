// RIP to ThemeDarkIcon ????-2025
// <Cynthia> Failed to remap "ThemeDarkIcon" in "discord/components/common/index"
// <NotNite> bro are you fucking kidding me
// <NotNite> that's literally the icon we use for the update banner

import type { IconProps } from "@moonlight-mod/types/coreExtensions/common";
import icons from "@moonlight-mod/wp/common_icons";
import React from "@moonlight-mod/wp/react";

export default function ThemeDarkIcon(props?: IconProps) {
  const parsed = icons.parseProps(props);

  return (
    <svg
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={parsed.width}
      height={parsed.height}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={parsed.fill}
        className={parsed.className}
        d="M20.52 18.96c.32-.4-.01-.96-.52-.96A11 11 0 0 1 9.77 2.94c.31-.78-.3-1.68-1.1-1.43a11 11 0 1 0 11.85 17.45Z"
      />

      <path
        fill={parsed.fill}
        className={parsed.className}
        d="m17.73 9.27-.76-2.02a.5.5 0 0 0-.94 0l-.76 2.02-2.02.76a.5.5 0 0 0 0 .94l2.02.76.76 2.02a.5.5 0 0 0 .94 0l.76-2.02 2.02-.76a.5.5 0 0 0 0-.94l-2.02-.76ZM19.73 2.62l.45 1.2 1.2.45c.21.08.21.38 0 .46l-1.2.45-.45 1.2a.25.25 0 0 1-.46 0l-.45-1.2-1.2-.45a.25.25 0 0 1 0-.46l1.2-.45.45-1.2a.25.25 0 0 1 .46 0Z"
      />
    </svg>
  );
}
