/*
 * loquat-core / pos.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module pos
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        SourcePos
    });
}

const DEFAULT_TAB_WIDTH = 8;

/**
 * An instance of the `SourcePos` class represents a specific position in the source.
 * @static
 */
class SourcePos {
    /**
     * Creates a new `SourcePos` instance.
     * @param {string} name Name of the source.
     * @param {number} line Line in the source.
     * @parma {number} coulmn Column in the source.
     */
    constructor(name, line, column) {
        this.name   = name;
        this.line   = line;
        this.column = column;
    }

    /**
     * Creates a new `SourcePos` instance initialized with `line = 1` and `column = 1`.
     * @param {string} name Name of the source.
     * @returns {SourcePos} New `SourcePos` instance.
     */
    static init(name) {
        return new SourcePos(name, 1, 1);
    }

    /**
     * Checks if two `SourcePos` instances describe the same position.
     * @param {SourcePos} posA
     * @param {SourcePos} posB
     * @returns {boolean} `true` if two `SoucePos` instances describe the same position.
     */
    static equal(posA, posB) {
        return posA.name   === posB.name
            && posA.line   === posB.line
            && posA.column === posB.column;
    }

    /**
     * Compares two `SourcePos` instances.
     * @param {SourcePos} posA
     * @parma {SourcePos} posB
     * @returns {number} Negative if `posA` describes a position ahead of `posB.
     * Positive if `posA` describes a position behind `posB`.
     * Zero if `posA` and `posB` describe the same.
     */
    static compare(posA, posB) {
        return posA.name   < posB.name   ? -1
             : posA.name   > posB.name   ? 1
             : posA.line   < posB.line   ? -1
             : posA.line   > posB.line   ? 1
             : posA.column < posB.column ? -1
             : posA.column > posB.column ? 1
                                         : 0;
    }

    /**
     * Returns the string representation of the position.
     * @returns {string} The string representation of the position.
     */
    toString() {
        return (this.name === "" ? "" : `"${this.name}"`)
            + `(line ${this.line.toString()}, column ${this.column.toString()})`;
    }

    /**
     * Creates a new copy of the instance.
     * @returns {SourcePos} Copy of the instnace.
     */
    clone() {
        return new SourcePos(this.name, this.line, this.column);
    }

    /**
     * Creates a new copy of the instance with `name` set to the specified value.
     * @param {string} name
     * @returns {SourcePos} Copy of the instance.
     */
    setName(name) {
        return new SourcePos(name, this.line, this.column);
    }

    /**
     * Creates a new copy of the instance with `line` set to the specified value.
     * @param {number} line
     * @returns {SourcePos} Copy of the instance.
     */
    setLine(line) {
        return new SourcePos(this.name, line, this.column);
    }

    /**
     * Creates a new copy of the instance with `column` set to the specified value.
     * @param {number} column
     * @returns {SourcePos} Copy of the instance.
     */
    setColumn(column) {
        return new SourcePos(this.name, this.line, column);
    }

    /**
     * @param {string} char
     * @param {number} tabWidth
     * @returns {SourcePos}
     */
    addChar(char, tabWidth) {
        tabWidth = tabWidth | 0;
        if (tabWidth <= 0) {
            tabWidth = DEFAULT_TAB_WIDTH;
        }
        let copy = this.clone();
        switch (char) {
        case "":
            break;
        case "\n":
            copy.line  += 1;
            copy.column = 1;
            break;
        case "\t":
            copy.column += tabWidth - (copy.column - 1) % tabWidth;
            break;
        default:
            copy.column += 1;
        }
        return copy;
    }

    /**
     * @param {string} str
     * @param {number} tabWidth
     * @param {boolean} useCodePoint If `true` specified, the characters in the `str` are counted
     * based on the UTF-16 code point.
     * @returns {SourcePos}
     */
    addString(str, tabWidth, useCodePoint) {
        tabWidth = tabWidth | 0;
        if (tabWidth <= 0) {
            tabWidth = DEFAULT_TAB_WIDTH;
        }
        let copy = this.clone();
        if (useCodePoint) {
            for (let char of str) {
                switch (char) {
                case "\n":
                    copy.line  += 1;
                    copy.column = 1;
                    break;
                case "\t":
                    copy.column += tabWidth - (copy.column - 1) % tabWidth;
                    break;
                default:
                    copy.column += 1;
                }
            }
        }
        else {
            let len = str.length;
            for (let i = 0; i < len; i++) {
                switch (str[i]) {
                case "\n":
                    copy.line  += 1;
                    copy.column = 1;
                    break;
                case "\t":
                    copy.column += tabWidth - (copy.column - 1) % tabWidth;
                    break;
                default:
                    copy.column += 1;
                }
            }
        }
        return copy;
    }
}

end();
