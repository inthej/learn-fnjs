
const curry = f => (a, ...args) => args.length ? f(a, ...args)
                                               : (...as) => f(a, ...as)

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