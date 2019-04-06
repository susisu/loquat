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

describe("identifier", () => {
  function genCharParser(re) {
    return new StrictParser(state => {
      const unconsed = uncons(state.input, state.config);
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
            new State(state.config, unconsed.tail, newPos, state.userState)
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

  context("caseSensitive = true", () => {
    it("should be a parser that parses an identifier", () => {
      const def = LanguageDef.create({
        idStart      : idStart,
        idLetter     : idLetter,
        caseSensitive: true,
      });
      const { identifier } = makeTokenParser(def);
      expect(identifier).to.be.a.parser;
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "nyan0CAT XYZ",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = identifier.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 9, 1, 10),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "nyan0CAT",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 9, 1, 10),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "0nyanCAT XYZ",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = identifier.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "identifier"),
            ]
          )
        ));
      }
    });

    it("should not accept any reserved word", () => {
      {
        const def = LanguageDef.create({
          idStart      : idStart,
          idLetter     : idLetter,
          reservedIds  : [],
          caseSensitive: true,
        });
        const { identifier } = makeTokenParser(def);
        expect(identifier).to.be.a.parser;
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "if XYZ",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 3, 1, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            "if",
            new State(
              new Config({ tabWidth: 8 }),
              "XYZ",
              new SourcePos("main", 3, 1, 4),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "IF XYZ",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 3, 1, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            "IF",
            new State(
              new Config({ tabWidth: 8 }),
              "XYZ",
              new SourcePos("main", 3, 1, 4),
              "none"
            )
          ));
        }
      }
      {
        const def = LanguageDef.create({
          idStart      : idStart,
          idLetter     : idLetter,
          reservedIds  : ["if", "then", "else", "let", "in", "do"],
          caseSensitive: true,
        });
        const { identifier } = makeTokenParser(def);
        expect(identifier).to.be.a.parser;
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "if XYZ",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(res).to.be.an.equalResultTo(Result.efail(
            new StrictParseError(
              new SourcePos("main", 2, 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
                ErrorMessage.create(ErrorMessageType.UNEXPECT, "reserved word " + show("if")),
              ]
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "IF XYZ",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 3, 1, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            "IF",
            new State(
              new Config({ tabWidth: 8 }),
              "XYZ",
              new SourcePos("main", 3, 1, 4),
              "none"
            )
          ));
        }
      }
    });
  });

  context("caseSensitive = false", () => {
    it("should be a parser that parses an identifier", () => {
      const def = LanguageDef.create({
        idStart      : idStart,
        idLetter     : idLetter,
        caseSensitive: false,
      });
      const { identifier } = makeTokenParser(def);
      expect(identifier).to.be.a.parser;
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "nyan0CAT XYZ",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = identifier.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 9, 1, 10),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "nyan0CAT",
          new State(
            new Config({ tabWidth: 8 }),
            "XYZ",
            new SourcePos("main", 9, 1, 10),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "0nyanCAT XYZ",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = identifier.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "identifier"),
            ]
          )
        ));
      }
    });

    it("should not accept any reserved word", () => {
      {
        const def = LanguageDef.create({
          idStart      : idStart,
          idLetter     : idLetter,
          reservedIds  : [],
          caseSensitive: false,
        });
        const { identifier } = makeTokenParser(def);
        expect(identifier).to.be.a.parser;
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "if XYZ",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 3, 1, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            "if",
            new State(
              new Config({ tabWidth: 8 }),
              "XYZ",
              new SourcePos("main", 3, 1, 4),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "IF XYZ",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 3, 1, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            "IF",
            new State(
              new Config({ tabWidth: 8 }),
              "XYZ",
              new SourcePos("main", 3, 1, 4),
              "none"
            )
          ));
        }
      }
      {
        const def = LanguageDef.create({
          idStart      : idStart,
          idLetter     : idLetter,
          reservedIds  : ["if", "then", "else", "let", "in", "do"],
          caseSensitive: false,
        });
        const { identifier } = makeTokenParser(def);
        expect(identifier).to.be.a.parser;
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "if XYZ",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(res).to.be.an.equalResultTo(Result.efail(
            new StrictParseError(
              new SourcePos("main", 2, 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
                ErrorMessage.create(ErrorMessageType.UNEXPECT, "reserved word " + show("if")),
              ]
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "IF XYZ",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = identifier.run(initState);
          expect(res).to.be.an.equalResultTo(Result.efail(
            new StrictParseError(
              new SourcePos("main", 2, 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "e"),
                ErrorMessage.create(ErrorMessageType.UNEXPECT, "reserved word " + show("IF")),
              ]
            )
          ));
        }
      }
    });
  });

  it("should always fails without consumption if either or both of idStart or idLetter is not"
    + " specified", () => {
    const def = LanguageDef.create();
    const { identifier } = makeTokenParser(def);
    expect(identifier).to.be.a.parser;
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "XYZ",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const res = identifier.run(initState);
    expect(res).to.be.an.equalResultTo(Result.efail(
      new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "identifier parser(s) not specified")]
      )
    ));
  });
});
