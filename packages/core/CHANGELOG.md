# 3.1.1 (2019-04-19)
- No changes

# 3.1.0 (2019-04-15)
## Features
- Drop `SourcePos#index`
  - It was just inconsistent, and a kind of mistake.
- Add default parameter `index = 0` to `ArrayStream` constructor

# 3.0.0 (2019-04-13)
## Breaking changes
- Drop support for Node.js v4
- Add `index` field to `SourcePos`
- Change default parameter of `Config`
- `ErrorMessage` and `Result` are no longer classes
- Rename `AbstractParseError` to `ParseError`, and previous `ParseError` is now `StrictParseError`
- Rename `AbstractParser` to `Parser`, and previous `Parser` is now `StrictParser`
- Rename `Result` methods `csuc`, `cerr`, `esuc`, `eerr` to `csucc`, `cfail`, `esucc`, `efail`
- Remove `assertParser` method
- `uncons` now takes a `Config` object as its argument

## Features
- `show` can now escape control characters
- Add `Result.succ` and `Result.fail`
- Add `Config#setTabWidth` and `#setUnicode`

# 2.0.2 (2018-10-13)
- Fix `ArrayStream` is not exported

# 2.0.1 (2017-03-14)
- Performance improvements

# 2.0.0 (2017-01-11)
- First release!
