import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import dokku from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await dokku({
      text: input,
    })
    return res
  },
  context: Context,
})

// export default ts
