"use strict";

module.exports = () => {
  /**
   * type LanguageDefObject[S, U] = {
   *   val commentStart?: string
   *   val commentEnd?: string
   *   val commentLine?: string
   *   val nestedComments?: boolean
   *   val idStart?: Parser[S, U, char]
   *   val idLetter?: Parser[S, U, char]
   *   val opStart?: Parser[S, U, char]
   *   val opLetter?: Parser[S, U, char]
   *   val reservedIds?: Array[string]
   *   val reservedOps?: Array[string]
   *   val caseSensitive?: boolean
   * }
   */

  /**
   * class LanguageDef[S, U](obj?: LanguageDefObject[S, U]) {
   *   val commentStart: string \/ undefined
   *   val commentEnd: string \/ undefined
   *   val commentLine: string \/ undefined
   *   val nestedComments: boolean
   *   val idStart: Parser[S, U, char] \/ undefined
   *   val idLetter: Parser[S, U, char] \/ undefined
   *   val opStart: Parser[S, U, char] \/ undefined
   *   val opLetter: Parser[S, U, char] \/ undefined
   *   val reservedIds: Array[string] \/ undefined
   *   val reservedOps: Array[string] \/ undefined
   *   val caseSensitive: boolean
   *   def clone(): LanguageDef[S, U]
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
