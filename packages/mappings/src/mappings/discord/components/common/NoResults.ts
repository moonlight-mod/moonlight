import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/components/common/NoResults";
  moonmap.register({
    name,
    find: [",noResultsImageURL:", "backgroundImage:`url(${"],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
