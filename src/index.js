// version "exceljs": "^4.4.0" is not needed

import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import { store } from './redux/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
// export const API_URL = 'https://insuranceapi-3o5t.onrender.com/'
export const API_URL = 'https://insuranceapi-3o5t.onrender.com/'
const hostname =
  window.location.hostname === 'localhost'
    ? window.location.hostname + ':3000'
    : window.location.hostname
export const forntendurl = window.location.protocol + '//' + hostname



