"use strict";

module.exports = ({ _pos }) => {
  const { SourcePos } = _pos;

  /**
   * type ConfigOptions = {
   *   tabWidth: undefined \/ int,
   *   unicode: undefined \/ boolean,
   * }
   */

  /**
   * class Config(opts?: ConfigOptions) {
   *  tabWidth: int
   *  unicode: boolean
   * }
   */
  class Config {
    constructor(opts = {}) {
      this._tabWidth = opts.tabWidth === undefined ? 8 : opts.tabWidth;
      this._unicode  = opts.unicode === undefined ? false : opts.unicode;
    }

    get tabWidth() {
      return this._tabWidth;
    }

    get unicode() {
      return this._unicode;
    }
  }

  /**
   * class State[S, U](config: Config, input: S, pos: SourcePos, userState: U) {
   *   setConfig(config: Config): State[S, U]
   *   setInput(input: S): State[S, U]
   *   setPosition(pos: SourcePos): State[S, U]
   *   setUserState(userState: U): State[S, U]
   * }
   */
  class State {
    constructor(config, input, pos, userState) {
      this._config    = config;
      this._input     = input;
      this._pos       = pos;
      this._userState = userState;
    }

    get config() {
      return this._config;
    }

    get input() {
      return this._input;
    }

    get pos() {
      return this._pos;
    }

    get userState() {
      return this._userState;
    }

    /**
     * State#setConfig(config: Config): State[S, U]
     *
     * Creates a new state with `config` updated.
     */
    setConfig(config) {
      return new State(config, this.input, this.pos, this.userState);
    }

    /**
     * State#setInput(input: S): State[S, U]
     *
     * Creates a new state with `input` updated.
     */
    setInput(input) {
      return new State(this.config, input, this.pos, this.userState);
    }

    /**
     * State#setPosition(pos: SourcePos): State[S, U]
     *
     * Creates a new state with `pos` updated.
     */
    setPosition(pos) {
      return new State(this.config, this.input, pos, this.userState);
    }

    /**
     * State#setUserState(userState: U): State[S, U]
     *
     * Creates a new state with `userState` updated.
     */
    setUserState(userState) {
      return new State(this.config, this.input, this.pos, userState);
    }
  }

  /**
   * class Result[S, U, A](
   *   consumed: boolean,
   *   success: boolean,
   *   err: ParseError,
   *   val: undefined \/ A,
   *   state: undefined \/ State[S, U]
   * ) {
   *   static csuc[S, U, A](err: AbstractParser, val: A, state: State[S, U]): Result[S, U, A]
   *   static cerr[S, U, A](err: AbstractParser): Result[S, U, A]
   *   static esuc[S, U, A](err: AbstractParser, val: A, state: State[S, U]): Result[S, U, A]
   *   static eerr[S, U, A](err: AbstractParser): Result[S, U, A]
   * }
   */
  class Result {
    constructor(consumed, success, err, val, state) {
      this._consumed = consumed;
      this._success  = success;
      this._err      = err;
      this._val      = val;
      this._state    = state;
    }

    /**
     * Result.csuc[S, U, A](err: AbstractParser, val: A, state: State[S, U]): Result[S, U, A]
     */
    static csuc(err, val, state) {
      return new Result(true, true, err, val, state);
    }

    /**
     * Result.cerr[S, U, A](err: AbstractParser): Result[S, U, A]
     */
    static cerr(err) {
      return new Result(true, false, err);
    }

    /**
     * Result.esuc[S, U, A](err: AbstractParser, val: A, state: State[S, U]): Result[S, U, A]
     */
    static esuc(err, val, state) {
      return new Result(false, true, err, val, state);
    }

    /**
     * Result.eerr[S, U, A](err: AbstractParser): Result[S, U, A]
     */
    static eerr(err) {
      return new Result(false, false, err);
    }

    get consumed() {
      return this._consumed;
    }

    get success() {
      return this._success;
    }

    get err() {
      return this._err;
    }

    get val() {
      return this._val;
    }

    get state() {
      return this._state;
    }
  }

  /**
   * trait AbstractParser[S, U, A] {
   *   run(state: State[S, U, A]): Result[S, U, A]
   *   parse(name: string, input: S, userState: U, opts: ConfigOptions): ParseResult[A]
   * }
   */
  class AbstractParser {
    constructor() {
      if (this.constructor === AbstractParser) {
        throw new Error("cannot create AbstractParser object");
      }
    }

    run() {
      throw new Error("not implemented");
    }

    parse(name, input, userState, opts = {}) {
      return parse(this, name, input, userState, opts);
    }
  }

  /**
   * class Parser[S, U, A](
   *   func: (input: State[S, U]) => Result[S, U, A]
   * ) extends AbstractParser[S, U, A] {
   * }
   */
  class Parser extends AbstractParser {
    constructor(func) {
      super();
      this._func = func;
    }

    run(state) {
      return this._func.call(undefined, state);
    }
  }

  /**
   * class LazyParser[S, U, A](
   *   thunk: () => AbstractParser[S, U, A]
   * ) extends AbstractParser[S, U, A] {
   *   eval(): Parser[S, U, A]
   * }
   */
  class LazyParser extends AbstractParser {
    constructor(thunk) {
      super();
      this._thunk = thunk;
      this._cache = undefined;
    }

    /**
     * LazyParseError#eval(): ParseError
     *
     * Evalutates the thunk and returns a fully-evaluated parser.
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
        } else {
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

    run(state) {
      return this.eval().run(state);
    }
  }

  /**
   * lazy: [S, U, A](thunk: () => AbstractParser[S, U, A]): LazyParser[S, U, A]
   */
  function lazy(thunk) {
    return new LazyParser(thunk);
  }

  /**
   * type ParseResult[A] = { success: true, value: A }
   *   \/ { success: false, error: ParseError }
   */

  /**
   * parse: [S, U, A](
   *   parser: Parser[S, U, A],
   *   name: string,
   *   input: S,
   *   userState: U,
   *   opts?: ConfigOptions
   * ): ParseResult[A]
   */
  function parse(parser, name, input, userState, opts = {}) {
    const state = new State(new Config(opts), input, SourcePos.init(name), userState);
    const res = parser.run(state);
    return res.success
      ? { success: true, value: res.val }
      : { success: false, error: res.err };
  }

  /**
   * isParser: (val: any) => boolean
   */
  function isParser(val) {
    return val instanceof AbstractParser;
  }

  /**
   * assertParser: (val: any) => undefined
   */
  function assertParser(val) {
    if (!isParser(val)) {
      throw new Error("not a parser");
    }
  }

  /**
   * extendParser: (extensions: {}) => undefined
   */
  function extendParser(extensions) {
    const descs = {};
    for (const key of Object.keys(extensions)) {
      descs[key] = {
        value       : extensions[key],
        writable    : true,
        configurable: true,
        enumerable  : false,
      };
    }
    Object.defineProperties(AbstractParser.prototype, descs);
  }

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
    extendParser,
  });
};
