# 3.2.0 (2019-09-16)
- No changes

# 3.1.1 (2019-04-19)
- No changes

# 3.1.0 (2019-04-15)
## Performance improvements
- Improve `forever`

# 3.0.0 (2019-04-13)
## Breaking changes
- Support `@loquat/core@3`

## Bug fixes
- `sequence_` and `msum` are now stack-safe when given large arrays

## Performance improvements
- `mapM`, `mapM_`, `zipWithM`, `zipWithM_`, `replicateM`, and `replicateM_` will not allocate new arrays

# 2.0.0 (2017-01-11)
- First release!
