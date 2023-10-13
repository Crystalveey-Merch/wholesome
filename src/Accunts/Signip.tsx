import React from 'react'
import { NavLink } from 'react-router-dom'

const Signip = () => {
  return (
    <div>
        
        <div className='  pt-10 bg-white text-black ' 
        >

            <div className='text-center text-2xl'>
                <div className="pt-34  m-auto   ">
                    <div className=" h-full w-full flex rounded rounded-lg    ">
                        <div className='w-1/2 text-lg h-screen  sm:hidden 'style={{ backgroundImage: "url(/Images/world.jpeg)", backgroundPosition: "center", backgroundRepeat: "none", backdropFilter: "black" }}>
                            
                        </div>
                        <div className='w-1/2 sm:m-auto pt-36 sm:pt-10 sm:w-full sm:h-full pb-44 '>
<div className="bg-grey-lighter  flex flex-col text-xl">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div className=" px-6 py-8  text-black w-full">
                    <h1 className="mb-8 text-xl text-center text-red-500">Sign up</h1>
                    <input 
                        type="text"
                        className="block border border-grey-100 bg-gray-100 w-full p-3 rounded mb-4 text-xl"
                        name="fullname"
                        placeholder="Full Name" />

                    <input 
                        type="text"
                        className="block border border-grey-light bg-gray-100 w-full p-3 rounded mb-4"
                        name="email"
                        placeholder="Email" />

                    <input 
                        type="password"
                        className="block border border-grey-light bg-gray-100 w-full p-3 rounded mb-4"
                        name="password"
                        placeholder="Password" />
                    <input 
                        type="password"
                        className="block border border-grey-light bg-gray-100 w-full p-3 rounded mb-4"
                        name="confirm_password"
                        placeholder="Confirm Password" />

                    <button
                        type="submit"
                        className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
                    >Create Account</button>

                    <div className="text-center text-sm text-grey-dark mt-4">
                        By signing up, you agree to the 
                        <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Terms of Service
                        </a> and 
                        <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Privacy Policy
                        </a>
                    </div>
                </div>

                <div className="text-grey-dark mt-6">
                    Already have an account? 
                    <NavLink className="no-underline border-b border-blue text-blue" to="/login">
                        Log in
                    </NavLink>
                        
                </div>
            </div>
        </div>
                        </div>
                    </div>
                 
                </div>
            </div>

        </div>
    </div>
  )
}

export default Signip