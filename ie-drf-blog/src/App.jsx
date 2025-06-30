import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { GuestRoute } from './auth/guards/RouteGuards' 
import { useDispatch} from 'react-redux'
import { ToastContainer } from "react-toastify"
import Home from './components/home/Home'
import About from './components/about/About'
import Navbar from './components/navbar/Navbar'
import Login from './components/login/Login'
import Register from './components/register/Register'
import { useEffect } from 'react'
import { SetAuthLoading } from './redux/UserState'
import NotFound from './components/notfound/NotFound'
import CreateArticle from './components/articles/CreateArticle'


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const access = sessionStorage.getItem("access_token");
    const refresh = sessionStorage.getItem("refresh_token");

    if(!access & !refresh){
      dispatch(SetAuthLoading(false));
    };

  },[dispatch])

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

        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
          } />

        <Route path="/register" element={
          <GuestRoute>
            <Register />
          </GuestRoute>
          } />

          <Route path="/add-article" element={<CreateArticle />} />

      <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  </div>)
}

export default App