/*
 * loquat-core test / error.LazyParseError
 */

"use strict";

describe(".LazyParseError", () => {
    require("./LazyParseError/constructor.js");
    require("./LazyParseError/eval.js");
    require("./LazyParseError/pos.js");
    require("./LazyParseError/msgs.js");
    require("./LazyParseError/toString.js");
    require("./LazyParseError/isUnknown.js");
    require("./LazyParseError/setPosition.js");
    require("./LazyParseError/setMessages.js");
    require("./LazyParseError/addMessages.js");
    require("./LazyParseError/setSpecificTypeMessages.js");
});
