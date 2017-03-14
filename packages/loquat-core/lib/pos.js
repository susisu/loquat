/*
 * loquat-core / pos.js
 */

/**
 * @module pos
 */

"use strict";

module.exports = () => {
    function end() {
        return Object.freeze({
            SourcePos
        });
    }

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
            this._name   = name;
            this._line   = line;
            this._column = column;
        }

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
         * @readonly
         * @type {string}
         */
        get name() {
            return this._name;
        }

        /**
         * @readonly
         * @type {number}
         */
        get line() {
            return this._line;
        }

        /**
         * @readonly
         * @type {number}
         */
        get column() {
            return this._column;
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
            // For this case
            // - `if` is faster than `switch`
            // - comparing strings is faster than character codes
            if (char === "") {
                return new SourcePos(this.name, this.line, this.column);
            }
            else if (char === "\n") {
                return new SourcePos(this.name, this.line + 1, 1);
            }
            else if (char === "\t") {
                return new SourcePos(this.name, this.line, this.column + tabWidth - (this.column - 1) % tabWidth);
            }
            else {
                return new SourcePos(this.name, this.line, this.column + 1);
            }
        }

        /**
         * @param {string} str
         * @param {number} tabWidth
         * @param {boolean} unicode If `true` specified, the characters are counted in units of code points.
         * @returns {module:pos.SourcePos}
         */
        addString(str, tabWidth, unicode) {
            // For this case
            // - `switch` is faster than `if`
            // - comparing character codes is faster than strings
            let line   = this.line;
            let column = this.column;
            if (unicode) {
                for (const char of str) {
                    switch (char.charCodeAt(0)) {
                    case 10: // "\n"
                        line  += 1;
                        column = 1;
                        break;
                    case 9: // "\t"
                        column += tabWidth - (column - 1) % tabWidth;
                        break;
                    default:
                        column += 1;
                    }
                }
            }
            else {
                const len = str.length;
                for (let i = 0; i < len; i++) {
                    switch (str.charCodeAt(i)) {
                    case 10: // "\n"
                        line  += 1;
                        column = 1;
                        break;
                    case 9: // "\t"
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

    return end();
};
