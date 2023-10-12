import './App.css'
import Header from './Header'
import Homepage from './Home/Homepage'
import Footer from './Footer'
import { Route, Routes } from 'react-router'
import Login from './Login'
import Aboutus from './Aboutus'
import Whatwedo from './Whatwedo'

// import "@fortawesome/fontawesome-free"

function App() {

  return (
  <div className="">
     <Header/>
     <Routes>
     <Route path="/aboutus" element={<Aboutus />}/>
     <Route path="/whatwedo" element={<Whatwedo />}/>

       <Route path="/" element={<Homepage />}/>
       <Route path="/login" element={<Login />}/>
     </Routes>
     <Footer/> 
</div>
  )
}

export default App
