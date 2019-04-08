declare module "@loquat/simple" {
  export type int = number;
  export type float = number;
  export type char = string;
  export type Option<A> = { empty: true } | { empty: false, value: A };

  export function show(val: any): string;
  export type UnconsResult<T, S> = { empty: true } | { empty: false, head: T, tail: S };
  export function unconsString(str: string, unicode: boolean): UnconsResult<char, string>;

  export class SourcePos {
    static init(name: string): SourcePos;
    static equal(posA: SourcePos, posB: SourcePos): boolean;
    static compare(posA: SourcePos, posB: SourcePos): int;
    constructor(name: string, index: int, line: int, column: int);
    readonly name: string;
    readonly index: int;
    readonly line: int;
    readonly column: int;
    toString(): string;
    setName(name: string): SourcePos;
    setIndex(index: int): SourcePos;
    setLine(line: int): SourcePos;
    setColumn(column: int): SourcePos;
    addChar(char: char, tabWidth: int): SourcePos;
    addString(str: string, tabWidth: int, unicode: boolean): SourcePos;
  }

  export type ErrorMessageType = "systemUnexpect" | "unexpect" | "expect" | "message";
  export const ErrorMessageType: {
    readonly SYSTEM_UNEXPECT: "systemUnexpect",
    readonly UNEXPECT: "unexpect",
    readonly EXPECT: "expect",
    readonly MESSAGE: "message",
  };
  export type ErrorMessage = { type: ErrorMessageType, str: string };
  export const ErrorMessage: {
    create(type: ErrorMessageType, str: string): ErrorMessage,
    equal(msgA: ErrorMessage, msgB: ErrorMessage): boolean,
    messagesEqual(msgsA: ErrorMessage[], msgsB: ErrorMessage[]): boolean,
    messagesToString(msgs: ErrorMessage[]): string,
  };
  export abstract class ParseError {
    static unknown(pos: SourcePos): ParseError;
    static equal(errA: ParseError, errB: ParseError): boolean;
    static merge(errA: ParseError, errB: ParseError): ParseError;
    readonly pos: SourcePos;
    readonly msgs: ErrorMessage[];
    toString(): string;
    isUnknown(): boolean;
    setPosition(pos: SourcePos): ParseError;
    setMessages(msgs: ErrorMessage[]): ParseError;
    addMessages(msgs: ErrorMessage[]): ParseError;
    setSpecificTypeMessages(type: ErrorMessageType, strs: string[]): ParseError;
  }
  export class StrictParseError extends ParseError {
    constructor(pos: SourcePos, msgs: ErrorMessage[]);
  }
  export class LazyParseError extends ParseError {
    constructor(thunk: () => ParseError);
    eval(): StrictParseError;
  }

  export type ConfigOptions = {
    tabWidth?: int,
    unicode?: boolean,
  };
  export class Config {
    static equal(configA: Config, configB: Config): boolean;
    constructor(opts?: ConfigOptions);
    readonly tabWidth: int;
    readonly unicode: boolean;
    setTabWidth(tabWidth: int): Config;
    setUnicode(unicode: boolean): Config;
  }
  export class State {
    static equal(
      stateA: State,
      stateB: State,
      inputEqual?: (inputA: string, inputB: string) => boolean,
      userStateEqual?: (userStateA: any, userStateB: any) => boolean
    ): boolean;
    constructor(config: Config, input: string, pos: SourcePos, userState: any);
    readonly config: Config;
    readonly input: string;
    readonly pos: SourcePos;
    readonly userState: any;
    setConfig(config: Config): State;
    setInput(input: string): State;
    setPosition(pos: SourcePos): State;
    setUserState(userState: any): State;
  }
  export type Success<A> = {
    success: true,
    consumed: boolean,
    err: ParseError,
    val: A,
    state: State,
  };
  export type Failure = {
    success: false,
    consumed: boolean,
    err: ParseError,
  };
  export type Result<A> = Success<A> | Failure;
  export const Result: {
    succ<A>(consumed: boolean, err: ParseError, val: A, state: State): Success<A>;
    fail(consumed: boolean, err: ParseError): Failure;
    csucc<A>(err: ParseError, val: A, state: State): Success<A>;
    cfail(err: ParseError): Failure;
    esucc<A>(err: ParseError, val: A, state: State): Success<A>;
    efail(err: ParseError): Failure;
    equal<A>(
      resA: Result<A>,
      resB: Result<A>,
      valEqual?: (valA: A, valB: A) => boolean,
      inputEqual?: (inputA: string, inputB: string) => boolean,
      userStateEqual?: (userStateA: any, userStateB: any) => boolean
    ): boolean;
  }
  export type ParseResult<A> = { success: true, value: A } | { success: false, error: ParseError };
  export abstract class Parser<A> {
    run(state: State): Result<A>;
    parse(name: string, input: string, userState?: any, opts?: ConfigOptions): ParseResult<A>;

    map<B>(func: (val: A) => B): Parser<B>;
    return<B>(val: B): Parser<B>;
    ap: A extends (val: infer B) => infer C ? (parser: Parser<B>) => Parser<C> : unknown;
    left(parser: Parser<unknown>): Parser<A>;
    skip(parser: Parser<unknown>): Parser<A>;
    right<B>(parser: Parser<B>): Parser<B>;
    bind<B>(func: (val: A) => Parser<B>): Parser<B>;
    and<B>(parser: Parser<B>): Parser<B>;
    fail(str: string): Parser<never>;
    cont(): Parser<Cont<A, never>>;
    done(): Parser<Cont<never, A>>;
    or<B>(parser: Parser<B>): Parser<A | B>;
    label(str: string): Parser<A>;
    hidden(): Parser<A>;
    try(): Parser<A>;
    lookAhead(): Parser<A>;
    reduceMany<B>(callback: (accum: B, val: A) => B, initVal: B): Parser<B>;
    many(): Parser<A[]>;
    skipMany(): Parser<undefined>;
    skipMany(parser: Parser<unknown>): Parser<A>;

    manyChars: A extends char ? () => Parser<string> : unknown;
    manyChars1: A extends char ? () => Parser<string> : unknown;

    option<B>(defaultVal: B): Parser<A | B>;
    optionMaybe(): Parser<Option<A>>;
    optional(): Parser<undefined>;
    between(open: Parser<unknown>, close: Parser<unknown>): Parser<A>;
    many1(): Parser<A[]>;
    skipMany1(): Parser<undefined>;
    skipMany1(parser: Parser<unknown>): Parser<A>;
    sepBy(sep: Parser<unknown>): Parser<A[]>;
    sepBy1(sep: Parser<unknown>): Parser<A[]>;
    sepEndBy(sep: Parser<unknown>): Parser<A[]>;
    sepEndBy1(sep: Parser<unknown>): Parser<A[]>;
    endBy(sep: Parser<unknown>): Parser<A[]>;
    endBy1(sep: Parser<unknown>): Parser<A[]>;
    count(num: int): Parser<A[]>;
    notFollowedBy(): Parser<undefined>;
    notFollowedBy(parser: Parser<unknown>): Parser<A>;
    reduceManyTill<B>(
      end: Parser<unknown>,
      callback: (accum: B, val: A) => B,
      initVal: B
    ): Parser<B>;
    manyTill(end: Parser<unknown>): Parser<A[]>;
    skipManyTill(end: Parser<unknown>): Parser<undefined>;
    skipManyTill(parser: Parser<unknown>, end: Parser<unknown>): Parser<A>;

    forever(): Parser<never>;
    discard(): Parser<undefined>;
    void(): Parser<undefined>;
    join: A extends Parser<infer B> ? () => Parser<B> : unknown;
    when: A extends undefined ? (cond: boolean) => Parser<undefined> : unknown;
    unless: A extends undefined ? (cond: boolean) => Parser<undefined> : unknown;
    filter(test: (val: A) => boolean): Parser<A>;
  }
  export type ParserFunction<A> = (state: State) => Result<A>;
  export class StrictParser<A> extends Parser<A> {
    constructor(func: ParserFunction<A>);
  }
  export class LazyParser<A> extends Parser<A> {
    constructor(thunk: () => Parser<A>);
    eval(): StrictParser<A>;
  }
  export function lazy<A>(thunk: () => Parser<A>): LazyParser<A>;
  export function parse<A>(
    parser: Parser<A>,
    name: string,
    input: string,
    userState?: any,
    opts?: ConfigOptions
  ): ParseResult<A>;

  export function uncons(input: string, config: Config): UnconsResult<char, string>;

  export function map<A, B>(parser: Parser<A>, func: (val: A) => B): Parser<B>;
  export function fmap<A, B>(func: (val: A) => B): (parser: Parser<A>) =>Parser<B>;
  export function pure<A>(val: A): Parser<A>;
  export function ap<A, B>(parserA: Parser<(val: A) => B>, parserB: Parser<A>): Parser<B>;
  export function left<A>(parserA: Parser<A>, parserB: Parser<unknown>): Parser<A>;
  export function right<A>(parserA: Parser<unknown>, parserB: Parser<A>): Parser<A>;
  export function bind<A, B>(parser: Parser<A>, bind: (val: A) => Parser<B>): Parser<B>;
  export function then<A>(parserA: Parser<unknown>, parserB: Parser<A>): Parser<A>;
  export function and<A>(parserA: Parser<unknown>, parserB: Parser<A>): Parser<A>;
  export function fail(str: string): Parser<never>;
  export type Cont<A, B> = { done: false, value: A } | { done: true, value: B };
  export function tailRecM<A, B>(initVal: A, func: (accum: A) => Parser<Cont<A, B>>): Parser<B>;
  export function ftailRecM<A, B>(
    func: (accum: A) => Parser<Cont<A, B>>
  ): (initVal: A) => Parser<B>;
  export function cont<A>(parser: Parser<A>): Parser<Cont<A, never>>;
  export function done<A>(parser: Parser<A>): Parser<Cont<never, A>>;
  export function mzero(): Parser<never>;
  export function mplus<A, B>(parserA: Parser<A>, parserB: Parser<B>): Parser<A | B>;
  export function or<A, B>(parserA: Parser<A>, parserB: Parser<B>): Parser<A | B>;
  export function label<A>(parser: Parser<A>, str: string): Parser<A>;
  export function labels<A>(parser: Parser<A>, strs: string[]): Parser<A>;
  export function hidden<A>(parser: Parser<A>): Parser<A>;
  export function unexpected(str: string): Parser<never>;
  export function tryParse<A>(parser: Parser<A>): Parser<A>;
  export function lookAhead<A>(parser: Parser<A>): Parser<A>;
  export function reduceMany<A, B>(
    parser: Parser<A>,
    callback: (accum: B, val: A) => B,
    initVal: B
  ): Parser<B>;
  export function many<A>(parser: Parser<A>): Parser<A[]>;
  export function skipMany(parser: Parser<unknown>): Parser<undefined>;
  export function tokens(
    expectTokens: char[],
    tokenEqual: (tokenA: char, tokenB: char) => boolean,
    tokensToString: (tokens: char[]) => string,
    calcNextPos: (pos: SourcePos, tokens: char[], config: Config) => SourcePos
  ): Parser<char[]>;
  export function token<A>(
    calcValue: (token: char, config: Config) => Option<A>,
    tokenToString: (token: char) => string,
    calcPos: (token: char, config: Config) => SourcePos
  ): Parser<A>;
  export function tokenPrim<A>(
    calcValue: (token: char, config: Config) => Option<A>,
    tokenToString: (token: char) => string,
    calcNextPos: (pos: SourcePos, head: char, tail: string, config: Config) => SourcePos,
    calcNextUserState?: (
      userState: any,
      pos: SourcePos,
      head: char,
      tail: string,
      config: Config
    ) => any
  ): Parser<A>;
  export const getParserState: Parser<State>;
  export function setParserState(state: State): Parser<State>;
  export function updateParserState(func: (state: State) => State): Parser<State>;
  export const getConfig: Parser<Config>;
  export function setConfig(config: Config): Parser<undefined>;
  export const getInput: Parser<string>;
  export function setInput(input: string): Parser<undefined>;
  export const getPosition: Parser<SourcePos>;
  export function setPosition(pos: SourcePos): Parser<undefined>;
  export const getState: Parser<any>;
  export function setState(userState: any): Parser<undefined>;

  export function string(str: string): Parser<string>;
  export function satisfy(test: (char: char, config: Config) => boolean): Parser<char>;
  export function oneOf(str: string): Parser<char>;
  export function noneOf(str: string): Parser<char>;
  export function char(expectChar: char): Parser<char>;
  export const anyChar: Parser<char>;
  export const space: Parser<char>;
  export const spaces: Parser<undefined>;
  export const newline: Parser<"\n">;
  export const tab: Parser<"\t">;
  export const upper: Parser<char>;
  export const lower: Parser<char>;
  export const letter: Parser<char>;
  export const digit: Parser<char>;
  export const alphaNum: Parser<char>;
  export const octDigit: Parser<char>;
  export const hexDigit: Parser<char>;
  export function manyChars(parser: Parser<char>): Parser<string>;
  export function manyChars1(parser: Parser<char>): Parser<string>;
  export function regexp(re: RegExp, groupId?: int): Parser<string>;
  export function regexpPrim(re: RegExp): Parser<RegExpExecArray>;

  export function choice<A>(parsers: Parser<A>[]): Parser<A>;
  export function option<A, B>(defaultVal: A, parser: Parser<B>): Parser<A | B>;
  export function optionMaybe<A>(parser: Parser<A>): Parser<Option<A>>;
  export function optional(parser: Parser<unknown>): Parser<undefined>;
  export function between<A>(
    open: Parser<unknown>,
    close: Parser<unknown>,
    parser: Parser<A>
  ): Parser<A>;
  export function many1<A>(parser: Parser<A>): Parser<A[]>;
  export function skipMany1(parser: Parser<unknown>): Parser<undefined>;
  export function sepBy<A>(parser: Parser<A>, sep: Parser<unknown>): Parser<A[]>;
  export function sepBy1<A>(parser: Parser<A>, sep: Parser<unknown>): Parser<A[]>;
  export function sepEndBy<A>(parser: Parser<A>, sep: Parser<unknown>): Parser<A[]>;
  export function sepEndBy1<A>(parser: Parser<A>, sep: Parser<unknown>): Parser<A[]>;
  export function endBy<A>(parser: Parser<A>, sep: Parser<unknown>): Parser<A[]>;
  export function endBy1<A>(parser: Parser<A>, sep: Parser<unknown>): Parser<A[]>;
  export function count<A>(num: int, parser: Parser<A>): Parser<A[]>;
  export function chainl<A>(
    term: Parser<A>,
    op: Parser<(valA: A, valB: A) => A>,
    defaultVal: A
  ): Parser<A>;
  export function chainl1<A>(term: Parser<A>, op: Parser<(valA: A, valB: A) => A>): Parser<A>;
  export function chainr<A>(
    term: Parser<A>,
    op: Parser<(valA: A, valB: A) => A>,
    defaultVal: A
  ): Parser<A>;
  export function chainr1<A>(term: Parser<A>, op: Parser<(valA: A, valB: A) => A>): Parser<A>;
  export const anyToken: Parser<char>;
  export function notFollowedBy(parser: Parser<unknown>): Parser<undefined>;
  export const eof: Parser<undefined>;
  export function reduceManyTill<A, B>(
    parser: Parser<A>,
    end: Parser<unknown>,
    callback: (accum: B, val: A) => B,
    initVal: B
  ): Parser<B>;
  export function manyTill<A>(parser: Parser<A>, end: Parser<unknown>): Parser<A[]>;
  export function skipManyTill(parser: Parser<unknown>, end: Parser<unknown>): Parser<undefined>;

  export function forever(parser: Parser<unknown>): Parser<never>;
  export function discard(parser: Parser<unknown>): Parser<undefined>;
  export function join<A>(parser: Parser<Parser<A>>): Parser<A>;
  export function when(cond: boolean, parser: Parser<undefined>): Parser<undefined>;
  export function unless(cond: boolean, parser: Parser<undefined>): Parser<undefined>;
  export function liftM<A, B>(func: (val: A) => B): (parser: Parser<A>) => Parser<B>;
  export function liftM2<A, B, C>(
    func: (valA: A, valB: B) => C
  ): (parserA: Parser<A>, parserB: Parser<B>) => Parser<C>;
  export function liftM3<A, B, C, D>(
    func: (valA: A, valB: B, valC: C) => D
  ): (parserA: Parser<A>, parserB: Parser<B>, parserC: Parser<C>) => Parser<D>;
  export function liftM4<A, B, C, D, E>(
    func: (valA: A, valB: B, valC: C, valD: D) => E
  ): (parserA: Parser<A>, parserB: Parser<B>, parserC: Parser<C>, parserD: Parser<D>) => Parser<E>;
  export function liftM5<A, B, C, D, E, F>(
    func: (valA: A, valB: B, valC: C, valD: D, valE: E) => F
  ): (
    parserA: Parser<A>,
    parserB: Parser<B>,
    parserC: Parser<C>,
    parserD: Parser<D>,
    parserE: Parser<E>
  ) => Parser<F>;
  export function ltor<A, B, C>(
    funcA: (val: A) => Parser<B>,
    funcB: (val: B) => Parser<C>
  ): (val: A) => Parser<C>;
  export function rtol<A, B, C>(
    funcA: (val: B) => Parser<C>,
    funcB: (val: A) => Parser<B>
  ): (val: A) => Parser<C>;
  export function sequence<A>(parsers: Parser<A>[]): Parser<A[]>;
  export function sequence_(parsers: Parser<unknown>[]): Parser<undefined>;
  export function mapM<A, B>(func: (val: A) => Parser<B>, arr: A[]): Parser<B[]>;
  export function mapM_<A>(func: (val: A) => Parser<unknown>, arr: A[]): Parser<undefined>;
  export function forM<A, B>(arr: A[], func: (val: A) => Parser<B>): Parser<B[]>;
  export function forM_<A>(arr: A[], func: (val: A) => Parser<unknown>): Parser<undefined>;
  export function filterM<A>(test: (val: A) => Parser<boolean>, arr: A[]): Parser<A[]>;
  export function zipWithM<A, B, C>(
    func: (valA: A, valB: B) => Parser<C>,
    arrA: A[],
    arrB: B[]
  ): Parser<C[]>;
  export function zipWithM_<A, B>(
    func: (valA: A, valB: B) => Parser<unknown>,
    arrA: A[],
    arrB: B[]
  ): Parser<undefined>;
  export function foldM<A, B>(
    func: (accum: A, val: B) => Parser<A>,
    initVal: A,
    arr: B[]
  ): Parser<A>;
  export function foldM_<A, B>(
    func: (accum: A, val: B) => Parser<A>,
    initVal: A,
    arr: B[]
  ): Parser<undefined>;
  export function replicateM<A>(num: int, parser: Parser<A>): Parser<A[]>;
  export function replicateM_(num: int, parser: Parser<unknown>): Parser<undefined>;
  export function guard(cond: boolean): Parser<undefined>;
  export function msum<A>(parsers: Parser<A>[]): Parser<A>;
  export function mfilter<A>(test: (val: A) => boolean, parser: Parser<A>): Parser<A>;

  export type OperatorType = "infix" | "prefix" | "postfix";
  export const OperatorType: {
    readonly INFIX: "infix",
    readonly PREFIX: "prefix",
    readonly POSTFIX: "postfix",
  };
  export type OperatorAssoc = "none" | "left" | "right";
  export const OperatorAssoc: {
    readonly NONE: "none",
    readonly LEFT: "left",
    readonly RIGHT: "right",
  };
  export type InfixOperator<A> = {
    type: "infix",
    parser: Parser<(valA: A, valB: A) => A>,
    assoc: OperatorAssoc,
  };
  export type PrefixOperator<A> = {
    type: "prefix",
    parser: Parser<(val: A) => A>,
  };
  export type PostfixOperator<A> = {
    type: "postfix",
    parser: Parser<(val: A) => A>,
  };
  export type Operator<A> = InfixOperator<A> | PrefixOperator<A> | PostfixOperator<A>;
  export const Operator: {
    infix<A>(parser: (valA: A, valB: A) => A, assoc: OperatorAssoc): InfixOperator<A>;
    prefix<A>(parser: (val: A) => A): PrefixOperator<A>;
    postfix<A>(parser: (val: A) => A): PostfixOperator<A>;
  };
  export function buildExpressionParser<A>(opTable: Operator<A>[][], atom: Parser<A>): Parser<A>;

  export function qo(genFunc: () => IterableIterator<any>): Parser<any>;

  export type LanguageDefObject = {
    commentStart?: string,
    commentEnd?: string,
    commentLine?: string,
    nestedComments?: boolean,
    idStart?: Parser<char>,
    idLetter?: Parser<char>,
    opStart?: Parser<char>,
    opLetter?: Parser<char>,
    reservedIds?: string[],
    reservedOps?: string[],
    caseSensitive?: boolean,
  };
  export type LanguageDef = {
    commentStart: string | undefined,
    commentEnd: string | undefined,
    commentLine: string | undefined,
    nestedComments: boolean,
    idStart: Parser<char> | undefined,
    idLetter: Parser<char> | undefined,
    opStart: Parser<char> | undefined,
    opLetter: Parser<char> | undefined,
    reservedIds: string[] | undefined,
    reservedOps: string[] | undefined,
    caseSensitive: boolean,
  };
  export const LanguageDef: {
    create(obj?: LanguageDefObject): LanguageDef,
  };
  export type NaturalOrFloat = { type: "natural", value: int } | { type: "float", value: float };
  export type TokenParser = {
    whiteSpace: Parser<undefined>,
    lexeme: <A>(parser: Parser<A>) => Parser<A>,
    symbol: (name: string) => Parser<string>,
    parens: <A>(parser: Parser<A>) => Parser<A>,
    braces: <A>(parser: Parser<A>) => Parser<A>,
    angles: <A>(parser: Parser<A>) => Parser<A>,
    brackets: <A>(parser: Parser<A>) => Parser<A>,
    semi: Parser<string>,
    comma: Parser<string>,
    colon: Parser<string>,
    dot: Parser<string>,
    semiSep: <A>(parser: Parser<A>) => Parser<A[]>,
    semiSep1: <A>(parser: Parser<A>) => Parser<A[]>,
    commaSep: <A>(parser: Parser<A>) => Parser<A[]>,
    commaSep1: <A>(parser: Parser<A>) => Parser<A[]>,
    decimal: Parser<int>,
    hexadecimal: Parser<int>,
    octal: Parser<int>,
    natural: Parser<int>,
    integer: Parser<int>,
    float: Parser<float>,
    naturalOrFloat: Parser<NaturalOrFloat>,
    charLiteral: Parser<char>,
    stringLiteral: Parser<string>,
    identifier: Parser<string>,
    reserved: (name: string) => Parser<undefined>,
    operator: Parser<string>,
    reservedOp: (name: string) => Parser<undefined>,
  };
  export function makeTokenParser(def: LanguageDef): TokenParser;
}
