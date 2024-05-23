import { type ShikiTransformer, FontStyle } from "shiki";

type TransformerOptions = {
    [theme: string]: {
        error?: CommentStyle
    }
}

type CommentStyle = {
    bgColor?: string,
    textColor?: string,
}

const defaultOptions: TransformerOptions = {
    'min-light': {
        error: {
            textColor: "red",
            bgColor: "rgba(255,0,0,0.25)"
        }
    },
    'poimandres': {
        error: {
            textColor: "red",
            bgColor: "rgba(255,0,0,0.25)"
        }
    },
    'min-dark': {
        error: {
            textColor: "#003333",
            bgColor: "red",
        }
    }
}

export function betterCommentsTransformer(options: TransformerOptions = defaultOptions): ShikiTransformer {
    return {
        name: "squigglyLines",
        tokens(lines) {
            const theme: string = (this.options as any).theme;
            const style = options[theme];
            for (const line of lines) {
                for (const token of line) {
                    if(/(?<=^|\s)\/\/!\s/.test(token.content)) {
                        token.color = style.error?.textColor ?? defaultOptions[theme]?.error?.textColor;
                        token.bgColor = style.error?.bgColor ?? defaultOptions[theme]?.error?.bgColor;
                        token.fontStyle = FontStyle.None;
                        token.content = token.content.replace(/(?<=^|\s)\/\/!\s/, "");
                    }
                }
            }
        },
    }
}
