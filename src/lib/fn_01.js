function map(f, iter) {
  const res = []
  for (const a of iter) {
    res.push(f(a))
  }
  return res
}

function filter(f, iter) {
  const res = []
  for (const a of iter) {
    if (f(a)) res.push(a)
  }
  return res
}

function reduce(f, acc, iter) {
  if (!iter) {
    iter = acc[Symbol.iterator]()
    acc = iter.next().value
  }

  for (const a of iter) {
    acc = f(acc, a)
  }
  return acc
}