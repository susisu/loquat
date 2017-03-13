/*
 * loquat-char / char.js
 */

/**
 * @module char
 */

"use strict";

module.exports = (_core, _prim) => {
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
            manyChars1,
            regexp
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

    const pure       = _prim.pure;
    const bind       = _prim.bind;
    const label      = _prim.label;
    const reduceMany = _prim.reduceMany;
    const skipMany   = _prim.skipMany;

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
            const len = str.length;
            if (len === 0) {
                return Result.esuc(ParseError.unknown(state.pos), "", state);
            }
            const tabWidth = state.config.tabWidth;
            const unicode  = state.config.unicode;
            let rest = state.input;
            if (unicode) {
                let consumed = false;
                for (const char of str) {
                    const unconsed = uncons(rest, unicode);
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
                    const unconsed = uncons(rest, unicode);
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
            const newPos = state.pos.addString(str, tabWidth, unicode);
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
        function systemUnexpectError(pos, str) {
            return new ParseError(
                pos,
                [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, str)]
            );
        }
        return new Parser(state => {
            const unconsed = uncons(state.input, state.config.unicode);
            if (unconsed.empty) {
                return Result.eerr(systemUnexpectError(state.pos, ""));
            }
            else {
                if (test(unconsed.head, state.config)) {
                    const newPos = state.pos.addChar(unconsed.head, state.config.tabWidth);
                    return Result.csuc(
                        ParseError.unknown(newPos),
                        unconsed.head,
                        new State(state.config, unconsed.tail, newPos, state.userState)
                    );
                }
                else {
                    return Result.eerr(systemUnexpectError(state.pos, show(unconsed.head)));
                }
            }
        });
    }

    /**
     * @function module:char.oneOf
     * @static
     * @param {string} str
     * @returns {AbstractParser}
     */
    function oneOf(str) {
        const cpChars = new Set(str);
        const chars   = new Set();
        for (let i = 0; i < str.length; i++) {
            chars.add(str[i]);
        }
        return satisfy((char, config) => config.unicode ? cpChars.has(char) : chars.has(char));
    }

    /**
     * @function module:char.noneOf
     * @static
     * @param {string} str
     * @returns {AbstractParser}
     */
    function noneOf(str) {
        const cpChars = new Set(str);
        const chars   = new Set();
        for (let i = 0; i < str.length; i++) {
            chars.add(str[i]);
        }
        return satisfy((char, config) => config.unicode ? !cpChars.has(char) : !chars.has(char));
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
        return new Parser(state => {
            if (typeof state.input !== "string") {
                throw new Error("`regexp' is only applicable to string input");
            }
            const match = anchored.exec(state.input);
            if (match) {
                const str = match[0];
                const val = match[groupId];
                if (str.length === 0) {
                    return Result.esuc(
                        ParseError.unknown(state.pos),
                        val,
                        state
                    );
                }
                else {
                    const newPos = state.pos.addString(str, state.config.tabWidth, state.config.unicode);
                    return Result.csuc(
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
            }
            else {
                return Result.eerr(
                    new ParseError(
                        state.pos,
                        [new ErrorMessage(ErrorMessageType.EXPECT, expectStr)]
                    )
                );
            }
        });
    }

    return end();
};
