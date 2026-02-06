import register from "../../../../registry";

export type AlertProps = {
  title: string;
  body: string;
  confirmText: string;
  cancelText: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
  secondaryConfirmText?: string;
  onConfirmSecondary?: () => void;
  className?: string;
  titleClassName?: string;
  contextKey?: any;
};

export type Alerts = {
  show: (props: AlertProps) => void;
  close: () => void;
  confirm: (props: AlertProps) => Promise<boolean>;
};

type Exports = {
  default: Alerts;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/Alerts";
  moonmap.register({
    name,
    find: ["secondaryConfirmText:", "this.show("],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
