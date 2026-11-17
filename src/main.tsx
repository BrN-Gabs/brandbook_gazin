import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import '@fontsource-variable/inter/wght.css'
import '@fontsource/montserrat/latin-700.css'
import '@fontsource/montserrat/latin-700-italic.css'
import './styles/globals.css'
import App from './App'
import { prepareEntry } from './motion/entry'

prepareEntry()
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
