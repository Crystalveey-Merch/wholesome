import React from 'react'
import { NavLink } from 'react-router-dom'
const Login = () => {
  return (
    <div>
        
        <div className='  pt-10 bg-white text-black ' 
        >

            <div className='text-center text-2xl'>
                <div className="pt-34  m-auto   ">
                    <div className=" h-full w-full flex rounded rounded-lg    ">
                        <div className='w-1/2 text-lg h-screen  sm:hidden 'style={{ backgroundImage: "url(/homepage/slider2.jpeg)", backgroundPosition: "center", backgroundRepeat: "none", backdropFilter: "black" }}>
                            <h1 className='w-98 text-left ml-40 text-3xl'>Wholesome </h1>
                            <ul className='text-left ml-40 my-10'>
                               create an Accoubt!!
                            </ul>
                        </div>
                        <div className='w-1/2 sm:m-auto pt-36 '>
<div className="bg-grey-lighter  flex flex-col text-xl">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div className=" px-6 py-8  text-black w-full">
                    <h1 className="mb-8 text-xl text-center text-red-500">Login</h1>
                 

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
                    

                    <button
                        type="submit"
                        className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
                    >Login</button>

                 
                </div>

                <div className="text-grey-dark mt-6">
                    Dont have an account? 
                    <NavLink className="no-underline border-b border-blue text-blue" to="/signup">
                       Sign up
                    </NavLink>.
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

export default Login