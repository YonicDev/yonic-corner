import type { ShikiTransformer } from "shiki";

type Range = {from: number, to: number} | number;

export function lineHighlightTransformer(): ShikiTransformer {
    return {
        name: "lineHighlighter",
        line(node, line) {
            const createMarks = (type: "mark"|"ins"|"del", className: string) => {
                const marksRaw = meta[type]?.split(",")
                const marksRanges: Range[] = marksRaw?.map(markRange => {
                    if(/^\d+-\d+$/.test(markRange)) {
                        const limits = markRange.split("-") as [string, string];
                        return {
                            from: parseInt(limits[0]),
                            to: parseInt(limits[1])
                        }
                    }
                    return parseInt(markRange)
                }) ?? [];
                let isMark = false;
                for (const range of marksRanges) {
                    if(isMark)
                        break;
                    if(typeof range == "number")
                        isMark ||= line === range;
                    else
                        isMark ||= line >= range.from && line <= range.to;
                }
                if(isMark)
                    this.addClassToHast(node, className);
            }
            
            if(!this.options.meta?.mark && !this.options.meta?.ins && !this.options.meta?.del)
                return;
            const meta: Record<string, string | undefined> = this.options.meta;
            if(meta.mark)
                createMarks("mark", "marked");
            if(meta.ins)
                createMarks("ins", "insertion");
            if(meta.del)
                createMarks("del", "deletion");
        },
    }
}

