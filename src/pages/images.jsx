import React from "react";
import newImage from "../cssonly/images/new.jpg"; 
import Cycle from "../cssonly/images/cycle.jpg"; 

const ImageComponent = () => {
  return (
    <div className="image-container2" >
      <img src={newImage} alt="New" className="image2" />
      
    </div>
  );
};

export default ImageComponent;
