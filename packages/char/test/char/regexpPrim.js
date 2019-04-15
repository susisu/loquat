"use strict";

const chai = require("chai");
const { expect } = chai;

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  ParseError,
  StrictParseError,
  Config,
  State,
  Result,
} = $core;

const { regexpPrim } = $char;

describe("regexpPrim", () => {
  it("should create a parser that accepts a string that the given regular expression"
    + " matches and returns an array containing the matched strings", () => {
    // empty match
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(new RegExp("", "u"));
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          ParseError.unknown(new SourcePos("main", 1, 1)),
          [""],
          new State(
            new Config(),
            "XYZ",
            new SourcePos("main", 1, 1),
            "none"
          )
        ),
        chai.util.eql
      );
    }
    // many characters match with groups
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/(.)(.)/u);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          ParseError.unknown(new SourcePos("main", 1, 3)),
          ["XY", "X", "Y"],
          new State(
            new Config(),
            "Z",
            new SourcePos("main", 1, 3),
            "none"
          )
        ),
        chai.util.eql
      );
    }
    // no matches
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/abc/u);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.EXPECT, show(/abc/u))]
        )
      ));
    }
  });

  it("should ignore case if `i` flag is used", () => {
    // not used
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/xy/u);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.EXPECT, show(/xy/u))]
        )
      ));
    }
    // used
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/xy/iu);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          ParseError.unknown(new SourcePos("main", 1, 3)),
          ["XY"],
          new State(
            new Config(),
            "Z",
            new SourcePos("main", 1, 3),
            "none"
          )
        ),
        chai.util.eql
      );
    }
  });

  it("`$` should match at the end of a line if `m` flag is used", () => {
    // not used
    {
      const initState = new State(
        new Config(),
        "XY\nZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/XY$/u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.EXPECT, show(/XY$/u))]
        )
      ));
    }
    // used
    {
      const initState = new State(
        new Config(),
        "XY\nZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/XY$/mu, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          ParseError.unknown(new SourcePos("main", 1, 3)),
          ["XY"],
          new State(
            new Config(),
            "\nZ",
            new SourcePos("main", 1, 3),
            "none"
          )
        ),
        chai.util.eql
      );
    }
  });

  it("should enable unicode features if `u` flag is used", () => {
    // not used
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/./);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          ParseError.unknown(new SourcePos("main", 1, 2)),
          ["\uD83C"],
          new State(
            new Config({ unicode: false }),
            "\uDF63XYZ",
            new SourcePos("main", 1, 2),
            "none"
          )
        ),
        chai.util.eql
      );
    }
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/\u{1F363}/);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [ErrorMessage.create(ErrorMessageType.EXPECT, show(/\u{1F363}/))]
        )
      ));
    }
    // used
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/./u);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          ParseError.unknown(new SourcePos("main", 1, 2)),
          ["\uD83C\uDF63"],
          new State(
            new Config({ unicode: true }),
            "XYZ",
            new SourcePos("main", 1, 2),
            "none"
          )
        ),
        chai.util.eql
      );
    }
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/\u{1F363}/u);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          ParseError.unknown(new SourcePos("main", 1, 2)),
          ["\uD83C\uDF63"],
          new State(
            new Config({ unicode: true }),
            "XYZ",
            new SourcePos("main", 1, 2),
            "none"
          )
        ),
        chai.util.eql
      );
    }
  });

  it("should throw Error if the input stream is not a string", () => {
    // Array
    {
      const initState = new State(
        new Config({ unicode: true }),
        ["X", "Y", "Z"],
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/./u);
      expect(parser).to.be.a.parser;
      expect(() => {
        parser.run(initState);
      }).to.throw(Error, /regexp/);
    }
    // IStream
    {
      const initState = new State(
        new Config({ unicode: true }),
        { uncons: () => ({ empty: true }) },
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/./u);
      expect(parser).to.be.a.parser;
      expect(() => {
        parser.run(initState);
      }).to.throw(Error, /regexp/);
    }
  });

  it("should throw Error if the unicode flag of the config and `u` flag of the regular expression"
    + " does not match", () => {
    // unicode = true, u not specified
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/./);
      expect(parser).to.be.a.parser;
      expect(() => {
        parser.run(initState);
      }).to.throw(Error, /unicode flag does not match/);
    }
    // unicode = false, u specified
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 1, 1),
        "none"
      );
      const parser = regexpPrim(/./u);
      expect(parser).to.be.a.parser;
      expect(() => {
        parser.run(initState);
      }).to.throw(Error, /unicode flag does not match/);
    }
  });
});
