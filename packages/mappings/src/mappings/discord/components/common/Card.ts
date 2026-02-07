import register from "../../../../registry";

export type CardTypes = {
  PRIMARY: string;
  DANGER: string;
  WARNING: string;
  SUCCESS: string;
  BRAND: string;
  CUSTOM: string;
};

export type Card = React.ComponentType<
  React.PropsWithChildren<{
    editable?: boolean;
    outline?: boolean;
    type?: string;
    className?: string;
  }> &
    React.HTMLAttributes<HTMLDivElement>
> & {
  Types: CardTypes;
};

type Exports = {
  default: Card;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/Card";
  moonmap.register({
    name,
    find: '.displayName="Card"', // /,{children:.,editable:.=!1,type:/,
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
