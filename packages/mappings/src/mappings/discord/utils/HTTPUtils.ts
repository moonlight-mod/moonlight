import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

export type HTTPUtilsRequest = {
  url: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: any;
  oldFormErrors?: boolean;
  attachments?: { name: string; file: Blob; filename?: string }[];
  fields?: { name: string; value: string }[];
  context?: Record<string, any>;
  withCredentials?: boolean;
  reason?: string;
  retried?: number;
  timeout?: number;
  binary?: boolean;
  onRequestProgress?: (progress: any) => void; // FIXME: superagent type
  backoff?: any; // FIXME
  interceptResponse?: (
    response: HTTPUtilsResponse,
    interceptor: (newHeaders: Record<string, string>, newIntercept: HTTPUtilsRequest["interceptResponse"]) => void,
    onError: (error: any) => void // FIXME
  ) => boolean;
  rejectWithError?: boolean;
  signal?: any; // FIXME
};

export type HTTPUtilsResponse = {
  headers?: Record<string, string>;
  ok: boolean;
  status: number;
  text?: string;
  body?: any;
};

export type HTTPUtilsFunction = (data: HTTPUtilsRequest) => Promise<HTTPUtilsResponse>;

type HTTP = {
  get: HTTPUtilsFunction;
  post: HTTPUtilsFunction;
  put: HTTPUtilsFunction;
  patch: HTTPUtilsFunction;
  del: HTTPUtilsFunction;
};

type Exports = {
  HTTP: HTTP;
};
export default Exports;

register((moonmap) => {
  const name = "discord/utils/HTTPUtils";
  moonmap.register({
    name,
    find: '.set("X-Audit-Log-Reason",',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "HTTP", {
        type: ModuleExportType.Key,
        find: "patch"
      });

      return true;
    }
  });
});
