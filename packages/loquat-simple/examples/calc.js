/*
 * simple calculator
 *
 * Example
 *   node calc.js <expression>
 */

"use strict";

// const lq = require("loquat-simple");
const lq = require("../index");

// skips trailing spaces
const spaces = lq.spaces.label("");

function lexeme(parser) {
  return parser.skip(spaces);
}

function symbol(str) {
  return lexeme(lq.string(str).try());
}

// <number> (non-negative)
const numberRegExp = /(0|[1-9]\d*)(\.\d*)?([Ee][+-]?\d*)?/u;
const number = lexeme(lq.regexp(numberRegExp)).map(Number).label("number");

// <term> ::= <number> | "(" <expr> ")"
const lparen = symbol("(");
const rparen = symbol(")");
const term = lq.lazy(() => number.or(expr.between(lparen, rparen)));

// <expr1> ::= "+" <term> | "-" <term> | <term>
// <expr2> ::= <expr1> ** <expr2> | <expr1>
// <expr3> ::= <expr3> "*" <expr2> | <expr3> "/" <expr2> | <expr2>
// <expr>  ::= <expr> "+" <expr3> | <expr> "-" <expr3> | <expr3>
const plus  = symbol("+").return(x => x);
const minus = symbol("-").return(x => -x);
const pow   = symbol("**").return((x, y) => Math.pow(x, y));
const mul   = symbol("*").return((x, y) => x * y);
const div   = symbol("/").return((x, y) => x / y);
const add   = symbol("+").return((x, y) => x + y);
const sub   = symbol("-").return((x, y) => x - y);
const expr = lq.buildExpressionParser(
  [
    [
      lq.Operator.prefix(plus),
      lq.Operator.prefix(minus),
    ],
    [
      lq.Operator.infix(pow, lq.OperatorAssoc.RIGHT),
    ],
    [
      lq.Operator.infix(mul, lq.OperatorAssoc.LEFT),
      lq.Operator.infix(div, lq.OperatorAssoc.LEFT),
    ],
    [
      lq.Operator.infix(add, lq.OperatorAssoc.LEFT),
      lq.Operator.infix(sub, lq.OperatorAssoc.LEFT),
    ],
  ],
  term
);

const calc = spaces.and(expr).left(lq.eof);

function parse(src) {
  const result = lq.parse(calc, "", src);
  if (result.success) {
    console.log(result.value);
  } else {
    console.error(result.error.toString());
  }
}

parse(process.argv[2]);
