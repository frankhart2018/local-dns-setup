import os from "os";
import path from "path";
import fs from "fs";

const createDirectoriesIfNotExistSync = (dirPath) => {
  try {
    fs.accessSync(dirPath);
  } catch (error) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const HOME_DIR = os.homedir();
const PRIMISTORE_DIR = path.join(HOME_DIR, ".primistore");

export { createDirectoriesIfNotExistSync, PRIMISTORE_DIR };
