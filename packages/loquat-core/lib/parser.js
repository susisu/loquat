/*
 * loquat / parser.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module parser
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        Config,
        State,
        Result,
        AbstractParser,
        Parser,
        LazyParser,
        lazy,
        parse,
        isParser,
        assertParser,
        extendParser
    });
}

const { SourcePos } = require("./pos.js");
const { ParseError } = require("./error.js");

/**
 * The `Config` class represents parser configuration.
 * @static
 */
class Config {
    /**
     * Creates a new `Config` instance.
     * @param {Object} [opts = {}] An object containing configuration options.
     * Available configurations are listed below:
     * <table>
     * <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
     * <tr><td>tabWidth</td><td>number</td><td>8</td><td>Positive integer specifying tab width.</td></tr>
     * <tr><td>useCodePoint</td><td>boolean</td><td>false</td><td>Specifies character counting strategy.
     * If `false` (default), characters in input are counted by the traditional method.
     * If `true`, characters are counted based on the UTF-16 code point.
     * (For instance, `"\uD83C\uDF63"` is counted 2 characters by the traditional method,
     * while it is counted 1 character based on the code point.)
     * You should set this flag to `true` when the language you want to parse allows surrogate pairs (like emojis)
     * to appear in input.</td></tr>
     * </table>
     */
    constructor(opts = {}) {
        this.tabWidth     = opts.tabWidth === undefined ? 8 : opts.tabWidth;
        this.useCodePoint = opts.useCodePoint === undefined ? false : opts.useCodePoint;
    }

    /** @member {number} module:parser.Config#tabWidth */
    /** @member {boolean} module:parser.Config#useCodePoint */

    /**
     * Checks if two configs are equal.
     * @param {module:parser.Config} configA
     * @param {module:parser.Config} configB
     * @returns {boolean}
     */
    static equal(configA, configB) {
        return configA.tabWidth === configB.tabWidth
            && configA.useCodePoint === configB.useCodePoint;
    }
}

/**
 * An instance of the `State` class describes state at some point in parsing.
 * @static
 */
class State {
    /**
     * Creates a new `State` instance.
     * @param {module:parser.Config} config Configuration of current parsing.
     * @param {(string|Array|module:stream.IStream)} input Current input.
     * @param {module:pos.SourcePos} pos Current position.
     * @param {*} [userState = undefined] Additional user-defined state for advanced use.
     */
    constructor(config, input, pos, userState = undefined) {
        this.config    = config;
        this.input     = input;
        this.pos       = pos;
        this.userState = userState;
    }

    /** @member {module:parser.Config} module:parser.State#config */
    /** @member {(string|Array|module:stream.IStream)} module:parser.State#input */
    /** @member {module:pos.SourcePos} module:parser.State#pos */
    /** @member {*} module:parser.State#userState */

    /**
     * Checks if two states are equal.
     * @param {module:parser.State} stateA
     * @param {module:parser.State} stateB
     * @param {(function|undefined)} [inputEqual = undefined]
     * @param {(function|undefined)} [userStateEqual = undefined]
     * @returns {boolean}
     */
    static equal(stateA, stateB, inputEqual = undefined, userStateEqual = undefined) {
        return Config.equal(stateA.config, stateB.config)
            && (inputEqual === undefined
                ? stateA.input === stateB.input
                : inputEqual(stateA.input, stateB.input))
            && SourcePos.equal(stateA.pos, stateB.pos)
            && (userStateEqual === undefined
                ? stateA.userState === stateB.userState
                : userStateEqual(stateA.userState, stateB.userState));
    }

    /**
     * @param {module:parser.Config} config
     * @returns {module:parser.State}
     */
    setConfig(config) {
        return new State(config, this.input, this.pos, this.userState);
    }

    /**
     * @param {(string|Array|module:stream.IStream)} input
     * @returns {module:parser.State}
     */
    setInput(input) {
        return new State(this.config, input, this.pos, this.userState);
    }

    /**
     * @param {module:pos.SourcePos} pos
     * @returns {module:parser.State}
     */
    setPosition(pos) {
        return new State(this.config, this.input, pos, this.userState);
    }

    /**
     * @param {*} userState
     * @returns {module:parser.State}
     */
    setUserState(userState) {
        return new State(this.config, this.input, this.pos, userState);
    }
}

/**
 * The `Result` class represents a result of parsing.
 * @static
 */
class Result {
    /**
     * Creates a new `Result` instance.
     * @param {boolean} consumed Indicates the parser consumed input or not.
     * @param {boolean} succeeded Indicates the parser was succeeded or not.
     * If `true`, `val` and `state` must be specified.
     * @param {module:error.AbstractParseError} err Parse error object.
     * @param {*} [val = undefined] Obtained value.
     * @param {(module:parser.State|undefined)} [state = undefined] Next state.
     */
    constructor(consumed, succeeded, err, val = undefined, state = undefined) {
        this.consumed  = consumed;
        this.succeeded = succeeded;
        this.err       = err;
        this.val       = val;
        this.state     = state;
    }

    /** @member {boolean} module:parser.Result#consumed */
    /** @member {boolean} module:parser.Result#succeeded */
    /** @member {module:error.AbstractParseError} module:parser.Result#err */
    /** @member {*} module:parser.Result#val */
    /** @member {module:parser.State} module:parser.Result#state */

