import React from 'react'

import SessionList from 'pacifica-session'
import 'pacifica-session/dist/index.css'

const App = () => {
  return <SessionList title="Localhost Development" sessionApiUrl="https://localhost:48443" />
}

export default App
