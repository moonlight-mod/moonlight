import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/components/common/Breadcrumbs.css";
  moonmap.register({
    name,
    find: "breadcrumbClickWrapper:",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
