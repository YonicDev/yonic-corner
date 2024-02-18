export {}
declare global {
    interface Array<T> {
        shuffle(): Array<T> 
    }
}

if(!Array.prototype.shuffle) {
    Array.prototype.shuffle = function<T>(this: Array<T>) {
        const array = structuredClone(this);
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
}