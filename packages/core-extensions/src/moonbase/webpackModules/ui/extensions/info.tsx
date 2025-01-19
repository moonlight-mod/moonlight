import { ExtensionTag } from "@moonlight-mod/types";
import { MoonbaseExtension } from "../../../types";

import React from "@moonlight-mod/wp/react";
import { Text } from "@moonlight-mod/wp/discord/components/common/index";

type Dependency = {
  id: string;
  type: DependencyType;
};

enum DependencyType {
  Dependency = "dependency",
  Optional = "optional",
  Incompatible = "incompatible"
}

export const tagNames: Record<ExtensionTag, string> = {
  [ExtensionTag.Accessibility]: "Accessibility",
  [ExtensionTag.Appearance]: "Appearance",
  [ExtensionTag.Chat]: "Chat",
  [ExtensionTag.Commands]: "Commands",
  [ExtensionTag.ContextMenu]: "Context Menu",
  [ExtensionTag.DangerZone]: "Danger Zone",
  [ExtensionTag.Development]: "Development",
  [ExtensionTag.Fixes]: "Fixes",
  [ExtensionTag.Fun]: "Fun",
  [ExtensionTag.Markdown]: "Markdown",
  [ExtensionTag.Voice]: "Voice",
  [ExtensionTag.Privacy]: "Privacy",
  [ExtensionTag.Profiles]: "Profiles",
  [ExtensionTag.QualityOfLife]: "Quality of Life",
  [ExtensionTag.Library]: "Library"
};

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        marginRight: "1em"
      }}
    >
      <Text variant="eyebrow" className="moonlight-card-info-header">
        {title}
      </Text>

      <Text variant="text-sm/normal">{children}</Text>
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="moonlight-card-badge"
      style={
        {
          "--badge-color": color
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}

export default function ExtensionInfo({ ext }: { ext: MoonbaseExtension }) {
  const authors = ext.manifest?.meta?.authors;
  const tags = ext.manifest?.meta?.tags;
  const version = ext.manifest?.version;

  const dependencies: Dependency[] = [];
  const incompatible: Dependency[] = [];

  if (ext.manifest.dependencies != null) {
    dependencies.push(
      ...ext.manifest.dependencies.map((dep) => ({
        id: dep,
        type: DependencyType.Dependency
      }))
    );
  }

  if (ext.manifest.suggested != null) {
    dependencies.push(
      ...ext.manifest.suggested.map((dep) => ({
        id: dep,
        type: DependencyType.Optional
      }))
    );
  }

  if (ext.manifest.incompatible != null) {
    incompatible.push(
      ...ext.manifest.incompatible.map((dep) => ({
        id: dep,
        type: DependencyType.Incompatible
      }))
    );
  }

  return (
    <>
      {authors != null && (
        <InfoSection title="Authors">
          {authors.map((author, i) => {
            const comma = i !== authors.length - 1 ? ", " : "";
            if (typeof author === "string") {
              return (
                <span key={i}>
                  {author}
                  {comma}
                </span>
              );
            } else {
              // TODO: resolve IDs
              return (
                <span key={i}>
                  {author.name}
                  {comma}
                </span>
              );
            }
          })}
        </InfoSection>
      )}

      {tags != null && (
        <InfoSection title="Tags">
          {tags.map((tag, i) => {
            const name = tagNames[tag];

            return (
              <Badge key={i} color={tag === ExtensionTag.DangerZone ? "var(--red-400)" : "var(--bg-mod-strong)"}>
                {name}
              </Badge>
            );
          })}
        </InfoSection>
      )}

      {dependencies.length > 0 && (
        <InfoSection title="Dependencies">
          {dependencies.map((dep) => {
            const name = MoonbaseSettingsStore.tryGetExtensionName(dep.id);

            // TODO: figure out a decent way to distinguish suggested
            return (
              <Badge color="var(--bg-mod-strong)" key={dep.id}>
                {name}
              </Badge>
            );
          })}
        </InfoSection>
      )}

      {incompatible.length > 0 && (
        <InfoSection title="Incompatible">
          {incompatible.map((dep) => {
            const name = MoonbaseSettingsStore.tryGetExtensionName(dep.id);

            return (
              <Badge color="var(--bg-mod-strong)" key={dep.id}>
                {name}
              </Badge>
            );
          })}
        </InfoSection>
      )}

      {version != null && (
        <InfoSection title="Version">
          <span>{version}</span>
        </InfoSection>
      )}
    </>
  );
}
