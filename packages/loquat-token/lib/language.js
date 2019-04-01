"use strict";

module.exports = () => {
  /**
   * type LanguageDefObject[S, U] = {
   *   commentStart?: string,
   *   commentEnd?: string,
   *   commentLine?: string,
   *   nestedComments?: boolean,
   *   idStart?: Parser[S, U, char],
   *   idLetter?: Parser[S, U, char],
   *   opStart?: Parser[S, U, char],
   *   opLetter?: Parser[S, U, char],
   *   reservedIds?: Array[string],
   *   reservedOps?: Array[string],
   *   caseSensitive?: boolean,
   * }
   */

  /**
   * class LanguageDef[S, U](obj?: LanguageDefObject[S, U]) {
   *   commentStart: string \/ undefined;
   *   commentEnd: string \/ undefined;
   *   commentLine: string \/ undefined;
   *   nestedComments: boolean;
   *   idStart: Parser[S, U, char] \/ undefined;
   *   idLetter: Parser[S, U, char] \/ undefined;
   *   opStart: Parser[S, U, char] \/ undefined;
   *   opLetter: Parser[S, U, char] \/ undefined;
   *   reservedIds: Array[string] \/ undefined;
   *   reservedOps: Array[string] \/ undefined;
   *   caseSensitive: boolean;
   *   clone(): LanguageDef[S, U];
   * }
   */
  class LanguageDef {
    constructor(obj = {}) {
      this.commentStart   = obj.commentStart;
      this.commentEnd     = obj.commentEnd;
      this.commentLine    = obj.commentLine;
      this.nestedComments = obj.nestedComments === undefined ? true : obj.nestedComments;
      this.idStart        = obj.idStart;
      this.idLetter       = obj.idLetter;
      this.opStart        = obj.opStart;
      this.opLetter       = obj.opLetter;
      this.reservedIds    = obj.reservedIds;
      this.reservedOps    = obj.reservedOps;
      this.caseSensitive  = obj.caseSensitive === undefined ? true : obj.caseSensitive;
    }

    clone() {
      return new LanguageDef({
        commentStart  : this.commentStart,
        commentEnd    : this.commentEnd,
        commentLine   : this.commentLine,
        nestedComments: this.nestedComments,
        idStart       : this.idStart,
        idLetter      : this.idLetter,
        opStart       : this.opStart,
        opLetter      : this.opLetter,
        reservedIds   : this.reservedIds,
        reservedOps   : this.reservedOps,
        caseSensitive : this.caseSensitive,
      });
    }
  }

  return Object.freeze({
    LanguageDef,
  });
};
