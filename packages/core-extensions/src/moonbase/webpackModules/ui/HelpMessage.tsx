import HelpMessageClasses from "@moonlight-mod/wp/discord/components/common/HelpMessage.css";
import Text from "@moonlight-mod/wp/discord/design/components/Text/Text";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import React from "@moonlight-mod/wp/react";

// reimpl of HelpMessage but with a custom icon
export default function HelpMessage({
  className,
  text,
  icon: IconComponent,
  children,
  type = "info"
}: {
  className?: string;
  text: string;
  icon: React.ComponentType<any>;
  type?: "warning" | "success" | "critical" | "info";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`${Margins.marginBottom20} ${HelpMessageClasses[type]} ${HelpMessageClasses.container} moonbase-help-message ${className}`}
    >
      <div className={HelpMessageClasses.iconAndTextContainer}>
        <div
          className={HelpMessageClasses.iconContainer}
          style={{
            alignSelf: "center"
          }}
        >
          <IconComponent size="sm" color="currentColor" className={HelpMessageClasses.icon} />
        </div>

        <div className={HelpMessageClasses.contentsContainer}>
          <div
            className={HelpMessageClasses.copyContainer}
            style={{
              alignSelf: "center"
            }}
          >
            <Text variant="text-sm/medium" color="currentColor">
              {text}
            </Text>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
