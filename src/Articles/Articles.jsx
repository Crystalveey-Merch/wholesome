import React from 'react'
import { useParams } from "react-router";
import { articles } from "../data/artucles"
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const Articles = () => {
    const { articleName } = useParams();



const [article, setArticle] = useState(null);

useEffect(() => {
    // Find the selected article by comparing the name as a string
    const selectedArticle = articles.find((a) => a.topic === articleName);

    if (selectedArticle) {
        // Set the selected article in the state
        setArticle(selectedArticle);
    }
}, [articleName]);

if (!article) {
    return <div>article not found.</div>;
}



return (
    <div className="mt-20 sm:mt-18 flex flex-col m-auto justify-center">
      <div className="m-auto">
        <img src={article.src} alt={article.name} width={600} />
      </div>
      <div className="mx-40 my-20 sm:mx-5 sm:my-10">
      {/* <h1 className="text-red-500 text-xl">{article.date}</h1> */}
      <div className='badge btn-primary'>{article.category}</div>
      <h1 className="text-black text-4xl"> {article.topic}</h1>
<hr></hr>     
 <p className="text-green-500 text-xl ">{article.theme}</p>
      <p className="text-red-500 py-5">{article.author}</p>

      <p className="text-gray-500"><FontAwesomeIcon icon=""/> {article.date}</p>
      <p className="text-gray-500"><FontAwesomeIcon icon=""/> {article.time}</p>

      <p className="text-gray-500"><FontAwesomeIcon icon=""/> {article.content}</p>
      
      </div>
    </div>
)
}

export default Articles