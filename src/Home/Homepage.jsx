import React from 'react'
import Section1 from './Section1'
import Sectiom2 from './Sectiom2'
import Section3 from './Section3'
import Section4 from './Section4'
import Section1plus from './Section1plus'
import Section2first from './Section2first'
import Section2new from './Section2new'
import { Helmet } from 'react-helmet-async'
const Homepage = () => {
  return (
    <><Helmet>
    <title>Wholesome</title>
    <meta name='description' content='Wholesome helps foster connections with like-minds that transcends borders and also share your experiences, knowledge and creativity'/>
    <link rel=" canonical"  href='https://wholesome.crystalveey.com/'/>
    <meta
          name="keywords"
          content="Wholesome, Crystalveey,
         , Blog article, Blog, writing, Business, marketing, Technology, Fashion, Nutrition, Food, Art, Travel and Adventure, Game and sports, Book club, Environmental and Sustainability"
        />
      <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Wholesome" />
        <meta property="og:url" content="http://wholesome.crystaleey.com"/>
        {/* <meta property="og:image" content={posts} /> */}
        <meta name="og:description" content='Wholesome helps foster connections with like-minds that transcends borders and also share your experiences, knowledge and creativity' />
        <meta name="og:site_name" content="Wholesome" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="http://wholesome.crystaleey.com" />
        <meta name="twitter:title" content="Article List" />
        <meta name="twitter:description" content='Wholesome helps foster connections with like-minds that transcends borders and also share your experiences, knowledge and creativity'/>
        {/* <meta name="twitter:image" content="../../public/20231116_210104-removebg-preview.png" /> */}

  <script
  type="application/ld+jason"
    {...JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Article List",
      url:"http://wholesome.crystaleey.com",

      // "image": {posts.imgUrl},
     
      "publisher": {
        "@type": "Organization",
        "name": "Wholesome",
        "logo": {
          "@type": "ImageObject",
          "url": "",
        },
      },
      // "datePublished": `${posts.timestamp?.toDate()?.toDateString()}`,
    })}
  />
    </Helmet>
    <div className='h-full  w-screen pt-20 sm:pt-14  bg-stone-100'>
        <Section1 />
        <Section1plus />

        <Section2new />
        <Section4 />

        <Section2first />


        <Section3 />








      </div></>
   
  )
}

export default Homepage