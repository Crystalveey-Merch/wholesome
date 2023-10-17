import React from 'react'

const Footer = () => {
  return (
    <div>
        <div className=" footer-center  w-screen   p-4 bg-black  ">
  <>
  <div className=" w-full flex gap-5 flex-col justify-center m-auto  ">
  <h1 className='text-center text-red-500 text-3xl'> Wholesome</h1>
          <ul className="menu menu-horizontal gap-40 sm:gap-5 px-1 m-auto text-white">

            <div className="dropdown dropdown-bottom">

              <label tabIndex={0} className=" text-white border-none capitalize  m-1">
                About us
              </label>

          
            </div>
            <div className="dropdown dropdown-bottom">

              <label tabIndex={0} className="text-white border-none capitalize  m-1">
                Interest
              </label>

            </div>
            <div className="dropdown dropdown-bottom">

              <label tabIndex={0} className=" text-white border-none capitalize  m-1 ">
                Events
              </label>

            </div>

              <label tabIndex={0} className=" text-white border-none capitalize  m-1 ">
                Podcast
              </label>

              


            
          </ul>
          <p className='text-white'>Copyright © 2023 - All right reserved by Wholesome</p>
        </div>
  
  </>
</div>
    </div>
  )
}

export default Footer