import * as fs from "fs";

export function getUserGroupsFromFile(filePath: string)
{
    const lines = fs.readFileSync(filePath)
                     .toString()
                     .split(/\r\n|\r|\n/);
    const groups: string[][] = [];
    let last_group: string[] = [];
    lines.forEach(line => {
        if (line.length > 0)
            last_group.push(line);
        else {
            if (last_group.length > 0)
                groups.push(last_group);
            last_group = [];
        }
    });
    if (last_group.length > 0)
        groups.push(last_group);
    return groups;
}