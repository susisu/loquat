# loquat
Monadic parser combinator library for JavaScript, inspired by (and almost clone of) [Parsec](https://github.com/aslatter/parsec/).

## Features
* Construct complex parser from simple parsers and combinators
* Friendly syntax using generators, like do-notation in Haskell
* Expression parser builder
* Regular expression parser
* Unicode aware
* Extensions

## Install
``` shell
npm i --save loquat
```

## Examples
* [json.js](https://github.com/susisu/loquat2/blob/master/examples/json.js): JSON parser
* [json_generators.js](https://github.com/susisu/loquat2/blob/master/examples/json_generators.js): JSON parser, using do-notation with generators
* [calc.js](https://github.com/susisu/loquat2/blob/master/examples/calc.js): Simple calculator, an example of expression parser builder

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))

## Contributing
Issues and pull requests are welcome!
Please read [contributing guidelines](https://github.com/susisu/loquat2/blob/master/CONTRIBUTING.md) first when you make a contribution.

## Links
### Related repositories
* [loquat](https://github.com/susisu/loquat2) (**here**)
* [loquat-core](https://github.com/susisu/loquat-core)
* [loquat-prim](https://github.com/susisu/loquat-prim)
* [loquat-char](https://github.com/susisu/loquat-char)
* [loquat-combinators](https://github.com/susisu/loquat-combinators)
* [loquat-monad](https://github.com/susisu/loquat-monad)
* [loquat-qo](https://github.com/susisu/loquat-qo)
* [loquat-expr](https://github.com/susisu/loquat-expr)

### Other parser combinator libraries
* [Parsec](https://github.com/aslatter/parsec/) (Haskell)
* [Parsimmon](https://github.com/jneen/parsimmon) (JavaScript)
