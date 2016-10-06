/*
 * loquat-prim
 * copyright (c) 2016 Susisu
 */

"use strict";

module.exports = (core, sugar) => {
    let _prim = require("./lib/prim.js")(core);
    const map          = _prim.map;
    const pure         = _prim.pure;
    const ap           = _prim.ap;
    const left         = _prim.left;
    const right        = _prim.right;
    const bind         = _prim.bind;
    const then         = _prim.then;
    const fail         = _prim.fail;
    const mzero        = _prim.mzero;
    const mplus        = _prim.mplus;
    const label        = _prim.label;
    const labels       = _prim.labels;
    const unexpected   = _prim.unexpected;
    const tryParse     = _prim.tryParse;
    const lookAhead    = _prim.lookAhead;
    const reduceMany   = _prim.reduceMany;
    const many         = _prim.many;
    const skipMany     = _prim.skipMany;
    const tokens       = _prim.tokens;
    const token        = _prim.token;
    const tokenPrim    = _prim.tokenPrim;
    const getState     = _prim.getState;
    const setState     = _prim.setState;
    const updateState  = _prim.updateState;
    const getConfig    = _prim.getConfig;
    const setConfig    = _prim.setConfig;
    const getInput     = _prim.getInput;
    const setInput     = _prim.setInput;
    const getPosition  = _prim.getPosition;
    const setPosition  = _prim.setPosition;
    const getUserState = _prim.getUserState;
    const setUserState = _prim.setUserState;

    return Object.freeze({
        map,
        pure,
        ap,
        left,
        right,
        bind,
        then,
        fail,
        mzero,
        mplus,
        label,
        labels,
        unexpected,
        tryParse,
        lookAhead,
        reduceMany,
        many,
        skipMany,
        tokens,
        token,
        tokenPrim,
        getState,
        setState,
        updateState,
        getConfig,
        setConfig,
        getInput,
        setInput,
        getPosition,
        setPosition,
        getUserState,
        setUserState
    });
};
