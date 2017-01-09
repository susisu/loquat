/*
 * loquat-core test / error
 */

"use strict";

describe("error", () => {
    require("./error/ErrorMessage.js");
    require("./error/AbstractParseError.js");
    require("./error/ParseError.js");
    require("./error/LazyParseError.js");
    require("./error/_internal.js");
});
