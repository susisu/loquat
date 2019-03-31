"use strict";

module.exports = (_core, { _prim, _combinators }) => {
  const { ParseError, Result, StrictParser } = _core;
  const { pure, bind, then, fail, mplus, label, tryParse } = _prim;
  const { choice } = _combinators;

  /**
   * type OperatorType = "infix" \/ "prefix" \/ "postfix"
   */

  /**
   * object OperatorType {
   *   INFIX: "infix"
   *   PREFIX: "prefix"
   *   POSTFIX: "postfix"
   * }
   */
  const OperatorType = Object.freeze({
    INFIX  : "infix",
    PREFIX : "prefix",
    POSTFIX: "postfix",
  });

  /**
   * type OperatorAssoc = "none" \/ "left" \/ "right"
   */

  /**
   * object OperatorAssoc {
   *   NONE: "none"
   *   LEFT: "left"
   *   RIGHT: "right"
   * }
   */
  const OperatorAssoc = Object.freeze({
    NONE : "none",
    LEFT : "left",
    RIGHT: "right",
  });

  /**
   * type InfixOperator[S, U, A] = {
   *   type: "infix",
   *   parser: Parser[S, U, (A, A) => A],
   *   assoc: OperatorAssoc,
   * }
   */

  /**
   * type PrefixOperator[S, U, A] = {
   *   type: "prefix",
   *   parser: Parser[S, U, A => A],
   * }
   */

  /**
   * type PostfixOperator[S, U, A] = {
   *   type: "postfix",
   *   parser: Parser[S, U, A => A],
   * }
   */

  /**
   * type Operator[S, U, A] =
   *      InfixOperator[S, U, A]
   *   \/ PrefixOperator[S, U, A]
   *   \/ PostfixOperator[S, U, A]
   */

  /**
   * object Operator {
   *   infix: [S, U, A](
   *     parser: Parser[S, U, (A, A) => A],
   *     assoc: OperatorAssoc
   *   ) => InfixOperator[S, U, A]
   *   prefix: [S, U, A](parser: Parser[S, U, A => A]) => PrefixOperator[S, U, A]
   *   postfix: [S, U, A](parser: Parser[S, U, A => A]) => PostfixOperator[S, U, A]
   * }
   */
  const Operator = Object.freeze({
    infix(parser, assoc) {
      return { type: OperatorType.INFIX, parser, assoc };
    },
    prefix(parser) {
      return { type: OperatorType.PREFIX, parser };
    },
    postfix(parser) {
      return { type: OperatorType.POSTFIX, parser };
    },
  });

  /**
   * makeParser: [S, U, A](term: Parser[S, U, A], ops: Array[Operator[S, U, A]]) => Parser[S, U, A]
   */
  function makeParser(term, ops) {
    // collect operators
    const nonAssoc   = [];
    const leftAssoc  = [];
    const rightAssoc = [];
    const prefix     = [];
    const postfix    = [];
    for (const op of ops) {
      switch (op.type) {
      case OperatorType.INFIX:
        switch (op.assoc) {
        case OperatorAssoc.NONE:
          nonAssoc.push(op.parser);
          break;
        case OperatorAssoc.LEFT:
          leftAssoc.push(op.parser);
          break;
        case OperatorAssoc.RIGHT:
          rightAssoc.push(op.parser);
          break;
        default:
          throw new Error(`unknown operator associativity: ${op.assoc}`);
        }
        break;
      case OperatorType.PREFIX:
        prefix.push(op.parser);
        break;
      case OperatorType.POSTFIX:
        postfix.push(op.parser);
        break;
      default:
        throw new Error(`unknown operator type: ${op.type}`);
      }
    }

    // create operator parsers
    const nassocOp  = choice(nonAssoc);
    const lassocOp  = choice(leftAssoc);
    const rassocOp  = choice(rightAssoc);
    const prefixOp  = label(choice(prefix), "");
    const postfixOp = label(choice(postfix), "");

    // warn ambiguity (always efail)
    function ambiguous(assoc, parser) {
      return tryParse(
        then(parser, fail(`ambiguous use of a ${assoc} associative operator`))
      );
    }

    const ambiguousNon   = ambiguous("non", nassocOp);
    const ambiguousLeft  = ambiguous("left", lassocOp);
    const ambiguousRight = ambiguous("right", rassocOp);

    // identity
    function id(x) {
      return x;
    }

    // unary operators
    const prefixP  = mplus(prefixOp, pure(id));
    const postfixP = mplus(postfixOp, pure(id));

    // term parser
    const termP = bind(prefixP, pre =>
      bind(term, val =>
        bind(postfixP, post =>
          pure(post(pre(val)))
        )
      )
    );

    // right assoc binary operator
    function rassocP(x) {
      return mplus(
        bind(rassocOp, f =>
          bind(bind(termP, rassocP1), y =>
            pure(f(x, y))
          )
        ),
        mplus(ambiguousLeft, ambiguousNon)
      );
    }

    function rassocP1(x) {
      return new StrictParser(state => {
        const vals = [];
        const operations = [];
        let currentState = state;
        let currentErr = ParseError.unknown(state.pos);
        let consumed = false;
        while (true) {
          const initState = currentState;

          const opRes = rassocOp.run(currentState);
          if (opRes.success) {
            if (opRes.consumed) {
              consumed = true;
              operations.push(opRes.val);
              currentState = opRes.state;
              currentErr = opRes.err;
            } else {
              operations.push(opRes.val);
              currentState = opRes.state;
              currentErr = ParseError.merge(currentErr, opRes.err);
            }
          } else {
            if (opRes.consumed) {
              return opRes;
            } else {
              const ambRes = mplus(ambiguousLeft, ambiguousNon).run(initState); // always efail
              // assert(!ambRes.success && !ambRes.consumed);
              const err = ParseError.merge(ParseError.merge(currentErr, opRes.err), ambRes.err);
              let resVal = x;
              if (vals.length > 0) {
                let currentVal = vals[vals.length - 1];
                for (let i = vals.length - 2; i >= 0; i -= 1) {
                  currentVal = operations[i + 1](vals[i], currentVal);
                }
                resVal = operations[0](resVal, currentVal);
              }
              return consumed
                ? Result.csucc(err, resVal, initState)
                : Result.esucc(err, resVal, initState);
            }
          }

          const termRes = termP.run(currentState);
          if (termRes.success) {
            if (termRes.consumed) {
              consumed = true;
              vals.push(termRes.val);
              currentState = termRes.state;
              currentErr = termRes.err;
            } else {
              vals.push(termRes.val);
              currentState = termRes.state;
              currentErr = ParseError.merge(currentErr, termRes.err);
            }
          } else {
            if (termRes.consumed) {
              return termRes;
            } else {
              if (opRes.consumed) {
                return Result.cfail(ParseError.merge(currentErr, termRes.err));
              } else {
                const ambRes = mplus(ambiguousLeft, ambiguousNon).run(initState); // always efail
                // assert(!ambRes.success && !ambRes.consumed);
                const err = ParseError.merge(ParseError.merge(currentErr, termRes.err), ambRes.err);
                let resVal = x;
                if (vals.length > 0) {
                  let currentVal = vals[vals.length - 1];
                  for (let i = vals.length - 2; i >= 0; i -= 1) {
                    currentVal = operations[i + 1](vals[i], currentVal);
                  }
                  resVal = operations[0](resVal, currentVal);
                }
                return consumed
                  ? Result.csucc(err, resVal, initState)
                  : Result.esucc(err, resVal, initState);
              }
            }
          }
        }
      });
    }

    // left assoc binary operator
    function lassocP(x) {
      return mplus(
        bind(lassocOp, f =>
          bind(termP, y =>
            lassocP1(f(x, y))
          )
        ),
        mplus(ambiguousRight, ambiguousNon)
      );
    }

    function lassocP1(x) {
      return new StrictParser(state => {
        let currentVal = x;
        let currentOperation;
        let currentState = state;
        let currentErr = ParseError.unknown(state.pos);
        let consumed = false;
        while (true) {
          const initState = currentState;

          const opRes = lassocOp.run(currentState);
          if (opRes.success) {
            if (opRes.consumed) {
              consumed = true;
              currentOperation = opRes.val;
              currentState = opRes.state;
              currentErr = opRes.err;
            } else {
              currentOperation = opRes.val;
              currentState = opRes.state;
              currentErr = ParseError.merge(currentErr, opRes.err);
            }
          } else {
            if (opRes.consumed) {
              return opRes;
            } else {
              const ambRes = mplus(ambiguousRight, ambiguousNon).run(initState); // always efail
              // assert(!ambRes.success && !ambRes.consumed);
              const err = ParseError.merge(ParseError.merge(currentErr, opRes.err), ambRes.err);
              return consumed
                ? Result.csucc(err, currentVal, initState)
                : Result.esucc(err, currentVal, initState);
            }
          }

          const termRes = termP.run(currentState);
          if (termRes.success) {
            if (termRes.consumed) {
              consumed = true;
              currentVal = currentOperation(currentVal, termRes.val);
              currentState = termRes.state;
              currentErr = termRes.err;
            } else {
              currentVal = currentOperation(currentVal, termRes.val);
              currentState = termRes.state;
              currentErr = ParseError.merge(currentErr, termRes.err);
            }
          } else {
            if (termRes.consumed) {
              return termRes;
            } else {
              if (opRes.consumed) {
                return Result.cfail(ParseError.merge(currentErr, termRes.err));
              } else {
                const ambRes = mplus(ambiguousRight, ambiguousNon).run(initState); // always efail
                // assert(!ambRes.success && !ambRes.consumed);
                const err = ParseError.merge(ParseError.merge(currentErr, termRes.err), ambRes.err);
                return consumed
                  ? Result.csucc(err, currentVal, initState)
                  : Result.esucc(err, currentVal, initState);
              }
            }
          }
        }
      });
    }

    // non assoc binary operator
    function nassocP(x) {
      return bind(nassocOp, f =>
        bind(termP, y =>
          mplus(
            mplus(
              mplus(ambiguousRight, ambiguousLeft),
              ambiguousNon
            ),
            pure(f(x, y))
          )
        )
      );
    }

    return bind(termP, x =>
      label(
        mplus(
          mplus(
            mplus(rassocP(x), lassocP(x)),
            nassocP(x)
          ),
          pure(x)
        ),
        "operator"
      )
    );
  }

  /**
   * buildExpressionParser: [S, U, A](
   *   opTable: Array[Array[Operator[S, U, A]]],
   *   atom: Parser[S, U, A]
   * ) => Parser[S, U, A]
   */
  function buildExpressionParser(opTable, atom) {
    return opTable.reduce(makeParser, atom);
  }

  return Object.freeze({
    OperatorType,
    OperatorAssoc,
    Operator,
    buildExpressionParser,
  });
};
