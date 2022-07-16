const curry = (f) => (a, ...args) => args.length ? f(a, ...args)
  : (...as) => f(a, ...as)

const map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a)
  }
})

const filter = curry(function* (f, iter) {
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

const take = curry(function (limit, iter) {
  const res = []
  for (const a of iter) {
    res.push(a)
    if (res.length === limit) return res
  }
  return res
})

// 함수들이 연속적으로 실행 될 수 있도록 인자들을 전달한다.
const go = (...args) => reduce((acc, f) => f(acc), args)

// 연속되는 함수를 실행하는 하나의 함수이다.
const pipe = (f, ...fs) => (acc) => go(f(acc), ...fs)

