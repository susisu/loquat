"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ErrorMessage,
  ErrorMessageType,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = _core;

const { OperatorAssoc, Operator, buildExpressionParser } = _expr;

const { createDummyParser } = _test.helper;

describe("buildExpressionParser", () => {
  function genP(chars, val) {
    const [csucc, cfail, esucc, efail] = chars;
    return new StrictParser(state => {
      switch (state.input[0]) {
      case csucc:
      {
        const newPos = state.pos.addChar(csucc);
        return Result.csucc(
          new StrictParseError(
            newPos,
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc")]
          ),
          val,
          new State(
            state.config,
            state.input.substr(1),
            newPos,
            "some"
          ));
      }
      case cfail:
        return Result.cfail(
          new StrictParseError(
            state.pos.addChar(cfail),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail")]
          ));
      case esucc:
        return Result.esucc(
          new StrictParseError(
            state.pos,
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc")]
          ),
          val,
          new State(
            state.config,
            state.input.substr(1),
            state.pos,
            "some"
          ));
      case efail:
      default:
        return Result.efail(
          new StrictParseError(
            state.pos,
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "efail")]
          ));
      }
    });
  }
  function genInfixP(chars, symbol) {
    return genP(chars, (x, y) => `(${x}${symbol}${y})`);
  }
  function genPrefixP(chars, symbol) {
    return genP(chars, x => `(${symbol}${x})`);
  }
  function genPostfixP(chars, symbol) {
    return genP(chars, x => `(${x}${symbol})`);
  }

  function infixOp(chars, symbol) {
    return Operator.infix(genInfixP(chars, symbol), OperatorAssoc.NONE);
  }
  function infixlOp(chars, symbol) {
    return Operator.infix(genInfixP(chars, symbol), OperatorAssoc.LEFT);
  }
  function infixrOp(chars, symbol) {
    return Operator.infix(genInfixP(chars, symbol), OperatorAssoc.RIGHT);
  }
  function prefixOp(chars, symbol) {
    return Operator.prefix(genPrefixP(chars, symbol));
  }
  function postfixOp(chars, symbol) {
    return Operator.postfix(genPostfixP(chars, symbol));
  }

  const atom = genP("CcEe", "X");

  context("when no operators given", () => {
    const opTable = [];

    it("should create a parser that is identical to the atom parser", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // csucc
      {
        const initState = new State(
          new Config(),
          "Ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc")]
          ),
          "X",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      // cfail
      {
        const initState = new State(
          new Config(),
          "ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail")]
          )
        ));
      }
      // esucc
      {
        const initState = new State(
          new Config(),
          "Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc")]
          ),
          "X",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // efail
      {
        const initState = new State(
          new Config(),
          "ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "efail")]
          )
        ));
      }
    });
  });

  context("when a prefix operator is given", () => {
    const opTable = [
      [prefixOp("+-*/", "+")],
    ];

    it("should create an expression parser that applies prefix operators to operands", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // csucc
      {
        const initState = new State(
          new Config(),
          "+Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
            ]
          ),
          "(+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      // cfail
      {
        const initState = new State(
          new Config(),
          "-Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // prefix
            ]
          )
        ));
      }
      // esucc
      {
        const initState = new State(
          new Config(),
          "*Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // prefix
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
            ]
          ),
          "(+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // efail
      {
        const initState = new State(
          new Config(),
          "/Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // prefix
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // term
            ]
          )
        ));
      }
    });
  });

  context("when a postfix operator is given", () => {
    const opTable = [
      [postfixOp("+-*/", "+")],
    ];

    it("should create an expression parser that applies postfix operators to operands", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // csucc
      {
        const initState = new State(
          new Config(),
          "E+e",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // postfix
            ]
          ),
          "(X+)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      // cfail
      {
        const initState = new State(
          new Config(),
          "E-e",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // postfix
            ]
          )
        ));
      }
      // esucc
      {
        const initState = new State(
          new Config(),
          "E*e",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // postfix
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "(X+)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // efail
      {
        const initState = new State(
          new Config(),
          "E/e",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // postfix
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "X",
          new State(
            initState.config,
            "/e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
    });
  });

  context("when a non-associative infix operator", () => {
    const opTable = [
      [infixOp("+-*/", "+")],
    ];

    it("should create an expression parser that applies infix operators to operands", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // csucc
      {
        const initState = new State(
          new Config(),
          "E+Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infix
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infix
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      // cfail
      {
        const initState = new State(
          new Config(),
          "E-Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infix
            ]
          )
        ));
      }
      // esucc
      {
        const initState = new State(
          new Config(),
          "E*Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a non associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixl
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a non associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infix
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infix
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // efail
      {
        const initState = new State(
          new Config(),
          "E/Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infix
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "X",
          new State(
            initState.config,
            "/Ee",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // multiple
      {
        const initState = new State(
          new Config(),
          "E*E*Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a non associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixl
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a non associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infix
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),    // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),    // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infix
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a non associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "*Ee",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
    });
  });

  context("when a left-associative infix operator is given", () => {
    const opTable = [
      [infixlOp("+-*/", "+")],
    ];

    it("should create an expression parser that applies infix operators to operands", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // one operator
      // csucc
      {
        const initState = new State(
          new Config(),
          "E+Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixl
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      // cfail
      {
        const initState = new State(
          new Config(),
          "E-Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infixl
            ]
          )
        ));
      }
      // esucc
      {
        const initState = new State(
          new Config(),
          "E*Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a left associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // efail
      {
        const initState = new State(
          new Config(),
          "E/Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "X",
          new State(
            initState.config,
            "/Ee",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // two operators
      // csucc
      {
        const initState = new State(
          new Config(),
          "E*E+Ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixl
            ]
          ),
          "((X+X)+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 2, 1, 3),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E+ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // term
            ]
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E+Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixl
            ]
          ),
          "((X+X)+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E+ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // term
            ]
          )
        ));
      }
      // cfail
      {
        const initState = new State(
          new Config(),
          "E*E-Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infixl
            ]
          )
        ));
      }
      // esucc
      {
        const initState = new State(
          new Config(),
          "E*E*Ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixl
            ]
          ),
          "((X+X)+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E*ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // term
            ]
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E*Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a left associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "((X+X)+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E*ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a left associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "*ee",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // efail
      {
        const initState = new State(
          new Config(),
          "E*E/Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a left associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "/Ee",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // three operators
      {
        const initState = new State(
          new Config(),
          "E*E+E*ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // term
            ]
          ),
          "((X+X)+X)",
          new State(
            initState.config,
            "*ee",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
    });
  });

  context("when a right-associative infix operator is given", () => {
    const opTable = [
      [infixrOp("+-*/", "+")],
    ];

    it("should create an expression parser that applies infix operators to operands", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // one operator
      // csucc
      {
        const initState = new State(
          new Config(),
          "E+Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixr
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      // cfail
      {
        const initState = new State(
          new Config(),
          "E-Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infixr
            ]
          )
        ));
      }
      // esucc
      {
        const initState = new State(
          new Config(),
          "E*Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // efail
      {
        const initState = new State(
          new Config(),
          "E/Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "X",
          new State(
            initState.config,
            "/Ee",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // two operators
      // csucc
      {
        const initState = new State(
          new Config(),
          "E*E+Ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixr
            ]
          ),
          "(X+(X+X))",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 2, 1, 3),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E+ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 2, 1, 3),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // term
            ]
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E+Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixr
            ]
          ),
          "(X+(X+X))",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E+ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // term
            ]
          )
        ));
      }
      // cfail
      {
        const initState = new State(
          new Config(),
          "E*E-Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infixr
            ]
          )
        ));
      }
      // esucc
      {
        const initState = new State(
          new Config(),
          "E*E*Ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixr
            ]
          ),
          "(X+(X+X))",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E*ce",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // term
            ]
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E*Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+(X+X))",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E*ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "*ee",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      // three operators
      {
        const initState = new State(
          new Config(),
          "E*E*E*Ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+(X+(X+X)))",
          new State(
            initState.config,
            "e",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
      {
        const initState = new State(
          new Config(),
          "E*E+E*ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // term
            ]
          ),
          "(X+(X+X))",
          new State(
            initState.config,
            "*ee",
            new SourcePos("main", 1, 1, 2),
            "some"
          )
        ));
      }
      // four operators
      {
        const initState = new State(
          new Config(),
          "E*E*E*E*ee",
          new SourcePos("main", 0, 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // term
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ]
          ),
          "(X+(X+(X+X)))",
          new State(
            initState.config,
            "*ee",
            new SourcePos("main", 0, 1, 1),
            "some"
          )
        ));
      }
    });
  });

  context("when two infix operators are given in single precedence", () => {
    const opTable = [
      [
        infixrOp("|o&a", "|"),
        infixlOp("+-*/", "+"),
      ],
    ];

    it("should create an expression parser that does not have operator hierarchy", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      const initState = new State(
        new Config(),
        "E*E&Ee",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // prefix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),       // postfix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixr
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),
            ErrorMessage.create(
              ErrorMessageType.MESSAGE,
              "ambiguous use of a left associative operator"
            ),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixl
            // ErrorMessage.create(ErrorMessageType.EXPECT, ""),    // prefix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
            // ErrorMessage.create(ErrorMessageType.EXPECT, ""),    // postfix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // infixl
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
            ErrorMessage.create(
              ErrorMessageType.MESSAGE,
              "ambiguous use of a right associative operator"
            ),
            ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
          ]
        ),
        "(X+X)",
        new State(
          initState.config,
          "&Ee",
          new SourcePos("main", 0, 1, 1),
          "some"
        )
      ));
    });
  });

  context("when two operators are given in different precedences", () => {
    const opTable = [
      [infixrOp("|o&a", "|")],
      [infixlOp("+-*/", "+")],
    ];

    it("should create an expression parser that has operator hierarchiy", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      const initState = new State(
        new Config(),
        "E*E&Ee",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
            ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
            ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
            ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
            ErrorMessage.create(
              ErrorMessageType.MESSAGE,
              "ambiguous use of a left associative operator"
            ),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
            // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
            // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
            // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
            // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
            ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
            ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
            ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
          ]
        ),
        "(X+(X|X))",
        new State(
          initState.config,
          "e",
          new SourcePos("main", 0, 1, 1),
          "some"
        )
      ));
    });
  });

  it("should throw Error if an operator in the table has unknown type", () => {
    const opTable = [
      [{ type: "__unknown_type__", parser: createDummyParser() }],
    ];
    const atom = createDummyParser();
    expect(() => {
      buildExpressionParser(opTable, atom);
    }).to.throw(Error, /unknown operator type/);
  });

  it("should throw Error if an infix operator in the table has an unknown associativity", () => {
    const opTable = [
      [Operator.infix(createDummyParser(), "__unknown_assoc__")],
    ];
    const atom = createDummyParser();
    expect(() => {
      buildExpressionParser(opTable, atom);
    }).to.throw(Error, /unknown operator associativity/);
  });
});
