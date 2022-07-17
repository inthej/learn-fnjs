const curry = (f) => (a, ...args) => args.length ? f(a, ...args)
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

L.range = function* (limit) {
  let i = 0
  while (i++ < limit) yield i
}

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

const go = (...args) => reduce((acc, f) => f(acc), args) // 연속되는 함수에 인자를 전달하는 함수
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs) // 연속되는 함수를 실행하는 하나의 함수

const map = curry(pipe(L.map, take(Infinity)))
const filter = curry(pipe(L.filter, take(Infinity)))
const range = pipe(L.range, take(Infinity))