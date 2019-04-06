"use strict";

const { expect } = require("chai");

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
} = _core;

const { regexp } = _char;

describe("regexp", () => {
  it("should create a parser that accepts a string that the given regular expression"
    + " matches and returns the matched string", () => {
    // empty match
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(new RegExp("", "u"), 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(new SourcePos("main", 0, 1, 1)),
        "",
        new State(
          new Config(),
          "XYZ",
          new SourcePos("main", 0, 1, 1),
          "none"
        )
      ));
    }
    // many characters match
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/.{2}/u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 3)),
        "XY",
        new State(
          new Config(),
          "Z",
          new SourcePos("main", 2, 1, 3),
          "none"
        )
      ));
    }
    // use default groupId = 0
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/.{2}/u);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 3)),
        "XY",
        new State(
          new Config(),
          "Z",
          new SourcePos("main", 2, 1, 3),
          "none"
        )
      ));
    }
    // specify groupId
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/(.)(.)/u, 2);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 3)),
        "Y",
        new State(
          new Config(),
          "Z",
          new SourcePos("main", 2, 1, 3),
          "none"
        )
      ));
    }
    // no matches
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/abc/u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
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
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/xy/u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.EXPECT, show(/xy/u))]
        )
      ));
    }
    // used
    {
      const initState = new State(
        new Config(),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/xy/iu, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 3)),
        "XY",
        new State(
          new Config(),
          "Z",
          new SourcePos("main", 2, 1, 3),
          "none"
        )
      ));
    }
  });

  it("`$` should match at the end of a line if `m` flag is used", () => {
    // not used
    {
      const initState = new State(
        new Config(),
        "XY\nZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/XY$/u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.EXPECT, show(/XY$/u))]
        )
      ));
    }
    // used
    {
      const initState = new State(
        new Config(),
        "XY\nZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/XY$/mu, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 3)),
        "XY",
        new State(
          new Config(),
          "\nZ",
          new SourcePos("main", 2, 1, 3),
          "none"
        )
      ));
    }
  });

  it("should enable unicode features if `u` flag is used", () => {
    // not used
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/./, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "\uD83C",
        new State(
          new Config({ unicode: false }),
          "\uDF63XYZ",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/\u{1F363}/, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.EXPECT, show(/\u{1F363}/))]
        )
      ));
    }
    // used
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/./u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 2)),
        "\uD83C\uDF63",
        new State(
          new Config({ unicode: true }),
          "XYZ",
          new SourcePos("main", 2, 1, 2),
          "none"
        )
      ));
    }
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/\u{1F363}/u, 0);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 2)),
        "\uD83C\uDF63",
        new State(
          new Config({ unicode: true }),
          "XYZ",
          new SourcePos("main", 2, 1, 2),
          "none"
        )
      ));
    }
  });

  it("should throw Error if the input stream is not a string", () => {
    // Array
    {
      const initState = new State(
        new Config({ unicode: true }),
        ["X", "Y", "Z"],
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/./u, 0);
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
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/./u, 0);
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
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/./, 0);
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
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = regexp(/./u, 0);
      expect(parser).to.be.a.parser;
      expect(() => {
        parser.run(initState);
      }).to.throw(Error, /unicode flag does not match/);
    }
  });
});
