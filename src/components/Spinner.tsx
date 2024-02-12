
import ClipLoader from "react-spinners/ClipLoader"
import React from "react"

const Spinner: React.FC = () => {
  return (
    <div className="w-full  h-screen p-40 m-auto">

      <div className=' center  flex mt-40 '>
        <ClipLoader
          color={"red"}
          // loading={loading}
          // cssOverride={override}

          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
          className='m-auto w-100'
        />
      </div>
    </div>
  )
}

export default Spinner

