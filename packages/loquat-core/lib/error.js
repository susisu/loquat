"use strict";

module.exports = ({ _pos }) => {
  const { SourcePos } = _pos;

  /**
   * type ErrorMessageType = "systemUnexpect" \/ "unexpect" \/ "expect" \/ "message"
   */

  /**
   * object ErrorMessageType {
   *   SYSTEM_UNEXPECT: "systemUnexpect"
   *   UNEXPECT: "unexpect"
   *   EXPECT: "expect"
   *   MESSAGE: "message"
   * }
   */
  const ErrorMessageType = Object.freeze({
    SYSTEM_UNEXPECT: "systemUnexpect",
    UNEXPECT       : "unexpect",
    EXPECT         : "expect",
    MESSAGE        : "message",
  });

  /**
   * class ErrorMessage(type: ErrorMessageType, msgStr: string) {
   *   static messagesToString(msgs: Array[ErrorMessage]): string
   * }
   */
  class ErrorMessage {
    /**
     * ErrorMessage.messagesToString(msgs: Array[ErrorMessage]): string
     *
     * Prints error messages in a human readable format.
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
            ? "unexpected " + (systemUnexpects[0] === "" ? "end of input" : systemUnexpects[0])
            : "",
        joinMessageStrings(cleanMessageStrings(unexpects), "unexpected"),
        joinMessageStrings(cleanMessageStrings(expects), "expecting"),
        joinMessageStrings(cleanMessageStrings(defaultMessages), ""),
      ];
      return cleanMessageStrings(msgStrs).join("\n");
    }

    constructor(type, msgStr) {
      this._type   = type;
      this._msgStr = msgStr;
    }

    get type() {
      return this._type;
    }

    get msgStr() {
      return this._msgStr;
    }
  }

  /**
   * cleanMessageStrings: (msgStrs: Array[string]): Array[string]
   *
   * Removes empty or duplicate ones from messages.
   */
  function cleanMessageStrings(msgStrs) {
    return msgStrs.filter((msgStr, i) => msgStr !== "" && msgStrs.indexOf(msgStr) === i);
  }

  /**
   * joinWithCommasOr: (msgStrs: Array[string]): string
   *
   * Returns a single message joined with commas "," and "or".
   */
  function joinWithCommasOr(msgStrs) {
    return msgStrs.length <= 2
      ? msgStrs.join(" or ")
      : msgStrs.slice(0, msgStrs.length - 1).join(", ") + " or " + msgStrs[msgStrs.length - 1];
  }

  /**
   * joinMessageStrings: (msgStrs: Array[string], desc: string): string
   *
   * Returns a joined message with a short description.
   */
  function joinMessageStrings(msgStrs, desc) {
    return msgStrs.length === 0
      ? ""
      : (desc === "" ? "" : desc + " ") + joinWithCommasOr(msgStrs);
  }

  /**
   * type ParseErrorType = "strict" \/ "lazy"
   */

  /**
   * object ParseErrorType {
   *   STRICT: "strict"
   *   LAZY: "lazy"
   * }
   */
  const ParseErrorType = Object.freeze({
    STRICT: "strict",
    LAZY  : "lazy",
  });

  /**
   * parseErrorTypeKey: symbol
   */
  const parseErrorTypeKey = Symbol.for("loquatParseErrorType");

  /**
   * object ParseError {
   *   unknown(pos: SourcePos): StrictParseError
   *   merge(errA: StrictParseError, errB: StrictParseError): ParseError
   * }
   */

  /**
   * sealed trait ParseError {
   *   [parseErrorTypeKey]: ParseErrorType
   *   pos: SourcePos
   *   msgs: Array[ErrorMessage]
   *   toString(): string
   *   isUnknown(): boolean
   *   setPosition(pos: SourcePos): ParseError
   *   setMessages(msgs: Array[ErrorMessage]): ParseError
   *   addMessages(msgs: Array[ErrorMessage]): ParseError
   *   setSpecificTypeMessages(type: ErrorMessageType, msgStrs: Array[string]): ParseError
   * }
   */
  class ParseError {
    /**
     * ParseError.unknown(pos: SourcePos): ParseError
     */
    static unknown(pos) {
      return new StrictParseError(pos, []);
    }

    /**
     * ParseError.merge(errA: ParseError, errB: ParseError): ParseError
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

    constructor() {
      if (this.constructor === ParseError) {
        throw new Error("cannot create ParseError object directly");
      }
    }

    get pos() {
      throw new Error("not implemented");
    }

    get msgs() {
      throw new Error("not implemented");
    }

    toString() {
      throw new Error("not implemented");
    }

    isUnknown() {
      throw new Error("not implemented");
    }

    setPosition() {
      throw new Error("not implemented");
    }

    setMessages() {
      throw new Error("not implemented");
    }

    addMessages() {
      throw new Error("not implemented");
    }

    setSpecificTypeMessages() {
      throw new Error("not implemented");
    }
  }

  /**
   * class StrictParseError(pos: SourcePos, msgs: Array[ErrorMessage]) extends ParseError {
   *   [parseErrorTypeKey]: "strict"
   *}
   */
  class StrictParseError extends ParseError {
    constructor(pos, msgs) {
      super();
      this._pos  = pos;
      this._msgs = msgs;
    }

    get pos() {
      return this._pos;
    }

    get msgs() {
      return this._msgs;
    }

    /**
     * StrictParseError#toString(): string
     *
     * Returns a human readable error message.
     */
    toString() {
      return `${this.pos}:\n${ErrorMessage.messagesToString(this.msgs)}`;
    }

    /**
     * StrictParseError#isUnknown(): boolean
     *
     * Checks if the parse error is unknonw i.e. has no messages.
     */
    isUnknown() {
      return this.msgs.length === 0;
    }

    /**
     * StrictParseError#setPosition(pos: SourcePos): ParseError
     *
     * Creates a new parse error with `pos` updated.
     */
    setPosition(pos) {
      return new StrictParseError(pos, this.msgs);
    }

    /**
     * StrictParseError#setMessages(msgs: Array[ErrorMessage]): ParseError
     *
     * Creates a new parse error with `msgs` updated.
     */
    setMessages(msgs) {
      return new StrictParseError(this.pos, msgs);
    }

    /**
     * StrictParseError#addMessages(msgs: Array[ErrorMessage]): ParseError
     *
     * Creates a new parse error with the given messages added.
     */
    addMessages(msgs) {
      return new LazyParseError(() => new StrictParseError(this.pos, this.msgs.concat(msgs)));
    }

    /**
     * StrictParseError#setSpecificTypeMessages(
     *   type: ErrorMessageType,
     *   msgStrs: Array[string]
     * ): ParseError
     *
     * Creates a new parse error with all of the specific type of messages overwritten.
     */
    setSpecificTypeMessages(type, msgStrs) {
      return new LazyParseError(() => new StrictParseError(
        this.pos,
        this.msgs.filter(msg => msg.type !== type)
          .concat(msgStrs.map(msgStr => new ErrorMessage(type, msgStr)))
      ));
    }
  }

  StrictParseError.prototype[parseErrorTypeKey] = ParseErrorType.STRICT;

  /**
   * class LazyParseError(thunk: () => ParseError) extends ParseError {
   *   [parseErrorTypeKey]: "lazy"
   *   pos: SourcePos,
   *   msgs: Array[ErrorMessage]
   *   eval(): StrictParseError
   * }
   */
  class LazyParseError extends ParseError {
    constructor(thunk) {
      super();
      this._thunk = thunk;
      this._cache = undefined;
    }

    /**
     * LazyParseError#eval(): StrictParseError
     *
     * Evalutates the thunk and returns a fully-evaluated parse error.
     */
    eval() {
      if (this._cache) {
        return this._cache;
      }
      const lazyErrs = [];
      let curr = this;
      while (curr && curr[parseErrorTypeKey] === ParseErrorType.LAZY) {
        if (curr._cache) {
          curr = curr._cache;
        } else {
          lazyErrs.push(curr);
          if (typeof curr._thunk !== "function") {
            throw new TypeError("thunk is not a function");
          }
          curr = curr._thunk.call(undefined);
        }
      }
      if (!(curr && curr[parseErrorTypeKey] === ParseErrorType.STRICT)) {
        throw new TypeError("evaluation result is not a StrictParseError obejct");
      }
      for (const err of lazyErrs) {
        err._cache = curr;
      }
      return curr;
    }

    get pos() {
      return this.eval().pos;
    }

    get msgs() {
      return this.eval().msgs;
    }

    /**
     * LazyParseError#toString(): string
     *
     * Returns a human readable error message.
     */
    toString() {
      return this.eval().toString();
    }

    /**
     * LazyParseError#isUnknown(): boolean
     *
     * Checks if the parse error is unknonw i.e. has no messages.
     */
    isUnknown() {
      return this.eval().isUnknown();
    }

    /**
     * LazyParseError#setPosition(pos: SourcePos): ParseError
     *
     * Creates a new parse error with `pos` updated.
     */
    setPosition(pos) {
      return new LazyParseError(() => this.eval().setPosition(pos));
    }

    /**
     * LazyParseError#setMessages(msgs: Array[ErrorMessage]): ParseError
     *
     * Creates a new parse error with `msgs` updated.
     */
    setMessages(msgs) {
      return new LazyParseError(() => this.eval().setMessages(msgs));
    }

    /**
     * LazyParseError#addMessages(msgs: Array[ErrorMessage]): ParseError
     *
     * Creates a new parse error with the given messages added.
     */
    addMessages(msgs) {
      return new LazyParseError(() => this.eval().addMessages(msgs));
    }

    /**
     * LazyParseError#setSpecificTypeMessages(
     *   type: ErrorMessageType,
     *   msgStrs: Array[string]
     * ): ParseError
     *
     * Creates a new parse error with all of the specific type of messages overwritten.
     */
    setSpecificTypeMessages(type, msgStrs) {
      return new LazyParseError(() => this.eval().setSpecificTypeMessages(type, msgStrs));
    }
  }

  LazyParseError.prototype[parseErrorTypeKey] = ParseErrorType.LAZY;

  return Object.freeze({
    ErrorMessageType,
    ErrorMessage,
    ParseError,
    StrictParseError,
    LazyParseError,
    _internal: {
      cleanMessageStrings,
      joinWithCommasOr,
      joinMessageStrings,
    },
  });
};
