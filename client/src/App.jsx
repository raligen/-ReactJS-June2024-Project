import { useState } from 'react';
import { Route, Routes, Navigate} from 'react-router-dom';
import { useParams } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthContext";

import Navbar from "./components/navbar/Navbar";
import Home from './components/home/Home';
import Footer from './components/footer/Footer'
import ArticleDetails from './components/article/ArticleDetails';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Logout from './components/logout/Logout';
import ArticleCreate from "./components/article-create/ArticleCreate";
import ArticleEdit from "./components/article-edit/ArticleEdit";
import ArticleList from "./components/article-list/ArticleList";
import ArticleListItem from "./components/article-list/article-list-item/ArticleListItem";
import AuthorizedView from "./components/common/AuthorizedView";


function App() {
  return (
    <AuthContextProvider>
      <div>
        <main id="main-content">
         <Navbar />

            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/articles" element={<ArticleList />}/>
                <Route path="/articles/:articleId/" element={<ArticleDetails />}/>
                <Route path="/articles/:articleId/edit" element={<ArticleEdit />}/>
                <Route path="/articles/create" element={<ArticleCreate />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/> 
                <Route path="/logout" element={<Logout />}/> 
            </Routes>
          

         <Footer />
        </main>  
     </div>
    </AuthContextProvider>
  )
};

export default App
