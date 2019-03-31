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
} = _core;

const { LanguageDef } = _language;
const { makeTokenParser } = _token;

describe(".whiteSpace", () => {
  context("when none of one-line and multi-line comments are given", () => {
    const defs = [
      new LanguageDef({
        nestedComments: false,
      }),
      new LanguageDef({
        commentLine   : "",
        commentStart  : "",
        commentEnd    : "",
        nestedComments: false,
      }),
      new LanguageDef({
        nestedComments: true,
      }),
      new LanguageDef({
        commentLine   : "",
        commentStart  : "",
        commentEnd    : "",
        nestedComments: true,
      }),
    ];

    it("should skip simple white space characters", () => {
      for (const def of defs) {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        // no white space
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        // some white spaces
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            " \f\r\v\n\tABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 2, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("test", 2, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            " \f\r\v\n\t",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 2, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 2, 9),
                "none"
              )
            )
          )).to.be.true;
        }
      }
    });
  });

  context("when only one-line comment is given", () => {
    const defs = [
      new LanguageDef({
        commentLine   : "//",
        nestedComments: false,
      }),
      new LanguageDef({
        commentLine   : "//",
        commentStart  : "",
        commentEnd    : "",
        nestedComments: false,
      }),
      new LanguageDef({
        commentLine   : "//",
        nestedComments: true,
      }),
      new LanguageDef({
        commentLine   : "//",
        commentStart  : "",
        commentEnd    : "",
        nestedComments: true,
      }),
    ];

    it("should skip spaces and one-line comment", () => {
      for (const def of defs) {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        // no spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "/ABC",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        // some spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "// nyancat\n \f\r\v////\n\n\tABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "// nyancat\n \f\r\v////\n\n\t/ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "/ABC",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "// nyancat\n \f\r\v////\n\n\t",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        // comment in the last line
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "// nyancat",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 1, 11),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 1, 11),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "//",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 1, 3),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 1, 3),
                "none"
              )
            )
          )).to.be.true;
        }
      }
    });
  });

  context("when only multi-line comment is given without allowing nested comments", () => {
    const defs = [
      new LanguageDef({
        commentStart  : "/*",
        commentEnd    : "*/",
        nestedComments: false,
      }),
      new LanguageDef({
        commentLine   : "",
        commentStart  : "/*",
        commentEnd    : "*/",
        nestedComments: false,
      }),
    ];

    it("should skip spaces and multi-line comments", () => {
      for (const def of defs) {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        // no spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "/ABC",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        // some spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/* nyan\ncat */\n \f\r\v/****/\n\tABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/* nyan\ncat */\n \f\r\v/****/\n\t/ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "/ABC",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/* nyan\ncat */\n \f\r\v/****/\n\t",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        // unclosed comment
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/* nyan\ncat",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.cfail(
              new StrictParseError(
                new SourcePos("test", 2, 4),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
                ]
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/*",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.cfail(
              new StrictParseError(
                new SourcePos("test", 1, 3),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
                ]
              )
            )
          )).to.be.true;
        }
      }
    });

    it("should not allow nested comments", () => {
      for (const def of defs) {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/*\n/* nyan\ncat */\n*/\nABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 4, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "*/\nABC",
              new SourcePos("test", 4, 1),
              "none"
            )
          )
        )).to.be.true;
      }
    });
  });

  context("when only multi-line comment is given with allowing nested comments", () => {
    const defs = [
      new LanguageDef({
        commentStart  : "{-",
        commentEnd    : "-}",
        nestedComments: true,
      }),
      new LanguageDef({
        commentLine   : "",
        commentStart  : "{-",
        commentEnd    : "-}",
        nestedComments: true,
      }),
    ];

    it("should skip spaces and multi-line comments", () => {
      for (const def of defs) {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        // no spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "{ABC",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.esucc(
              new StrictParseError(
                new SourcePos("test", 1, 1),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 1, 1),
                "none"
              )
            )
          )).to.be.true;
        }
        // some spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n\tABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n\t{ABC",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "{ABC",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n\t",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.csucc(
              new StrictParseError(
                new SourcePos("test", 4, 9),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ]
              ),
              undefined,
              new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("test", 4, 9),
                "none"
              )
            )
          )).to.be.true;
        }
        // unclosed comment
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.cfail(
              new StrictParseError(
                new SourcePos("test", 2, 4),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
                ]
              )
            )
          )).to.be.true;
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{-",
            new SourcePos("test", 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(Result.equal(
            res,
            Result.cfail(
              new StrictParseError(
                new SourcePos("test", 1, 3),
                [
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                  ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
                ]
              )
            )
          )).to.be.true;
        }
      }
    });

    it("should allow nested comments", () => {
      for (const def of defs) {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{-\n{- nyan\ncat -}\n-}\nABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 5, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "ABC",
              new SourcePos("test", 5, 1),
              "none"
            )
          )
        )).to.be.true;
      }
    });
  });

  context("when both one-line and multi-line comments are given without allowing nested"
    + " comments", () => {
    const def = new LanguageDef({
      commentLine   : "//",
      commentStart  : "/*",
      commentEnd    : "*/",
      nestedComments: false,
    });

    it("should skip spaces and multi-line comments", () => {
      const tp = makeTokenParser(def);
      const whiteSpace = tp.whiteSpace;
      expect(whiteSpace).to.be.a.parser;
      // no spaces and comments
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "ABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("test", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "ABC",
              new SourcePos("test", 1, 1),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/ABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("test", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "/ABC",
              new SourcePos("test", 1, 1),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("test", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("test", 1, 1),
              "none"
            )
          )
        )).to.be.true;
      }
      // some spaces and comments
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\tABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 5, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "ABC",
              new SourcePos("test", 5, 9),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\t/ABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 5, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "/ABC",
              new SourcePos("test", 5, 9),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\t",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 5, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("test", 5, 9),
              "none"
            )
          )
        )).to.be.true;
      }
      // comment in the last line
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "// nyancat",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 1, 11),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("test", 1, 11),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "//",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("test", 1, 3),
              "none"
            )
          )
        )).to.be.true;
      }
      // unclosed comment
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/* nyan\ncat",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("test", 2, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/*",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("test", 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
              ]
            )
          )
        )).to.be.true;
      }
    });

    it("should not allow nested comments", () => {
      const tp = makeTokenParser(def);
      const whiteSpace = tp.whiteSpace;
      expect(whiteSpace).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "/*\n/* nyan\ncat */\n*/\nABC",
        new SourcePos("test", 1, 1),
        "none"
      );
      const res = whiteSpace.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("test", 4, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          undefined,
          new State(
            new Config({ tabWidth: 8 }),
            "*/\nABC",
            new SourcePos("test", 4, 1),
            "none"
          )
        )
      )).to.be.true;
    });
  });

  context("when both one-line and multi-line comments are given with allowing nested"
    + " comments", () => {
    const def = new LanguageDef({
      commentLine   : "--",
      commentStart  : "{-",
      commentEnd    : "-}",
      nestedComments: true,
    });

    it("should skip spaces and comments", () => {
      const tp = makeTokenParser(def);
      const whiteSpace = tp.whiteSpace;
      expect(whiteSpace).to.be.a.parser;
      // no spaces and comments
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "ABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("test", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "ABC",
              new SourcePos("test", 1, 1),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "-ABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("test", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("-")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("-")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "-ABC",
              new SourcePos("test", 1, 1),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{ABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("test", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "{ABC",
              new SourcePos("test", 1, 1),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("test", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("test", 1, 1),
              "none"
            )
          )
        )).to.be.true;
      }
      // some spaces and comments
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 5, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "ABC",
              new SourcePos("test", 5, 9),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t-ABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 5, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("-")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("-")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "-ABC",
              new SourcePos("test", 5, 9),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t{ABC",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 5, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "{ABC",
              new SourcePos("test", 5, 9),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 5, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("test", 5, 9),
              "none"
            )
          )
        )).to.be.true;
      }
      // comment in the last line
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "-- nyancat",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 1, 11),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("test", 1, 11),
              "none"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "--",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("test", 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("test", 1, 3),
              "none"
            )
          )
        )).to.be.true;
      }
      // unclosed comment
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("test", 2, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{-",
          new SourcePos("test", 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("test", 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
              ]
            )
          )
        )).to.be.true;
      }
    });

    it("should allow nested comments", () => {
      const tp = makeTokenParser(def);
      const whiteSpace = tp.whiteSpace;
      expect(whiteSpace).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "{-\n{- nyan\ncat -}\n-}\nABC",
        new SourcePos("test", 1, 1),
        "none"
      );
      const res = whiteSpace.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          new StrictParseError(
            new SourcePos("test", 5, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          undefined,
          new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("test", 5, 1),
            "none"
          )
        )
      )).to.be.true;
    });
  });
});
