import { useState } from 'react'
import './components/ChatInterface'
import './App.css'
import ChatInterface from './components/ChatInterface'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ChatInterface/>
  )
}

export default App
