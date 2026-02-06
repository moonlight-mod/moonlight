import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

register((moonmap) => {
  const name = "discord/flow/Server";
  moonmap.register({
    name,
    find: '.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "PermissionOverwriteType", {
        type: ModuleExportType.Key,
        find: "MEMBER"
      });
      moonmap.addExport(name, "EmbeddedActivitySupportedPlatforms", {
        type: ModuleExportType.Key,
        find: "IOS"
      });
      moonmap.addExport(name, "EmbeddedActivityLabelTypes", {
        type: ModuleExportType.Key,
        find: "UPDATED"
      });
      moonmap.addExport(name, "ApplicationDirectoryEntryCarouselItemType", {
        type: ModuleExportType.Key,
        find: "YOUTUBE"
      });
      moonmap.addExport(name, "InteractionContextType", {
        type: ModuleExportType.Key,
        find: "PRIVATE_CHANNEL"
      });
      moonmap.addExport(name, "ApplicationCommandHandler", {
        type: ModuleExportType.Key,
        find: "DISCORD_LAUNCH_ACTIVITY"
      });
      moonmap.addExport(name, "ApplicationCommandOptionType", {
        type: ModuleExportType.Key,
        find: "MENTIONABLE"
      });
      moonmap.addExport(name, "ApplicationCommandType", {
        type: ModuleExportType.Key,
        find: "PRIMARY_ENTRY_POINT"
      });
      moonmap.addExport(name, "InteractionTypes", {
        type: ModuleExportType.Key,
        find: "APPLICATION_COMMAND_AUTOCOMPLETE"
      });
      moonmap.addExport(name, "ComponentType", {
        type: ModuleExportType.Key,
        find: "MENTIONABLE_SELECT"
      });
      moonmap.addExport(name, "ButtonStyle", {
        type: ModuleExportType.Key,
        find: "DESTRUCTIVE"
      });
      moonmap.addExport(name, "TextComponentStyle", {
        type: ModuleExportType.Key,
        find: "PARAGRAPH"
      });
      moonmap.addExport(name, "SeparatorSpacingSize", {
        type: ModuleExportType.Key,
        find: "LARGE"
      });
      moonmap.addExport(name, "InvoiceDiscountTypes", {
        type: ModuleExportType.Key,
        find: "PREMIUM_TRIAL"
      });
      moonmap.addExport(name, "PurchaseNotificationType", {
        type: ModuleExportType.Key,
        find: "GUILD_PRODUCT"
      });
      moonmap.addExport(name, "AuthenticatorType", {
        type: ModuleExportType.Key,
        find: "WEBAUTHN"
      });

      return true;
    }
  });
});
