import register from "../../../registry";

register((moonmap) => {
  const name = "discord/actions/MessageActionCreators";
  moonmap.register({
    name,
    find: "},sendExplicitMediaClydeError(",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
