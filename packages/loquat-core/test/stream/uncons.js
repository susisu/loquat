"use strict";

const { expect } = require("chai");

const { uncons } = _stream;

describe("uncons", () => {
  context("string input", () => {
    it("should return an empty result if the input is an empty string", () => {
      expect(uncons("", false)).to.deep.equal({ empty: true });
      expect(uncons("", true)).to.deep.equal({ empty: true });
    });

    it("should return an result containing the first character and the rest", () => {
      expect(uncons("foobar", false)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });
      expect(uncons("foobar", true)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });

      expect(uncons("\uD83C\uDF63cat", false))
        .to.deep.equal({ empty: false, head: "\uD83C", tail: "\uDF63cat" });
      expect(uncons("\uD83C\uDF63cat", true))
        .to.deep.equal({ empty: false, head: "\uD83C\uDF63", tail: "cat" });
    });
  });

  context("array input", () => {
    it("should return an empty result if the input is an empty array", () => {
      expect(uncons([], false)).to.deep.equal({ empty: true });
      expect(uncons([], true)).to.deep.equal({ empty: true });
    });

    it("should return a result containing the first element and the rest", () => {
      expect(uncons(["foo", "bar", "baz"], false))
        .to.deep.equal({ empty: false, head: "foo", tail: ["bar", "baz"] });
      expect(uncons(["foo", "bar", "baz"], true))
        .to.deep.equal({ empty: false, head: "foo", tail: ["bar", "baz"] });
    });
  });

  context("stream input", () => {
    it("should return an empty result if the input is an empty stream", () => {
      {
        const stream = {
          uncons: unicode => {
            expect(unicode).to.be.false;
            return { empty: true };
          },
        };
        expect(uncons(stream, false)).to.deep.equal({ empty: true });
      }
      {
        const stream = {
          uncons: unicode => {
            expect(unicode).to.be.true;
            return { empty: true };
          },
        };
        expect(uncons(stream, true)).to.deep.equal({ empty: true });
      }
    });

    it("should return a result containing the first token and the rest", () => {
      {
        const tail = {
          uncons: unicode => {
            expect(unicode).to.be.false;
            return { empty: true };
          },
        };
        const stream = {
          uncons: unicode => {
            expect(unicode).to.be.false;
            return {
              empty: false,
              head : "nyancat",
              tail : tail,
            };
          },
        };
        expect(uncons(stream, false)).to.deep.equal({ empty: false, head: "nyancat", tail: tail });
      }
      {
        const tail = {
          uncons: unicode => ({ empty: true }),
        };
        const stream = {
          uncons: unicode => {
            expect(unicode).to.be.true;
            return {
              empty: false,
              head : "nyancat",
              tail : tail,
            };
          },
        };
        expect(uncons(stream, true)).to.deep.equal({ empty: false, head: "nyancat", tail: tail });
      }
    });
  });


  it("should throw `TypeError` if the input does not implement `Stream[S]`", () => {
    expect(() => { uncons({}, false); }).to.throw(TypeError, /input is not a stream/i);
    expect(() => { uncons({}, true); }).to.throw(TypeError, /input is not a stream/i);
  });

  it("should throw `TypeError` if the input is not a string, an array, nor an object", () => {
    const values = [
      null,
      undefined,
      42,
      true,
      () => {},
    ];
    for (const value of values) {
      expect(() => { uncons(value, false); }).to.throw(TypeError, /input is not a stream/i);
      expect(() => { uncons(value, true); }).to.throw(TypeError, /input is not a stream/i);
    }
  });
});
