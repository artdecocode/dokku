/* yarn example/ */
import dokku from '../src'

(async () => {
  const res = await dokku({
    text: 'example',
  })
  console.log(res)
})()