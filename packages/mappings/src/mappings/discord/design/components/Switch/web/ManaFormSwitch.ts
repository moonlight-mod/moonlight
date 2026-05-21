import type { ComponentType } from "react";
import register from "../../../../../../registry";
import type { FieldComponentProps } from "../../Form/web/Field";
import type { SwitchProps } from "./ManaSwitch";

type Exports = {
  default: ComponentType<SwitchProps & FieldComponentProps>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Switch/web/ManaFormSwitch";
  moonmap.register({
    name,
    find: 'layout:"horizontal",interactiveLabel:!0,auxiliaryContentPosition:"under-label",',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
