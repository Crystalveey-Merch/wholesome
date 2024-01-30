import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper';
import { useParams } from "react-router";
import { articles } from "../data/artucles";
import { NavLink } from "react-router-dom";



const Sectiom2 = () => {
  const { articleName } = useParams();

  const ArticleName = () => {
    return articles.filter((article) => article.topic === articleName);
  };

  const breakpoints = {
    300: {
      slidesPerView: 1,
      spaceBetween: 5,

    },
    639: {
      slidesPerView: 4,
      spaceBetween: 10,
      centeredSlides: true,

    },
    768: {
      slidesPerView: 4,
      spaceBetween: 10,
      centeredSlides: true,

    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 10,
      centeredSlides: true,

    },

  };
  return (


    <div className='  py-20  sm:py-5 bg-sky-100'>
      <h1 className='text-black text-2xl text-red-500  my-5 text-center Aceh text-md'>MUST READS</h1>
      <div className='  m-auto justify-center flex auto'
      >
        <Swiper
          slidesPerView={'auto'}
          centeredSlides={true}
          watchSlidesProgress
          navigation={true}
          grabCursor={true}
          spaceBetween={30}
          loop={true}
          breakpoints={breakpoints}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper w-full  mx-20 sm:mx-0 sm:px-10 lg:px-10"
        >
          {articles.length > 0 ? (
            articles.map((article) => {
              return (
                <SwiperSlide style={{ height: "35rem" }} key={article.id}>
                  <NavLink to={`/article/${article.topic}`}>
                    <div className="relative w-72  bg-base-100 shadow-xl  image-full">
                      <figure><img src={article.src} alt="image" /></figure>
                      <div className="  flex flex-col  gap-2 bottom-0 bg-gray-100 border p-5 top-40">
                        <button className="badge btn-primary">{article.category}</button>

                        <h2 className="Aceh text-black py-2">{article.topic}</h2>
                        <p className='text-red-500'>{article.author}</p>

                        <p className='text-gray-700'>{article.content}</p>
                        <div className="card-actions justify-end">
                        </div>
                      </div>

                    </div>
                  </NavLink>

                </SwiperSlide>
              );
            })
          ) : (
            <div className="text-center text-2xl font-bold text-gray-500 mt-4 h-48">
              No events found matching your search.
            </div>
          )}

        </Swiper>

      </div>
    </div>

  )

}

export default Sectiom2