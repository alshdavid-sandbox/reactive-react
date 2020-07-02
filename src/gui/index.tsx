import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalContext } from 'global-context'
import { HomePage } from './pages'

const services = {
}

const App = () => {
  // Imagine a router in place of this
  return <HomePage />
  // return <GalleryPage />
}

export function main() {
  ReactDOM.render(<GlobalContext.Provider value={services}><App /></GlobalContext.Provider>,
  document.getElementById('root'))
}
