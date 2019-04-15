"use strict";

module.exports = ({ $core }) => {
  const { show } = $core;

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

  const SourcePos = {
    inspect: mkInspect("SourcePos", ["name", "line", "column"]),
  };

  const ErrorMessage = {
    inspect     : mkInspect("ErrorMessage", ["type", "str"]),
    inspectArray: msgs => "[" + msgs.map(ErrorMessage.inspect).join(", ") + "]",
  };

  const ParseError = {
    inspect: mkInspect("ParseError", [
      { name: "pos", inspector: SourcePos.inspect },
      { name: "msgs", inspector: ErrorMessage.inspectArray },
    ]),
  };

  const Config = {
    inspect: mkInspect("Config", ["tabWidth", "unicode"]),
  };

  const State = {
    inspect: mkInspect("State", [
      { name: "config", inspector: Config.inspect },
      { name: "input" },
      { name: "pos", inspector: SourcePos.inspect },
      { name: "userState" },
    ]),
  };

  const Success = {
    inspect: mkInspect("Result", [
      { name: "success" },
      { name: "consumed" },
      { name: "err", inspector: ParseError.inspect },
      { name: "val" },
      { name: "state", inspector: State.inspect },
    ]),
  };

  const Failure = {
    inspect: mkInspect("Result", [
      { name: "success" },
      { name: "consumed" },
      { name: "err", inspector: ParseError.inspect },
    ]),
  };

  const Result = {
    inspect: res => res.success ? Success.inspect(res) : Failure.inspect(res),
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
    },
  });
};
