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

describe("whiteSpace", () => {
  context("when none of one-line and multi-line comments are specified", () => {
    const defs = [
      {
        testName: "not specified; nestedComments = false",
        def     : LanguageDef.create({
          nestedComments: false,
        }),
      },
      {
        testName: "empty strings specified; nestedComments = false",
        def     : LanguageDef.create({
          commentLine   : "",
          commentStart  : "",
          commentEnd    : "",
          nestedComments: false,
        }),
      },
      {
        testName: "not specified; nestedComments = true",
        def     : LanguageDef.create({
          nestedComments: true,
        }),
      },
      {
        testName: "empty strings specified; nestedComments = true",
        def     : LanguageDef.create({
          commentLine   : "",
          commentStart  : "",
          commentEnd    : "",
          nestedComments: true,
        }),
      },
    ];
    for (const { testName, def } of defs) {
      it(`should skip simple white space characters: ${testName}`, () => {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        // no white spaces
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "ABC",
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        // some white spaces
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            " \f\r\v\n\tABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 6, 2, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "ABC",
              new SourcePos("main", 6, 2, 9),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            " \f\r\v\n\t",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 6, 2, 9),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            undefined,
            new State(
              new Config({ tabWidth: 8 }),
              "",
              new SourcePos("main", 6, 2, 9),
              "none"
            )
          ));
        }
      });
    }
  });

  context("when only one-line comment is specified", () => {
    const defs = [
      {
        testName: "no multi specified; nestedComments = false",
        def     : LanguageDef.create({
          commentLine   : "//",
          nestedComments: false,
        }),
      },
      {
        testName: "empty multi specified; nestedComments = false",
        def     : LanguageDef.create({
          commentLine   : "//",
          commentStart  : "",
          commentEnd    : "",
          nestedComments: false,
        }),
      },
      {
        testName: "no multi specified; nestedComments = true",
        def     : LanguageDef.create({
          commentLine   : "//",
          nestedComments: true,
        }),
      },
      {
        testName: "empty multi specified; nestedComments = true",
        def     : LanguageDef.create({
          commentLine   : "//",
          commentStart  : "",
          commentEnd    : "",
          nestedComments: true,
        }),
      },
    ];

    for (const { testName, def } of defs) {
      it(`should skip spaces and one-line comment: ${testName}`, () => {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        // no spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        // some spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "// nyancat\n \f\r\v////\n\n\tABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 22, 4, 9),
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
              new SourcePos("main", 22, 4, 9),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "// nyancat\n \f\r\v////\n\n\t/ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 22, 4, 9),
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
              new SourcePos("main", 22, 4, 9),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "// nyancat\n \f\r\v////\n\n\t",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 22, 4, 9),
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
              new SourcePos("main", 22, 4, 9),
              "none"
            )
          ));
        }
        // comment in the last line
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "// nyancat",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 10, 1, 11),
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
              new SourcePos("main", 10, 1, 11),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "//",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 2, 1, 3),
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
              new SourcePos("main", 2, 1, 3),
              "none"
            )
          ));
        }
      });
    }
  });

  context("when only multi-line comment is specified without allowing nested comments", () => {
    const defs = [
      {
        testName: "no single specified",
        def     : LanguageDef.create({
          commentStart  : "/*",
          commentEnd    : "*/",
          nestedComments: false,
        }),
      },
      {
        testName: "empty single specified",
        def     : LanguageDef.create({
          commentLine   : "",
          commentStart  : "/*",
          commentEnd    : "*/",
          nestedComments: false,
        }),
      },
    ];

    for (const { testName, def } of defs) {
      it(`should skip spaces and multi-line comments: ${testName}`, () => {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        // no spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        // some spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/* nyan\ncat */\n \f\r\v/****/\n\tABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 27, 4, 9),
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
              new SourcePos("main", 27, 4, 9),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/* nyan\ncat */\n \f\r\v/****/\n\t/ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 27, 4, 9),
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
              new SourcePos("main", 27, 4, 9),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/* nyan\ncat */\n \f\r\v/****/\n\t",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 27, 4, 9),
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
              new SourcePos("main", 27, 4, 9),
              "none"
            )
          ));
        }
        // unclosed comment
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/* nyan\ncat",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.cfail(
            new StrictParseError(
              new SourcePos("main", 11, 2, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
              ]
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "/*",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.cfail(
            new StrictParseError(
              new SourcePos("main", 2, 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
              ]
            )
          ));
        }
      });

      it(`should not allow nested comments: ${testName}`, () => {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/*\n/* nyan\ncat */\n*/\nABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 18, 4, 1),
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
            new SourcePos("main", 18, 4, 1),
            "none"
          )
        ));
      });
    }
  });

  context("when only multi-line comment is specified with allowing nested comments", () => {
    const defs = [
      {
        testName: "no single specified",
        def     : LanguageDef.create({
          commentStart  : "{-",
          commentEnd    : "-}",
          nestedComments: true,
        }),
      },
      {
        testName: "empty single specified",
        def     : LanguageDef.create({
          commentLine   : "",
          commentStart  : "{-",
          commentEnd    : "-}",
          nestedComments: true,
        }),
      },
    ];

    for (const { testName, def } of defs) {
      it(`should skip spaces and multi-line comments: ${testName}`, () => {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        // no spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.esucc(
            new StrictParseError(
              new SourcePos("main", 0, 1, 1),
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
              new SourcePos("main", 0, 1, 1),
              "none"
            )
          ));
        }
        // some spaces and comments
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n\tABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 27, 4, 9),
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
              new SourcePos("main", 27, 4, 9),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n\t{ABC",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 27, 4, 9),
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
              new SourcePos("main", 27, 4, 9),
              "none"
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat -}\n \f\r\v{----}\n\t",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.csucc(
            new StrictParseError(
              new SourcePos("main", 27, 4, 9),
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
              new SourcePos("main", 27, 4, 9),
              "none"
            )
          ));
        }
        // unclosed comment
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{- nyan\ncat",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.cfail(
            new StrictParseError(
              new SourcePos("main", 11, 2, 4),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
              ]
            )
          ));
        }
        {
          const initState = new State(
            new Config({ tabWidth: 8 }),
            "{-",
            new SourcePos("main", 0, 1, 1),
            "none"
          );
          const res = whiteSpace.run(initState);
          expect(res).to.be.an.equalResultTo(Result.cfail(
            new StrictParseError(
              new SourcePos("main", 2, 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
              ]
            )
          ));
        }
      });

      it(`should allow nested comments: ${testName}`, () => {
        const tp = makeTokenParser(def);
        const whiteSpace = tp.whiteSpace;
        expect(whiteSpace).to.be.a.parser;
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{-\n{- nyan\ncat -}\n-}\nABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 21, 5, 1),
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
            new SourcePos("main", 21, 5, 1),
            "none"
          )
        ));
      });
    }
  });

  context("when both one-line and multi-line comments are specified without allowing nested"
    + " comments", () => {
    const def = LanguageDef.create({
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
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
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
            new SourcePos("main", 0, 1, 1),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/ABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
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
            new SourcePos("main", 0, 1, 1),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
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
            new SourcePos("main", 0, 1, 1),
            "none"
          )
        ));
      }
      // some spaces and comments
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\tABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 37, 5, 9),
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
            new SourcePos("main", 37, 5, 9),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\t/ABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 37, 5, 9),
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
            new SourcePos("main", 37, 5, 9),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\t",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 37, 5, 9),
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
            new SourcePos("main", 37, 5, 9),
            "none"
          )
        ));
      }
      // comment in the last line
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "// nyancat",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 10, 1, 11),
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
            new SourcePos("main", 10, 1, 11),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "//",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
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
            new SourcePos("main", 2, 1, 3),
            "none"
          )
        ));
      }
      // unclosed comment
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/* nyan\ncat",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 11, 2, 4),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
            ]
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/*",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
            ]
          )
        ));
      }
    });

    it("should not allow nested comments", () => {
      const tp = makeTokenParser(def);
      const whiteSpace = tp.whiteSpace;
      expect(whiteSpace).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "/*\n/* nyan\ncat */\n*/\nABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = whiteSpace.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 18, 4, 1),
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
          new SourcePos("main", 18, 4, 1),
          "none"
        )
      ));
    });
  });

  context("when both one-line and multi-line comments are specified with allowing nested"
    + " comments", () => {
    const def = LanguageDef.create({
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
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
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
            new SourcePos("main", 0, 1, 1),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "-ABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
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
            new SourcePos("main", 0, 1, 1),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{ABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
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
            new SourcePos("main", 0, 1, 1),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
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
            new SourcePos("main", 0, 1, 1),
            "none"
          )
        ));
      }
      // some spaces and comments
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 37, 5, 9),
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
            new SourcePos("main", 37, 5, 9),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t-ABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 37, 5, 9),
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
            new SourcePos("main", 37, 5, 9),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t{ABC",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 37, 5, 9),
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
            new SourcePos("main", 37, 5, 9),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 37, 5, 9),
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
            new SourcePos("main", 37, 5, 9),
            "none"
          )
        ));
      }
      // comment in the last line
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "-- nyancat",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 10, 1, 11),
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
            new SourcePos("main", 10, 1, 11),
            "none"
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "--",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
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
            new SourcePos("main", 2, 1, 3),
            "none"
          )
        ));
      }
      // unclosed comment
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{- nyan\ncat",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 11, 2, 4),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
            ]
          )
        ));
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "{-",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = whiteSpace.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "end of comment"),
            ]
          )
        ));
      }
    });

    it("should allow nested comments", () => {
      const tp = makeTokenParser(def);
      const whiteSpace = tp.whiteSpace;
      expect(whiteSpace).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "{-\n{- nyan\ncat -}\n-}\nABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = whiteSpace.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        new StrictParseError(
          new SourcePos("main", 21, 5, 1),
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
          new SourcePos("main", 21, 5, 1),
          "none"
        )
      ));
    });
  });
});
