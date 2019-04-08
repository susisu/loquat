# 3.0.0 (yyyy-mm-dd)
## Breaking changes
- Support `@loquat/core@3`

## Bug fixes
- `sequence_` and `msum` are now stack-safe when given large arrays

## Performance improvements
- `mapM`, `mapM_`, `zipWithM`, `zipWithM_`, `replicateM`, and `replicateM_` will not allocate new arrays

# 2.0.0 (2017-01-11)
- First release!
