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
   *   static csuc[S, U, A](err: Parser, val: A, state: State[S, U]): Result[S, U, A]
   *   static cerr[S, U, A](err: Parser): Result[S, U, A]
   *   static esuc[S, U, A](err: Parser, val: A, state: State[S, U]): Result[S, U, A]
   *   static eerr[S, U, A](err: Parser): Result[S, U, A]
   * }
   */
  class Result {
    /**
     * Result.csuc[S, U, A](err: Parser, val: A, state: State[S, U]): Result[S, U, A]
     */
    static csuc(err, val, state) {
      return new Result(true, true, err, val, state);
    }

    /**
     * Result.cerr[S, U, A](err: Parser): Result[S, U, A]
     */
    static cerr(err) {
      return new Result(true, false, err);
    }

    /**
     * Result.esuc[S, U, A](err: Parser, val: A, state: State[S, U]): Result[S, U, A]
     */
    static esuc(err, val, state) {
      return new Result(false, true, err, val, state);
    }

    /**
     * Result.eerr[S, U, A](err: Parser): Result[S, U, A]
     */
    static eerr(err) {
      return new Result(false, false, err);
    }

    constructor(consumed, success, err, val, state) {
      this._consumed = consumed;
      this._success  = success;
      this._err      = err;
      this._val      = val;
      this._state    = state;
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
   * type ParserType = "strict" \/ "lazy"
   */

  /**
   * object ParserType {
   *   STRICT: "strict"
   *   LAZY: "lazy"
   * }
   */
  const ParserType = Object.freeze({
    STRICT: "strict",
    LAZY  : "lazy",
  });

  /**
   * parserTypeKey: symbol
   */
  const parserTypeKey = Symbol.for("loquatParserType");

  /**
   * sealed trait Parser[S, U, A] {
   *   [parserTypeKey]: ParserType
   *   run(state: State[S, U, A]): Result[S, U, A]
   *   parse(name: string, input: S, userState: U, opts: ConfigOptions): ParseResult[A]
   * }
   */
  class Parser {
    constructor() {
      if (this.constructor === Parser) {
        throw new Error("cannot create Parser object directly");
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
   * type ParserFunc[S, U, A] = (input: State[S, U]) => Result[S, U, A]
   */

  /**
   * class StrictParser[S, U, A](func: ParserFunc[S, U, A]) extends Parser[S, U, A] {
   *   [parserTypeKey]: "strict"
   * }
   */
  class StrictParser extends Parser {
    constructor(func) {
      super();
      this._func = func;
    }

    run(state) {
      return this._func.call(undefined, state);
    }
  }

  StrictParser.prototype[parserTypeKey] = ParserType.STRICT;

  /**
   * class LazyParser[S, U, A](thunk: () => Parser[S, U, A]) extends Parser[S, U, A] {
   *   [parserTypeKey]: "lazy"
   *   eval(): StrictParser[S, U, A]
   * }
   */
  class LazyParser extends Parser {
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
      let curr = this;
      while (curr && curr[parserTypeKey] === ParserType.LAZY) {
        if (curr._cache) {
          curr = curr._cache;
        } else {
          lazyParsers.push(curr);
          if (typeof curr._thunk !== "function") {
            throw new TypeError("thunk is not a function");
          }
          curr = curr._thunk.call(undefined);
        }
      }
      if (!(curr && curr[parserTypeKey] === ParserType.STRICT)) {
        throw new TypeError("evaluation result is not a StrictParser object");
      }
      for (const parser of lazyParsers) {
        parser._cache = curr;
      }
      return curr;
    }

    run(state) {
      return this.eval().run(state);
    }
  }

  LazyParser.prototype[parserTypeKey] = ParserType.LAZY;

  /**
   * lazy: [S, U, A](thunk: () => Parser[S, U, A]): LazyParser[S, U, A]
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
   *   parser: StrictParser[S, U, A],
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
    return val instanceof Parser;
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
    Object.defineProperties(Parser.prototype, descs);
  }

  return Object.freeze({
    Config,
    State,
    Result,
    Parser,
    StrictParser,
    LazyParser,
    lazy,
    parse,
    isParser,
    assertParser,
    extendParser,
  });
};
