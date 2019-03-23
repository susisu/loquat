"use strict";

describe("ParseError", () => {
  require("./ParseError/constructor");
  require("./ParseError/unknown");
  require("./ParseError/merge");
  require("./ParseError/pos");
  require("./ParseError/msgs");
  require("./ParseError/toString");
  require("./ParseError/isUnknown");
  require("./ParseError/setPosition");
  require("./ParseError/setMessages");
  require("./ParseError/addMessages");
  require("./ParseError/setSpecificTypeMessages");
});
