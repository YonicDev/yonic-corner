import fs from "fs";
import path from "path";

import matter from "gray-matter";

import { program } from "commander";

const updatePost = (updateFunction) => {
    return (id, options) => {
        const post = fs.readFileSync(path.resolve(process.cwd(), "./src/content/blog/", `${id}.mdx`))
        const { data, content } = matter(post);
    
        const output = updateFunction(data, content, options);
    
        fs.writeFileSync(path.resolve(process.cwd(), "./src/content/blog/", `${id}.mdx`), output);
        console.log("Post updated successfully!");
    }
}

program
    .command("new")
    .description("Creates a new post and its associated assets folder.")
    .argument('<title>', 'title of the post')
    .option('--id <id>', 'internal ID of the post')
    .action((title, options) => {
        const id = options.id
            ? options.id.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "").replace(/\s/, "-").toLowerCase()
            : title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "").replace(/\s/, "-").toLowerCase();

        const postDir = path.resolve(process.cwd(), "./src/content/blog/", `${id}.mdx`);
        const assetsDir = path.resolve(process.cwd(), "./src/assets/articles", id);

        if(fs.existsSync(postDir))
            throw `A post with the ID ${id} already exists. Try with another ID.`

        const frontmatter = {
            title,
            description: "Insert description here",
            pubDate: new Date().toISOString(),
            draft: true,
            category: "misc",
            tags: []
        }
        const content =`
Image imports go here...

<div class="feed-preview">
Anything inside this element will be inside the content of the RSS feed.
(No leading whitespaces!)
</div>

Body of the post here...`;

        const output = matter.stringify(content, frontmatter);

        
        fs.writeFileSync(postDir, output);
        console.log("Created MDX post!");
        if(fs.existsSync(assetsDir) && fs.statSync(assetsDir).isDirectory()) {
            console.log("Assets folder for this post already exists.")
        } else {
            fs.mkdirSync(assetsDir);
            console.log("Created post assets folder!");
        }
    });

program
    .command("publish")
    .description("Sets post for publishing. This also updates the publish date.")
    .argument("<id>", "ID of the post")
    .option("-d", "do not update the publish date.")
    .action(updatePost((data, content, options) => {
        if(!options?.d)
            data.pubDate = new Date().toISOString();
        data.draft = false;
        return matter.stringify({data, content});
    }));

program
    .command("update")
    .description("Marks posts that has been updated. The updated date will be set.")
    .argument("<id>", "ID of the post")
    .option("-p --publish", "Alter the publish date instead.")
    .action(updatePost((data, content, options) => {
        if(options?.publish) {
            console.log("Updating pubDate instead of updatedDate.")
            data.pubDate = new Date().toISOString();
        } else {
            data.updatedDate = new Date().toISOString();
        }
        return matter.stringify({data, content});
    }))

program.parse();