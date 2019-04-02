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
   * type LanguageDef[S, U] = {
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
   * }
   */

  /**
   * object LanguageDef {
   *   create: [S, U](obj?: LanguageDefObject[S, U]) => LanguageDef[S, U]
   * }
   */
  const LanguageDef = Object.freeze({
    create(obj = {}) {
      return {
        commentStart  : obj.commentStart,
        commentEnd    : obj.commentEnd,
        commentLine   : obj.commentLine,
        nestedComments: obj.nestedComments === undefined ? true : obj.nestedComments,
        idStart       : obj.idStart,
        idLetter      : obj.idLetter,
        opStart       : obj.opStart,
        opLetter      : obj.opLetter,
        reservedIds   : obj.reservedIds,
        reservedOps   : obj.reservedOps,
        caseSensitive : obj.caseSensitive === undefined ? true : obj.caseSensitive,
      };
    },
  });

  return Object.freeze({
    LanguageDef,
  });
};
