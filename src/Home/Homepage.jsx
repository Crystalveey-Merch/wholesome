import React from 'react'
import Section1 from './Section1'
import Sectiom2 from './Sectiom2'
import Section3 from './Section3'
import Section4 from './Section4'
import Section1plus from './Section1plus'
import Section2first from './Section2first'

const Homepage = () => {
  return (
    <div className='h-full  w-screen pt-20 sm:pt-14 '>
        <Section1/>
        <Section1plus/>
        <Section2first/>
        <Sectiom2/>
        
        <Section4/>
        <Section3/>

       


       

       

    </div>
  )
}

export default Homepage