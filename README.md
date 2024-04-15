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

## Migrating from 2.1.0

1. Move the `assets` folder associated with a MDX post straight to the `contents` folder and group it by year/month.
2. In the same folder, put the MDX post with the same ID and rename it `index.mdx`.
3. Remove the `export components = { ... }` line from the MDX.
4. Optionally, add a `hero` property in the frontmatter with the `modern` and `legacy` parameters, with values being relative paths pointing to the images.

## Configuration

The `src/settings.ts` file contains some properties that control the overall structure of the blog.

* `BLOG_PAGE_SIZE`: In post listing pages, controls how many posts should be displayed per page.
* `CATEGORY_IDS`: The internal IDs of each category.
* `HIDE_DRAFTS_IN_DEVELOPMENT`: A flag that hides draft posts in development mode.

Additionally, the blog uses the following enviornment variables:

* `INVIDIOUS_DEFAULT_INSTANCE`: URL to an Invidious instance to be used by default.

## Content

The Yonic Corner uses Astro content collections for handling the actual content of the blog.

### Blog posts

Located in `content/blog`. From 2.2.0, these are organized by year and month, although grouping them in a `drafts` folder is also supported.

This collection is meant for MDX or Markdown posts only and associated assets. The frontmatter structure is as follows (in *italics*, optional):

* `title`: The display title of the post.
* `description`: Flavor text to be used in the blog and SEO.
* `pubDate`: Date when it was first published, in any format accepted by the JavaScript Date parser ([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) is preferred)
* *`updatedDate`*: Date when it was last updated, using the same format as the other date field.
* *`category`*: Which category the post belongs to. It may only be one the list of set categories.
* *`tags`*: An array containing the tags the post should have. These are also used as keywords for SEO.
* *`draft`*: Takes in a boolean. Draft posts will not show on production mode. In development mode, they will have a \[draft\] indicator after the title, unless `HIDE_DRAFTS_IN_DEVELOPMENT` is set to true.
* *`legacy`*: Determines if this post should be included in the [Legacy Version][1] of the blog. Can be set to `true`, `false` or `only`. If set to `only`, it will be filtered out from this version of the blog (Modern).
* *`asianText`*: Has no effect on Modern version, but displays a warning to the reader when set to `true` in the [Legacy Version][1].
* *`series`*: Set this if the post belongs to a series of posts. It's an object with the following properties (both mandatory).
  * `id`: The internal ID of the series.
  * `order`: An integer number that tells how should this post be ordered in relation to others. Posts with lower order numbers will be placed first.
* *`hero`*: A set of two images:
  * *`modern`*: Asset path to the image used in this version.
  * *`legacy`* Asset path to the image used in the [Legacy Version][1]. It must have a 3:2 aspect ratio, and ideally a resolution of 454x303 pixels.
* *`heroPosition`*: Takes either `top`, `center` and `bottom`.

If `hero` is not defined, the hero images can be set by placing an image named `hero.png` for this version and `hero-legacy.png` for the Legacy one, in the same folder as the MDX post.

> Despite their names, hero images don't really need to be a PNG image. JPEG, GIF, WEBP and AVIF images will also work just fine. They only need to be named `hero.png` and `hero-legacy.png`.

When the modern hero image's aspect ratio is different than 16/9, `heroPosition` controls how the image should be vertically centered, with either the top, center, or bottom of the image being centered. Hero images are always horizontally centered in the middle. Hero images are used as images for Twitter/X Cards.

### Built-in components

MDX posts have some components that are already imported, and can be used right away without `import` statements.

**Modern-only** components may only be rendered in the Modern version. This can be guaranteed using the `<VersionBranch>` component.

