import argufy from 'argufy'

export const argsConfig = {
  'command': {
    description: 'The command to execute.',
    command: true,
    multiple: true,
  },
  'host': {
    description: 'The host. If not given, reads executes `git remote` and uses `dokku` record.',
  },
  'app': {
    description: 'The app. If not given, reads executes `git remote` and uses `dokku` record.',
    short: 'a',
  },
  'user': {
    description: 'Dokku user, used to look the host from git remote, and to connect.',
    default: 'dokku',
  },
}

const args = argufy(argsConfig)

/**
 * The command to execute.
 */
export const _command = /** @type {!Array<string>} */ (args['command'])

/**
 * The host. If not given, reads executes `git remote` and uses `dokku` record.
 */
export const _host = /** @type {string} */ (args['host'])

/**
 * The app. If not given, reads executes `git remote` and uses `dokku` record.
 */
export const _app = /** @type {string} */ (args['app'])

/**
 * Dokku user, used to look the host from git remote, and to connect. Default `dokku`.
 */
export const _user = /** @type {string} */ (args['user'] || 'dokku')

/**
 * The additional arguments passed to the program.
 */
export const _argv = /** @type {!Array<string>} */ (args._argv)