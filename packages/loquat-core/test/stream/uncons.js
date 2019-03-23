"use strict";

const { expect } = require("chai");

const { Config } = _parser;
const { uncons } = _stream;

describe("uncons", () => {
  context("string input", () => {
    it("should return an empty result if the input is an empty string", () => {
      {
        const config = new Config({ tabWidth: 4, unicode: false });
        expect(uncons("", config)).to.deep.equal({ empty: true });
      }
      {
        const config = new Config({ tabWidth: 4, unicode: true });
        expect(uncons("", config)).to.deep.equal({ empty: true });
      }
    });

    it("should return an result containing the first character and the rest", () => {
      {
        const config = new Config({ tabWidth: 4, unicode: false });
        expect(uncons("foobar", config)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });
        expect(uncons("\uD83C\uDF63cat", config))
          .to.deep.equal({ empty: false, head: "\uD83C", tail: "\uDF63cat" });
      }
      {
        const config = new Config({ tabWidth: 4, unicode: true });
        expect(uncons("foobar", config)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });
        expect(uncons("\uD83C\uDF63cat", config))
          .to.deep.equal({ empty: false, head: "\uD83C\uDF63", tail: "cat" });
      }
    });
  });

  context("array input", () => {
    it("should return an empty result if the input is an empty array", () => {
      {
        const config = new Config({ tabWidth: 4, unicode: false });
        expect(uncons([], config)).to.deep.equal({ empty: true });
      }
      {
        const config = new Config({ tabWidth: 4, unicode: true });
        expect(uncons([], config)).to.deep.equal({ empty: true });
      }
    });

    it("should return a result containing the first element and the rest", () => {
      {
        const config = new Config({ tabWidth: 4, unicode: false });
        expect(uncons(["foo", "bar", "baz"], config))
          .to.deep.equal({ empty: false, head: "foo", tail: ["bar", "baz"] });
      }
      {
        const config = new Config({ tabWidth: 4, unicode: true });
        expect(uncons(["foo", "bar", "baz"], config))
          .to.deep.equal({ empty: false, head: "foo", tail: ["bar", "baz"] });
      }
    });
  });

  context("stream input", () => {
    it("should return an empty result if the input is an empty stream", () => {
      const config = new Config({ tabWidth: 4, unicode: true });
      const stream = {
        uncons: config => {
          expect(config).to.be.an.equalConfigTo(new Config({ tabWidth: 4, unicode: true }));
          return { empty: true };
        },
      };
      expect(uncons(stream, config)).to.deep.equal({ empty: true });
    });

    it("should return a result containing the first token and the rest", () => {
      const config = new Config({ tabWidth: 4, unicode: true });
      const tail = {
        uncons: config => ({ empty: true }),
      };
      const stream = {
        uncons: config => {
          expect(config).to.be.an.equalConfigTo(new Config({ tabWidth: 4, unicode: true }));
          return {
            empty: false,
            head : "foo",
            tail : tail,
          };
        },
      };
      expect(uncons(stream, config)).to.deep.equal({ empty: false, head: "foo", tail: tail });
    });
  });


  it("should throw `TypeError` if the input does not implement `Stream[S]`", () => {
    const config = new Config({ tabWidth: 4, unicode: true });
    expect(() => { uncons({}, config); }).to.throw(TypeError, /input is not a stream/i);
  });

  it("should throw `TypeError` if the input is not a string, an array, nor an object", () => {
    const values = [
      null,
      undefined,
      42,
      true,
      () => {},
    ];
    const config = new Config({ tabWidth: 4, unicode: true });
    for (const value of values) {
      expect(() => { uncons(value, config); }).to.throw(TypeError, /input is not a stream/i);
    }
  });
});
