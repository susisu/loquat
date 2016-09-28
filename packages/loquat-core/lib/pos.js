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
     * @param {number} column Column in the source.
     */
    constructor(name, line, column) {
        this.name   = name;
        this.line   = line;
        this.column = column;
    }

    /** @member {string} module:pos.SourcePos#name */
    /** @member {number} module:pos.SourcePos#line */
    /** @member {number} module:pos.SourcePos#column */

    /**
     * Creates a new `SourcePos` instance initialized with `line = 1` and `column = 1`.
     * @param {string} name Name of the source.
     * @returns {module:pos.SourcePos} New `SourcePos` instance.
     */
    static init(name) {
        return new SourcePos(name, 1, 1);
    }

    /**
     * Checks if two `SourcePos` instances describe the same position.
     * @param {module:pos.SourcePos} posA
     * @param {module:pos.SourcePos} posB
     * @returns {boolean} `true` if two `SoucePos` instances describe the same position.
     */
    static equal(posA, posB) {
        return posA.name   === posB.name
            && posA.line   === posB.line
            && posA.column === posB.column;
    }

    /**
     * Compares two `SourcePos` instances.
     * @param {module:pos.SourcePos} posA
     * @param {module:pos.SourcePos} posB
     * @returns {number} Negative if `posA` describes a position ahead of `posB`.
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
            + `(line ${this.line}, column ${this.column})`;
    }

    /**
     * Creates a new copy of the instance with `name` set to the specified value.
     * @param {string} name
     * @returns {module:pos.SourcePos} Copy of the instance.
     */
    setName(name) {
        return new SourcePos(name, this.line, this.column);
    }

    /**
     * Creates a new copy of the instance with `line` set to the specified value.
     * @param {number} line
     * @returns {module:pos.SourcePos} Copy of the instance.
     */
    setLine(line) {
        return new SourcePos(this.name, line, this.column);
    }

    /**
     * Creates a new copy of the instance with `column` set to the specified value.
     * @param {number} column
     * @returns {module:pos.SourcePos} Copy of the instance.
     */
    setColumn(column) {
        return new SourcePos(this.name, this.line, column);
    }

    /**
     * @param {string} char
     * @param {number} tabWidth
     * @returns {module:pos.SourcePos}
     */
    addChar(char, tabWidth) {
        tabWidth = tabWidth | 0;
        if (tabWidth <= 0) {
            tabWidth = DEFAULT_TAB_WIDTH;
        }
        let line   = this.line;
        let column = this.column;
        switch (char) {
        case "":
            break;
        case "\n":
            line  += 1;
            column = 1;
            break;
        case "\t":
            column += tabWidth - (column - 1) % tabWidth;
            break;
        default:
            column += 1;
        }
        return new SourcePos(this.name, line, column);
    }

    /**
     * @param {string} str
     * @param {number} tabWidth
     * @param {boolean} useCodePoint If `true` specified, the characters in the `str` are counted
     * based on the UTF-16 code point.
     * @returns {module:pos.SourcePos}
     */
    addString(str, tabWidth, useCodePoint) {
        tabWidth = tabWidth | 0;
        if (tabWidth <= 0) {
            tabWidth = DEFAULT_TAB_WIDTH;
        }
        let line   = this.line;
        let column = this.column;
        if (useCodePoint) {
            for (let char of str) {
                switch (char) {
                case "\n":
                    line  += 1;
                    column = 1;
                    break;
                case "\t":
                    column += tabWidth - (column - 1) % tabWidth;
                    break;
                default:
                    column += 1;
                }
            }
        }
        else {
            let len = str.length;
            for (let i = 0; i < len; i++) {
                switch (str[i]) {
                case "\n":
                    line  += 1;
                    column = 1;
                    break;
                case "\t":
                    column += tabWidth - (column - 1) % tabWidth;
                    break;
                default:
                    column += 1;
                }
            }
        }
        return new SourcePos(this.name, line, column);
    }
}

end();
