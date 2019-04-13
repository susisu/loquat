# `@loquat/framework`
Loquat framework.

## Installation
``` shell
npm i @loquat/core @loquat/framework
# or
yarn add @loquat/core @loquat/framework
```

## Usage
First, create a new instance of loquat.

``` javascript
const lq = require("@loquat/framework")(require("@loquat/core"));
```

The core features will be accessible via `lq`, like `lq.parse`.

To use an extension, first install it

``` shell
npm i @loquat/prim
# or
yarn add @loquat/prim
```

and `use` it.

``` javascript
lq.use(require("@loquat/prim"), { options: { sugar: true } });

const p = lq.pure(42);
```

## API
### `lq.use(ext, opts)`
Use an extension.

An extension is a function that takes the core instance and options.

``` javascript
module.exports = (core, opts) => {
  // ...
  return {
    // foo: "bar", ...
  };
};
```

All the values returned from the extension will be assigned to `lq` by default.

#### Options
If `name` is specified, the extension will also be accessible via `lq.exts[name]`.

If `qualified: true` is specified, the extension will not be assigned to `lq`.

If `options` is provided, it will be passed to the extension as an argument.

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
