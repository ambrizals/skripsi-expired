'use strict'
const Env = use('Env')
const Logger = use('Logger')

class ConvertEmptyStringsToNull {
  async handle ({ request }, next) {
    if (process.env.NODE_ENV !== 'testing') {
      Logger.transport('console').info('Requested Data Headers', request.headers())
      Logger.transport('console').info('Requested Data Body', request.except(['password']))
    }
    if (Object.keys(request.body).length) {
      request.body = Object.assign(
        ...Object.keys(request.body).map(key => ({
          [key]: request.body[key] !== '' ? request.body[key] : null
        }))
      )
    }

    await next()
  }
}

module.exports = ConvertEmptyStringsToNull
