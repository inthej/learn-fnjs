const curry = (f) => (a, ...args) => args.length ? f(a, ...args)
                                                 : (..._) => f(a, ..._)
const go = (...args) => reduce((acc, f) => f(acc), args)
const pipe = (f, ...fs) => (...args) => go(f(...args), ...fs)

const L = {}
L.map = curry(function *(f, iter) {
  for (const a of iter) {
    yield f(a)
  }
})
const map = curry((f, iter) => go(iter, L.map(f), takeAll))

L.filter = curry(function *(f, iter) {
  for (const a of iter) {
    if (f(a)) yield a
  }
})
const filter = curry((f, iter) => go(iter, L.filter(f), takeAll))

const reduce = curry(function (f, acc, iter) {
  if (!iter) {
    iter = acc[Symbol.iterator]()
    acc = iter.next().value
  }
  for (const a of iter) {
    acc = f(acc, a)
  }
  return acc
})

const take = curry(function (limit, iter) {
  const res = []
  for (const a of iter) {
    res.push(a)
    if (res.length === limit) return res
  }
  return res
})

const takeAll = take(Infinity)

const find = curry(pipe(L.filter, take(1), ([a]) => a))

const isSymbolIterator = (a) => a && a[Symbol.iterator]
L.flatten = function* (iter) {
  for (const a of iter) {
    if (isSymbolIterator(a)) yield* L.flatten(a)
    else yield a
  }
}

L.flatMap = curry(pipe(L.map, L.flatten))
const flatMap = curry(pipe(L.flatMap, takeAll))

