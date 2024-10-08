import type { Store } from "@moonlight-mod/mappings/discord/packages/flux";

export type NoticeButton = {
  name: string;
  onClick: () => boolean; // return true to dismiss the notice after the button is clicked
};

export type Notice = {
  element: React.ReactNode;
  color?: string;
  showClose?: boolean;
  buttons?: NoticeButton[];
  onDismiss?: () => void;
};

export type Notices = Store<any> & {
  addNotice: (notice: Notice) => void;
  popNotice: () => void;
  getCurrentNotice: () => Notice | null;
  shouldShowNotice: () => boolean;
};
