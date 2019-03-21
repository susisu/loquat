"use strict";

module.exports = ({ _core, _aux }) => (chai, utils) => {
  const { SourcePos } = _core;

  const { Assertion } = chai;

  Assertion.addMethod("equalPositionTo", function (exp) {
    const { equal, inspect } = _aux.SourcePos;
    const act = this._obj;

    new Assertion(act).to.be.an.instanceOf(SourcePos);

    this.assert(
      equal(act, exp),
      `expected ${inspect(act)} to equal ${inspect(exp)}`,
      `expected ${inspect(act)} to not equal ${inspect(exp)}`
    );
  });
};
