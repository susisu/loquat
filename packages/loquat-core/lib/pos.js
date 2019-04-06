"use strict";

module.exports = () => {
  const TAB = 0x9;
  const LF = 0xA;

  /**
   * class SourcePos(name: string, index:int, line: int, column: int) {
   *   static init(name: string): SourcePos;
   *   static equal(posA: SourcePos, posB; SourcePos): boolean;
   *   static compare(posA: SourcePos, posB: SourcePos): int;
   *   toString(): string;
   *   setName(name: string): SourcePos;
   *   setLine(line: int): SourcePos;
   *   setColumn(column: int): SourcePos;
   *   addChar(char: string, tabWidth: int): SourcePos;
   *   addString(str: string, tabWidth: int, unicode: boolean): SourcePos;
   * }
   *
   * `SourcePos` represents a position in input.
   */
  class SourcePos {
    /**
     * SourcePos.init(name: string): SourcePos
     *
     * Creates a new `SourcePos` with the initial position `(index, line, column) = (0, 1, 1)`.
     */
    static init(name) {
      return new SourcePos(name, 0, 1, 1);
    }

    /**
     * SourcePos.equal(posA: SourcePos, posB: SourcePos): boolean
     */
    static equal(posA, posB) {
      return posA.name   === posB.name
          && posA.index  === posB.index
          && posA.line   === posB.line
          && posA.column === posB.column;
    }

    /**
     * SourcePos.compare(posA: SourcePos, posB: SourcePos): int
     *
     * Compares two positions. Returns negative number if `posA` is ahead of `posB`, positive if
     * `posA` is behind `posB`, and zero if two positions are equal.
     */
    static compare(posA, posB) {
      return posA.name   < posB.name   ? -1
           : posA.name   > posB.name   ? 1
           : posA.index  < posB.index  ? -1
           : posA.index  > posB.index  ? 1
           : posA.line   < posB.line   ? -1
           : posA.line   > posB.line   ? 1
           : posA.column < posB.column ? -1
           : posA.column > posB.column ? 1
                                       : 0;
    }

    constructor(name, index, line, column) {
      this._name   = name;
      this._index  = index;
      this._line   = line;
      this._column = column;
    }

    get name() {
      return this._name;
    }

    get index() {
      return this._index;
    }

    get line() {
      return this._line;
    }

    get column() {
      return this._column;
    }

    /**
     * SourcePos#toString(): string
     *
     * Returns a human readable string representation of the position.
     */
    toString() {
      return (this.name === "" ? "" : `"${this.name}"`)
        + `(line ${this.line}, column ${this.column})`;
    }

    /**
     * SourcePos#setName(name: string): SourcePos
     *
     * Creates a copy of the position with `name` updated.
     */
    setName(name) {
      return new SourcePos(name, this.index, this.line, this.column);
    }

    /**
     * SourcePos#setIndex(index: int): SourcePos
     *
     * Creates a copy of the position with `index` updated.
     */
    setIndex(index) {
      return new SourcePos(this.name, index, this.line, this.column);
    }

    /**
     * SourcePos#setLine(line: int): SourcePos
     *
     * Creates a copy of the position with `line` updated.
     */
    setLine(line) {
      return new SourcePos(this.name, this.index, line, this.column);
    }

    /**
     * SourcePos#setColumn(column: int): SourcePos
     *
     * Creates a copy of the position with `column` updated.
     */
    setColumn(column) {
      return new SourcePos(this.name, this.index, this.line, column);
    }

    /**
     * SourcePos#addChar(char: string, tabWidth: int): SourcePos
     *
     * Returns a new position that is offset from the original position by the given character.
     */
    addChar(char, tabWidth) {
      // For this case,
      // - `if` is faster than `switch`
      // - comparing strings is faster than character codes
      if (char === "") {
        return new SourcePos(this.name, this.index, this.line, this.column);
      } else if (char === "\n") {
        return new SourcePos(this.name, this.index + 1, this.line + 1, 1);
      } else if (char === "\t") {
        return new SourcePos(
          this.name,
          this.index + 1,
          this.line,
          this.column + tabWidth - (this.column - 1) % tabWidth
        );
      } else {
        return new SourcePos(this.name, this.index + char.length, this.line, this.column + 1);
      }
    }

    /**
     * SourcePos#addString(str: string, tabWidth: int, unicode: boolean): SourcePos
     *
     * Returns a new position that is offset from the original position by the given string.
     */
    addString(str, tabWidth, unicode) {
      // For this case,
      // - `switch` is faster than `if`
      // - comparing character codes is faster than strings
      let line = this.line;
      let column = this.column;
      const len = str.length;
      if (unicode) {
        for (const char of str) {
          switch (char.charCodeAt(0)) {
          case LF:
            line += 1;
            column = 1;
            break;
          case TAB:
            column += tabWidth - (column - 1) % tabWidth;
            break;
          default:
            column += 1;
          }
        }
      } else {
        for (let i = 0; i < len; i++) {
          switch (str.charCodeAt(i)) {
          case LF:
            line += 1;
            column = 1;
            break;
          case TAB:
            column += tabWidth - (column - 1) % tabWidth;
            break;
          default:
            column += 1;
          }
        }
      }
      return new SourcePos(this.name, this.index + len, line, column);
    }
  }

  return Object.freeze({
    SourcePos,
  });
};
