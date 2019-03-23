"use strict";

module.exports = ({ _core }) => {
  const { show } = _core;

  function mkInspect(className, props) {
    const fullProps = props.map(prop =>
      typeof prop === "object"
        ? Object.assign({ inspector: show }, prop)
        : { name: prop, inspector: show }
    );
    return obj => {
      const propsStr = fullProps.map(({ name, inspector }) => {
        const val = obj[name];
        return `${name} = ${inspector(val)}`;
      }).join(", ");
      return `${className}(${propsStr})`;
    };
  }

  function eqeqeq(x, y) {
    return x === y;
  }

  function mkEqual(props) {
    const fullProps = props.map(prop =>
      typeof prop === "object"
        ? Object.assign({ eq: eqeqeq, allowEqOverriding: false }, prop)
        : { name: prop, eq: eqeqeq, allowEqOverriding: false }
    );
    return (objA, objB, ...eqs) => {
      for (const prop of fullProps) {
        const { name, eq, allowEqOverriding } = prop;
        const valA = objA[name];
        const valB = objB[name];
        let ok;
        if (allowEqOverriding) {
          const overridingEq = eqs.shift();
          if (overridingEq !== undefined) {
            ok = overridingEq(valA, valB);
          } else {
            ok = eq(valA, valB);
          }
        } else {
          ok = eq(valA, valB);
        }
        if (!ok) {
          return false;
        }
      }
      return true;
    };
  }

  const SourcePos = {
    inspect: mkInspect("SourcePos", ["name", "index", "line", "column"]),
    equal  : mkEqual(["name", "index", "line", "column"]),
  };

  const ErrorMessage = {
    inspect     : mkInspect("ErrorMessage", ["type", "str"]),
    equal       : mkEqual(["type", "str"]),
    inspectArray: msgs => "[" + msgs.map(ErrorMessage.inspect).join(", ") + "]",
    equalArray  : (msgsA, msgsB) => {
      if (msgsA.length !== msgsB.length) {
        return false;
      }
      const len = msgsA.length;
      for (let i = 0; i < len; i++) {
        if (!ErrorMessage.equal(msgsA[i], msgsB[i])) {
          return false;
        }
      }
      return true;
    },
  };

  const ParseError = {
    inspect: mkInspect("ParseError", [
      { name: "pos", inspector: SourcePos.inspect },
      { name: "msgs", inspector: ErrorMessage.inspectArray },
    ]),
    equal: mkEqual([
      { name: "pos", eq: SourcePos.equal },
      { name: "msgs", eq: ErrorMessage.equalArray },
    ]),
  };

  const Config = {
    inspect: mkInspect("Config", ["tabWidth", "unicode"]),
    equal  : mkEqual(["tabWidth", "unicode"]),
  };

  const State = {
    inspect: mkInspect("State", [
      { name: "config", inspector: Config.inspect },
      { name: "input" },
      { name: "pos", inspector: SourcePos.inspect },
      { name: "userState" },
    ]),
    equal: mkEqual([
      { name: "config", eq: Config.equal },
      { name: "input", allowEqOverriding: true },
      { name: "pos", eq: SourcePos.equal },
      { name: "userState", allowEqOverriding: true },
    ]),
  };

  const Success = {
    inspect: mkInspect("Result", [
      { name: "consumed" },
      { name: "success" },
      { name: "err", inspector: ParseError.inspect },
      { name: "val" },
      { name: "state", inspector: State.inspect },
    ]),
    equal: (resA, resB, valEqual, inputEqual, userStateEqual) =>
      resA.success === resB.success
        && resA.consumed === resB.consumed
        && ParseError.equal(resA.err, resB.err)
        && (valEqual !== undefined ? valEqual(resA.val, resB.val) : resA.val === resB.val)
        && State.equal(resA.state, resB.state, inputEqual, userStateEqual),
  };

  const Failure = {
    inspect: mkInspect("Result", [
      { name: "consumed" },
      { name: "success" },
      { name: "err", inspector: ParseError.inspect },
    ]),
    equal: (resA, resB) =>
      resA.success === resB.success
        && resA.consumed === resB.consumed
        && ParseError.equal(resA.err, resB.err),
  };

  const Result = {
    inspect: res => res.success ? Success.inspect(res) : Failure.inspect(res),
    equal  : (resA, resB, ...eqs) => resA.success && resB.success
      ? Success.equal(resA, resB, ...eqs)
      : Failure.equal(resA, resB, ...eqs),
  };

  return Object.freeze({
    SourcePos,
    ErrorMessage,
    ParseError,
    Config,
    State,
    Result,
    _internal: {
      mkInspect,
      mkEqual,
    },
  });
};
