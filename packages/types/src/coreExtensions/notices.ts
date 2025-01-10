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
  /**
   * Adds a custom notice to the top of the screen.
   */
  addNotice: (notice: Notice) => void;

  /**
   * Removes the current notice from the top of the screen.
   */
  popNotice: () => void;

  /**
   * @private
   */
  getCurrentNotice: () => Notice | null;

  /**
   * @private
   */
  shouldShowNotice: () => boolean;
};
