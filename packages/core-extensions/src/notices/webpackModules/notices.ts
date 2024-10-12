import { Store } from "@moonlight-mod/wp/discord/packages/flux";
import Dispatcher from "@moonlight-mod/wp/discord/Dispatcher";
import type { Notice, Notices } from "@moonlight-mod/types/coreExtensions/notices";

// very lazy way of doing this, FIXME
let open = false;

class NoticesStore extends Store<any> {
  private notices: Notice[] = [];

  constructor() {
    super(Dispatcher);
  }

  addNotice(notice: Notice) {
    this.notices.push(notice);
    if (open && this.notices.length !== 0) {
      Dispatcher.dispatch({
        type: "NOTICE_SHOW",
        notice: { type: "__moonlight_notice" }
      });
    }
    this.emitChange();
  }

  popNotice() {
    this.notices.shift();
    this.emitChange();
  }

  getCurrentNotice() {
    return this.notices.length > 0 ? this.notices[0] : null;
  }

  shouldShowNotice() {
    return this.notices.length > 0;
  }
}

const store: Notices = new NoticesStore();

function showNotice() {
  open = true;
  if (store.shouldShowNotice()) {
    Dispatcher.dispatch({
      type: "NOTICE_SHOW",
      notice: { type: "__moonlight_notice" }
    });
  }
}

Dispatcher.subscribe("CONNECTION_OPEN", showNotice);
Dispatcher.subscribe("CONNECTION_OPEN_SUPPLEMENTAL", showNotice);

export default store;
