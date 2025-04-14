import type { IconProps, IconSize } from "@moonlight-mod/mappings/discord/components/common/index";

export type ErrorBoundaryProps = React.PropsWithChildren<{
  noop?: boolean;
  fallback?: React.FC<any>;
  message?: string;
}>;

export type ErrorBoundaryState = {
  errored: boolean;
  error?: Error;
  componentStack?: string;
};

export type ErrorBoundary = React.ComponentClass<ErrorBoundaryProps, ErrorBoundaryState>;

export type ParsedIconProps = {
  width: number;
  height: number;
  fill: string;
  className: string;
};

export interface Icons {
  /**
   * Parse icon props into their actual width/height.
   * @param props The icon props
   */
  parseProps(props?: IconProps): ParsedIconProps;
}

// Re-export so extension developers don't need to depend on mappings
export type { IconProps, IconSize };
