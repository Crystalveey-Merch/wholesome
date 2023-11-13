import React from 'react'
import Section1 from './Section1'
import Sectiom2 from './Sectiom2'
import Section3 from './Section3'
import Section4 from './Section4'
import Section1plus from './Section1plus'
import Section2first from './Section2first'
import Section2new from './Section2new'

const Homepage = () => {
  return (
    <div className='h-full  w-screen pt-20 sm:pt-14  bg-stone-100'>
        <Section1/>
        <Section1plus/>

        <Section2new/>
        <Section4/>
          
        <Section2first/>
        
        
        <Section3/>

       


       

       

    </div>
  )
}

export default Homepage