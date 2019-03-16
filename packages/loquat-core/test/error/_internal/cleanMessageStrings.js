"use strict";

const { expect } = require("chai");

const { cleanMessageStrings } = _error._internal;

describe("cleanMessageStrings", () => {
  it("should remove empty or duplicate messages", () => {
    expect(cleanMessageStrings([])).to.deep.equal([]);
    {
      const msgStrs = ["", ""];
      expect(cleanMessageStrings(msgStrs)).to.deep.equal([]);
    }
    {
      const msgStrs = [
        "",
        "foo",
        "bar",
        "",
        "foo",
        "baz",
        "foo",
        "bar",
      ];
      expect(cleanMessageStrings(msgStrs)).to.deep.equal([
        "foo",
        "bar",
        "baz",
      ]);
    }
  });
});
