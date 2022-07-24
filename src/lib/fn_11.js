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

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a)

const reduce = curry(function (f, acc, iter) {
  if (!iter) {
    iter = acc[Symbol.iterator]()
    acc = iter.next().value
  }

  // Promise 체인이 연속적으로 일어나는  불필요한 로드로 인한 성능 저하가 발생한다.
  // for (const a of iter) {
  //   acc = f(acc, a)
  // }
  // return acc

  // 하나의 call stack 에서의 처리 방법.. 유명함수 사용
  // return function recur(acc) {
  //   for (const a of iter) {
  //     acc = f(acc ,a)
  //     if (acc instanceof Promise) return acc.then(recur)
  //   }
  //   return acc
  // } (acc)

  return go1(acc, function recur(acc) {
    for (const a of iter) {
      acc = f(acc, a)
      if (acc instanceof Promise) return acc.then(recur)
    }
    return acc
  })
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