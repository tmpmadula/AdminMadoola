import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Col } from "../FlexBox/FlexBox";
import Fade from "react-reveal/Fade";
import {
  LoaderWrapper,
  LoaderItem,
} from "../../containers/ProductForm/Products";
import { CURRENCY } from "../../settings/constants";
import NoResult from "../NoResult/NoResult";
import Placeholder from "../Placeholder/Placeholder";
import ProductCard from "../Cards/ProductCard/ProductCard";
import { Storage } from "aws-amplify";

export default function Carousel({ productId }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 4,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  console.log(productId);
  const getImg = async (coverMedia) => {
    const im = await Storage.get(coverMedia, { level: "public" });
    return im;
  };
  return (
    <>
      <h2> Responsive </h2>
      <Slider {...settings}>
        {productId ? (
          productId.Products && productId.Products.length !== 0 ? (
            productId.Products.map((item: any, index: number) => (
              <Col key={index} style={{ margin: "15px 0" }}>
                <Fade bottom duration={800} delay={index * 10}>
                  <ProductCard
                    id={item.id}
                    title={item.name}
                    weight={item.unit}
                    coverMedia={getImg(item.coverMedia)}
                    currency={CURRENCY}
                    userid={item.userid}
                    price={item.price}
                    data={item}
                  />
                </Fade>
              </Col>
            ))
          ) : (
            <NoResult />
          )
        ) : (
          <LoaderWrapper>
            <LoaderItem>
              <Placeholder />
            </LoaderItem>
            <LoaderItem>
              <Placeholder />
            </LoaderItem>
            <LoaderItem>
              <Placeholder />
            </LoaderItem>
            <LoaderItem>
              <Placeholder />
            </LoaderItem>
          </LoaderWrapper>
        )}
      </Slider>
    </>
  );
}
