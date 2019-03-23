"use strict";

module.exports = ({ _pos }) => {
  const { SourcePos } = _pos;

  /**
   * type ErrorMessageType = "systemUnexpect" | "unexpect" | "expect" | "message"
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
   *   static equal(msgA: ErrorMessage, msgB: ErrorMessage): boolean
   *   static messagesToString(msgs: Array[ErrorMessage]): string
   *   static messagesEqual(msgsA: Array[ErrorMessage], msgsB: Array[ErrorMessage]): bool
   * }
   */
  class ErrorMessage {
    constructor(type, msgStr) {
      this._type   = type;
      this._msgStr = msgStr;
    }

    /**
     * ErrorMessage.messagesToString(msgs: Array[ErrorMessage]): string
     *
     * Prints error messages in human readable format.
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
                joinMessageStrings(cleanMessageStrings(defaultMessages), ""),
      ];
      return cleanMessageStrings(msgStrs).join("\n");
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
   * trait AbstractParseError {
   *   pos: SourcePos
   *   msgs: Array[ErrorMessage]
   *   toString(): string
   *   isUnknown(): boolean
   *   setPosition(pos: SourcePos): AbstractParseError
   *   setMessages(msgs: Array[ErrorMessage]): AbstractParseError
   *   addMessages(msgs: Array[ErrorMessage]): AbstractParseError
   *   setSpecificTypeMessages(type: ErrorMessageType, msgStrs: Array[string]): AbstractParseError
   * }
   */
  class AbstractParseError {
    constructor() {
      if (this.constructor === AbstractParseError) {
        throw new Error("cannot create AbstractParseError object");
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
   * class ParseError(pos: SourcePos, msgs: Array[ErrorMessage]) extends AbstractParseError {
   *   static unknown(pos: SourcePos): ParseError
   *   static equal(errA: ParseError, errB: ParseError): bool
   *   static merge(errA: ParseError, errB: ParseError): AbstractParseError
   * }
   */
  class ParseError extends AbstractParseError {
    constructor(pos, msgs) {
      super();
      this._pos  = pos;
      this._msgs = msgs;
    }

    /**
     * ParseError.unknown(pos: SourcePos): ParseError
     */
    static unknown(pos) {
      return new ParseError(pos, []);
    }

    /**
     * ParseError.merge(errA: ParseError, errB: ParseError): AbstractParseError
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

    get pos() {
      return this._pos;
    }

    get msgs() {
      return this._msgs;
    }

    /**
     * ParseError#toString(): string
     *
     * Returns a human readable error message.
     */
    toString() {
      return `${this.pos}:\n${ErrorMessage.messagesToString(this.msgs)}`;
    }

    /**
     * ParseError#isUnknown(): boolean
     *
     * Checks if the parse error is unknonw i.e. has no messages.
     */
    isUnknown() {
      return this.msgs.length === 0;
    }

    /**
     * ParseError#setPosition(pos: SourcePos): AbstractParseError
     *
     * Creates a new parse error with `pos` updated.
     */
    setPosition(pos) {
      return new ParseError(pos, this.msgs);
    }

    /**
     * ParseError#setMessages(msgs: Array[ErrorMessage]): AbstractParseError
     *
     * Creates a new parse error with `msgs` updated.
     */
    setMessages(msgs) {
      return new ParseError(this.pos, msgs);
    }

    /**
     * ParseError#addMessages(msgs: Array[ErrorMessage]): AbstractParseError
     *
     * Creates a new parse error with the given messages added.
     */
    addMessages(msgs) {
      return new LazyParseError(() => new ParseError(this.pos, this.msgs.concat(msgs)));
    }

    /**
     * ParseError#setSpecificTypeMessages(
     *   type: ErrorMessageType,
     *   msgStrs: Array[string]
     * ): AbstractParseError
     *
     * Creates a new parse error with all of the specific type of messages overwritten.
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
   * class LazyParseError(thunk: () => AbstractParseError) extends AbstractParseError {
   *   pos: SourcePos,
   *   msgs: Array[ErrorMessage]
   *   eval(): ParseError
   * }
   */
  class LazyParseError extends AbstractParseError {
    constructor(thunk) {
      super();
      this._thunk = thunk;
      this._cache = undefined;
    }

    /**
     * LazyParseError#eval(): ParseError
     *
     * Evalutates the thunk and returns a fully-evaluated parse error.
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
        } else {
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
     * LazyParseError#setPosition(pos: SourcePos): AbstractParseError
     *
     * Creates a new parse error with `pos` updated.
     */
    setPosition(pos) {
      return new LazyParseError(() => this.eval().setPosition(pos));
    }

    /**
     * LazyParseError#setMessages(msgs: Array[ErrorMessage]): AbstractParseError
     *
     * Creates a new parse error with `msgs` updated.
     */
    setMessages(msgs) {
      return new LazyParseError(() => this.eval().setMessages(msgs));
    }

    /**
     * LazyParseError#addMessages(msgs: Array[ErrorMessage]): AbstractParseError
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
     * ): AbstractParseError
     *
     * Creates a new parse error with all of the specific type of messages overwritten.
     */
    setSpecificTypeMessages(type, msgStrs) {
      return new LazyParseError(() => this.eval().setSpecificTypeMessages(type, msgStrs));
    }
  }

  return Object.freeze({
    ErrorMessageType,
    ErrorMessage,
    AbstractParseError,
    ParseError,
    LazyParseError,
    _internal: {
      cleanMessageStrings,
      joinWithCommasOr,
      joinMessageStrings,
    },
  });
};
