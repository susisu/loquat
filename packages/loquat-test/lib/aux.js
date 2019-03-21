"use strict";

module.exports = ({ _core }) => {
  const { show } = _core;

  function mkInspect(name, props) {
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
      return `${name}(${propsStr})`;
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
    inspect: mkInspect("SourcePos", ["name", "line", "column"]),
    equal  : mkEqual(["name", "line", "column"]),
  };

  const ErrorMessage = {
    inspect: mkInspect("ErrorMessage", ["type", "msgStr"]),
    equal  : mkEqual(["type", "msgStr"]),
  };

  return Object.freeze({
    SourcePos,
    ErrorMessage,
    _internal: {
      mkInspect,
      mkEqual,
    },
  });
};
