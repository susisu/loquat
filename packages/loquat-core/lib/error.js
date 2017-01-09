/*
 * loquat-core / error.js
 */

/**
 * @module error
 */

"use strict";

module.exports = _pos => {
    function end() {
        return Object.freeze({
            ErrorMessageType,
            ErrorMessage,
            AbstractParseError,
            ParseError,
            LazyParseError,
            _internal: {
                cleanMessageStrings,
                joinWithCommasOr,
                joinMessageStrings
            }
        });
    }

    const SourcePos = _pos.SourcePos;

    /**
     * @constant {Object} module:error.ErrorMessageType
     * @description The `ErrorMessageType` object has string constants, each describes a type of error message:
     * - `ErrorMessageType.SYSTEM_UNEXPECT = "systemUnexpect"`
     * - `ErrorMessageType.UNEXPECT = "unexpect"`
     * - `ErrorMessageType.EXPECT = "expect"`
     * - `ErrorMessageType.MESSAGE = "mesage"`
     * @static
     */
    const ErrorMessageType = Object.freeze({
        SYSTEM_UNEXPECT: "systemUnexpect",
        UNEXPECT       : "unexpect",
        EXPECT         : "expect",
        MESSAGE        : "message"
    });

    /**
     * An instance of the `ErrorMessage` class represents a specific type error message.
     * @static
     */
    class ErrorMessage {
        /**
         * Creates a new `ErrorMessage` instance.
         * @param {string} type One of the constant of `ErrorMessageType`.
         * @param {string} msgStr Message string.
         */
        constructor(type, msgStr) {
            this._type   = type;
            this._msgStr = msgStr;
        }

        /**
         * Checks if two messages are the same.
         * @param {module:error.ErrorMessage} msgA An {@link module:error.ErrorMessage} object.
         * @param {module:error.ErrorMessage} msgB An {@link module:error.ErrorMessage} object.
         * @returns {boolean} `true` if two messages are the same.
         */
        static equal(msgA, msgB) {
            return msgA.type === msgB.type
                && msgA.msgStr === msgB.msgStr;
        }

        /**
         * Returns pretty-printed string of the error messages.
         * @param {Array.<ErrorMessage>} msgs An array of {@link module:error.ErrorMessage} objects.
         * @returns {string} Printed string.
         * @throws {Error} A message has unknown type.
         */
        static messagesToString(msgs) {
            if (msgs.length === 0) {
                return "unknown parse error";
            }
            const systemUnexpects = [];
            const unexpects       = [];
            const expects         = [];
            const defaultMessages = [];
            for (const msg of msgs) {
                switch (msg.type) {
                case ErrorMessageType.SYSTEM_UNEXPECT:
                    systemUnexpects.push(msg.msgStr);
                    break;
                case ErrorMessageType.UNEXPECT:
                    unexpects.push(msg.msgStr);
                    break;
                case ErrorMessageType.EXPECT:
                    expects.push(msg.msgStr);
                    break;
                case ErrorMessageType.MESSAGE:
                    defaultMessages.push(msg.msgStr);
                    break;
                default:
                    throw new Error("unknown message type: " + msg.type);
                }
            }
            const msgStrs = [
                unexpects.length === 0 && systemUnexpects.length !== 0
                    ? systemUnexpects[0] === ""
                        ? "unexpected end of input"
                        : "unexpected " + systemUnexpects[0]
                    : "",
                joinMessageStrings(cleanMessageStrings(unexpects), "unexpected"),
                joinMessageStrings(cleanMessageStrings(expects), "expecting"),
                joinMessageStrings(cleanMessageStrings(defaultMessages))
            ];
            return cleanMessageStrings(msgStrs).join("\n");
        }

        /**
         * Checks if two arrays describe the same error messages.
         * @param {Array.<module:error.ErrorMessage>} msgsA An array of {@link module:error.ErrorMessage} objects.
         * @param {Array.<module:error.ErrorMessage>} msgsB An array of {@link module:error.ErrorMessage} objects.
         * @returns {boolean} `true` if two arrays describe the same error messages with the same order.
         */
        static messagesEqual(msgsA, msgsB) {
            if (msgsA.length !== msgsB.length) {
                return false;
            }
            const len = msgsA.length;
            for (let i = 0; i < len; i++) {
                if (!ErrorMessage.equal(msgsA[i], msgsB[i])) {
                    return false;
                }
            }
            return true;
        }

        /**
         * @readonly
         * @type {string}
         */
        get type() {
            return this._type;
        }

        /**
         * @readonly
         * @type {string}
         */
        get msgStr() {
            return this._msgStr;
        }
    }

    /**
     * @function module:error.cleanMessageStrings
     * @description Cleans array of message strings by removing empty and duplicate elements.
     * @private
     * @static
     * @param {Array.<string>} msgStrs An array of message strings.
     * @returns {Array.<strings>} Cleaned array.
     */
    function cleanMessageStrings(msgStrs) {
        return msgStrs.filter((msgStr, i) => msgStr !== "" && msgStrs.indexOf(msgStr) === i);
    }

    /**
     * @function module:error.joinWithCommasOr
     * @description Joins strings with commas (,) and "or".
     * @private
     * @static
     * @param {Array.<string>} msgStrs An array of message strings.
     * @returns {string} Joined string.
     */
    function joinWithCommasOr(msgStrs) {
        return msgStrs.length <= 2
            ? msgStrs.join(" or ")
            : msgStrs.slice(0, msgStrs.length - 1).join(", ") + " or " + msgStrs[msgStrs.length - 1];
    }

    /**
     * @function module:error.joinMessageStrings
     * @description Joins message strings with the specified description.
     * @private
     * @static
     * @param {Array.<string>} msgStrs An array of message strings.
     * @param {string} [desc = ""] Short description of the messages.
     * @returns {string} Joined messages.
     */
    function joinMessageStrings(msgStrs, desc) {
        if (typeof desc === "undefined") {
            desc = "";
        }
        return msgStrs.length === 0
            ? ""
            : (desc === "" ? "" : desc + " ") + joinWithCommasOr(msgStrs);
    }

    /**
     * The `AbstractParseError` class is inherited by the concrete parse error classes.
     * This class is abstract and you cannot create `AbstractParseError` instance directly.
     * @static
     */
    class AbstractParseError {
        /**
         * You cannot create `AbstractParseError` instance directly.
         * @throws {Error}
         */
        constructor() {
            if (this.constructor === AbstractParseError) {
                throw new Error("cannot create AbstractParseError object");
            }
        }

        /**
         * Not implemented.
         * @readonly
         * @type {module:pos.SourcePos}
         * @throws {Error}
         */
        get pos() {
            throw new Error("not implemented");
        }

        /**
         * Not implemented.
         * @readonly
         * @type {Array.<module:error.ErrorMessage>}
         * @throws {Error}
         */
        get msgs() {
            throw new Error("not implemented");
        }

        /**
         * Not implemented.
         * @returns {string}
         * @throws {Error}
         */
        toString() {
            throw new Error("not implemented");
        }

        /**
         * Not implemented.
         * @returns {boolean}
         * @throws {Error}
         */
        isUnknown() {
            throw new Error("not implemented");
        }

        /**
         * Not implemented.
         * @param {module:pos.SourcePos} pos
         * @returns {module:error.AbstractParseError}
         * @throws {Error}
         */
        setPosition() {
            throw new Error("not implemented");
        }

        /**
         * Not implemented.
         * @param {Array.<module:error.ErrorMessage>} msgs
         * @returns {module:error.AbstractParseError}
         * @throws {Error}
         */
        setMessages() {
            throw new Error("not implemented");
        }

        /**
         * Not implemented.
         * @param {Array.<module:error.ErrorMessage>} msgs
         * @returns {module:error.AbstractParseError}
         * @throws {Error}
         */
        addMessages() {
            throw new Error("not implemented");
        }

        /**
         * Not implemented.
         * @param {string} type
         * @param {Array.<string>} msgStrs
         * @returns {module:error.AbstractParseError}
         * @throws {Error}
         */
        setSpecificTypeMessages() {
            throw new Error("not implemented");
        }
    }

    /**
     * @static
     * @extends {module:error.AbstractParseError}
     */
    class ParseError extends AbstractParseError {
        /**
         * Creates a new `ParseError` instance.
         * @param {module:pos.SourcePos} pos
         * @param {Array.<module:error.ErrorMessage>} msgs
         */
        constructor(pos, msgs) {
            super();
            this._pos  = pos;
            this._msgs = msgs;
        }

        /**
         * @param {module:pos.SourcePos} pos
         * @returns {module:error.ParseError}
         */
        static unknown(pos) {
            return new ParseError(pos, []);
        }

        /**
         * @param {module:error.AbstractParseError} errA
         * @param {module:error.AbstractParseError} errB
         * @returns {boolean}
         */
        static equal(errA, errB) {
            return SourcePos.equal(errA.pos, errB.pos)
                && ErrorMessage.messagesEqual(errA.msgs, errB.msgs);
        }

        /**
         * @param {module:error.AbstractParseError} errA
         * @param {module:error.AbstractParseError} errB
         * @returns {module:error.AbstractParseError}
         */
        static merge(errA, errB) {
            return new LazyParseError(() => {
                const cmp = SourcePos.compare(errA.pos, errB.pos);
                return errB.isUnknown() && !errA.isUnknown() ? errA
                     : errA.isUnknown() && !errB.isUnknown() ? errB
                     : cmp > 0                               ? errA
                     : cmp < 0                               ? errB
                                                             : errA.addMessages(errB.msgs);
            });
        }

        /**
         * @readonly
         * @type {module:pos.SourcePos}
         */
        get pos() {
            return this._pos;
        }

        /**
         * @readonly
         * @type {Array.<module:error.ErrorMessage>}
         */
        get msgs() {
            return this._msgs;
        }

        /**
         * @returns {string}
         */
        toString() {
            return `${this.pos}:\n${ErrorMessage.messagesToString(this.msgs)}`;
        }

        /**
         * @returns {boolean}
         */
        isUnknown() {
            return this.msgs.length === 0;
        }

        /**
         * @param {module:pos.SourcePos} pos
         * @returns {module:error.AbstractParseError}
         */
        setPosition(pos) {
            return new ParseError(pos, this.msgs);
        }

        /**
         * @param {Array.<module:error.ErrorMessage>} msgs
         * @returns {module:error.AbstractParseError}
         */
        setMessages(msgs) {
            return new ParseError(this.pos, msgs);
        }

        /**
         * @param {Array.<module:error.ErrorMessage>} msgs
         * @returns {module:error.AbstractParseError}
         */
        addMessages(msgs) {
            return new LazyParseError(() => new ParseError(this.pos, this.msgs.concat(msgs)));
        }

        /**
         * @param {string} type
         * @param {Array.<string>} msgStrs
         * @returns {module:error.AbstractParseError}
         */
        setSpecificTypeMessages(type, msgStrs) {
            return new LazyParseError(() => new ParseError(
                this.pos,
                this.msgs.filter(msg => msg.type !== type)
                    .concat(msgStrs.map(msgStr => new ErrorMessage(type, msgStr)))
            ));
        }
    }

    /**
     * @static
     * @extends {module:error.AbstractParseError}
     */
    class LazyParseError extends AbstractParseError {
        /**
         * Creates a new `LazyParseError` instance.
         * @param {function} thunk A function that returns an {@link module:error.AbstractParseError} object.
         */
        constructor(thunk) {
            super();
            this._thunk = thunk;
            this._cache = undefined;
        }

        /**
         * @returns {module:error.ParseError}
         * @throws {TypeError} Invalid thunk (not a function) found while evaluation.
         * @throws {TypeError} The final evaluation result is not a {@link module:error.ParseError} object.
         */
        eval() {
            if (this._cache) {
                return this._cache;
            }
            const lazyErrs = [];
            let err = this;
            while (err instanceof LazyParseError) {
                if (err._cache) {
                    err = err._cache;
                }
                else {
                    lazyErrs.push(err);
                    if (typeof err._thunk !== "function") {
                        throw new TypeError("thunk is not a function");
                    }
                    err = err._thunk.call(undefined);
                }
            }
            if (!(err instanceof ParseError)) {
                throw new TypeError("evaluation result is not a ParseError obejct");
            }
            for (const lazyErr of lazyErrs) {
                lazyErr._cache = err;
            }
            return err;
        }

        /**
         * @readonly
         * @type {module:pos.SourcePos}
         */
        get pos() {
            return this.eval().pos;
        }

        /**
         * @readonly
         * @type {Array.<module:error.ErrorMessage>}
         */
        get msgs() {
            return this.eval().msgs;
        }

        /**
         * @returns {string}
         */
        toString() {
            return this.eval().toString();
        }

        /**
         * @returns {boolean}
         */
        isUnknown() {
            return this.eval().isUnknown();
        }

        /**
         * @param {module:pos.SourcePos} pos
         * @returns {module:error.AbstractParseError}
         */
        setPosition(pos) {
            return new LazyParseError(() => this.eval().setPosition(pos));
        }

        /**
         * @param {Array.<module:error.ErrorMessage>} msgs
         * @returns {module:error.AbstractParseError}
         */
        setMessages(msgs) {
            return new LazyParseError(() => this.eval().setMessages(msgs));
        }

        /**
         * @param {Array.<module:error.ErrorMessage>} msgs
         * @returns {module:error.AbstractParseError}
         */
        addMessages(msgs) {
            return new LazyParseError(() => this.eval().addMessages(msgs));
        }

        /**
         * @param {string} type
         * @param {Array.<string>} msgStrs
         * @returns {module:error.AbstractParseError}
         */
        setSpecificTypeMessages(type, msgStrs) {
            return new LazyParseError(() => this.eval().setSpecificTypeMessages(type, msgStrs));
        }
    }

    return end();
};
