"use strict";

describe("SourcePos", () => {
  require("./SourcePos/init");
  require("./SourcePos/equal");
  require("./SourcePos/compare");

  require("./SourcePos/constructor");
  require("./SourcePos/toString");
  require("./SourcePos/setName");
  require("./SourcePos/setIndex");
  require("./SourcePos/setLine");
  require("./SourcePos/setColumn");
  require("./SourcePos/addChar");
  require("./SourcePos/addString");
});
