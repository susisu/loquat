"use strict";

module.exports = ({ _core, _aux }) => chai => {
  const { Assertion } = chai;

  Assertion.addMethod("equalPositionTo", function (exp) {
    const { SourcePos } = _core;
    const { inspect } = _aux.SourcePos;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(SourcePos);

    this.assert(
      SourcePos.equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalErrorMessageTo", function (exp) {
    const { ErrorMessage } = _core;
    const { inspect } = _aux.ErrorMessage;

    const act = this._obj;

    this.assert(
      ErrorMessage.equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalErrorMessagesTo", function (exp) {
    const { ErrorMessage } = _core;
    const {  inspectArray } = _aux.ErrorMessage;

    const act = this._obj;

    this.assert(
      ErrorMessage.messagesEqual(act, exp),
      `expected ${inspectArray(act)} to equal ${inspectArray(exp)}`,
      `expected ${inspectArray(act)} to not equal ${inspectArray(exp)}`
    );
  });

  Assertion.addMethod("equalErrorTo", function (exp) {
    const { ParseError } = _core;
    const { inspect } = _aux.ParseError;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(ParseError);

    this.assert(
      ParseError.equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalConfigTo", function (exp) {
    const { Config } = _core;
    const {  inspect } = _aux.Config;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(Config);

    this.assert(
      Config.equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalStateTo", function (exp, inputEqual, userStateEqual) {
    const { State } = _core;
    const {  inspect } = _aux.State;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(State);

    this.assert(
      State.equal(act, exp, inputEqual, userStateEqual),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalResultTo", function (exp, valEqual, inputEqual, userStateEqual) {
    const { Result } = _core;
    const { inspect } = _aux.Result;

    const act = this._obj;

    this.assert(
      Result.equal(act, exp, valEqual, inputEqual, userStateEqual),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addProperty("parser", function () {
    const { isParser } = _core;

    const obj = this._obj;

    this.assert(
      isParser(obj),
      "expected #{this} to be a parser",
      "expected #{this} to not be a parser"
    );
  });
};
