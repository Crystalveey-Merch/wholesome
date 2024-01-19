import React from 'react'
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation ,Pagination} from 'swiper';

import { useEffect, useState } from "react";
import {
    addDoc,
    collection,
    DocumentSnapshot,
    endAt,
    endBefore,
    getDocs,
    setDoc,
    doc,
    getDoc,
    updateDoc,
    limit,
    limitToLast,
    orderBy,
    query,
    startAfter,
    deleteField,
    where,
    increment,
  } from "firebase/firestore";
  import { auth, db } from "../firebase/auth.js";
  import Spinner from "../components/Spinner.tsx";
import { onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router-dom";

const Section3 = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [randomUser, setRandomUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
          setLoading(true);
    
          try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const userData = [];
            querySnapshot.forEach((doc) => {
              // Extract the data from each document
              const post = doc.data();
              post.id = doc.id;
    
              userData.push(post);
            });
    
            setUsers(userData);

    const randomIndex = Math.floor(Math.random() * userData.length);


    if (userData[randomIndex]) {
        setRandomUser([userData[randomIndex]]);
      }
    // setUsers(randomUsers);
    setLoading(false);
          } catch (error) {
            console.error("Error fetching posts:", error);
            setRandomUser([]);
          }
        };
    
        fetchUser();
      }, []);
    
      if (loading) {
        return <Spinner />;
      }
      

    const breakpoints = {
        300: {
          slidesPerView: 1,
          spaceBetween: 20,
    
        },
        639: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 40,
          loop: true,
          centeredSlides: false,
    
        },
    
      };
    return (
        <div className='bg-white'>
                    <h1 className=' text-2xl  py-5 text-center text-red-500 Aceh text-md'>COMMUNITY SPOTLIGHT</h1>
<hr></hr>
           <Swiper
            slidesPerView={'auto'}
            centeredSlides={true}
       watchSlidesProgress
       grabCursor={true}
      spaceBetween={30}
        loop= {true}
        breakpoints={breakpoints}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[ Autoplay, Navigation]}
        className="mySwiper w-full  px-4 sm:px-10 lg:px-10"
        >
        {
            
            users.map((user) => (
<SwiperSlide key={user.id}>
<div className=' flex w-auto sm:flex-col gap-4  p-10 m-auto justify-center' >
                <div className="avatar sm:m-auto">
                    <div className="w-40 sm:w-36 rounded-full">
                        <img src={user.photoURL}/>
                    </div>
                </div>
                <div className='h-full flex flex-col  gap-2'>
                    <h1 className='text-black text-xl sm:text-center'>{user.name}</h1>
                    <p className='text-black w-64 text-red-500 sm:text-center'>Occupation : {user.occupation}</p>

                    <p className='text-black w-64 text-red-500 sm:text-center'> Bio:  {user.shortBio}</p>
                    <NavLink to={`/profile/${user.id}`}>
              <button className="btn w-40 flex hover:bg-black m-auto my-2  bg-gradient-to-r from-orange-400 to-rose-400 text-white ">
                View Profile
              </button>
            </NavLink>

                </div>
            </div>
</SwiperSlide>
))}



        </Swiper>
      
        </div>
    )
}

export default Section3