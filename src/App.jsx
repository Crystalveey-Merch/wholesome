import './App.css'
import Header from './Header'
import Homepage from './Home/Homepage'
import Footer from './Footer'
import { Route, Routes } from 'react-router'
import Account from './Account'
import Aboutus from './Aboutus'
import Whatwedo from './Whatwedo'
import { useEffect } from 'react'
import Login from './Accunts/Login'
import Signip from './Accunts/Signip'

// import "@fortawesome/fontawesome-free"

function App() {
  useEffect(() => {
    // Scroll to the section based on the hash in the URL
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  return (
  <div className="">
     <Header/>
     <Routes>
     <Route path="/aboutus" element={<Aboutus />}/>
     <Route path="/aboutus/#whatwedo" element={<Aboutus />}/>

     <Route path="/whatwedo" element={<Whatwedo />}/>

       <Route path="/" element={<Homepage />}/>

       <Route path="/account" element={<Account />}/>
       <Route path="/login" element={<Login />}/>
       
       <Route path="/signup" element={<Signip />}/>
     </Routes>
     <Footer/> 
</div>
  )
}

export default App
