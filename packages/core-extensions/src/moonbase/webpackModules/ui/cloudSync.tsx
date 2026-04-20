import CloudSyncStore, { SyncStatus } from "@moonlight-mod/wp/cloudSync_sync";
import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";
import { MultiAccountStore, UserStore } from "@moonlight-mod/wp/common_stores";
import { FormDivider, FormItem, FormSwitch, FormText, Text } from "@moonlight-mod/wp/discord/components/common/index";
import { SingleSelect } from "@moonlight-mod/wp/discord/components/common/Select";
import { openModalLazy } from "@moonlight-mod/wp/discord/modules/modals/Modals";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import { Button } from "@moonlight-mod/wp/discord/uikit/legacy/Button";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

let ConfirmModal: typeof import("@moonlight-mod/wp/discord/components/modals/ConfirmModal").ConfirmModal;
function lazyLoadConfirmModal() {
  if (!ConfirmModal) {
    ConfirmModal = (spacepack.require("discord/components/modals/ConfirmModal") as any).ConfirmModal;
  }
}

function openDeleteConfirmModal() {
  lazyLoadConfirmModal();
  openModalLazy(async () => {
    return ({ transitionState, onClose }: { transitionState: number | null; onClose: () => void }) => (
      <ConfirmModal
        header="Delete sync data"
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor={Button.Colors.RED}
        transitionState={transitionState}
        onClose={onClose}
        onConfirm={() => CloudSyncStore.deleteSyncData()}
      >
        <Text variant="text-md/normal">
          Are you sure you want to delete all cloud sync settings? This cannot be undone.
        </Text>
      </ConfirmModal>
    );
  });
}

const statusLabels: Record<SyncStatus, string> = {
  [SyncStatus.Idle]: "Idle",
  [SyncStatus.Pulling]: "Pulling remote settings…",
  [SyncStatus.Pushing]: "Pushing local settings…",
  [SyncStatus.Conflict]: "Conflict detected",
  [SyncStatus.Error]: "Error"
};

const statusColors: Record<SyncStatus, string> = {
  [SyncStatus.Idle]: "var(--text-positive)",
  [SyncStatus.Pulling]: "var(--text-brand)",
  [SyncStatus.Pushing]: "var(--text-brand)",
  [SyncStatus.Conflict]: "var(--text-warning)",
  [SyncStatus.Error]: "var(--text-danger)"
};

interface Account {
  id: string;
  username: string;
}

function useAccounts(): { value: string; label: string; current: boolean }[] {
  const accounts = useStateFromStores([MultiAccountStore], () => {
    return MultiAccountStore.getValidUsers();
  });
  const currentUser = useStateFromStores([UserStore], () => UserStore.getCurrentUser());

  return accounts.map((account: Account) => ({
    value: account.id,
    label: account.username + (account.id === currentUser?.id ? " (current)" : ""),
    current: account.id === currentUser?.id
  }));
}

export default function CloudSyncPage() {
  const enabled = MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("cloudSync", "enabled", false) ?? false;
  const accountId = MoonbaseSettingsStore.getExtensionConfigRaw<string>("cloudSync", "accountId", "0") ?? "0";

  const [status, lastError] = useStateFromStores<[SyncStatus, string | null]>([CloudSyncStore], () => [
    CloudSyncStore.status,
    CloudSyncStore.lastError
  ]);

  const accounts = useAccounts();
  if (accountId === "0") {
    // Default to the current account
    const currentAccount = accounts.find((a) => a.current);
    if (currentAccount) {
      MoonbaseSettingsStore.setExtensionConfig("cloudSync", "accountId", currentAccount.value, true);
    }
  }

  return (
    <ErrorBoundary>
      <div className={Margins.marginTop20}>
        <FormSwitch
          checked={enabled}
          onChange={async (value: boolean) => {
            MoonbaseSettingsStore.setExtensionConfig("cloudSync", "enabled", value, true);
            value ? CloudSyncStore.start(false) : await CloudSyncStore.stop();
          }}
          label="Enable Cloud Sync"
          description="Sync your moonlight settings with your Discord account"
        />
      </div>

      <FormItem title="Sync Account" className={Margins.marginTop20}>
        <FormText className={Margins.marginBottom4}>Which account to use for sync</FormText>
        <SingleSelect
          autofocus={false}
          clearable={false}
          value={String(accountId)}
          options={accounts}
          onChange={(v: string) => {
            MoonbaseSettingsStore.setExtensionConfig("cloudSync", "accountId", v);
          }}
        />
      </FormItem>

      {enabled && (
        <>
          <FormDivider className={Margins.marginTop20} />

          <FormItem title="Sync Status" className={Margins.marginTop20}>
            <Flex direction={Flex.Direction.HORIZONTAL} align={Flex.Align.CENTER} style={{ gap: "12px" }}>
              <Text variant="text-md/medium" style={{ color: statusColors[status] }}>
                {statusLabels[status]}
              </Text>

              <Button
                size={Button.Sizes.SMALL}
                color={Button.Colors.PRIMARY}
                disabled={status === SyncStatus.Pulling || status === SyncStatus.Pushing}
                onClick={() => CloudSyncStore.syncNow()}
              >
                Sync now
              </Button>

              <Button
                size={Button.Sizes.SMALL}
                color={Button.Colors.RED}
                disabled={status === SyncStatus.Pulling || status === SyncStatus.Pushing}
                onClick={() => openDeleteConfirmModal()}
              >
                Delete sync data
              </Button>
            </Flex>

            {status === SyncStatus.Error && lastError && (
              <FormText className={Margins.marginTop4} style={{ color: "var(--text-danger)" }}>
                {lastError}
              </FormText>
            )}
          </FormItem>

          {status === SyncStatus.Conflict && (
            <>
              <FormDivider className={Margins.marginTop20} />
              <FormItem title="Resolve Conflict" className={Margins.marginTop20}>
                <FormText className={Margins.marginBottom20}>
                  <Text variant="text-md/medium" style={{ color: "var(--text-warning)" }}>
                    Remote settings changed while you had unsaved local modifications. Choose which version to keep.
                  </Text>
                </FormText>
                <Flex direction={Flex.Direction.HORIZONTAL} style={{ gap: "8px" }}>
                  <Button
                    size={Button.Sizes.SMALL}
                    color={Button.Colors.RED}
                    onClick={() => CloudSyncStore.resolveConflictUseRemote(true)}
                  >
                    Keep remote
                  </Button>
                  <Button
                    size={Button.Sizes.SMALL}
                    color={Button.Colors.GREEN}
                    onClick={() => CloudSyncStore.resolveConflictUseLocal(true)}
                  >
                    Keep local
                  </Button>
                </Flex>
              </FormItem>
            </>
          )}
        </>
      )}
    </ErrorBoundary>
  );
}
