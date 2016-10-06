/*
 * loquat-char / char.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module char
 */

"use strict";

module.exports = _core => {
    function end() {
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
            manyChars1
        });
    }

    const show             = _core.show;
    const ErrorMessageType = _core.ErrorMessageType;
    const ErrorMessage     = _core.ErrorMessage;
    const ParseError       = _core.ParseError;
    const uncons           = _core.uncons;
    const State            = _core.State;
    const Result           = _core.Result;
    const Parser           = _core.Parser;

    const _prim = require("loquat-prim")(_core);
    const pure       = _prim.pure;
    const bind       = _prim.bind;
    const label      = _prim.label;
    const reduceMany = _prim.reduceMany;
    const skipMany   = _prim.skipMany;
    const tokenPrim  = _prim.tokenPrim;

    /**
     * @function module:char.string
     * @static
     * @param {string} str
     * @returns {AbstractParser}
     */
    function string(str) {
        function eofError(pos) {
            return new ParseError(
                pos,
                [
                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                    new ErrorMessage(ErrorMessageType.EXPECT, show(str))
                ]
            );
        }
        function expectError(pos, char) {
            return new ParseError(
                pos,
                [
                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(char)),
                    new ErrorMessage(ErrorMessageType.EXPECT, show(str))
                ]
            );
        }
        return new Parser(state => {
            let len = str.length;
            if (len === 0) {
                return Result.esuc(ParseError.unknown(state.pos), "", state);
            }
            let tabWidth     = state.config.tabWidth;
            let useCodePoint = state.config.useCodePoint;
            let rest = state.input;
            if (useCodePoint) {
                let consumed = false;
                for (let char of str) {
                    let unconsed = uncons(rest);
                    if (unconsed.empty) {
                        return !consumed
                            ? Result.eerr(eofError(state.pos))
                            : Result.cerr(eofError(state.pos));
                    }
                    else {
                        if (char === unconsed.head) {
                            rest     = unconsed.tail;
                            consumed = true;
                        }
                        else {
                            return !consumed
                                ? Result.eerr(expectError(state.pos, unconsed.head))
                                : Result.cerr(expectError(state.pos, unconsed.head));
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < len; i++) {
                    let unconsed = uncons(rest);
                    if (unconsed.empty) {
                        return i === 0
                            ? Result.eerr(eofError(state.pos))
                            : Result.cerr(eofError(state.pos));
                    }
                    else {
                        if (str[i] === unconsed.head) {
                            rest = unconsed.tail;
                        }
                        else {
                            return i === 0
                                ? Result.eerr(expectError(state.pos, unconsed.head))
                                : Result.cerr(expectError(state.pos, unconsed.head));
                        }
                    }
                }
            }
            let newPos = state.pos.addString(str, tabWidth, useCodePoint);
            return Result.csuc(
                ParseError.unknown(newPos),
                str,
                new State(state.config, rest, newPos, state.userState)
            );
        });
    }

    /**
     * @function module:char.satisfy
     * @static
     * @param {function} test
     * @returns {AbstractParser}
     */
    function satisfy(test) {
        return tokenPrim(
            (char, config) => test(char, config) ? { empty: false, value: char } : { empty: true },
            show,
            (pos, char, rest, config) => pos.addChar(char, config.tabWidth)
        );
    }

    /**
     * @function module:char.oneOf
     * @static
     * @param {string} str
     * @returns {AbstractParser}
     */
    function oneOf(str) {
        let cpChars = new Set(str);
        let chars   = new Set();
        for (let i = 0; i < str.length; i++) {
            chars.add(str[i]);
        }
        return satisfy((char, config) => config.useCodePoint ? cpChars.has(char) : chars.has(char));
    }

    /**
     * @function module:char.noneOf
     * @static
     * @param {string} str
     * @returns {AbstractParser}
     */
    function noneOf(str) {
        let cpChars = new Set(str);
        let chars   = new Set();
        for (let i = 0; i < str.length; i++) {
            chars.add(str[i]);
        }
        return satisfy((char, config) => config.useCodePoint ? !cpChars.has(char) : !chars.has(char));
    }

    /**
     * @function module:char.char
     * @static
     * @param {string} expectChar
     * @returns {AbstractParser}
     */
    function char(expectChar) {
        return label(satisfy(char => char === expectChar), show(expectChar));
    }

    /**
     * @constant module:char.anyChar
     * @static
     * @type {AbstractParser}
     */
    const anyChar = satisfy(() => true);

    const spaceChars    = new Set(" \f\n\r\t\v");
    const upperChars    = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    const lowerChars    = new Set("abcdefghijklmnopqrstuvwxyz");
    const letterChars   = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    const digitChars    = new Set("0123456789");
    const alphaNumChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    const octDigitChars = new Set("01234567");
    const hexDigitChars = new Set("0123456789ABCDEFabcdef");

    /**
     * @constant module:char.space
     * @static
     * @type {AbstractParser}
     */
    const space = label(satisfy(char => spaceChars.has(char)), "space");

    /**
     * @constant module:char.spaces
     * @static
     * @type {AbstractParser}
     */
    const spaces = label(skipMany(space), "white space");

    /**
     * @constant module:char.newline
     * @static
     * @type {AbstractParser}
     */
    const newline = label(char("\n"), "new-line");

    /**
     * @constant module:char.tab
     * @static
     * @type {AbstractParser}
     */
    const tab = label(char("\t"), "tab");

    /**
     * @constant module:char.upper
     * @static
     * @type {AbstractParser}
     */
    const upper = label(satisfy(char => upperChars.has(char)), "uppercase letter");

    /**
     * @constant module:char.lower
     * @static
     * @type {AbstractParser}
     */
    const lower = label(satisfy(char => lowerChars.has(char)), "lowercase letter");

    /**
     * @constant module:char.letter
     * @static
     * @type {AbstractParser}
     */
    const letter = label(satisfy(char => letterChars.has(char)), "letter");

    /**
     * @constant module:char.digit
     * @static
     * @type {AbstractParser}
     */
    const digit = label(satisfy(char => digitChars.has(char)), "digit");

    /**
     * @constant module:char.alphaNum
     * @static
     * @type {AbstractParser}
     */
    const alphaNum = label(satisfy(char => alphaNumChars.has(char)), "letter or digit");

    /**
     * @constant module:char.octDigit
     * @static
     * @type {AbstractParser}
     */
    const octDigit = label(satisfy(char => octDigitChars.has(char)), "octal digit");

    /**
     * @constant module:char.hexDigit
     * @static
     * @type {AbstractParser}
     */
    const hexDigit = label(satisfy(char => hexDigitChars.has(char)), "hexadecimal digit");

    /**
     * @function module:char.manyChars
     * @static
     * @param {AbstractParser} parser
     * @returns {AbstractParser}
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

    return end();
};
