# 3.2.0 (2019-09-16)
- No changes

# 3.1.1 (2019-04-19)
- No changes

# 3.1.0 (2019-04-15)
- No changes

# 3.0.0 (2019-04-13)
## Breaking changes
- Support `@loquat/core@3`
- `LanguageDef` is no longer a class

## Features
- `makeTokenParser` now returns `identifier`, `reserved`, `operator`, and `reservedOp` that always fails if `idStart`, `idLetter`, `opStart`, and `opLetter` are not given

## Performance improvements
- Avoid creating a parser in `whiteSpace` at each internal iteration
- Prefer `map(parser, _ => x)` to `then(parser, pure(x))`

# 2.0.0 (2017-01-11)
- First release!
