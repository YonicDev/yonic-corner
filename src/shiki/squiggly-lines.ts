import { type ShikiTransformer, FontStyle } from "shiki";

type TransformerOptions = {
    [theme: string]: string
}

const defaultOptions: TransformerOptions = {
    'min-light': "text-decoration: underline;text-decoration: underline wavy red;",
    'poimandres': "text-decoration: underline;text-decoration: underline wavy red;",
    'min-dark': "text-decoration: underline;color: red!important;",
}

export function squigglyLinesTransformer(options: TransformerOptions = defaultOptions): ShikiTransformer {
    return {
        name: "squigglyLines",
        tokens(lines) {   
            let squiggly = false;
            let cumulativeOffset = 0;
            const theme: string = (this.options as any).theme;
            const style = options[theme];
            for (const line of lines) {
                for (const token of line) {
                    if(/~~/.test(token.content)) {
                        squiggly = !squiggly;
                        token.content = token.content.replace("~~", "");
                        cumulativeOffset += 2;
                        continue;
                    }
                    if(squiggly) {
                        const fontStyle = token.fontStyle === FontStyle.Italic? "font-style: italic;" : "";
                        const fontWeight = token.fontStyle === FontStyle.Bold? "font-weight: bold;" : "";
                        token.htmlStyle=`${style}color: ${token.color};${fontStyle}${fontWeight}`;
                        token.offset -= cumulativeOffset;
                    }
                }
            }
        },
    }
}
