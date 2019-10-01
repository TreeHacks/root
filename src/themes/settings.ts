import customConfig from "./custom";
import defaultConfig from "./default";
import { set } from "lodash-es";

for (let key in customConfig) {
    set(defaultConfig, key, customConfig[key]);
}

export default defaultConfig;