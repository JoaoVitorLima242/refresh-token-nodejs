import pino from 'pino'

export default pino({
  level: 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
})
