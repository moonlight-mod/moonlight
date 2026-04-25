import type { PropsWithChildren, ReactNode, Ref } from "react";
import register from "../../../../../../registry";
import type { ButtonProps } from "../../Button/web/Button";

export type ModalProps = {
  size?: "md" | "sm";
  title?: ReactNode;
  subtitle?: ReactNode;
  input?: ReactNode;
  preview?: ReactNode;
  actions?: ButtonProps[];
  actionBarInput?: ReactNode;
  actionBarInputLayout?: "default" | "chat-input";
  listProps?: any;
  notice?: {
    message?: ReactNode;
    type?: "critical" | "warning" | "info" | "success";
  };
  onScroll?: () => void;
  scrollerRef?: Ref<any>;
  transitionState?: number | null;
};

type Exports = {
  Modal: React.ComponentType<PropsWithChildren<ModalProps>>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Modal/web/Modal";
  moonmap.register({
    name,
    find: "{Modal:()=>",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
