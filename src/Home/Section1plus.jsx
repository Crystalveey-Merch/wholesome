import { faLightbulb, faMap, faMapLocation, faPen, faPeopleGroup, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Section1plus = () => {
  return (
    <div className='py-24 bg-gray-400/25 '>
      <h1 className='text-2xl   text-center text-red-500 Aceh py-5 uppercase sm:text-md'>What’s in store for members?</h1>
      <div className='flex flex-wrap mx-20 sm:mx-5 '>
        <div className=' flex w-auto sm:flex-col   gap-4  p-4 m-auto justify-center' >
          <div className="avatar ">
            <div className="border border-4 border-red-500 border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
              <FontAwesomeIcon icon={faMapLocation} className=' text-red-600' />
            </div>
          </div>
          <div className='h-full flex flex-col shadow-2xl  shadow gap-4 border text-center border-2xl bg- rounded py-10 rounded-lg bg-red-500  p-2'>
            <p className=' w-64 text-white Aceh'>Create a map of your travels</p>
          </div>
        </div>
        <div className=' flex w-auto sm:flex-col  gap-4  p-4 m-auto justify-center' >
          <div className="avatar ">
            <div className="border border-4 border-green-600 border-double  h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
              <FontAwesomeIcon icon={faPeopleGroup} className=' text-green-600' />
            </div>
          </div>
          <div className='h-full flex flex-col shadow shadow-2xl gap-4 border text-center  bg- rounded py-10 rounded-lg bg-green-600  p-2'>
            <p className=' w-64 text-white Aceh'>Get advice from the community</p>
          </div>
        </div>
        <div className=' flex w-auto sm:flex-col  gap-4  p-4 m-auto justify-center' >
          <div className="avatar ">
            <div className="border border-4 border-amber-600  border-double   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
              <FontAwesomeIcon icon={faPen} className=' text-amber-600 ' />
            </div>
          </div>
          <div className='h-full flex flex-col shadow shadow-2xl gap-4 text-center border border-2xl bg- rounded py-10 rounded-lg bg-amber-600  p-2'>
            <p className=' w-64 text-white Aceh'>Blog about your adventures</p>
          </div>
        </div>
        <div className=' flex w-auto sm:flex-col  gap-4  p-4 m-auto justify-center' >
          <div className="avatar ">
            <div className="border border-4 border-double border-violet-600   h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
              <FontAwesomeIcon icon={faUserFriends} className=' text-violet-600 ' />
            </div>
          </div>
          <div className='h-full flex flex-col shadow shadow-2xl gap-4 border text-center border-2xl bg- rounded py-10 rounded-lg bg-violet-600  p-2'>
            <p className=' w-64 text-white Aceh'>Foster connections with like-minds that transcends borders</p>
          </div>
        </div>
        <div className=' flex w-auto sm:flex-col  gap-4  p-4 m-auto justify-center' >
          <div className="avatar ">
            <div className="border border-4 border-sky-600 border-double  h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
              <FontAwesomeIcon icon={faLightbulb} className=' text-sky-600 ' />
            </div>
          </div>
          <div className='h-full flex flex-col shadow shadow-2xl text-center gap-4 border border-2xl bg- rounded py-10 rounded-lg bg-sky-600  p-2'>
            <p className=' w-64 text-white Aceh'>Share your experiences, knowledge and creativity</p>
          </div>
        </div>
        <div className=' flex w-auto sm:flex-col  gap-4  p-4 m-auto justify-center' >
          <div className="avatar ">
            <div className="border border-4 border-teal-600 border-double  h-fit p-4 rounded-full absolute -top-4 bg-white -left-3">
              <FontAwesomeIcon icon={faPen} className=' text-teal-600 ' />
            </div>
          </div>
          <div className='h-full flex flex-col shadow  shadow-2xl text-center gap-4 border border-2xl bg- rounded py-10 rounded-lg bg-teal-600  p-2'>
            <p className=' w-64 text-white Aceh'>Share your experiences, knowledge and creativity</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section1plus