# loquat-token
Token parser extension for [loquat](https://github.com/susisu/loquat2).

## Install
``` shell
npm install --save loquat-token
```

## Usage
Make sure loquat (or loquat-core) has already been installed.

``` javascript
const lq = require("loquat")();
// use extension
lq.use(require("loquat-token"));
// language definition
const def = new lq.LanguageDef({
    commentStart  : "/*",
    commentEnd    : "*/",
    commentLine   : "//",
    nestedComments: false,
    idStart       : lq.letter,
    idLetter      : lq.alphaNum,
    opStart       : lq.oneOf("+-*/%=<>!&|"),
    opLetter      : lq.oneOf("+-*/%=<>!&|"),
    reservedIds   : ["if", "else", "for"],
    reservedOps   : ["=", "=>"],
    caseSensitive : true
});
// make token parser from the definition
const tp = lq.makeTokenParser(def);
/*
 * { whiteSpace: Parser { _func: [Function] },
 *   lexeme: [Function: lexeme],
 *   symbol: [Function: symbol],
 *   parens: [Function: parens],
 *   braces: [Function: braces],
 *   angles: [Function: angles],
 *   brackets: [Function: brackets],
 *   semi: Parser { _func: [Function] },
 *   comma: Parser { _func: [Function] },
 *   colon: Parser { _func: [Function] },
 *   dot: Parser { _func: [Function] },
 *   semiSep: [Function: semiSep],
 *   semiSep1: [Function: semiSep1],
 *   commaSep: [Function: commaSep],
 *   commaSep1: [Function: commaSep1],
 *   decimal: Parser { _func: [Function] },
 *   hexadecimal: Parser { _func: [Function] },
 *   octal: Parser { _func: [Function] },
 *   natural: Parser { _func: [Function] },
 *   integer: Parser { _func: [Function] },
 *   float: Parser { _func: [Function] },
 *   naturalOrFloat: Parser { _func: [Function] },
 *   charLiteral: Parser { _func: [Function] },
 *   stringLiteral: Parser { _func: [Function] },
 *   identifier: Parser { _func: [Function] },
 *   reserved: [Function: reserved],
 *   operator: Parser { _func: [Function] },
 *   reservedOp: [Function: reservedOp] }
 */
```

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
