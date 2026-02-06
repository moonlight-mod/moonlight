import register from "../../../registry";
import { BaseRecord } from "../lib/BaseRecord";
import { UserFlags } from "../Constants";

interface AvatarDecorationData {
  asset: string;
  skuId: string;
}

declare class UserRecord extends BaseRecord {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  avatarDecorationData: AvatarDecorationData | null;
  email: string | null;
  verified: boolean;
  bot: boolean;
  system: boolean;
  mfaEnabled: boolean | null;
  mobile: boolean;
  desktop: boolean;
  premiumType: number | undefined;
  flags: UserFlags;
  publicFlags: UserFlags;
  purchasedFlags: number;
  premiumUsageFlags: number;
  phone: string | null;
  nsfwAllowed: boolean | undefined;
  guildMemberAvatars: Record<string, string>;
  hasBouncedEmail: boolean;
  personalConnectionId: string | null;
  globalName: string | null;
  primaryGuild: {
    identityGuildId: string | null;
    identityEnabled: boolean;
    tag: string | null;
    badge: string | null;
  };

  hasFlag(flag: number): boolean;
  isStaff(): boolean;
  isStaffPersonal(): boolean;
  hasAnyStaffLevel(): boolean;

  get createdAt(): Date;
  hasVerifiedEmailOrPhone(): boolean;
  getAvatarURL(guildId: string | undefined, size: number, canAnimate?: boolean): string | undefined;
  addGuildAvatarHash(guildId: string, hash: string): this;
  removeGuildAvatarHash(guildId: string): this;
  getAvatarSource(guildId: string | undefined): { uri: string } | undefined;
  isClaimed(): boolean;
  isPhoneVerified(): boolean;
  toString(): string;
  get tag(): string;
  hasPurchasedFlag(flag: number): boolean;
  hasPremiumUsageFlag(flag: number): boolean;
  hasHadSKU(id: string): boolean;
  hasHadPremium(): boolean;
  hasFreePremium(): boolean;
  hasUrgentMessages(): boolean;
  isNonUserBot(): boolean;
  isLocalBot(): boolean;
  isVerifiedBot(): boolean;
  isSystemUser(): boolean;
  isClyde(): boolean;
  hasAvatarForGuild(guildId: string): boolean;
  isPomelo(): boolean;
  get isProvisional(): boolean;
  get avatarDecoration(): AvatarDecorationData | null;
  set avatarDecoration(value: AvatarDecorationData | null);
}

type Exports = {
  default: UserRecord;
};
export default Exports;

register((moonmap) => {
  const name = "discord/records/UserRecord";
  moonmap.register({
    name,
    find: "hasFreePremium(){",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
