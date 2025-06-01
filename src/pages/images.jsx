import React from "react";
import newImage from "../cssonly/images/new.png"; 
import '../cssonly/images.css';

const ImageComponent = () => {
  return (
    <div className="image-wrapper">
      <img src={newImage} alt="Parenting" className="image-centered" />
    </div>
  );
};

export default ImageComponent;

// image will be displayed here 