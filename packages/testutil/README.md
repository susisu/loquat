# `@loquat/testutil`
Test utilities.

## Installation
``` shell
npm i -D @loquat/core @loquat/testutil
# or
yarn add -D @loquat/core @loquat/testutil
```

## Usage
First, you need to instantiate `testutil`.
``` javascript
const core = require("@loquat/core")();
const testutil = require("@loquat/testutil")(core);
```

### Chai plugin
``` javascript
chai.use(testutil.plugin);
```

The following language chains are available:

- `.equalPositionTo(pos)`
- `.equalErrorMessageTo(msg)`
- `.equalErrorMessagesTo(msgs)`
- `.equalErrorTo(err)`
- `.equalConfigTo(config)`
- `.equalStateTo(state)`
- `.equalResultTo(res)`
- `.be.a.parser`


### Test helpers
`testutil.helpers` contains test helper functions.

- `createDummyParser`: Create a parser that always fails without consumption

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
