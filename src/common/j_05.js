const curry = (f) => (a, ...args) => args.length ? f(a, ...args)
                                                 : (...as) => f(a, ...as)

function range(limit) {
  const res = []
  let i = 0
  while (i++ < limit) res.push(i)
  return res
}

const map = curry(function (f, iter) {
  const res = []
  for (const a of iter) {
    res.push(f(a))
  }
  return res
})

const filter = curry(function (f, iter) {
  const res = []
  for (const a of iter) {
    if (f(a)) res.push(a)
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

const take = curry(function (limit, iter) {
  const res = []
  for (const a of iter) {
    res.push(a)
    if (res.length === limit) return res
  }
  return res
})

const go = (...args) => reduce((acc, f) => f(acc), args)
const pipe = (...fs) => (acc) => go(acc, ...fs)

const L = {}
L.range = function* (limit) {
  let i = 0
  while(i++ < limit) yield i
}

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