import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify"
import Home from './components/home/Home'
import About from './components/about/About'
import Navbar from './components/navbar/Navbar'
import Login from './components/login/Login'
import Register from './components/register/Register'


function App() {
  return (<div className="wrapper">

    <Router>
      <Navbar />
      <ToastContainer className="toastifier"
        newestOnTop
        pauseOnFocusLoss
        pauseOnHover
      />
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

    </Router>
  </div>)
}

export default App