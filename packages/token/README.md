# `@loquat/token`
Token parser builder.

## Installation
``` shell
npm i @loquat/token
# or
yarn add @loquat/token
```

See also [`@loquat/framework`](https://github.com/susisu/loquat/tree/master/packages/framework).

## Usage
First, create a language definition.

``` javascript
const def = LanguageDef.create({
    commentStart  : "/*",
    commentEnd    : "*/",
    commentLine   : "//",
    nestedComments: false,
    idStart       : letter,
    idLetter      : alphaNum,
    opStart       : oneOf("+-*/%=<>!&|"),
    opLetter      : oneOf("+-*/%=<>!&|"),
    reservedIds   : ["if", "else", "for"],
    reservedOps   : ["=", "=>"],
    caseSensitive : true
});
```

Then build token parsers from it.

``` javascript
const tp = makeTokenParser(def);
```

The returned `tp` is an object containing the following token parsers:

- `whiteSpace`
- `lexeme(parser)`
- `symbol(str)`
- `parens(parser)`
- `braces(parser)`
- `angles(parser)`
- `brackets(parser)`
- `semi`
- `comma`
- `colon`
- `dot`
- `semiSep(parser)`
- `semiSep1(parser)`
- `commaSep(parser)`
- `commaSep1(parser)`
- `decimal`
- `hexadecimal`
- `octal`
- `natural`
- `integer`
- `float`
- `naturalOrFloat`
- `charLiteral`
- `stringLiteral`
- `identifier`
- `reserved(name)`
- `operator`
- `reservedOp(name)`

## License
```
Copyright 2019 Susisu

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
