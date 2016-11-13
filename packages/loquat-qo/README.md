# loquat-qo
Allow friendly syntax for [loquat](https://github.com/susisu/loquat2) using generators , like do-notation in Haskell.

Before:

``` javascript
const parser = parserA.bind(x =>
    parserB.bind(y =>
        perserC.bind(z =>
            pure(something(x, y, z))
        )
    )
);
```

After:

``` javascript
const parser = qo(function* () {
    const x = yield parserA;
    const y = yield parserB;
    const z = yield parserC;
    return something(x, y, z);
});
```

See [loquat](https://github.com/susisu/loquat2) repository for more information.

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
