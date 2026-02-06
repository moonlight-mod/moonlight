import { ComponentType } from "react";
import register from "../../../../registry";

export type OAuth2Response = {
  application?: any;
  guild?: any;
  location: string;
};

export type OAuth2Props = {
  clientId: string;
  redirectUri?: string;
  scopes?: string[];
  responseType?: string;
  permissions?: bigint;
  callback: (response: OAuth2Response) => void;

  channelId?: string;
  guildId?: string;

  cancelCompletesFlow?: boolean;
  disableGuildSelect?: boolean;
};

// Lazy on the types here since it's hard to test, don't want to spam oauth endpoints
type Exports = {
  OAuth2AuthorizeModal: ComponentType<any>;
  OAuth2AuthorizePage: ComponentType<any>;
  getOAuth2AuthorizeProps: (url: string) => any;
  openOAuth2Modal: (props: OAuth2Props, unk?: any) => void;
  openOAuth2ModalWithCreateGuildModal: (props: OAuth2Props, unk?: any) => void;
  useOAuth2AuthorizeForm: any;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/oauth2/index";
  moonmap.register({
    name,
    find: ["OAuth2AuthorizeModal:", "openOAuth2Modal:"],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
