export type RemapModule = {
  name: string; // the name you require it by in your code
  id: string; // the resolved webpack module ID (usually a number)
  type: string;
};

export type RemapType = {
  name: string;
  fields: RemapField[];
};

export type RemapField = {
  name: string; // the name of the field in the proxy (human readable)
  unmapped?: string; // the name of the field in discord source (minified)
  type?: string;
};
