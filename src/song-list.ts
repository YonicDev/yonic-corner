interface Music {
    title: string,
    author?: string,
    album?: string,
    cover?: string,
    sources: {
        src: string,
        type: `${string}/${string}`
    }[]
}

const SongList: Record<string, Music> = {
    "null": {
        title: "Nothing playing",
        sources: [
            {
                src: "",
                type: "audio/mpeg"
            }
        ]
    },
    "rhythm-heaven_remix4": {
        title: "Remix 4",
        author: "TSUNKU♂",
        album: "Rhythm Heaven",
        cover: "rhythm-heaven",
        sources: [
            {
                src: "https://fi.zophar.net/soundfiles/nintendo-ds-2sf/rhythm-heaven/STRM_BGM_MEROMERO_COCOA.mp3",
                type: "audio/mpeg",
            }
        ]
    },
    "paper-mario-ttyd_chara": {
        title: "Teaching new stuff!",
        album: "Paper Mario: The Thousand-Year Door",
        cover: "ttyd",
        sources: [
            {
                src: "https://fi.zophar.net/soundfiles/nintendo-gamecube-gcn/paper-mario-the-thousand-year-door/evt_lec1_32k.mp3",
                type: "audio/mpeg"
            }
        ]
    }
}

export default SongList