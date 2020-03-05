import spawn from 'spawncommand'
import { readFileSync } from 'fs'
import { _command, _host, _app, _user } from './get-args'

const command = _command || []
const [action, ...rest] = command

const run = async (Host, App) => {
  let realCommand
  if (action == 'config:env') {
    const a = readFileSync('.env', 'utf8')
    const vars = a.split('\n').join(' ')
    realCommand = ['config:set', App, vars]
  } else if (action == 'config:get') {
    if (!rest.length) throw new Error('Usage: config:get <KEY>')
    realCommand = [action, App, ...rest]
  }
  // else if (['config:set', 'config:unset'].includes(action)) {
  //   realCommand = [action, App, ...rest]
  // }
  else {
    realCommand = [action, App, ...rest]
  }
  const rc = realCommand.join(' ')
  if (rc.length) console.log(rc)
  // return

  spawn('ssh', [Host, rc], /** @type {!child_process.SpawnOptions} */ ({
    stdio: 'inherit',
  }))
}

;(async () => {
  // if (_command) throw new Error('please specify command')
  let Host = _host, App = _app
  if (!_host || !_app) {
    const p = spawn('git', ['remote', '-v'])
    const { stdout } = await p.promise
    const h = stdout
      .split('\n')
      .filter(a => /\(push\)/.test(a))
      .reduce((acc, c) => {
        const [, location] = c.split('\t')
        if (!location.startsWith(_user)) return acc
        const [host, app] = location.replace(' (push)', '').split(':')
        acc[app] = host
        return acc
      }, {})
    const keys = Object.keys(h)
    if (!keys.length) {
      console.log('No dokku remotes found.')
      process.exit(1)
    }
    if (keys.length > 1 && !_app) {
      console.log('More than one app found: %s', keys.join(', '))
      console.log('Use -a to specify which app to use.')
      process.exit()
    } else if (!_app) {
      ([[App, Host]] = Object.entries(h))
    } else {
      App = _app
      Host = h[App]
      if (!Host) {
        console.log('Host not found for %s', App)
        console.log('Existing dokku apps: %s', keys.join(', '))
        process.exit()
      }
    }
  }
  console.log('Will connect to %s:%s', Host, App)

  try {
    await run(Host, App)
  } catch (err) {
    console.log(err.message)
  }
  // const p = spawn(_command)
})()