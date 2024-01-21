import React from 'react'
import { NavLink } from 'react-router-dom'

const Account = () => {
    return (
        <div className=' w-screen pt-10 text-white bg-white text-black ' 
        >

            <div className='text-center text-2xl'>
                <div className="pt-34  m-auto bg-gradient-to-r from-teal-200 to-lime-200  pb-20 ">
                    <div className=" h-full w-full flex sm:flex-col rounded rounded-lg  pt-36  ">
                        <div className='w-1/2 sm:w-full text-lg  '>
                            <h1 className='w-98 text-left ml-40 sm:ml-0 text-3xl sm:p-5 sm:text-center text-black'>Wholesquare helps foster connections with like-minds
                                that transcends borders and also share your
                                experiences, knowledge and creativity</h1>
                            <ul className='text-left ml-40 my-10 sm:ml-0 sm:p-5 sm:text-center text-sky-600'>
                                <li>Becoming a member of a group or community gives you a
                place to ask for and give assistance.</li>
                <li>Through shared content, users can explore and find new interests or hobbies.</li>
                                
                            </ul>
                        </div>
                        <div className='w-1/2 sm:m-auto '>
                            <h2 className="text-2xl text-center Aceh   text-red-500 sm:text-xl mx-aluto">
                                Wholesquare
                            </h2>
                            <p className='text-green-500'>Get on board Today</p>

                            <div className="flex flex-col m-auto justify-center gap-5 mx-40 sm:mx-4 my-10">
                              <NavLink to="/signup">  <div className="btn bg-green-500 Aceh rounded-full text-bold border-none w-48 m-auto text-white" >
                                    <i className="fa-brands fa-google text-2xl"></i> Sign up
                                </div></NavLink>
                                <NavLink to="/login" > <div className="btn bg-transparent   Aceh border-red-500 border-sky-500 rounded-full m-auto   hover:bg-sky-500/50 text-sky-500  hover:text-white  w-48" >
                                    <i className="fa-brands fa-facebook text-2xl"></i> Login
                                </div> </NavLink>

                            </div>
                        </div>
                    </div>
                    <div className='w-2/5 m-auto sm:w-full sm:px-5'>
                    <div className="flex -space-x-2 overflow-hidden justify-center">
  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt=""/>
  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
</div>
                        <p className='text-md py-4 text-red-500'>Join Awesome communities </p>
                        <hr></hr>
                        <p className='text-sm py-4 text-gray-400'>Wholesquare helps foster connections with like-minds
                            that transcends borders and also share your
                            experiences, knowledge and creativity</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Account