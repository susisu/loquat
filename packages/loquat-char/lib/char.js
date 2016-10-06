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
            string
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

    return end();
};
