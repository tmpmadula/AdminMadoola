import React from "react";
import SimpleImageSlider from "react-simple-image-slider";

const images = [
  {
    url:
      "https://burst.shopifycdn.com/photos/a-candlelit-flatlay-welcoming-2021.jpg",
  },
  { url: "images/2.jpg" },
  { url: "images/3.jpg" },
  { url: "images/4.jpg" },
  { url: "images/5.jpg" },
  { url: "images/6.jpg" },
  { url: "images/7.jpg" },
];

export const GalleryCarousel = () => {
  return (
    <div>
      <SimpleImageSlider
        width={296}
        height={404}
        images={images}
        showNavs
        showBullets
      />
    </div>
  );
};
