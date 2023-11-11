# ![The Yonic Corner](./public/img/desktop-logo.svg)

This is the source code of my personal blog, built with Astro, and uses Svelte components. Apart from a few key differences, it's not much different than any other Astro blog site.

There is another blog expressly designed for extremely old browsers called [Legacy Version][1] that uses nearly the same content.

## Setup

Clone the repository and run `npm install` in it.

> ⚠ **The actual contents of The Yonic Corner have been separated to a private monorepo.**
> 
> If you want to add some sample content to the blog, you can simply delete the symbolic links in the `src/content` and `src/assets` folders (or "files" if Git for Windows doesn't process them) and copy and merge the contents of the `example` folder to those folders.

Then you can run one of the following commands:

```bash
npm install
npm run dev # run the development server
npm run build # make a build
npm run preview # run a server in production mode with the built site
```

### CLI tool

To handle posts easier, a CLI script is included on the repo. It's meant to be run in the root directory of the repository. It has the following commands:

#### `new`

```bash
node cli.mjs new <Title of the post> [--id <id>]
```

This will create a MDX file in the blog content folder, and a folder for media like images and video in the assets folder. The ID option defines how both will be named in the filesystem.

#### `publish`

```bash
node cli.mjs publish <Post id> [-d]
```

Basically, it marks the post as "not a draft and viable for publishing" and updates the `publishDate` field. The `-d` option prevents this last effect.

#### `update`

```bash
node cli.mjs update <Post id> [-p | --publish]
```

Adds or modified the `updatedDate` field of the post. With the `-p` or `--publish` option, it updates the `publishDate` field instead.

## Configuration

The `src/settings.ts` file contains some properties that control the overall structure of the blog.

* `BLOG_PAGE_SIZE`: In post listing pages, controls how many posts should be displayed per page.
* `CATEGORY_IDS`: The internal IDs of each category.
* `HIDE_DRAFTS_IN_DEVELOPMENT`: A flag that hides draft posts in development mode.

## Content

The Yonic Corner uses Astro content collections for handling the actual content of the blog.

### Blog posts

Located in `content/blog`.

This collection is meant for MDX or Markdown posts only. The frontmatter structure is as follows (in *italics*, optional):

* `title`: The display title of the post.
* `description`: Flavor text to be used in the blog and SEO.
* `pubDate`: Date when it was first published, in any format accepted by the JavaScript Date parser ([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) is preferred)
* *`updatedDate`*: Date when it was last updated, using the same format as the other date field.
* *`category`*: Which category the post belongs to. It may only be one the list of set categories.
* *`tags`*: An array containing the tags the post should have. These are also used as keywords for SEO.
* *`draft`*: Takes in a boolean. Draft posts will not show on production mode. In development mode, they will have a \[draft\] indicator after the title, unless `HIDE_DRAFTS_IN_DEVELOPMENT` is set to true.
* *`legacy`*: Determines if this post should be included in the [Legacy Version][1] of the blog. Can be set to `true`, `false` or `only`. If set to `only`, it will be filtered out from this version of the blog (Modern).
* *`series`*: Set this if the post belongs to a series of posts. It's an object with the following properties (both mandatory).
  * `id`: The internal ID of the series.
  * `order`: An integer number that tells how should this post be ordered in relation to others. Posts with lower order numbers will be placed first.
* *`heroPosition`*: Takes either `top`, `center` and `bottom`.

Hero images can be set by placing an image named `hero.png` in the post's assets folder.

> Despite its name, it doesn't really need to be a PNG image. JPEG, GIF, WEBP and AVIF images will also work just fine. It only needs to be named `hero.png`.

When the hero image's aspect ratio is different than 16/9, `heroPosition` controls how the image should be vertically centered, with either the top, center, or bottom of the image being centered. Hero images are always horizontally centered in the middle. Hero images are used as images for Twitter/X Cards.

### Built-in components

MDX posts have some components that are already imported, and can be used right away without `import` statements.

**Modern-only** components may only be rendered in the Modern version. This can be guaranteed using the `<VersionBranch>` component.

* `<Bubble>`: Creates a comic-like text bubble.
* `<Chara>`: Displays a character sprite. Used with `<Bubble>`.
* `<Figure>`: Displays an image with art direction with an optional `<figcaption>`.
* `<PlayerLink>`: Displays a link to play music on the player.
* `<VersionBranch>`: Splits rendering between this version (Modern) and the [Legacy Version][1]. Anything with the `slot` attribute assigned to `modern` will be rendered in this version, while anything in the `legacy` slot will be rendered in the Legacy one.
* `<ImageGrid>` (**Modern-only**): Creates a responsive grid to display images, with an optional caption.

#### Replaceable elements

Some built-in components are meant to replace HTML elements to provide additional enhancements.

In the body of the post, the following line should be set first to do this.

```js
export const components = { p: Paragraph, li: ListItem, code: Code, a: Anchor };
```

* `<Paragraph>` and `<ListItem>` enable the text inside for Bi(y)onic reading.
* `<Anchor>` will make external links open in a new tab or window.
* `<Code>` customizes the look of text that will be shown in monospace text (`like this string`).

### Code blocks

A filename tag can be added to a code block by adding a commented line as the first line, like this:

```markdown
```js
// src/script.js
console.log("The // comment in the first line will add a filename tag with the name 'src/script.js'");

// ... rest of blockcode
```

### Series

Located in `content/series`.

A series is a list of posts set in a chronological order.

Contains JSON data only. All properties are mandatory. The internal ID is set in the filename.

* `title`: The display title of the series.
* `description`: Flavor text to be used in the blog and SEO.

A hero image can be set by placing a `hero.png` in its associated `src/assets/series` folder. Unlike posts, the hero image is meant to be 16/9 in aspect ratio and does not align.

### Music

Located in `content/music`.

These contain the metadata for music tracks to be played in the blog's music player.

This is the only content collection that has subfolders, one for each "track subset", which is included in the track's ID.

Contains JSON data only. Properties in italics are optional.

* `title`: The title of the track
* *`author`*: The author/composer of the music
* *`album`*: The album to which the track belongs to. In the Yonic Corner, it also refers to the title of the games the soundtrack belongs to.
* *`cover`*: The filename of the cover image. Preferably a square image. The image has to be placed in the `/src/assets/covers` folder.
* `sources`: An array of audio sources for the track, made of objects with all properties mandatory:
  * `src`: The URL targeting the audio source.
  * `type`: The MIME type of the source. It must be one of the compatible `audio/` types.

> Only HTTPS audio sources are used. Any other protocol is ignored.

## Web feeds

This blog generates an Atom feed that's copied into the public folder during post-build. Because of this, the feed is not available when running the development server.

## Issues regarding PostCSS

This blog uses PostCSS with Autoprefixer to extend compatibility with older browsers. Sometimes, if there is an error during build and it takes some time to fix, the pages will error out with "unexpected token" errors. So far the only workaround is to reset the development server.

[1]: https://github.com/YonicDev/yonic-corner-legacy