* `<Bubble>`: Creates a comic-like text bubble.
* `<Chara>`: Displays a character sprite. Used with `<Bubble>`.
* `<Figure>`: Displays an image with art direction with an optional `<figcaption>`. This component has no slots.
* `<PlayerLink>`: Displays a link to play music on the player. This component has no slots.
* `<VersionBranch>`: Splits rendering between this version (Modern) and the [Legacy Version][1]. Anything with the `slot` prop assigned to `modern` will be rendered in this version, while anything in the `legacy` slot will be rendered in the Legacy one.
* `<Ruby>`: adds [ruby text](https://en.wikipedia.org/wiki/Ruby_character) to the text in the `text` prop. The text in the `ruby` prop will be displayed as ruby characters. Both of them are arrays of strings, one `ruby` text per string of characters in the `text` array. This component has no slots.
* `<ImageGrid>` (**Modern-only**): Creates a responsive grid to display images, with an optional caption.

#### Replaced elements

Some HTML elements are replaced with built-in components to provide additional enhancements. Since 2.2.0, these are replaced automatically when rendering and don't have to be exported in the MDX posts.

* `<Paragraph>` and `<ListItem>` enable the text inside for Bi(y)onic reading.
* `<Anchor>` will make external links open in a new tab or window.
* `<Code>` disables the text that will be shown in monospace text (`like this string`) for Bi(y)onic reading.

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
* *`hero`*: A set of two images:
  * *`modern`*: Asset path to the image used in this version. Unlike posts, the hero image is meant to be 16:9 in aspect ratio and does not align.
  * *`legacy`* Asset path to the image used in the [Legacy Version][1]. It must have a 3:2 aspect ratio, but it does not need to be in a specific resolution.
* `description`: Flavor text to be used in the blog and SEO.

If `hero` is no set, a hero image can be set by placing a `id-of-series.png` in its associated `src/assets/series` folder; much like posts, it does not need to be a PNG file.

### Music

Located in `content/music`.

These contain the metadata for music tracks to be played in the blog's music player.

This is the only content collection that has subfolders, one for each "track subset", which is included in the track's ID.

Contains JSON data only. Properties in italics are optional.

* `title`: The title of the track
* *`author`*: The author/composer of the music
* *`album`*: The album to which the track belongs to. In the Yonic Corner, it also refers to the title of the games the soundtrack belongs to.
* *`cover`*: The filename of the cover image. Preferably a square image. The image has to be placed in the `/src/assets/covers` folder.
* `sources`: An array of audio sources for the track.

The audio sources can be of two types: Direct source or YouTube sourced.

#### Direct source

  * `src`: The URL targeting the audio source.
  * `type`: The MIME type of the source. It must be one of the compatible `audio/` types.

> Only HTTPS audio sources are used. Any other protocol is ignored.

#### YouTube sourced *(experimental)*

The Yonic Corner can rely on the Invidious API to get several audio stream sources from any YouTube video with publicly available playback.

* `type`: Set to `'youtube'`.
* `src`: The ID of the YouTube video.

> These sources will be ignored in the [Legacy Version][1] and should always be accompanied by at least one direct source.

### Blurbs

Located in `content/blurb`.

These three JSON files contain strings of text that are displayed in the site's marquee. There is one for each version of the blog, and another one for both of them. Some will be randomly selected from a maximum of 6 blurb texts.

* `base`: Array of blurb strings that will always be included in the selection.
* `timed`: Array of blurb strings that will only be included if the current day falls within the blurb's specified date range. If client-side  JavaScript is disabled, these blurbs will never be included in the selection.
  * *`singleDate`*: Only for one day. 
    * `text`: The string for the blurb text.
    * `date`: The date string specified, in YYYY-MM-DD format.
    * *`useYear`*: When true, also checks if it falls within the same year.
  * *`dateRange`*: Check for a specified date range (extremes inclusive):
    * `text`: The string for the blurb text.
    * `from`: The starting date specified, in YYYY-MM-DD format.
    * `dot`: The ending date specified, in YYYY-MM-DD format.
    * *`useYear`*: When true, also checks if it falls within the year ranges.

## Web feeds

This blog generates an Atom feed that's copied into the public folder during post-build. Because of this, the feed is not available when running the development server.

The Yonic Corner distinguishes between rendering for the website (**blog context**) and rendering for the blog's web feed (**feed context**).

For the default feed, only the contents inside a `<div class="feed-preview">` element will be rendered. In the future, a full feed will render all of its contexts.

Astro components that use the `<FeedBranch>` component split rendering into two slots. Anything in the default slot will only be rendered on the blog context, while anything in the `feed` slot will only be rendered in the feed context.

⚠  Framework components rendered in the feed context is not recommended, but they may work without client directives.

## Issues regarding PostCSS

This blog uses PostCSS with Autoprefixer to extend compatibility with older browsers. Sometimes, if there is an error during build and it takes some time to fix, the pages will error out with "unexpected token" errors. So far the only workaround is to reset the development server.

[1]: https://github.com/YonicDev/yonic-corner-legacy