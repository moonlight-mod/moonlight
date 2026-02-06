import register from "../../../registry";

register((moonmap) => {
  const name = "discord/stores/UploadAttachmentStore";
  moonmap.register({
    name,
    find: '"UploadAttachmentStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
