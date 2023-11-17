import React from 'react'
import { articles } from '../data/artucles';


const tags = () => {
  return (
    <div>
   
    <div className="tags">
      {tags?.map((tag: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal, index: Key) => (
        <div className="badge badge-primary m-1 p-2 hvr-bounce-in" key={index}>
          <Link
            to={`/tag/${tag}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            {tag}
          </Link>
        </div>
      ))}
    </div>
  </div>
  )
}

export default tags