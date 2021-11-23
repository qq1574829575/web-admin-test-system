const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  user: state => state.user,
  token: state => state.user.token,
  routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
