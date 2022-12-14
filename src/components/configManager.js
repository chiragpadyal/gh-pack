import { Store } from "data-store";
import { cwd } from "process";
import { join } from "path";
import * as os from "os";
const store = new Store({
  home: join(cwd(), ".config/gh-pack.config"),
  name: "settings",
});
export default store;
