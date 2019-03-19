"use strict";

describe("SourcePos", () => {
  require("./SourcePos/constructor");

  require("./SourcePos/init");
  require("./SourcePos/equal");
  require("./SourcePos/compare");

  require("./SourcePos/toString");
  require("./SourcePos/setName");
  require("./SourcePos/setLine");
  require("./SourcePos/setColumn");
  require("./SourcePos/addChar");
  require("./SourcePos/addString");
});
