import fs from "fs";
import path from "path";

import matter from "gray-matter";

import { program } from "commander";
import { globSync } from "glob";

const updatePost = (updateFunction) => {
    return (id, date, options) => {
        const [postPath] = globSync(`./src/content/blog/${date ?? "*/*"}/${id}/index.mdx`);
        if(!postPath)
            throw `There is no post with ID ${id}.`

        const post = fs.readFileSync(postPath, 'utf-8')
        const { data, content } = matter(post);
    
        const output = updateFunction(data, content, options);
    
        fs.writeFileSync(postPath, output);
        console.log("Post updated successfully!");
    }
}

program
    .command("new")
    .description("Creates a new post and its associated assets folder.")
    .argument('<title>', 'title of the post')
    .option('--id <id>', 'internal ID of the post')
    .action(async (title, options) => {
        const id = options.id
            ? options.id.replaceAll(/[&\/\\#,+()$~%.'":*?<>{}]/g, "").replaceAll(/\s/g, "-").toLowerCase()
            : title.replaceAll(/[&\/\\#,+()$~%.'":*?<>{}]/g, "").replaceAll(/\s/g, "-").toLowerCase();

        const today = new Date();
        const year = today.getUTCFullYear().toString();
        const month = (today.getUTCMonth()+1).toString().padStart(2, '0');

        const postDir = path.resolve(process.cwd(), "./src/content/blog/", year, month, id);
        const postPath = path.resolve(postDir, "index.mdx");

        if(!fs.existsSync(postDir)) {
            fs.mkdirSync(postDir, {recursive: true})
        } else if(fs.existsSync(postPath)) {
            throw `A post with the ID ${id} already exists. Try with another ID.`
        }

        const frontmatter = {
            title,
            description: "Insert description here",
            pubDate: today.toISOString(),
            hero: {
                modern: "./hero.png",
                legacy: "./hero-legacy.png"
            },
            draft: true,
            category: "misc",
            tags: ['tags','here']
        }
        const content =`
Image imports go here...

<div class="feed-preview">
Anything inside this element will be inside the content of the RSS feed.
(No leading whitespaces!)
</div>

Body of the post here...`;

        const output = matter.stringify(content, frontmatter);

        
        fs.writeFileSync(postPath, output);
        console.log("Created MDX post!");

        const placeholderModern = Buffer.from(await (await fetch("https://placehold.co/1920x1080/png")).arrayBuffer());
        const placeholderLegacy = Buffer.from(await (await fetch("https://placehold.co/454x303/png")).arrayBuffer());

        fs.writeFileSync(path.resolve(postDir, "hero.png"), placeholderModern);
        fs.writeFileSync(path.resolve(postDir, "hero-legacy.png"), placeholderLegacy);
    });

program
    .command("publish")
    .description("Sets post for publishing. This also updates the publish date.")
    .argument("<id>", "ID of the post")
    .argument("[date-folder]", "The date folder it is included, in YYYY/MM format. If not specified, it gets the first find.")
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
    .argument("[date-folder]", "The date folder it is included, in YYYY/MM format. If not specified, it gets the first find.")
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