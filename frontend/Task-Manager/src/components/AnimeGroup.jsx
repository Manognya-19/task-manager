import React from "react";

const AnimeGroup = ({ images = [] }) => {
  return (
    <div className="flex -space-x-2">
      {images.slice(0, 3).map((img, index) => (
        <img
          key={index}
          src={img}
          className="w-8 h-8 rounded-full border-2 border-white"
          alt="avatar"
        />
      ))}
    </div>
  );
};

export default AnimeGroup;
