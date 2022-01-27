import * as fs from "fs"
import { promisify } from "util"

export const my_mkdir = promisify(fs.mkdir);

export const my_file_exists = promisify(fs.exists);

export const my_file_write = promisify(fs.writeFile);

export const my_file_read = promisify(fs.readFile);

export const my_file_read_JSON = async (path: string) => 
{
    const raw_string = await my_file_read(path);
    return JSON.parse(raw_string.toString());    
}