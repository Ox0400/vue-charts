import * as d3 from 'd3'

const _y = 31536000, // Seconds in a year
  _d = 86400, // Seconds in a day
  _h = 3600, // Seconds in an hour
  _m = 60, // Seconds in a minute
  _s = 1 // Seconds in a second :)

const aggregateSeconds = (s: number): Record<string, number> => {
  const years = Math.floor(s / _y)
  const days = Math.floor(s % _y / _d)
  const hours = Math.floor(s % _y % _d / _h)
  const minutes = Math.floor(s % _y % _d % _h / _m)
  const seconds = Math.ceil(s % _y % _d % _h % _m)

  return { years, days, hours, minutes, seconds }
}

const getLargestInterval = (s: number): string => {
  const _t = aggregateSeconds(s)

  if (_t.years > 0) {
    return 'years'
  }

  if (_t.days > 0) {
    return 'days'
  }

  if (_t.hours > 0) {
    return 'hours'
  }

  if (_t.minutes > 0) {
    return 'minutes'
  }

  return 'seconds'
}

const secondsToInterval = (s: number): number => {
  const _t = getLargestInterval(s)

  switch (_t) {
    case 'years':
      return s / _y
    case 'days':
      return s / _d
    case 'hours':
      return s / _h
    case 'minutes':
      return s / _m
    case 'seconds':
    default:
      return s / _s
  }
}

const getD3IntervalMethod = (start: Date, end: Date) => {
  const timeStart = start.getTime() / 1000 // time in seconds
  const timeEnd = end.getTime() / 1000 // time in seconds

  const _t = getLargestInterval(timeEnd - timeStart)

  switch (_t) {
    case 'years':
      return d3.timeYear
    case 'days':
      return d3.timeDay
    case 'hours':
      return d3.timeHour
    case 'minutes':
      return d3.timeMinute
    case 'seconds':
    default:
      return d3.timeSecond
  }
}

export { getD3IntervalMethod, getLargestInterval, secondsToInterval, aggregateSeconds }