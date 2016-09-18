/*
 * loquat-core / prim.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module prim
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        Config,
        State,
        Result
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

    /** @member {number} module:prim.Config#tabWidth */
    /** @member {boolean} module:prim.Config#useCodePoint */

    /**
     * Checks if two configs are equal.
     * @param {module:prim.Config} configA
     * @param {module:prim.Config} configB
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
     * @param {module:prim.Config} config Configuration of current parsing.
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

    /** @member {module:prim.Config} module:prim.State#config */
    /** @member {(string|Array|module:stream.IStream)} module:prim.State#input */
    /** @member {module:pos.SourcePos} module:prim.State#pos */
    /** @member {*} module:prim.State#userState */

    /**
     * Checks if two states are equal.
     * @param {module:prim.State} stateA
     * @param {module:prim.State} stateB
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
     * @param {(string|Array|module:stream.IStream)} input
     * @returns {module:prim.State}
     */
    setInput(input) {
        return new State(this.config, input, this.pos, this.userState);
    }

    /**
     * @param {module:pos.SourcePos} pos
     * @returns {module:prim.State}
     */
    setPosition(pos) {
        return new State(this.config, this.input, pos, this.userState);
    }

    /**
     * @param {*} userState
     * @returns {module:prim.State}
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
     * @param {module:error.IParseError} err Parse error object.
     * @param {*} [val = undefined] Obtained value.
     * @param {(module:prim.State|undefined)} [state = undefined] Next state.
     */
    constructor(consumed, succeeded, err, val = undefined, state = undefined) {
        this.consumed  = consumed;
        this.succeeded = succeeded;
        this.err       = err;
        this.val       = val;
        this.state     = state;
    }

    /**
     * Checks if two results are equal.
     * The properties `val` and `state` are compared only when both results are succeeded.
     * @param {module:prim.Result} resA
     * @param {module:prim.Result} resB
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
     * @param {module:error.IParseError} err
     * @param {*} val
     * @param {module:prim.State} state
     * @returns {module:prim.Result}
     */
    static csuc(err, val, state) {
        return new Result(true, true, err, val, state);
    }

    /**
     * Returns consumed but error result object.
     * @param {module:error.IParseError} err
     * @returns {module:prim.Result}
     */
    static cerr(err) {
        return new Result(true, false, err);
    }

    /**
     * Returns not consumed and succeeded result object.
     * @param {module:error.IParseError} err
     * @param {*} val
     * @param {module:prim.State} state
     * @returns {module:prim.Result}
     */
    static esuc(err, val, state) {
        return new Result(false, true, err, val, state);
    }

    /**
     * Returns not consumed but error result object.
     * @param {module:error.IParseError} err
     * @returns {module:prim.Result}
     */
    static eerr(err) {
        return new Result(false, false, err);
    }
}

end();
