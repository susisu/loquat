"use strict";

module.exports = (_core, { _prim }) => {
  const {
    show,
    ErrorMessageType,
    ErrorMessage,
    ParseError,
    StrictParseError,
    State,
    Result,
    StrictParser,
    uncons,
  } = _core;

  const { pure, bind, label, reduceMany, skipMany } = _prim;

  /**
   * type char = string
   */

  /**
   * type CharacterStream[S] = Stream[S] /\ { type Token = char }
   */

  /**
   * string: [S <: CharacterStream[S], U](str: string) => Parser[S, U, string]
   */
  function string(str) {
    function eofError(pos) {
      return new StrictParseError(
        pos,
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
          ErrorMessage.create(ErrorMessageType.EXPECT, show(str)),
        ]
      );
    }
    function expectError(pos, char) {
      return new StrictParseError(
        pos,
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(char)),
          ErrorMessage.create(ErrorMessageType.EXPECT, show(str)),
        ]
      );
    }
    return new StrictParser(state => {
      const len = str.length;
      if (len === 0) {
        return Result.esucc(ParseError.unknown(state.pos), "", state);
      }
      const config = state.config;
      let rest = state.input;
      if (config.unicode) {
        let consumed = false;
        for (const char of str) {
          const unconsed = uncons(rest, config);
          if (unconsed.empty) {
            return !consumed
              ? Result.efail(eofError(state.pos))
              : Result.cfail(eofError(state.pos));
          } else {
            if (char === unconsed.head) {
              rest = unconsed.tail;
              consumed = true;
            } else {
              return !consumed
                ? Result.efail(expectError(state.pos, unconsed.head))
                : Result.cfail(expectError(state.pos, unconsed.head));
            }
          }
        }
      } else {
        for (let i = 0; i < len; i++) {
          const unconsed = uncons(rest, config);
          if (unconsed.empty) {
            return i === 0
              ? Result.efail(eofError(state.pos))
              : Result.cfail(eofError(state.pos));
          } else {
            if (str[i] === unconsed.head) {
              rest = unconsed.tail;
            } else {
              return i === 0
                ? Result.efail(expectError(state.pos, unconsed.head))
                : Result.cfail(expectError(state.pos, unconsed.head));
            }
          }
        }
      }
      const newPos = state.pos.addString(str, config.tabWidth, config.unicode);
      return Result.csucc(
        ParseError.unknown(newPos),
        str,
        new State(state.config, rest, newPos, state.userState)
      );
    });
  }

  /**
   * satisfy: [S <: CharacterStream[S], U](test: (char, config) => boolean) => Parser[S, U, char]
   */
  function satisfy(test) {
    function systemUnexpectError(pos, str) {
      return new StrictParseError(
        pos,
        [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, str)]
      );
    }
    return new StrictParser(state => {
      const unconsed = uncons(state.input, state.config);
      if (unconsed.empty) {
        return Result.efail(systemUnexpectError(state.pos, ""));
      } else {
        if (test(unconsed.head, state.config)) {
          const newPos = state.pos.addChar(unconsed.head, state.config.tabWidth);
          return Result.csucc(
            ParseError.unknown(newPos),
            unconsed.head,
            new State(state.config, unconsed.tail, newPos, state.userState)
          );
        } else {
          return Result.efail(systemUnexpectError(state.pos, show(unconsed.head)));
        }
      }
    });
  }

  /**
   * oneOf: [S <: CharacterStream[S], U](str: string) => Parser[S, U, char]
   */
  function oneOf(str) {
    const codePoints = new Set(str);
    const codeUnits = new Set();
    for (let i = 0; i < str.length; i++) {
      codeUnits.add(str[i]);
    }
    return satisfy((char, config) => config.unicode ? codePoints.has(char) : codeUnits.has(char));
  }

  /**
   * noneOf: [S <: CharacterStream[S], U](str: string) => Parser[S, U, char]
   */
  function noneOf(str) {
    const codePoints = new Set(str);
    const codeUnits = new Set();
    for (let i = 0; i < str.length; i++) {
      codeUnits.add(str[i]);
    }
    return satisfy((char, config) => config.unicode ? !codePoints.has(char) : !codeUnits.has(char));
  }

  /**
   * char: [S <: CharacterStream[S], U](expectChar: char) => Parser[S, U, char]
   */
  function char(expectChar) {
    return label(satisfy((char, config) => char === expectChar), show(expectChar));
  }

  /**
   * anyChar: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const anyChar = satisfy((char, config) => true);

  const spaceChars    = new Set(" \f\n\r\t\v");
  const upperChars    = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  const lowerChars    = new Set("abcdefghijklmnopqrstuvwxyz");
  const letterChars   = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  const digitChars    = new Set("0123456789");
  const alphaNumChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  const octDigitChars = new Set("01234567");
  const hexDigitChars = new Set("0123456789ABCDEFabcdef");

  /**
   * space: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const space = label(satisfy((char, config) => spaceChars.has(char)), "space");

  /**
   * spaces: [S <: CharacterStream[S], U]Parser[S, U, undefined]
   */
  const spaces = label(skipMany(space), "white space");

  /**
   * newline: [S <: CharacterStream[S], U]Parser[S, U, "\n"]
   */
  const newline = label(char("\n"), "new-line");

  /**
   * tab: [S <: CharacterStream[S], U]Parser[S, U, "\t"]
   */
  const tab = label(char("\t"), "tab");

  /**
   * upper: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const upper = label(satisfy((char, config) => upperChars.has(char)), "uppercase letter");

  /**
   * lower: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const lower = label(satisfy((char, config) => lowerChars.has(char)), "lowercase letter");

  /**
   * letter: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const letter = label(satisfy((char, config) => letterChars.has(char)), "letter");

  /**
   * digit: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const digit = label(satisfy((char, config) => digitChars.has(char)), "digit");

  /**
   * alphaNum: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const alphaNum = label(satisfy((char, config) => alphaNumChars.has(char)), "letter or digit");

  /**
   * octDigit: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const octDigit = label(satisfy((char, config) => octDigitChars.has(char)), "octal digit");

  /**
   * hexDigit: [S <: CharacterStream[S], U]Parser[S, U, char]
   */
  const hexDigit = label(satisfy((char, config) => hexDigitChars.has(char)), "hexadecimal digit");

  /**
   * manyChars: [S, U](parser: Parser[S, U, char]) => Parser[S, U, string]
   */
  function manyChars(parser) {
    return reduceMany(parser, (accum, char) => accum + char, "");
  }

  /**
     * @function module:char.manyChars1
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
     */
  function manyChars1(parser) {
    return bind(parser, head => bind(manyChars(parser), tail => pure(head + tail)));
  }

  /**
     * @function module:char.regexp
     * @static
     * @param {RegExp} re
     * @param {number} [groupId = 0]
     * @returns {AbstractParser}
     */
  function regexp(re, groupId) {
    if (groupId === undefined) {
      groupId = 0;
    }
    const flags = (re.ignoreCase ? "i" : "")
            + (re.multiline ? "m" : "")
            + (re.unicode ? "u" : "");
    const anchored = new RegExp(`^(?:${re.source})`, flags);
    const expectStr = show(re);
    return new StrictParser(state => {
      if (typeof state.input !== "string") {
        throw new Error("`regexp' is only applicable to string input");
      }
      const match = anchored.exec(state.input);
      if (match) {
        const str = match[0];
        const val = match[groupId];
        if (str.length === 0) {
          return Result.esucc(
            ParseError.unknown(state.pos),
            val,
            state
          );
        } else {
          const newPos = state.pos.addString(str, state.config.tabWidth, state.config.unicode);
          return Result.csucc(
            ParseError.unknown(newPos),
            val,
            new State(
              state.config,
              state.input.substr(str.length),
              newPos,
              state.userState
            )
          );
        }
      } else {
        return Result.efail(
          new StrictParseError(
            state.pos,
            [ErrorMessage.create(ErrorMessageType.EXPECT, expectStr)]
          )
        );
      }
    });
  }

  return Object.freeze({
    string,
    satisfy,
    oneOf,
    noneOf,
    char,
    anyChar,
    space,
    spaces,
    newline,
    tab,
    upper,
    lower,
    letter,
    digit,
    alphaNum,
    octDigit,
    hexDigit,
    manyChars,
    manyChars1,
    regexp,
  });
};
