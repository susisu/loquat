/*
 * S-Expression parser
 *
 * Example:
 *   node s_expr.js <expression>
 */

"use strict";

// const lq = require("loquat-simple");
const lq = require("../index");

const space = lq.oneOf("\r\n\t ").label("");
function lexeme(parser) {
  return parser.skipMany(space);
}

// expr ::= atom | list
const expr = lq.lazy(() => lq.choice([
  atom,
  list,
])).label("expression");

// atom ::= letter atom_tail*
// atom_tail ::= letter | number
const atom = lexeme(lq.qo(function* () {
  const x  = yield lq.letter;
  const xs = yield lq.alphaNum.manyChars();
  return x + xs;
})).label("atom");

// list ::= "(" expr* ["." expr] ")"
const list = lq.qo(function* () {
  yield lexeme(lq.char("("));
  const xs = yield expr.many();
  const x  = yield lq.option(null, lexeme(lq.char(".")).and(expr));
  yield lexeme(lq.char(")"));
  return xs.reduceRight((ys, y) => ({ car: y, cdr: ys }), x);
}).label("list");

const parser = lq.spaces.and(expr).left(lq.eof);

function parse(src) {
  const result = lq.parse(parser, "", src);
  if (result.success) {
    console.log(print(result.value));
  } else {
    console.error(result.error.toString());
  }
}

// pretty printer
function print(x) {
  if (typeof x === "object") {
    const xs = [];
    let y = x;
    while (typeof y === "object" && y !== null) {
      xs.push(print(y.car));
      y = y.cdr;
    }
    return y === null
      ? `(${xs.join(" ")})`
      : `(${xs.join(" ")} . ${print(y)})`;
  } else {
    return x.toString();
  }
}

parse(process.argv[2]);
