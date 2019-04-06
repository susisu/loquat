"use strict";

const { expect } = require("chai");

const { cleanMessageStrings } = _error._internal;

describe("cleanMessageStrings", () => {
  it("should remove empty or duplicate messages", () => {
    expect(cleanMessageStrings([])).to.deep.equal([]);
    {
      const strs = ["", ""];
      expect(cleanMessageStrings(strs)).to.deep.equal([]);
    }
    {
      const strs = [
        "",
        "foo",
        "bar",
        "",
        "foo",
        "baz",
        "foo",
        "bar",
      ];
      expect(cleanMessageStrings(strs)).to.deep.equal([
        "foo",
        "bar",
        "baz",
      ]);
    }
  });
});
