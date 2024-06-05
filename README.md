# ![The Yonic Corner](./public/img/desktop-logo.svg)

This is the source code of my personal blog, built with Astro, and uses Svelte components. Apart from a few key differences, it's not much different than any other Astro blog site.

There is another blog expressly designed for extremely old browsers called [Legacy Version][1] that uses nearly the same content. A popup with a link to it will be displayed if the browser detected cannot confidently display the page properly.

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

## Migrating from 2.2.0

Not much has changed in terms of the content API, except for the fact that **this version updates Astro from v3 to v4**. The blog has already addressed all of the breaking changes from the builtin features, but any additional features you may have added might require upgrading. [Check the Astro v4 upgrading guide](https://docs.astro.build/en/guides/upgrade-to/v4/) for more information.

However, the `src/feeds` folder that was automatically generated for internal use is not being utilized anymore, and should now be deleted.

## Configuration

The `src/settings.ts` file contains some properties that control the overall structure of the blog.

* `BLOG_PAGE_SIZE`: In post listing pages, controls how many posts should be displayed per page.
* `CATEGORY_IDS`: The internal IDs of each category.
* `HIDE_DRAFTS_IN_DEVELOPMENT`: A flag that hides draft posts in development mode.

Additionally, the blog uses the following environment variables:

* `INVIDIOUS_DEFAULT_INSTANCE`: URL to an Invidious instance to be used by default.
* `USE_CONTENT_COLLECTION_CACHE`: Whether to use the Astro experimental feature of content collection cache. By default it's set to false.

## Content

The Yonic Corner uses Astro content collections for handling the actual content of the blog. In 2.3.0, [JSON schemas](https://json-schema.org/) are generated automatically to aid in the creation of data content files.

### Blog posts

Located in `content/blog`. These are organized by year and month, although grouping them in a `drafts` folder is also supported.

This collection is meant for MDX or Markdown posts only and associated assets, with MDX posts being far more recommended. The frontmatter structure is as follows (in *italics*, optional):

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

#### Built-in components

MDX posts have some components that are already imported, and can be used right away without `import` statements.

**Modern-only** components may only be rendered in the Modern version. This can be guaranteed using the `<VersionBranch>` component.

* `<TextBubble>`: Creates a comic-like text bubble.
* `<Chara>`: Displays a character sprite. Used with `<TextBubble>`.
* `<Figure>`: Displays an image with art direction with an optional `<figcaption>`. This component has no slots.
* `<PlayerLink>`: Displays a link to play music on the player. This component has no slots.
* `<VersionBranch>`: Splits rendering between this version (Modern) and the [Legacy Version][1]. Anything with the `slot` prop assigned to `modern` will be rendered in this version, while anything in the `legacy` slot will be rendered in the Legacy one.
* `<Ruby>`: adds [ruby text](https://en.wikipedia.org/wiki/Ruby_character) to the text in the `text` prop. The text in the `ruby` prop will be displayed as ruby characters. Both of them are arrays of strings, one `ruby` text per string of characters in the `text` array. This component has no slots.
* `<ImageGrid>` (**Modern-only**): Creates a responsive grid to display images, with an optional caption.

#### Replaced elements

Some HTML elements are replaced with built-in components to provide additional enhancements. These are replaced automatically when rendering and don't have to be exported in the MDX posts.

* `<Paragraph>` and `<ListItem>` enable the text inside for Bi(y)onic reading.
* `<Anchor>` will make external links open in a new tab or window.
* `<Code>` disables the text that will be shown in inline monospace text (`like this string`) for Bi(y)onic reading.
* `<CodeBlock>`: Adds some customization options to code blocks that take more than one line and allow for syntax highlighting. [See the below section](#code-blocks) for more information.

> Do not confuse the `<Code>` component with the `<CodeBlock>` component and the `_internal/Code.astro` component.

#### Code blocks

Inspired by [Expressive Code](https://github.com/expressive-code/expressive-code), you can further customize code blocks with meta information (the first line of the code block) and extended syntax for comments, line highlights, among other things.

All code fences in the markdown posts will be replaced with the `<CodeBlock>` component, which uses a modified version of Astro's built-in Shiki renderer component (`_internal/Code.astro`) as a workaround to add these customizations in ways that the Astro built-in renderer can't.

##### Meta tags

A filename tag can be added to a code block with the `filename` meta tag, which will display a tab with the filename and its associated icon to the left of it.

By default the icon is determined from the file extension, but a custom icon can be set with the `icon` meta tag. It must correspond to the filename of the icon located in the public file icons folder without the image extension.

> Light icons (meant for dark backgrounds) are usually preferred over dark icons (meant for light backgrounds), although it depends on the contrast ratio between the icon and background.

```markdown
```js filename="src/script.js" icon="file_type_reactjs"

console.log("Backwards compatibility: You can also use a // comment in the second line of the block code, although this is not recommended.");

// ... rest of blockcode
```

You can highlight an entire line by putting them in one of the following three categories in the meta:
* `mark`: Simple highlight. Meant for focusing on a line.
* `ins`: Diff insertion highlight.
* `del`: Diff deletion highlight.
  
> Line number markings *(Modern version only)* do not count up diff deleted lines and respect the actual line numbering after the diff would be applied.

```markdown
```plaintext mark="1" ins="2-3" del="4,7"
Within curly braces, you can group consecutive lines with a hyphen (a-b,
from a to b) and separate lines with commas (3,8; lines 3 and 8).

You can make any mixture of these: "2-5,8" (lines 2 to 5, and line 8), "1,4,7"...
```

##### Syntax extensions

You can underline a piece of code with a red wavy line (simple underline in browsers that do not support wavy lines) by wrapping the content with two pairs of tildes (`~~`):

```markdown
```js
~~consoul~~.log("This will not work!") //! ReferenceError: consoul is not defined.
```

> ⚠ Due to limitations of the Shiki transformer, adding wavy lines can potentially alter and/or break syntax highlighting. Make sure the span of the tildes makes syntactical sense and does not cut a token in two.

You can also customize stylings by making comments of a specific format. This only works for file types that allow backslash comments:
* **Error style** (`//! Comment`), for the error message that a line of code will throw.
* **Return style** (`//> Comment`), for the result that a line of code will return.
* **Header style** (`//N. Comment`), where `N` is a positive integer number. Useful for highlighting sections of code.
* **Warning style** (`//? Comment`), for warnings that a line of code may display, or important messages.
* **Note/information style** (`//i Comment`), for marking comments as tips or noteworthy information.

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
* *`duration`*: Only has an effect on [Legacy version][1]. The duration of the song, in either minutes:seconds format, or a number with the amount of seconds (it can be decimal).
* `sources`: An array of audio sources for the track.

The audio sources can be of two types: Direct source or supplied from a third-party platform (YouTube or Internet Archive). You can combine sources from both types.

#### Direct source

Just an URL pointing directly to the source. If you self-host the source, this is the best option.

| Availability | Modern version | Legacy version |
| :-- | :-- | :-- |
| Depends on the supplier | HTTP(S) sources of any majorly supported MIME type | Only the first plain HTTP *(not HTTPS)* source, ignores sources with incompatible MIME types |

In order to support both versions with a direct source, at least one of each HTTPS and HTTP sources must be supplied.

It has the following properties:

* `type`: The MIME type of the source. It must be one of the compatible `audio/` types.
* `src`: The full URL targeting the audio source.

#### Internet Archive sourced *(experimental)*

The Yonic Corner can use the [metadata API](https://archive.org/developers/items.html) from the Internet Archive to obtain information from any music file publicly uploaded there.

| Availability | Modern version | Legacy version |
| - | - | - |
| Guaranteed on build, but may become stale over time | Uses both `d1` and `d2` servers over HTTPS | Uses `d1` over plain HTTP |

It has the following properties:

* `type`: Set to `'iarchive'`.
* `src`: A string divided into `{item}/{file}` format, where:
  * `item` is the item identifier associated with the archived item.
  * `file` is the name of the file within the archived item. It may be either an original or a derivative, and must include the extension.
  * Both components must be exact (case and space sensitive, among others) except for URI encoding, which doesn't matter whether it's encoded or not.

#### YouTube sourced *(experimental)*

The Yonic Corner can rely on the Invidious API to get several audio stream sources from any YouTube video with publicly available playback. *This source type is not recommended*.

| Availability | Modern version | Legacy version |
| - | - | - |
| Depends on the default Invidious instance | Videos accessible without logging in only | No; ignored |

It has the following properties:

* `type`: Set to `'youtube'`.
* `src`: The ID of the YouTube video.

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

Since version 2.3.0, web feeds are now generated in the Astro pipeline, so they are available on development mode.
However, in dev mode it's displayed as plain HTML, and image URLs may not be resolved correctly, so it's recommended to test them on production mode as well. 

The Yonic Corner distinguishes between rendering for the website (**blog context**) and rendering for the blog's web feed (**feed context**).

For the default feed, only the contents inside a `<div class="feed-preview">` element will be rendered. The full feed renders the post's full contents.

Astro components that use the `<FeedBranch>` component to split rendering into two slots and customize their appearance for either context. Anything in the default slot will only be rendered on the blog context, while anything in the `feed` slot will only be rendered in the feed context.

⚠  Framework components rendered in the feed context is not recommended, but they may be displayed without client directives.

[1]: https://github.com/YonicDev/yonic-corner-legacy