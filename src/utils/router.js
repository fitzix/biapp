import NavigatorService from '../services/navigator'
import StorageUtil from './storage'

const routerUtil = {
  logout() {
    StorageUtil.clearAll()
    NavigatorService.reset('LoginPage')
  }
}

export default routerUtil