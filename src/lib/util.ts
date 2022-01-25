import * as fs from "fs"
import { promisify } from "util"

export const my_mkdir = promisify(fs.mkdir);
export const my_file_exists = promisify(fs.exists);
export const my_file_write = promisify(fs.writeFile);
