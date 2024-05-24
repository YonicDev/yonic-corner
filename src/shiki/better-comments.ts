import { type ShikiTransformer, FontStyle } from "shiki";

type TransformerOptions = {
    [theme: string]: {
        error?: CommentStyle,
        return?: CommentStyle,
        header?: CommentStyle,
        warning?: CommentStyle,
        info?: CommentStyle
    }
}

type CommentStyle = {
    bgColor?: string,
    textColor?: string,
}

const defaultOptions: TransformerOptions = {
    'min-light': {
        error: { textColor: "red", bgColor: "rgba(255,0,0,0.25)" },
        return: { textColor: "#976ebf" },
        warning: { textColor: "#955300", bgColor: "rgba(171,144,0,0.25)" },
        header: { textColor: "#9fdfdb", bgColor: "#2c6a63"},
        info: { textColor: "#1f3d95", bgColor: "rgba(121, 173, 227, 0.285)"},
    },
    'poimandres': {
        error: { textColor: "red", bgColor: "rgba(255,0,0,0.25)" },
        return: { textColor: "#55b0ff" },
        warning: { textColor: "gold", bgColor: "rgba(255,94,0,0.25)" },
        header: { textColor: "#8fb6ff", bgColor: "#142c58"},
        info: { textColor: "#b3cdff", bgColor: "rgba(113,176,255, 0.5)"},
    },
    'min-dark': {
        error: { textColor: "#003333", bgColor: "red" },
        return: { textColor: "deepskyblue" },
        warning: { textColor: "#003333", bgColor: "gold" },
        header: { textColor: "#00423A", bgColor: "#92F3ED"},
        info: { textColor: "azure", bgColor: "royalblue"},
    }
}

export function betterCommentsTransformer(options: TransformerOptions = defaultOptions): ShikiTransformer {
    const errorStyle = { script: /(?<=^|\s)\/\/!\s/, markup: /(?<=^|\s)(?<=<!--\s)!\s/};
    const returnStyle = { script: /(?<=^|\s)\/\/>\s/, markup: /(?<=^|\s)<!--\s>\s/};
    const warningStyle = { script: /(?<=^|\s)\/\/\?\s/, markup: /(?<=^|\s)(?<=<!--\s)\?\s/};
    const headerStyle = { script: /(?<=^|\s)\/\/(\d+\.\s?)/, markup: /(?<=^|\s)<!--\s(\d+\.\s?)/};
    const infoStyle = { script: /(?<=^|\s)\/\/i\s/, markup: /(?<=^|\s)(?<=<!--\s)i\s/};

    function getStyledCommentOfType(type: Record<string, RegExp>, token: string): RegExp | null {
        for (const syntax of Object.values(type)) {
            if(syntax.test(token))
                return syntax;
        }
        return null;
    }

    return {
        name: "squigglyLines",
        tokens(lines) {
            const theme: string = (this.options as any).theme;
            const style = options[theme];
            for (const line of lines) {
                for (const token of line) {
                    let detectedStyleSyntax = getStyledCommentOfType(errorStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = style.error?.textColor ?? defaultOptions[theme]?.error?.textColor;
                        token.bgColor = style.error?.bgColor ?? defaultOptions[theme]?.error?.bgColor;
                        token.fontStyle = FontStyle.None;
                        token.content = token.content.replace(detectedStyleSyntax, "");
                        continue;
                    }
                    detectedStyleSyntax = getStyledCommentOfType(returnStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = style.return?.textColor ?? defaultOptions[theme]?.return?.textColor;
                        token.bgColor = style.return?.bgColor ?? defaultOptions[theme]?.return?.bgColor;
                        token.fontStyle = FontStyle.Italic;
                        if(detectedStyleSyntax === returnStyle.markup)
                            token.content = token.content.replace(/--*>(?=$|\s)/, "")
                        token.content = token.content.replace(detectedStyleSyntax, "=> ");
                        continue;
                    }
                    detectedStyleSyntax = getStyledCommentOfType(warningStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = style.warning?.textColor ?? defaultOptions[theme]?.warning?.textColor;
                        token.bgColor = style.warning?.bgColor ?? defaultOptions[theme]?.warning?.bgColor;
                        token.fontStyle = FontStyle.None;
                        token.content = token.content.replace(detectedStyleSyntax, "");
                        continue;
                    }
                    detectedStyleSyntax = getStyledCommentOfType(headerStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = style.header?.textColor ?? defaultOptions[theme]?.header?.textColor;
                        token.bgColor = style.header?.bgColor ?? defaultOptions[theme]?.header?.bgColor;
                        token.fontStyle = FontStyle.Bold;
                        const [,number] = detectedStyleSyntax.exec(token.content)!;
                        token.content = token.content.replace(detectedStyleSyntax, number);
                        if(detectedStyleSyntax === headerStyle.markup)
                            token.content = token.content.replace(/\s*-->(?=$|\s+)/, "")
                        token.content += " ";
                        continue;
                    }
                    detectedStyleSyntax = getStyledCommentOfType(infoStyle, token.content);
                    if(detectedStyleSyntax != null) {
                        token.color = style.info?.textColor ?? defaultOptions[theme]?.info?.textColor;
                        token.bgColor = style.info?.bgColor ?? defaultOptions[theme]?.info?.bgColor;
                        token.fontStyle = FontStyle.None;
                        token.content = token.content.replace(detectedStyleSyntax, "");
                        continue;
                    }
                }
            }
        },
    }
}
