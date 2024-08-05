import { useState } from 'react';
import { Route, Routes} from 'react-router-dom';


import Navbar from "./components/navbar/Navbar";
import Home from './components/home/Home';
import Footer from './components/footer/Footer'
import Categories from './components/categories/Categories'
import Politics from './components/categories/politics/Politics'
import Business from './components/categories/business/Business'
import Technology from './components/categories/technology/Technology'
import ArticleForm from './components/article-form/ArticleForm';
import Register from './components/register/Register';
import Login from './components/login/Login';
import ArticleCreate from "./components/article-create/ArticleCreate";
import ArticleDetails from "./components/article-details/ArticleDetails";


function App() {
  // TODO remove from component
  const [authState, setAuthState] = useState({});

  const changeAuthState = (state) => {
    // TODO quick solution, fix afterwards by implementing persisted authState
      localStorage.setItem('accessToken', state.accessToken);
      setAuthState(state);
  };
  
  const contextData = {
    userId: authState._id,
    email: authState.email,
    accessToken: authState.accessToken,
    isAuthenticated: !!authState.email,
    changeAuthState,
  };

  return (
    <AuthContext.Provider value={contextData}>
    <div>
      <Navbar />

      <main id="main-content">
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/politics' element={<Politics />}/>
          <Route path='/business' element={<Business />}/>
          <Route path='/technology' element={<Technology />}/>
          <Route path='/create-news' element={<ArticleForm />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/> 
        </Routes>
      </main> 

      <Footer />
    </div>
    </AuthContext.Provider>
  )
}

export default App
