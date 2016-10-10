/*
 * loquat-prim
 * copyright (c) 2016 Susisu
 */

"use strict";

module.exports = (_core, sugar) => {
    const _prim = require("./lib/prim.js")(_core);

    return Object.freeze({
        map         : _prim.map,
        pure        : _prim.pure,
        ap          : _prim.ap,
        left        : _prim.left,
        right       : _prim.right,
        bind        : _prim.bind,
        then        : _prim.then,
        fail        : _prim.fail,
        mzero       : _prim.mzero,
        mplus       : _prim.mplus,
        label       : _prim.label,
        labels      : _prim.labels,
        unexpected  : _prim.unexpected,
        tryParse    : _prim.tryParse,
        lookAhead   : _prim.lookAhead,
        reduceMany  : _prim.reduceMany,
        many        : _prim.many,
        skipMany    : _prim.skipMany,
        tokens      : _prim.tokens,
        token       : _prim.token,
        tokenPrim   : _prim.tokenPrim,
        getState    : _prim.getState,
        setState    : _prim.setState,
        updateState : _prim.updateState,
        getConfig   : _prim.getConfig,
        setConfig   : _prim.setConfig,
        getInput    : _prim.getInput,
        setInput    : _prim.setInput,
        getPosition : _prim.getPosition,
        setPosition : _prim.setPosition,
        getUserState: _prim.getUserState,
        setUserState: _prim.setUserState
    });
};
