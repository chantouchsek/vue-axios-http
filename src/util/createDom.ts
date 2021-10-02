export function disableTransitions() {
  const css = `
  * {
    animation: none !important;
    transition: none !important;
    transition-timing-function: none !important;
  }`
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  head.appendChild(style)
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
}

export function addElemWithDataAppToBody() {
  const app = document.createElement('div')
  app.setAttribute('data-app', String(true))
  document.body.append(app)
}
