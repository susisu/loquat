# `@loquat/qo`
Sweet syntax powered by generators.

## Installation
``` shell
npm i @loquat/qo
# or
yarn add @loquat/qo
```

See also [`@loquat/framework`](https://github.com/susisu/loquat/tree/master/packages/framework).

## Usage
When writing parsers, `.bind` chains sometimes introduce a kind of *Callback Hell*. But fortunately, you can avoid it using generators to keep your code readable and maintainable!

For example, the following code

``` javascript
const parser =
  parserA.bind(x =>
    parserB.bind(y =>
      perserC.bind(z =>
        pure(foo(x, y, z))
      )
    )
  );
```

can be rewritten as

``` javascript
const parser = qo(function* () {
  const x = yield parserA;
  const y = yield parserB;
  const z = yield parserC;
  return foo(x, y, z);
});
```

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
