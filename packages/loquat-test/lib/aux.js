"use strict";

module.exports = _core => {
  const { show } = _core;

  function mkInspect(name, props) {
    return obj => {
      const propsStr = props.map(name => `${name} = ${show(obj[name])}`).join(", ");
      return `${name}(${propsStr})`;
    };
  }

  function mkEqual(props) {
    return (objA, objB, ...eqs) => {
      for (const prop of props) {
        const name = Array.isArray(prop) ? prop[0] : prop;
        const allowEqualityOverriding = Array.isArray(prop) ? !!prop[1] : false;
        const valA = objA[name];
        const valB = objB[name];
        let ok;
        if (allowEqualityOverriding) {
          const eq = eqs.shift();
          if (eq !== undefined) {
            ok = eq(valA, valB);
          } else {
            ok = valA === valB;
          }
        } else {
          ok = valA === valB;
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

  return {
    SourcePos,
  };
};
