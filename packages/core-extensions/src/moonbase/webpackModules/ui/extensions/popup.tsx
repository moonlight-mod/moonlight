import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import React from "@moonlight-mod/wp/react";

const {
  openModalLazy
} = require("@moonlight-mod/wp/discord/components/common/index");
const Popup = spacepack.findByCode(".minorContainer", "secondaryAction")[0]
  .exports.default;

const logger = moonlight.getLogger("moonbase");

function OurPopup({ transitionState }: { transitionState: any }) {
  return (
    <Popup
      body={<span>body</span>}
      cancelText="cancel"
      confirmText="confirm"
      secondaryConfirmText="secondaryConfirm"
      onCancel={() => logger.info("cancel")}
      onClose={() => logger.info("close")}
      onConfirm={() => logger.info("confirm")}
      onConfirmSecondary={() => logger.info("confirmSecondary")}
      title="title"
      header="header"
      transitionState={transitionState}
    />
  );
}

export default async function doPopup() {
  await openModalLazy(async () => {
    return OurPopup;
  });
}
