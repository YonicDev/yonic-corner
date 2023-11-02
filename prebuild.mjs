// Sometimes, src/feeds is cached, so we want to check if it exists
// if it doesn't, create it.

import fs from "fs";
import path from "path"

const feedsPath = path.resolve(process.cwd(), "src/feeds");

if(!fs.existsSync(feedsPath)) {
    fs.mkdirSync(feedsPath);
} else if(fs.statSync(feedsPath).isDirectory()) {
    fs.mkdirSync(feedsPath);
}