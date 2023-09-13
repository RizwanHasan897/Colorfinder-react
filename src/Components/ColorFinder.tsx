import { useState,useEffect,useRef } from "react";

const ColorFinder = () => {
  
  interface Images {
    imgUrl: string;
  }
  
  const [image, setImage] = useState<Images | null>(null);

  const [color, setColor] = useState<string>("#808080");
  const [eyeDropperActive, setEyeDropperActive] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imgUrl = URL.createObjectURL(e.target.files[0]);
      setImage({ imgUrl });
      setEyeDropperActive(false);
    }
  };
  
  const extractColors = (imageData: Uint8ClampedArray) => {
    const colorCounts: { [key: string]: number } = {};
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      const hexColor = rgbToHex(r, g, b);
      
      if (colorCounts[hexColor]) {
        colorCounts[hexColor]++;
      } else {
        colorCounts[hexColor] = 1;
      }
    }
    
    const colors = Object.keys(colorCounts).map((color) => ({
      color,
      count: colorCounts[color],
    }));
    
    colors.sort((a, b) => b.count - a.count);
    
    return colors;
  };
  
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };
  
  const handleOpenEye = () => {
    setEyeDropperActive(!eyeDropperActive);
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (eyeDropperActive && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const selectedColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setColor(selectedColor);
      
      setEyeDropperActive(false);
    }
  };
  
  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      const img = new Image();
      img.src = image.imgUrl;
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = ctx?.getImageData(0, 0, img.width, img.height).data;
        
        const extractedColors = extractColors(imageData);
        
        if (extractedColors.length > 0) {
          setColor(extractedColors[0].color);
        }
      };
    }
  }, [image]);



  const handleCopy = async () => {
    await navigator.clipboard.writeText(color);
  }
  
  return (
    <div className="wrapper">
      <div className="left">
        <h1 className="header-text">Welcome to Color finder</h1>
        <div className="color-input">
          <p>Upload Image</p>
          <input className="upload" type="file" accept="images/*" onChange={handleImage} />
        </div>
        <div className="eyeopener">
          <p>Open Eyedropper and select the color we want</p>
          <button className="openEye-btn" onClick={handleOpenEye}>
            {eyeDropperActive ? "Deactivate EyeDropper" : "Activate EyeDropper"}
          </button>
        </div>

        <div className="your-color" onClick={handleCopy}>
          <p>The Color you selected is</p>
          <button className="selected-color" style={{ background: color }}>
            <p>{color}</p>
          </button>
        </div>
      </div>
      <div className="right">
        {image ? (
          <>
            <canvas
              ref={canvasRef}
              className="cnv"
              width={800}
              height={800}
              style={{ background: 'white' }}
              onClick={handleCanvasClick}
            ></canvas>
          </>
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
  );
};

export default ColorFinder;