const curry = f => (a, ...args) => args.length ? f(a, ...args)
                                                 : (...as) => f(a, ...as)
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

const take = curry(function (limit, iter) {
  const res = []
  for (const a of iter) {
    res.push(a)
    if (res.length === limit) return res
  }
  return res
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

const takeAll = take(Infinity)

const go = (...args) => reduce((acc, f) => f(acc), args)
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs)

const map = curry(pipe(L.map, takeAll))
const filter = curry(pipe(L.filter, takeAll))
const find = curry(pipe(L.filter, take(1), ([a]) => a))