/*
 * loquat-core / pos.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        SourcePos
    });
}

const DEFAULT_TAB_WIDTH = 8;

class SourcePos {
    constructor(name, line, column) {
        this.name   = name;
        this.line   = line;
        this.column = column;
    }

    static init(name) {
        return new SourcePos(name, 1, 1);
    }

    static equal(posA, posB) {
        return posA.name   === posB.name
            && posA.line   === posB.line
            && posA.column === posB.column;
    }

    static compare(posA, posB) {
        return posA.name   < posB.name   ? -1
             : posA.name   > posB.name   ? 1
             : posA.line   < posB.line   ? -1
             : posA.line   > posB.line   ? 1
             : posA.column < posB.column ? -1
             : posA.column > posB.column ? 1
                                         : 0;
    }

    toString() {
        return (this.name === "" ? "" : `"${this.name}"`)
            + `(line ${this.line.toString()}, column ${this.column.toString()})`;
    }

    clone() {
        return new SourcePos(this.name, this.line, this.column);
    }

    setName(name) {
        return new SourcePos(name, this.line, this.column);
    }

    setLine(line) {
        return new SourcePos(this.name, line, this.column);
    }

    setColumn(column) {
        return new SourcePos(this.name, this.line, column);
    }

    addChar(char, tabWidth) {
        tabWidth = tabWidth | 0;
        if (tabWidth <= 0) {
            tabWidth = DEFAULT_TAB_WIDTH;
        }
        let copy = this.clone();
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
        return copy;
    }

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
