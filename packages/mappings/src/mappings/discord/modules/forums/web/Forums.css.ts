import register from "../../../../../registry";

type Exports = {
  container: string;
  uploadArea: string;
  label: string;
  content: string;
  noListContainer: string;
  list: string;
  grid: string;
  headerRow: string;
  card: string;
  columnsSpan: string;
  emptyStateRow: string;
  newMemberBanner: string;
  gridViewBanner: string;
  placeholder: string;
  mainCard: string;
  emptyMainCard: string;
  outOfDate: string;
  header: string;
  matchingPostsRow: string;
  headerWithMatchingPosts: string;
  noForm: string;
  sortContainer: string;
  sort: string;
  sortPopout: string;
  archivedDividerRow: string;
  archivedDivider: string;
  newPostsButton: string;
  loadingCard: string;
  "loadingCard-0": string;
  "loadingCard-1": string;
  "loadingCard-2": string;
  enterIcon: string;
  warnIcon: string;
  searchIcon: string;
  missingReadHistoryPermission: string;
  divider: string;
  tagsContainer: string;
  filterIcon: string;
  tagList: string;
  tagListInner: string;
  tag: string;
  tagsButton: string;
  tagsButtonInner: string;
  tagsButtonPlaceholder: string;
  tagsButtonWithCount: string;
  sortDropdown: string;
  sortDropdownInner: string;
  sortDropdownText: string;
  clear: string;
  matchingPosts: string;
  startPostHelp: string;
  tagsSpacer: string;
  keyboardShortcut: string;
  key: string;
  countContainer: string;
  countText: string;
  optInNotice: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/forums/web/Forums.css";
  moonmap.register({
    name,
    find: ["tagsButtonWithCount:"],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
