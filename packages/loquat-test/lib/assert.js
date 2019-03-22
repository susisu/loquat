"use strict";

module.exports = ({ _core, _aux }) => (chai, utils) => {
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
    const { ErrorMessage } = _core;
    const { equal, inspect } = _aux.ErrorMessage;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(ErrorMessage);

    this.assert(
      equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });

  Assertion.addMethod("equalErrorMessagesTo", function (exp) {
    const { ErrorMessage, show } = _core;
    const { equalArray, inspectArray } = _aux.ErrorMessage;

    const act = this._obj;

    new Assertion(act).assert(
      act.every(msg => msg instanceof ErrorMessage),
      `expected ${show(act)} to be an ErrorMessage array`,
      `expected ${show(act)} to not be an ErrorMessage array`
    );

    this.assert(
      equalArray(act, exp),
      `expected ${inspectArray(act)} to equal ${inspectArray(exp)}`,
      `expected ${inspectArray(act)} to not equal ${inspectArray(exp)}`
    );
  });

  Assertion.addMethod("equalErrorTo", function (exp) {
    const { AbstractParseError } = _core;
    const { equal, inspect } = _aux.ParseError;

    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(AbstractParseError);

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
};
