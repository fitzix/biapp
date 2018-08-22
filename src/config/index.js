import devConfig from './dev.env'
import prodConfig from './prod.env'

export default __DEV__ ? devConfig : prodConfig