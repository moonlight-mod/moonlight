import { WebpackRequireType } from "types/src";

export default (require: WebpackRequireType) => {
  const React = require("common_react");

  return function ConfigPage() {
    return <>config soon:tm:</>;
  };
};
