import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import dokku from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof dokku, 'function')
  },
  async 'calls package without error'() {
    await dokku()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await dokku({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T