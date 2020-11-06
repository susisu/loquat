# loquat
[![CI](https://github.com/susisu/loquat/workflows/CI/badge.svg)](https://github.com/susisu/loquat/actions?query=workflow%3ACI)

Monadic parser combinators for JavScript, inspired by [Parsec](https://github.com/haskell/parsec).

``` javascript
import * as lq from "@loquat/simple";

const nat = lq.digit.manyChars1().map(str => parseInt(str, 10));
const op = lq.choice([
  lq.char("+").return((a, b) => a + b),
  lq.char("-").return((a, b) => a - b),
]);
const expr =
  nat.bind(a =>
    op.bind(f =>
      nat.map(b =>
        f(a, b)
      )
    )
  );

const res = expr.parse("", "14+28"); // { success: true, value: 42 }
```

## Packages
If you are not familiar with loquat, or you are using TypeScript, `@loquat/simple` is recommended.

- [simple](https://github.com/susisu/loquat/tree/master/packages/simple)

For a more flexible and extensible framework, use `@loquat/framework`.

- [framework](https://github.com/susisu/loquat/tree/master/packages/framework)

The core features and extensions are provided as separate packages.

- [core](https://github.com/susisu/loquat/tree/master/packages/core)
- [prim](https://github.com/susisu/loquat/tree/master/packages/prim)
- [char](https://github.com/susisu/loquat/tree/master/packages/char)
- [combinators](https://github.com/susisu/loquat/tree/master/packages/combinators)
- [monad](https://github.com/susisu/loquat/tree/master/packages/monad)
- [expr](https://github.com/susisu/loquat/tree/master/packages/expr)
- [qo](https://github.com/susisu/loquat/tree/master/packages/qo)
- [token](https://github.com/susisu/loquat/tree/master/packages/token)

For extension development, a [chai](https://www.chaijs.com) plugin and some test helpers are available.

- [testutil](https://github.com/susisu/loquat/tree/master/packages/testutil)

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
