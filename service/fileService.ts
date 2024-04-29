const fs = require("fs");
export function createFolderIfNotExists(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
