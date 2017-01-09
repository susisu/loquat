/*
 * loquat-core / parser.js
 */

/**
 * @module parser
 */

"use strict";

module.exports = (_pos, _error) => {
    function end() {
        return Object.freeze({
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

    const SourcePos = _pos.SourcePos;

    const ParseError = _error.ParseError;

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
         * <tr><td>unicode</td><td>boolean</td><td>false</td><td>Enables unicode features.
         * If `true`, characters are treated as code points.
         * (For instance, `"\uD83C\uDF63"` is 2 characters (code units) in non-unicode mode,
         * while it is 1 character (code point) in unicode mode.)
         * </td></tr>
         * </table>
         */
        constructor(opts) {
            if (opts === undefined) {
                opts = {};
            }
            this._tabWidth     = opts.tabWidth === undefined ? 8 : opts.tabWidth;
            this._unicode = opts.unicode === undefined ? false : opts.unicode;
        }

        /**
         * Checks if two configs are equal.
         * @param {module:parser.Config} configA
         * @param {module:parser.Config} configB
         * @returns {boolean}
         */
        static equal(configA, configB) {
            return configA.tabWidth === configB.tabWidth
                && configA.unicode === configB.unicode;
        }

        /**
         * @readonly
         * @type {number}
         */
        get tabWidth() {
            return this._tabWidth;
        }

        /**
         * @readonly
         * @type {boolean}
         */
        get unicode() {
            return this._unicode;
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
        constructor(config, input, pos, userState) {
            this._config    = config;
            this._input     = input;
            this._pos       = pos;
            this._userState = userState;
        }

        /**
         * Checks if two states are equal.
         * @param {module:parser.State} stateA
         * @param {module:parser.State} stateB
         * @param {(function|undefined)} [inputEqual = undefined]
         * @param {(function|undefined)} [userStateEqual = undefined]
         * @returns {boolean}
         */
        static equal(stateA, stateB, inputEqual, userStateEqual) {
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
         * @readonly
         * @type {module:parser.Config}
         */
        get config() {
            return this._config;
        }

        /**
         * @readonly
         * @type {(string|Array|module:stream.IStream)}
         */
        get input() {
            return this._input;
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
         * @type {*}
         */
        get userState() {
            return this._userState;
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
         * @param {boolean} success Indicates parsing succeeded or not.
         * If `true`, `val` and `state` must be specified.
         * @param {module:error.AbstractParseError} err Parse error object.
         * @param {*} [val = undefined] Obtained value.
         * @param {(module:parser.State|undefined)} [state = undefined] Next state.
         */
        constructor(consumed, success, err, val, state) {
            this._consumed = consumed;
            this._success  = success;
            this._err      = err;
            this._val      = val;
            this._state    = state;
        }

        /**
         * Checks if two results are equal.
         * The properties `val` and `state` are compared only when both results are success.
         * @param {module:parser.Result} resA
         * @param {module:parser.Result} resB
         * @param {(function|undefined)} valEqual
         * @param {(function|undefined)} inputEqual
         * @param {(function|undefined)} userStateEqual
         * @returns {boolean}
         */
        static equal(resA, resB, valEqual, inputEqual, userStateEqual) {
            if (resA.success && resB.success) {
                return resA.consumed === resB.consumed
                    && (valEqual === undefined
                        ? resA.val === resB.val
                        : valEqual(resA.val, resB.val))
                    && State.equal(resA.state, resB.state, inputEqual, userStateEqual)
                    && ParseError.equal(resA.err, resB.err);
            }
            else {
                return resA.success === resB.success
                    && resA.consumed === resB.consumed
                    && ParseError.equal(resA.err, resB.err);
            }
        }

        /**
         * Returns a consumed success result object.
         * @param {module:error.AbstractParseError} err
         * @param {*} val
         * @param {module:parser.State} state
         * @returns {module:parser.Result}
         */
        static csuc(err, val, state) {
            return new Result(true, true, err, val, state);
        }

        /**
         * Returns a consumed failure result object.
         * @param {module:error.AbstractParseError} err
         * @returns {module:parser.Result}
         */
        static cerr(err) {
            return new Result(true, false, err);
        }

        /**
         * Returns an empty success result object.
         * @param {module:error.AbstractParseError} err
         * @param {*} val
         * @param {module:parser.State} state
         * @returns {module:parser.Result}
         */
        static esuc(err, val, state) {
            return new Result(false, true, err, val, state);
        }

        /**
         * Returns an empty failure result object.
         * @param {module:error.AbstractParseError} err
         * @returns {module:parser.Result}
         */
        static eerr(err) {
            return new Result(false, false, err);
        }

        /**
         * @readonly
         * @type {boolean}
         */
        get consumed() {
            return this._consumed;
        }

        /**
         * @readonly
         * @type {boolean}
         */
        get success() {
            return this._success;
        }

        /**
         * @readonly
         * @type {module:error.AbstractParseError}
         */
        get err() {
            return this._err;
        }

        /**
         * @readonly
         * @type {*}
         */
        get val() {
            return this._val;
        }

        /**
         * @readonly
         * @type {module:parser.State}
         */
        get state() {
            return this._state;
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

        /**
         * @param {string} name
         * @param {(string | Array | module:stream.IStream)} input
         * @param {*} [userState = undefined]
         * @param {Object} [opts = {}]
         * @returns {Object}
         */
        parse(name, input, userState, opts) {
            return parse(this, name, input, userState, opts);
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
            const lazyParsers = [];
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
            for (const lazyParser of lazyParsers) {
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
     * @function module:parser.lazy
     * @description Shorthand for `new LazyParser()`.
     * @static
     * @param {function} thunk
     * @returns {module:parser.LazyParser}
     */
    function lazy(thunk) {
        return new LazyParser(thunk);
    }

    /**
     * @function module:parser.parse
     * @static
     * @param {module:parser.AbstractParser} parser
     * @param {string} name
     * @param {(string | Array | module:stream.IStream)} input
     * @param {*} [userState = undefined]
     * @param {Object} [opts = {}]
     * @returns {Object}
     */
    function parse(parser, name, input, userState, opts) {
        if (opts === undefined) {
            opts = {};
        }
        const state = new State(new Config(opts), input, SourcePos.init(name), userState);
        const res   = parser.run(state);
        return res.success
            ? { success: true, value: res.val }
            : { success: false, error: res.err };
    }

    /**
     * @function module:parser.isParser
     * @static
     * @param {*} val
     * @return {boolean}
     */
    function isParser(val) {
        return val instanceof AbstractParser;
    }

    /**
     * @function module:parser.assertParser
     * @static
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
     * @function module:parser.extendParser
     * @static
     * @param {Object} extensions
     * @returns {undefined}
     */
    function extendParser(extensions) {
        const descs = {};
        for (const key of Object.keys(extensions)) {
            descs[key] = {
                value       : extensions[key],
                writable    : true,
                configurable: true,
                enumerable  : false
            };
        }
        Object.defineProperties(AbstractParser.prototype, descs);
    }

    return end();
};
