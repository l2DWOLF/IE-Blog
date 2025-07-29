import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthRoute, GuestRoute, RoleRoute } from './auth/guards/RouteGuards'
import { useDispatch } from 'react-redux'
import { ToastContainer } from "react-toastify"
import { useEffect } from 'react'
import { SetAuthLoading } from './redux/UserState'

import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import About from './components/about/About'
import Login from './components/user/login/Login'
import Register from './components/user/register/Register'
import NotFound from './components/notfound/NotFound'
import LikedArticles from './components/articles/LikedArticles'
import CreateArticle from './components/articles/CreateArticle'
import EditArticle from './components/articles/EditArticle'
import MyArticles from './components/articles/MyArticles'
import { ArticleProvider } from './contexts/ArticleContext'
import ProfilePage from './components/user/profile/ProfilePage'
import ScrollToTopButton from './components/common/scroll-btn/ScrollToTopButton'
import Footer from './components/footer/Footer'


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const access = sessionStorage.getItem("access_token");
    const refresh = sessionStorage.getItem("refresh_token");

    if (!access & !refresh) {
      dispatch(SetAuthLoading(false));
    };
  }, [dispatch])

  return (<div className="wrapper">
    <div className="bgImage"></div>
    <Router>
      <ArticleProvider>
        <Navbar />
        <div className="toast-wrapper">
          <ToastContainer className="toast-container"
            newestOnTop
            pauseOnFocusLoss
            pauseOnHover
          />
        </div>

        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>

          <Route path="/liked-articles" element={<AuthRoute roles={["user", "mod", "admin"]}>   
            <LikedArticles />  
          </AuthRoute>} />

          <Route path="/my-articles" element={<AuthRoute roles={["mod", "admin"]}> 
            <MyArticles />  
          </AuthRoute>} />

          <Route path="/add-article" element={<RoleRoute roles={["mod", "admin"]}> 
            <CreateArticle />  
          </RoleRoute>} />

          <Route path="/edit-article/:id" element={<RoleRoute roles={["mod", "admin"]}> 
            <EditArticle />  
          </RoleRoute>} />

          <Route
            path="/login"
            element={<GuestRoute> <Login /> </GuestRoute>}
          />
          <Route
            path="/register"
            element={<GuestRoute> <Register /> </GuestRoute>}
          />

          <Route path="/Profile/:id" element={<ProfilePage />} />
          <Route path="/Profile" element={<AuthRoute roles={["user", "mod", "admin"]}> 
            <ProfilePage />  
          </AuthRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      
      <Footer />
      </ArticleProvider>
    </Router>
    <ScrollToTopButton />
  </div>)
}
export default App