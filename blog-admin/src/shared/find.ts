export const findSameName = (arr: any, key: string) => {
  const counts = arr.reduce(
    (all: { [x: string]: any }, current: { [x: string]: string | number }) => {
      all[current[key]] = (all[current[key]] || 0) + 1
      return all
    },
    {}
  )

  return Object.keys(counts).filter((name) => counts[name] > 1)
}
