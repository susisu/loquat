"use strict";

const { expect } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
  uncons,
} = _core;

const { LanguageDef } = _language;
const { makeTokenParser } = _token;

function genCharParser(re) {
  return new StrictParser(state => {
    const unconsed = uncons(state.input, state.config.unicode);
    if (unconsed.empty) {
      return Result.efail(
        new StrictParseError(
          state.pos,
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "e")]
        )
      );
    } else {
      if (re.test(unconsed.head)) {
        const newPos = state.pos.addChar(unconsed.head, state.config.tabWidth);
        return Result.csucc(
          new StrictParseError(
            newPos,
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "C")]
          ),
          unconsed.head,
          new State(
            state.config,
            unconsed.tail,
            newPos,
            state.userState
          )
        );
      } else {
        return Result.efail(
          new StrictParseError(
            state.pos,
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "e")]
          )
        );
      }
    }
  });
}

const idStart = genCharParser(/[A-Za-z]/);
const idLetter = genCharParser(/[0-9A-Za-z]/);

describe(".reserved(name)", () => {
  context("when `caseSensitive' is true", () => {
    const def = new LanguageDef({
      idStart      : idStart,
      idLetter     : idLetter,
      caseSensitive: true,
    });
    const tp = makeTokenParser(def);
    const reserved = tp.reserved;

    it("should parse a reserved word `name'", () => {
      expect(reserved).to.be.a("function");
      const parser = reserved("nyan0CAT");
      expect(parser).to.be.a.parser;
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "nyan0CAT XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 10),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8, unicode: false }),
              "XYZ",
              new SourcePos("foobar", 1, 10),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "NYAN0CAT XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("N")),
                ErrorMessage.create(ErrorMessageType.EXPECT, show("nyan0CAT")),
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "nyan XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                ErrorMessage.create(ErrorMessageType.EXPECT, show("nyan0CAT")),
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "nyan0CATXYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 10),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "C"),
                ErrorMessage.create(ErrorMessageType.UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of " + show("nyan0CAT")),
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, show("nyan0CAT")),
              ]
            )
          )
        )).to.be.true;
      }
    });

    it("should treat surrogate pairs correctly", () => {
      const parser = reserved("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "\uD83C\uDF63 XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8, unicode: false }),
              "XYZ",
              new SourcePos("foobar", 1, 4),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: true }),
          "\uD83C\uDF63 XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8, unicode: true }),
              "XYZ",
              new SourcePos("foobar", 1, 3),
              "none"
            )
          )
        )).to.be.true;
      }
    });
  });

  context("when `caseSensitive' is false", () => {
    const def = new LanguageDef({
      idStart      : idStart,
      idLetter     : idLetter,
      caseSensitive: false,
    });
    const tp = makeTokenParser(def);
    const reserved = tp.reserved;

    it("should parse a reserved word `name', without considering case", () => {
      expect(reserved).to.be.a("function");
      const parser = reserved("nyan0CAT");
      expect(parser).to.be.a.parser;
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "nyan0CAT XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 10),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8, unicode: false }),
              "XYZ",
              new SourcePos("foobar", 1, 10),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "NYAN0cat XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 10),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8, unicode: false }),
              "XYZ",
              new SourcePos("foobar", 1, 10),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "nyan XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 5),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                ErrorMessage.create(ErrorMessageType.EXPECT, show("nyan0CAT")),
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "nyan0 XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 6),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                ErrorMessage.create(ErrorMessageType.EXPECT, show("nyan0CAT")),
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "nyan0CATXYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 10),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "C"),
                ErrorMessage.create(ErrorMessageType.UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of " + show("nyan0CAT")),
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, show("nyan0CAT")),
              ]
            )
          )
        )).to.be.true;
      }
    });

    it("should treat surrogate pairs correctly", () => {
      const parser = reserved("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: false }),
          "\uD83C\uDF63 XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8, unicode: false }),
              "XYZ",
              new SourcePos("foobar", 1, 4),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8, unicode: true }),
          "\uD83C\uDF63 XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8, unicode: true }),
              "XYZ",
              new SourcePos("foobar", 1, 3),
              "none"
            )
          )
        )).to.be.true;
      }
    });
  });
});
