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

const {
  OperatorType,
  OperatorAssoc,
  Operator,
  buildExpressionParser,
} = _expr;

describe(".buildExpressionParser(opTable, atom)", () => {
  function genP(chars, val) {
    const csucc = chars[0];
    const cfail = chars[1];
    const esucc = chars[2];
    const efail = chars[3];
    return new StrictParser(state => {
      switch (state.input[0]) {
      case csucc:
      {
        const newPos = state.pos.setColumn(state.pos.column + 1);
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
          )
        );
      }
      case cfail:
        return Result.cfail(
          new StrictParseError(
            state.pos.setColumn(state.pos.column + 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail")]
          )
        );
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
          )
        );
      case efail:
      default:
        return Result.efail(
          new StrictParseError(
            state.pos,
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "efail")]
          )
        );
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
    return new Operator(OperatorType.INFIX, genInfixP(chars, symbol), OperatorAssoc.NONE);
  }
  function infixlOp(chars, symbol) {
    return new Operator(OperatorType.INFIX, genInfixP(chars, symbol), OperatorAssoc.LEFT);
  }
  function infixrOp(chars, symbol) {
    return new Operator(OperatorType.INFIX, genInfixP(chars, symbol), OperatorAssoc.RIGHT);
  }
  function prefixOp(chars, symbol) {
    return new Operator(OperatorType.PREFIX, genPrefixP(chars, symbol));
  }
  function postfixOp(chars, symbol) {
    return new Operator(OperatorType.POSTFIX, genPostfixP(chars, symbol));
  }

  const atom = genP("CcEe", "X");

  context("when no operators given", () => {
    const opTable = [];

    it("should return a parser that is identical to `atom'", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // csucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "Ce",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc")]
            ),
            "X",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      // cfail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "ce",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail")]
            )
          )
        )).to.be.true;
      }
      // esucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc")]
            ),
            "X",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // efail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.efail(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [ErrorMessage.create(ErrorMessageType.MESSAGE, "efail")]
            )
          )
        )).to.be.true;
      }
    });
  });

  context("when a prefix operator is given", () => {
    const opTable = [
      [prefixOp("+-*/", "+")],
    ];

    it("should return an expression parser that applies the operator to value", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // csucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "+Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
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
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      // cfail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "-Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // prefix
              ]
            )
          )
        )).to.be.true;
      }
      // esucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "*Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
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
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // efail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "/Ee",
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
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // prefix
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // term
              ]
            )
          )
        )).to.be.true;
      }
    });
  });

  context("when a postfix operator is given", () => {
    const opTable = [
      [postfixOp("+-*/", "+")],
    ];

    it("should return an expression parser that applies the operator to value", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // csucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E+e",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // postfix
              ]
            ),
            "(X+)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      // cfail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E-e",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // postfix
              ]
            )
          )
        )).to.be.true;
      }
      // esucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*e",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // postfix
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            "(X+)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // efail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E/e",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"), // postfix
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),
              ]
            ),
            "X",
            new State(
              initState.config,
              "/e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
    });
  });

  context("when a non-associative infix operator", () => {
    const opTable = [
      [infixOp("+-*/", "+")],
    ];

    it("should return an expression parser that applies the operator to operands", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // csucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E+Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infix
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infix
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      // cfail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E-Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infix
              ]
            )
          )
        )).to.be.true;
      }
      // esucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                ErrorMessage.create(
                  ErrorMessageType.MESSAGE,
                  "ambiguous use of a non associative operator"
                ),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
                ErrorMessage.create(
                  ErrorMessageType.MESSAGE,
                  "ambiguous use of a non associative operator"
                ),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infix
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infix
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // efail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E/Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
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
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // multiple
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                ErrorMessage.create(
                  ErrorMessageType.MESSAGE,
                  "ambiguous use of a non associative operator"
                ),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
                ErrorMessage.create(
                  ErrorMessageType.MESSAGE,
                  "ambiguous use of a non associative operator"
                ),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infix
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infix
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
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
    });
  });

  context("when a left-associative infix operator is given", () => {
    const opTable = [
      [infixlOp("+-*/", "+")],
    ];

    it("should return an expression parser that applies the operator to operands", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // 1 operator
      // csucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E+Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infixl
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      // cfail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E-Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infixl
              ]
            )
          )
        )).to.be.true;
      }
      // esucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                ErrorMessage.create(
                  ErrorMessageType.MESSAGE,
                  "ambiguous use of a left associative operator"
                ),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // efail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E/Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "X",
            new State(
              initState.config,
              "/Ee",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // 2 operators
      // csucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+Ce",
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
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infixl
              ]
            ),
            "((X+X)+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 3),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+ce",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // term
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infixl
              ]
            ),
            "((X+X)+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // term
              ]
            )
          )
        )).to.be.true;
      }
      // cfail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E-Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infixl
              ]
            )
          )
        )).to.be.true;
      }
      // esucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*Ce",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infixl
              ]
            ),
            "((X+X)+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*ce",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // term
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                ErrorMessage.create(
                  ErrorMessageType.MESSAGE,
                  "ambiguous use of a left associative operator"
                ),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "((X+X)+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                ErrorMessage.create(
                  ErrorMessageType.MESSAGE,
                  "ambiguous use of a left associative operator"
                ),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "*ee",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // efail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E/Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                ErrorMessage.create(
                  ErrorMessageType.MESSAGE,
                  "ambiguous use of a left associative operator"
                ),
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixl
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "/Ee",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // 3 operators
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+E*ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // term
              ]
            ),
            "((X+X)+X)",
            new State(
              initState.config,
              "*ee",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
    });
  });

  context("when a right-associative infix operator is given", () => {
    const opTable = [
      [infixrOp("+-*/", "+")],
    ];

    it("should return an expression parser that applies the operator to operands", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      // 1 operator
      // csucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E+Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infixr
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      // cfail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E-Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infixr
              ]
            )
          )
        )).to.be.true;
      }
      // esucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // efail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E/Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixl
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "X",
            new State(
              initState.config,
              "/Ee",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // 2 operators
      // csucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+Ce",
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
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infixr
              ]
            ),
            "(X+(X+X))",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 3),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+ce",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 3),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // term
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infixr
              ]
            ),
            "(X+(X+X))",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // term
              ]
            )
          )
        )).to.be.true;
      }
      // cfail
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E-Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // infixr
              ]
            )
          )
        )).to.be.true;
      }
      // esucc
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*Ce",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // infixr
              ]
            ),
            "(X+(X+X))",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*ce",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "cfail"), // term
              ]
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+(X+X))",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+X)",
            new State(
              initState.config,
              "*ee",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      // 3 operators
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*E*Ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+(X+(X+X)))",
            new State(
              initState.config,
              "e",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
      }
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E+E*ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 2),
              [
                ErrorMessage.create(ErrorMessageType.MESSAGE, "csucc"), // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"), // infixr
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),  // term
              ]
            ),
            "(X+(X+X))",
            new State(
              initState.config,
              "*ee",
              new SourcePos("foobar", 1, 2),
              "some"
            )
          )
        )).to.be.true;
      }
      // 4 operators
      {
        const initState = new State(
          new Config({ tabWidth: 8 }),
          "E*E*E*E*ee",
          new SourcePos("foobar", 1, 1),
          "none"
        );
        const res = parser.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(
            new StrictParseError(
              new SourcePos("foobar", 1, 1),
              [
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, ""),        // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // term
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // postfix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),   // infixr
                // ErrorMessage.create(ErrorMessageType.EXPECT, ""),     // prefix
                ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),   // term
                ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ]
            ),
            "(X+(X+(X+X)))",
            new State(
              initState.config,
              "*ee",
              new SourcePos("foobar", 1, 1),
              "some"
            )
          )
        )).to.be.true;
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

    it("should return an expression parser that does not parse operators hierarchically", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "E*E&Ee",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),    // infixr
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a left associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // infixl
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),    // infixl
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // infixr
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a right associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"),  // label
            ]
          ),
          "(X+X)",
          new State(
            initState.config,
            "&Ee",
            new SourcePos("foobar", 1, 1),
            "some"
          )
        )
      )).to.be.true;
    });
  });

  context("when two operators are given in different precedences", () => {
    const opTable = [
      [infixrOp("|o&a", "|")],
      [infixlOp("+-*/", "+")],
    ];

    it("should return an expression parser that parses operators hierarchically", () => {
      const parser = buildExpressionParser(opTable, atom);
      expect(parser).to.be.a.parser;
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "E*E&Ee",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // term
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),    // infixr
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),    // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"), // label
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),         // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // infixr
              ErrorMessage.create(
                ErrorMessageType.MESSAGE,
                "ambiguous use of a left associative operator"
              ),
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // infixl
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // infixr
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // prefix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "esucc"),    // term
              // ErrorMessage.create(ErrorMessageType.EXPECT, ""),      // postfix
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),    // infixr
              ErrorMessage.create(ErrorMessageType.MESSAGE, "efail"),    // infixl
              ErrorMessage.create(ErrorMessageType.EXPECT, "operator"),  // label
            ]
          ),
          "(X+(X|X))",
          new State(
            initState.config,
            "e",
            new SourcePos("foobar", 1, 1),
            "some"
          )
        )
      )).to.be.true;
    });
  });

  it("should throw an Error if an operator in `opTable' has unknown operator type", () => {
    const opTable = [
      [new Operator("__unknown_type__", new StrictParser(() => {}))],
    ];
    const atom = new StrictParser(() => {});
    expect(() => { buildExpressionParser(opTable, atom); }).to.throw(Error, /operator/);
  });

  it("should throw an Error if an infix operator in `opTable' has unknown operator"
    + " associativity", () => {
    const opTable = [
      [new Operator(OperatorType.INFIX, new StrictParser(() => {}), "__unknown_assoc__")],
    ];
    const atom = new StrictParser(() => {});
    expect(() => { buildExpressionParser(opTable, atom); }).to.throw(Error, /operator/);
  });
});
