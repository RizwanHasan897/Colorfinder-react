import React, {useState } from "react";

const ColorFinder = () => {
  interface Images {
    imgUrl: string;
  }

  const [image, setImage] = useState<Images | null>(null);
  const [eyeDropperActive, setEyedropperActive] = useState<boolean>(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imgUrl = URL.createObjectURL(e.target.files[0]);
      setImage({ imgUrl });
    }
  };

  const handleOpenEye = () => {
    if(eyeDropperActive){
      setEyedropperActive(false);
    }else{
      setEyedropperActive(true);
    }
  }

  return(
      <div className='wrapper'>
        <div className="left">
          <h1 className="header-text">Welcome to Color finder</h1>
          <div className="color-input">
            <p>Upload Image</p>
            <input className="upload" type="file" accept="images/*"  onChange={handleImage}/>
          </div>
          <div className="eyeopener">
            <p>Open Eyedroper and select the color we want</p>
            <button className="openEye-btn" onClick={handleOpenEye}>
              {eyeDropperActive ? (<p>Deactivate EyeDropper</p>): (<p>Activate Eyedropper</p>)}
            </button>
          </div>

          <div className="your-color">
            <p>The Color you selected is</p>
            <button className="selected-color">
                <p>Color</p>
            </button>
          </div>
        </div>
        <div className="right">
        {image ? (
            <img src={image.imgUrl} className="right-img"/> 
          ) : (
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="4em"
              width="4em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707v5.586l-2.73-2.73a1 1 0 0 0-1.52.127l-1.889 2.644-1.769-1.062a1 1 0 0 0-1.222.15L2 12.292V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zm-1.498 4a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"></path>
              <path d="M10.564 8.27 14 11.708V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.293l3.578-3.577 2.56 1.536 2.426-3.395z"></path>
            </svg>
          )}            
        </div>
      </div>
  )
}

export default ColorFinder