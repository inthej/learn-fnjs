const curry = (f) => (a, ...args) => args.length ? f(a, ...args)
                                                 : (...as) => f(a, ...as)
const go = (...args) => reduce((acc, f) => f(acc), args)
const pipe = (f, ...fs) => (...args) => go(f(...args), ...fs)

const L = {}
L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a)
  }
})

L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a
  }
})

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

const take = curry(function (l, iter) {
  const res = []
  for (const a of iter) {
    res.push(a)
    if (res.length === l) return res
  }
  return res
})
const takeOne = take(1)
const takeAll = take(Infinity)

const isSymbolIterator = a => a && a[Symbol.iterator]
L.flatten = function* (iter) {
  for (const a of iter) {
    if (isSymbolIterator(a)) yield* L.flatten(a)
    else yield a
  }
}

L.flatMap = curry(pipe(L.map, L.flatten))

const flatMap = curry(pipe(L.flatMap, takeAll))

const map = curry(pipe(L.map, takeAll))

const filter = curry(pipe(L.filter, takeAll))

const find = curry(pipe(L.filter, takeOne, ([a]) => a))