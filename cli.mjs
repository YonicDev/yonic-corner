import fs from "fs";
import path from "path";

import yaml from "yaml";

import { program } from "commander";

program
    .command("new")
    .argument('<title>', 'title of the article')
    .option('--id <id>', 'internal ID of the article')
    .action((title, options) => {
        const frontmatter = {
            title,
            description: "Insert description here",
            pubDate: new Date().toISOString(),
            draft: true,
            category: "misc",
            tags: []
        }
        let output =`---\n${yaml.stringify(frontmatter)}---\nBody of the post here...`;

        const id = options.id
            ? options.id.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "").replace(/\s/, "-").toLowerCase()
            : title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "").replace(/\s/, "-").toLowerCase();
        console.log(id);
        fs.writeFileSync(path.resolve(process.cwd(), "./src/content/blog/", `${id}.mdx`), output);
        console.log("Created MDX post!");
        fs.mkdirSync(path.resolve(process.cwd(), "./src/assets/articles", id));
        console.log("Created post assets folder!");
    });

program.parse();