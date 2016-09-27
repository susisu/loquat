/*
 * loquat test / error.AbstractParseError
 * copyright (c) 2016 Susisu
 */

"use strict";

describe(".AbstractParseError", () => {
    require("./AbstractParseError/constructor.js");
    require("./AbstractParseError/pos.js");
    require("./AbstractParseError/msgs.js");
    require("./AbstractParseError/toString.js");
    require("./AbstractParseError/isUnknown.js");
    require("./AbstractParseError/setPosition.js");
    require("./AbstractParseError/setMessages.js");
    require("./AbstractParseError/addMessages.js");
    require("./AbstractParseError/setSpecificTypeMessages.js");
});
