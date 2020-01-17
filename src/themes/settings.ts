import customConfig from "./pink_palm_tree";
import defaultConfig from "./default";
import { set } from "lodash";

for (let key in customConfig) {
    set(defaultConfig, key, customConfig[key]);
}

export default defaultConfig;
