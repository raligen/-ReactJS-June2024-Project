import { Route, Routes} from 'react-router-dom';
import { useState } from 'react'

import Navbar from "./components/navbar/Navbar";
import Home from './components/home/Home';
import Footer from './components/footer/Footer'
import Categories from './components/categories/Categories'
import Politics from './components/categories/politics/Politics'
import Business from './components/categories/business/Business'
import Technology from './components/categories/technology/Technology'



function App() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/categories' element={<Categories />}/>
          <Route path='/politics' element={<Politics />}/>
          <Route path='/business' element={<Business />}/>
          <Route path='/technology' element={<Technology />}/>
          {/* <Route path='/create-article' element={<CreateArticle />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/> */}
        </Routes>
      </main> 

      <Footer />
    </>
  )
}

export default App
