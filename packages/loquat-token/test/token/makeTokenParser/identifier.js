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

describe(".identifier", () => {
  context("when `caseSensitive' is true", () => {
    it("should parse an identifier", () => {
      const def = new LanguageDef({
        idStart      : idStart,
        idLetter     : idLetter,
        caseSensitive: true,
      });
      const tp = makeTokenParser(def);
      const identifier = tp.identifier;
      expect(identifier).to.be.a.parser;
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "nyan0CAT XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = identifier.run(initState);
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
            "nyan0CAT",
            new State(
              new Config({ tabWidth: 8 }),
              "XYZ",
              new SourcePos("foobar", 1, 10),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "0nyanCAT XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = identifier.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
                ErrorMessage.create(ErrorMessageType.EXPECT, "identifier"),
              ]
            )
          )
        )).to.be.true;
      }
    });

    it("should not accept reserved word", () => {
      {
        const def = new LanguageDef({
          idStart      : idStart,
          idLetter     : idLetter,
          reservedIds  : [],
          caseSensitive: true,
        });
        const tp = makeTokenParser(def);
        const identifier = tp.identifier;
        expect(identifier).to.be.a.parser;
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "if XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          );
          const res = identifier.run(initState);
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
              "if",
              new State(
                new Config({ tabWidth: 8 }),
                "XYZ",
                new SourcePos("foobar", 1, 4),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "IF XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          );
          const res = identifier.run(initState);
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
              "IF",
              new State(
                new Config({ tabWidth: 8 }),
                "XYZ",
                new SourcePos("foobar", 1, 4),
                "none"
              )
            )
          )).to.be.true;
        }
      }
      {
        const def = new LanguageDef({
          idStart      : idStart,
          idLetter     : idLetter,
          reservedIds  : ["if", "then", "else", "let", "in", "do"],
          caseSensitive: true,
        });
        const tp = makeTokenParser(def);
        const identifier = tp.identifier;
        expect(identifier).to.be.a.parser;
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "if XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(Result.equal(
            res,
            Result.efail(
              new StrictParseError(
                new SourcePos("foobar", 1, 3),
                [
                  ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
                  ErrorMessage.create(ErrorMessageType.UNEXPECT, "reserved word " + show("if")),
                ]
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "IF XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          );
          const res = identifier.run(initState);
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
              "IF",
              new State(
                new Config({ tabWidth: 8 }),
                "XYZ",
                new SourcePos("foobar", 1, 4),
                "none"
              )
            )
          )).to.be.true;
        }
      }
    });
  });

  context("when `caseSensitive' is false", () => {
    it("should parse an identifier", () => {
      const def = new LanguageDef({
        idStart      : idStart,
        idLetter     : idLetter,
        caseSensitive: false,
      });
      const tp = makeTokenParser(def);
      const identifier = tp.identifier;
      expect(identifier).to.be.a.parser;
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "nyan0CAT XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = identifier.run(initState);
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
            "nyan0CAT",
            new State(
              new Config({ tabWidth: 8 }),
              "XYZ",
              new SourcePos("foobar", 1, 10),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "0nyanCAT XYZ",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = identifier.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
                ErrorMessage.create(ErrorMessageType.EXPECT, "identifier"),
              ]
            )
          )
        )).to.be.true;
      }
    });

    it("should not accept reserved word", () => {
      {
        const def = new LanguageDef({
          idStart      : idStart,
          idLetter     : idLetter,
          reservedIds  : [],
          caseSensitive: false,
        });
        const tp = makeTokenParser(def);
        const identifier = tp.identifier;
        expect(identifier).to.be.a.parser;
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "if XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          );
          const res = identifier.run(initState);
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
              "if",
              new State(
                new Config({ tabWidth: 8 }),
                "XYZ",
                new SourcePos("foobar", 1, 4),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "IF XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          );
          const res = identifier.run(initState);
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
              "IF",
              new State(
                new Config({ tabWidth: 8 }),
                "XYZ",
                new SourcePos("foobar", 1, 4),
                "none"
              )
            )
          )).to.be.true;
        }
      }
      {
        const def = new LanguageDef({
          idStart      : idStart,
          idLetter     : idLetter,
          reservedIds  : ["if", "then", "else", "let", "in", "do"],
          caseSensitive: false,
        });
        const tp = makeTokenParser(def);
        const identifier = tp.identifier;
        expect(identifier).to.be.a.parser;
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "if XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(Result.equal(
            res,
            Result.efail(
              new StrictParseError(
                new SourcePos("foobar", 1, 3),
                [
                  ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
                  ErrorMessage.create(ErrorMessageType.UNEXPECT, "reserved word " + show("if")),
                ]
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "IF XYZ",
            new SourcePos("foobar", 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(Result.equal(
            res,
            Result.efail(
              new StrictParseError(
                new SourcePos("foobar", 1, 3),
                [
                  ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
                  ErrorMessage.create(ErrorMessageType.UNEXPECT, "reserved word " + show("IF")),
                ]
              )
            )
          )).to.be.true;
        }
      }
    });
  });
});
