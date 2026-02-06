import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/gateway/GatewayConnectionStore";
  moonmap.register({
    name,
    find: '"GatewayConnectionStore"',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
