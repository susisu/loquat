/*
 * loquat / error.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module error
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        ErrorMessageType,
        ErrorMessage,
        ParseError,
        LazyParseError,
        _internal: {
            cleanMessageStrings,
            joinWithCommasOr,
            joinMessageStrings
        }
    });
}

const { SourcePos } = require("./pos.js");

/**
 * The `ErrorMessageType` object has string constants, each describes a type of error message:
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
     * @param {string} msgStr
     */
    constructor(type, msgStr) {
        this.type   = type;
        this.msgStr = msgStr;
    }

    /** @member {string} module:error.ErrorMessage#type */
    /** @member {string} module:error.ErrorMessage#msgStr */

    /**
     * Checks if two messages are the same.
     * @param {module:error.ErrorMessage} msgA
     * @param {module:error.ErrorMessage} msgB
     * @returns {boolean} `true` if two messages are the same.
     */
    static equal(msgA, msgB) {
        return msgA.type === msgB.type
            && msgA.msgStr === msgB.msgStr;
    }

    /**
     * @param {Array.<ErrorMessage>} msgs
     * @returns {string}
     * @throws {Error} A message has unknown type.
     */
    static messagesToString(msgs) {
        if (msgs.length === 0) {
            return "unknown parse error";
        }
        let systemUnexpects = [];
        let unexpects       = [];
        let expects         = [];
        let defaultMessages = [];
        for (let msg of msgs) {
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
        let msgStrs = [
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
     * @param {Array.<module:error.ErrorMessage>} msgsA
     * @param {Array.<module:error.ErrorMessage>} msgsB
     * @returns {boolean}
     */
    static messagesEqual(msgsA, msgsB) {
        if (msgsA.length !== msgsB.length) {
            return false;
        }
        let len = msgsA.length;
        for (let i = 0; i < len; i++) {
            if (!ErrorMessage.equal(msgsA[i], msgsB[i])) {
                return false;
            }
        }
        return true;
    }
}

/**
 * @private
 * @static
 * @param {Array.<string>} msgStrs
 * @returns {Array.<strings>}
 */
function cleanMessageStrings(msgStrs) {
    return msgStrs.filter((msgStr, i) => msgStr !== "" && msgStrs.indexOf(msgStr) === i);
}

/**
 * @private
 * @static
 * @param {Array.<string>} msgStrs
 * @returns {string}
 */
function joinWithCommasOr(msgStrs) {
    return msgStrs.length <= 2
        ? msgStrs.join(" or ")
        : msgStrs.slice(0, msgStrs.length - 1).join(", ") + " or " + msgStrs[msgStrs.length - 1];
}

/**
 * @private
 * @static
 * @param {Array.<string>} msgStrs
 * @param {string} [desc = ""]
 * @returns {string}
 */
function joinMessageStrings(msgStrs, desc = "") {
    return msgStrs.length === 0
        ? ""
        : (desc === "" ? "" : desc + " ") + joinWithCommasOr(msgStrs);
}

/**
 * @interface IParseError
 * @description The `IParseError` interface abstract parse error objects.
 * There are two parse error classes which implements this interface:
 * {@link module:error.ParseError} and {@link module:error.LazyParseError}.
 * @static
 */
/**
 * @member {module:pos.SourcePos} module:error.IParseError#pos
 * @description The position where the error occurred.
 */
/**
 * @member {Array.<module:error.ErrorMessage>} module:error.IParseError#msgs
 * @description Messages of the error.
 */
/**
 * @method module:error.IParseError#toString
 * @description Returns string representation of the error.
 * @returns {string}
 */
/**
 * @method module:error.IParseError#isUnknown
 * @description Checks wheter the error has no messages (unknown) or not.
 * @returns {boolean}
 */
/**
 * @method module:error.IParseError#setPosition
 * @description Creates a copy of the error with specified position
 * @param {module:pos.SourcePos} pos
 * @returns {module:error.IParseError}
 */
/**
 * @method module:error.IParseError#addMessages
 * @param {Array.<module:error.ErrorMessage>} msgs
 * @returns {module:error.IParseError}
 */
/**
 * @method module:error.IParseError#setSpecificTypeMessages
 * @param {string} type
 * @param {Array.<string>} msgStrs
 * @returns {module:error.IParseError}
 */

/**
 * @static
 * @implements {module:error.IParseError}
 */
class ParseError {
    /**
     * Creates a new `ParseError` instance.
     * @param {module:pos.SourcePos} pos
     * @param {Array.<module:error.ErrorMessage>} msgs
     */
    constructor(pos, msgs) {
        this.pos  = pos;
        this.msgs = msgs;
    }

    /** @member {module:pos.SourcePos} module:error.ParseError#pos */
    /** @member {Array.<module:error.ErrorMessage>} module:error.ParseError#msgs */

    /**
     * @param {module:pos.SourcePos} pos
     * @returns {module:error.ParseError}
     */
    static unknown(pos) {
        return new ParseError(pos, []);
    }

    /**
     * @param {module:error.IParseError} errA
     * @param {module:error.IParseError} errB
     * @returns {boolean}
     */
    static equal(errA, errB) {
        return SourcePos.equal(errA.pos, errB.pos)
            && ErrorMessage.messagesEqual(errA.msgs, errB.msgs);
    }

    /**
     * @param {module:error.IParseError} errA
     * @param {module:error.IParseError} errB
     * @returns {module:error.IParseError}
     */
    static merge(errA, errB) {
        return new LazyParseError(() => {
            let cmp = SourcePos.compare(errA.pos, errB.pos);
            return errB.isUnknown() && !errA.isUnknown() ? errA
                 : errA.isUnknown() && !errB.isUnknown() ? errB
                 : cmp > 0                               ? errA
                 : cmp < 0                               ? errB
                                                         : errA.addMessages(errB.msgs);
        });
    }

    toString() {
        return `${this.pos}:\n${ErrorMessage.messagesToString(this.msgs)}`;
    }

    isUnknown() {
        return this.msgs.length === 0;
    }

    setPosition(pos) {
        return new ParseError(pos, this.msgs);
    }

    addMessages(msgs) {
        return new LazyParseError(() => new ParseError(this.pos, this.msgs.concat(msgs)));
    }

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
 * @implements {module:error.IParseError}
 */
class LazyParseError {
    /**
     * Creates a new `LazyParseError` instance.
     * @param {function} thunk A function that returns a {@link module:error.ParseError}
     * or {@link module:error.LazyParseError} object.
     */
    constructor(thunk) {
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
        let lazyErrs = [];
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
        for (let lazyErr of lazyErrs) {
            lazyErr._cache = err;
        }
        return err;
    }

    get pos() {
        return this.eval().pos;
    }

    get msgs() {
        return this.eval().msgs;
    }

    toString() {
        return this.eval().toString();
    }

    isUnknown() {
        return this.eval().isUnknown();
    }

    setPosition(pos) {
        return new LazyParseError(() => this.eval().setPosition(pos));
    }

    addMessages(msgs) {
        return new LazyParseError(() => this.eval().addMessages(msgs));
    }

    setSpecificTypeMessages(type, msgStrs) {
        return new LazyParseError(() => this.eval().setSpecificTypeMessages(type, msgStrs));
    }
}

end();
