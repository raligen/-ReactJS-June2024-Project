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
import Logout from './components/logout/Logout';
import ArticleCreate from "./components/article-create/ArticleCreate";
import ArticleDetails from "./components/article-details/ArticleDetails";

import { AuthContextProvider } from "./contexts/AuthContext";


function App() {
  return (
    <AuthContextProvider>
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
                <Route path='/logout' element={<Logout />}/> 
            </Routes>
          </main> 

         <Footer />
     </div>
    </AuthContextProvider>
  )
};

export default App
