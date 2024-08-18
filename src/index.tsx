import React from 'react'
import * as ReactDOM from 'react-dom/client'
import '~/assets/css/index.css'
import App from '~/app'
import reportWebVitals from '~/report-web-vitals'

const rootElement = document.querySelector('#root')
if (!rootElement) {
  throw new Error('Could not find root element')
}
const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
