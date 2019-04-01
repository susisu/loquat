"use strict";

module.exports = ({ _core, _aux }) => chai => {
  const { Assertion } = chai;

  Assertion.addMethod("equalPositionTo", function (exp) {
    const { SourcePos } = _core;
    const { equal, inspect } = _aux.SourcePos;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(SourcePos);

    this.assert(
      equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalErrorMessageTo", function (exp) {
    const { equal, inspect } = _aux.ErrorMessage;

    const act = this._obj;

    this.assert(
      equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalErrorMessagesTo", function (exp) {
    const { equalArray, inspectArray } = _aux.ErrorMessage;

    const act = this._obj;

    this.assert(
      equalArray(act, exp),
      `expected ${inspectArray(act)} to equal ${inspectArray(exp)}`,
      `expected ${inspectArray(act)} to not equal ${inspectArray(exp)}`
    );
  });

  Assertion.addMethod("equalErrorTo", function (exp) {
    const { ParseError } = _core;
    const { equal, inspect } = _aux.ParseError;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(ParseError);

    this.assert(
      equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalConfigTo", function (exp) {
    const { Config } = _core;
    const { equal, inspect } = _aux.Config;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(Config);

    this.assert(
      equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalStateTo", function (exp, inputEqual, userStateEqual) {
    const { State } = _core;
    const { equal, inspect } = _aux.State;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(State);

    this.assert(
      equal(act, exp, inputEqual, userStateEqual),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalResultTo", function (exp, valEqual, inputEqual, userStateEqual) {
    const { equal, inspect } = _aux.Result;

    const act = this._obj;

    this.assert(
      equal(act, exp, valEqual, inputEqual, userStateEqual),
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
