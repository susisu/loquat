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
};
