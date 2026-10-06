import { useState } from 'react'
import './index.css'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Root from './pages/Root'
import Signup from './components/SignUp'
import UploadFile from './pages/UploadFile'
import CreateFolder from './pages/CreateFolder'
import ReceiveForm from './pages/ReceiveForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/receive" element={<ReceiveForm />} />
        <Route path="/root" element={<Root />} />
        <Route path="/upload-file" element={<UploadFile />} />
        <Route path="/create-folder" element={<CreateFolder />} />
      </Routes>
    </>
  )
}

export default App
