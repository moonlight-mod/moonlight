import HelpMessageClasses from "@moonlight-mod/wp/discord/components/common/HelpMessage.css";
import { Text } from "@moonlight-mod/wp/discord/components/common/index";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import React from "@moonlight-mod/wp/react";

// reimpl of HelpMessage but with a custom icon
export default function HelpMessage({
  className,
  text,
  icon,
  children,
  type = "info"
}: {
  className?: string;
  text: string;
  icon: React.ComponentType<any>;
  type?: "warning" | "positive" | "error" | "info";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`${Margins.marginBottom20} ${HelpMessageClasses[type]} ${HelpMessageClasses.container} moonbase-help-message ${className}`}
    >
      <Flex direction={Flex.Direction.HORIZONTAL}>
        <div
          className={HelpMessageClasses.iconDiv}
          style={{
            alignItems: "center"
          }}
        >
          {React.createElement(icon, {
            size: "sm",
            color: "currentColor",
            className: HelpMessageClasses.icon
          })}
        </div>

        <Text variant="text-sm/medium" color="currentColor" className={HelpMessageClasses.text}>
          {text}
        </Text>

        {children}
      </Flex>
    </div>
  );
}
