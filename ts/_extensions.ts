/* Array */
interface Array<T> {
    /**
     *  Checks whether all elements of the array satisfy the predicate condition.
     */
    All(predicate: (element: T) => boolean): boolean;
}

Array.prototype.All = function <T>(predicate: (element: T) => boolean): boolean {
    for (let i = 0; i < this.length; i++) {
        let item = this[i];
        if (!predicate(item)) {
            return false;
        }
    }
    return true;
}

/* String */
interface String {
    Format(...args: string[]): string;
}

String.prototype.Format = function (...args: string[]): string {
    let format = this;
    for (let p in args) {
        format = format.replace("{" + p + "}", arguments[p]);
    }
    return format;
}

// String.prototype.contains = function (conString) {
//     ///<signature>
//     ///<summary>Check source string for conString entries.</summary>
//     ///<param name='conString' type='String'>A string that must be found in source string.</param>
//     ///<return type="String">true - conString is found in source string; false - not found</retrun>
//     ///</signature>
//     return this.indexOf(conString) !== -1;
// };

// String.isNullOrWhitespace = function (input) {
//     if (typeof input === 'undefined' || input === null) return true;
//     return input.replace(/\s/g, '').length < 1;
// };