    /**
     * Checks if two results are equal.
     * The properties `val` and `state` are compared only when both results are succeeded.
     * @param {module:parser.Result} resA
     * @param {module:parser.Result} resB
     * @param {(function|undefined)} valEqual
     * @param {(function|undefined)} inputEqual
     * @param {(function|undefined)} userStateEqual
     * @returns {boolean}
     */
    static equal(resA, resB, valEqual = undefined, inputEqual = undefined, userStateEqual = undefined) {
        if (resA.succeeded && resB.succeeded) {
            return resA.consumed === resB.consumed
                && (valEqual === undefined
                    ? resA.val === resB.val
                    : valEqual(resA.val, resB.val))
                && State.equal(resA.state, resB.state, inputEqual, userStateEqual)
                && ParseError.equal(resA.err, resB.err);
        }
        else {
            return resA.succeeded === resB.succeeded
                && resA.consumed === resB.consumed
                && ParseError.equal(resA.err, resB.err);
        }
    }

    /**
     * Returns consumed and succeeded result object.
     * @param {module:error.AbstractParseError} err
     * @param {*} val
     * @param {module:parser.State} state
     * @returns {module:parser.Result}
     */
    static csuc(err, val, state) {
        return new Result(true, true, err, val, state);
    }

    /**
     * Returns consumed but error result object.
     * @param {module:error.AbstractParseError} err
     * @returns {module:parser.Result}
     */
    static cerr(err) {
        return new Result(true, false, err);
    }

    /**
     * Returns not consumed and succeeded result object.
     * @param {module:error.AbstractParseError} err
     * @param {*} val
     * @param {module:parser.State} state
     * @returns {module:parser.Result}
     */
    static esuc(err, val, state) {
        return new Result(false, true, err, val, state);
    }

    /**
     * Returns not consumed but error result object.
     * @param {module:error.AbstractParseError} err
     * @returns {module:parser.Result}
     */
    static eerr(err) {
        return new Result(false, false, err);
    }
}

/**
 * The `AbstractParser` class is inherited by the concrete parser classes,
 * and is used for extending all the parser classes.
 * This class is abstract and you cannot create `AbstractParser` instance directly.
 * @static
 */
class AbstractParser {
    /**
     * You cannot create `AbstractParser` instance directly.
     * @throws {Error}
     */
    constructor() {
        if (this.constructor === AbstractParser) {
            throw new Error("cannot create AbstractParser object");
        }
    }

    /**
     * Not implemented.
     * @returns {module:parser.Result}
     * @throws {Error}
     */
    run() {
        throw new Error("not implemented");
    }
}

/**
 * The `Parser` class is just a wrapper of parser function.
 * @static
 * @extends {module:parser.AbstractParser}
 */
class Parser extends AbstractParser {
    /**
     * Creates a new `Parser` object.
     * @param {function} func Parser function, which must take a {@link module:parser.State} object as its argument
     * and return a {@link module:parser.Result} object.
     */
    constructor(func) {
        super();
        this._func = func;
    }

    /**
     * @param {module:parser.State} state
     * @returns {module:parser.Result}
     */
    run(state) {
        return this._func.call(undefined, state);
    }
}

/**
 * The `LazyParser` class is a lazy version of the {@link:module.Parser} class.
 * @static
 * @extends {module:parser.AbstractParser}
 */
class LazyParser extends AbstractParser {
    /**
     * Creates a new `LazyParser` object.
     * @param {function} thunk A function, which must return an {@link module:parser.AbstractParser} object.
     */
    constructor(thunk) {
        super();
        this._thunk = thunk;
        this._cache = undefined;
    }

    /**
     * Evaluates the thunk.
     * @returns {module:parser.Parser}
     * @throws {TypeError} Invalid thunk (not a function) found while evaluation.
     * @throws {TypeError} The final evaluation result is not a {@link module:error.ParseError} object.
     */
    eval() {
        if (this._cache) {
            return this._cache;
        }
        let lazyParsers = [];
        let parser = this;
        while (parser instanceof LazyParser) {
            if (parser._cache) {
                parser = parser._cache;
            }
            else {
                lazyParsers.push(parser);
                if (typeof parser._thunk !== "function") {
                    throw new TypeError("thunk is not a function");
                }
                parser = parser._thunk.call(undefined);
            }
        }
        if (!(parser instanceof Parser)) {
            throw new TypeError("evaluation result is not a Parser object");
        }
        for (let lazyParser of lazyParsers) {
            lazyParser._cache = parser;
        }
        return parser;
    }

    /**
     * @param {module:parser.State} state
     * @returns {module:parser.Result}
     */
    run(state) {
        return this.eval().run(state);
    }
}

/**
 * Shorthand for `new LazyParser()`.
 * @param {function} thunk
 * @returns {module:parser.LazyParser}
 */
function lazy(thunk) {
    return new LazyParser(thunk);
}

/**
 * @param {module:parser.AbstractParser} parser
 * @param {string} name
 * @param {(string | Array | module:stream.IStream)} input
 * @param {*} [userState = undefined]
 * @param {Object} [opts = {}]
 * @returns {Object}
 */
function parse(parser, name, input, userState = undefined, opts = {}) {
    let state = new State(new Config(opts), input, SourcePos.init(name), userState);
    let res   = parser.run(state);
    return res.succeeded
        ? { succeeded: true, value: res.val }
        : { succeeded: false, error: res.err };
}

/**
 * @param {*} val
 * @return {boolean}
 */
function isParser(val) {
    return val instanceof AbstractParser;
}

/**
 * @param {*} val
 * @return {undefined}
 * @throws {Error} Not a parser.
 */
function assertParser(val) {
    if (!isParser(val)) {
        throw new Error("not a parser");
    }
}

/**
 * @param {Object} extensions
 * @returns {undefined}
 */
function extendParser(extensions) {
    let descs = {};
    for (let key of Object.keys(extensions)) {
        descs[key] = {
            value       : extensions[key],
            writable    : true,
            configurable: true,
            enumerable  : false
        };
    }
    Object.defineProperties(AbstractParser.prototype, descs);
}

end();
