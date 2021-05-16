import React from "react";
import {
  CreaterCardWrapper,
  CreaterImageWrapper,
  CreaterInfo,
  SaleTag,
  DiscountPercent,
  Image,
  CreaterTitle,
  CreaterWeight,
  CreaterMeta,
  OrderID,
  CreaterPriceWrapper,
  CreaterPrice,
  DiscountedPrice,
} from "./CreaterCard.style";
//import { useDrawerDispatch } from "../../context/DrawerContext";

type CreaterCardProps = {
  title: string;
  image: any;
  weight?: string;
  currency?: string;
  description?: string;
  price: number;
  salePrice?: number;
  orderId?: number;
  discountInPercent?: number;
  data: any;
};

const CreaterCard: React.FC<CreaterCardProps> = ({
  title,
  image,
  weight,
  price,
  salePrice,
  discountInPercent,
  currency,
  data,
  orderId,
  ...props
}) => {
  return (
    <CreaterCardWrapper {...props} className="Creater-card">
      <CreaterImageWrapper>
        <Image url={image} className="Creater-image" />
        {discountInPercent && discountInPercent !== 0 ? (
          <>
            <SaleTag>Sale</SaleTag>
            <DiscountPercent>{discountInPercent}% Off</DiscountPercent>
          </>
        ) : null}
      </CreaterImageWrapper>
      <CreaterInfo>
        <CreaterTitle>{title}</CreaterTitle>
        <CreaterWeight>{weight}</CreaterWeight>
        <CreaterMeta>
          <CreaterPriceWrapper>
            <CreaterPrice>
              {currency}
              {salePrice && salePrice !== 0 ? salePrice : price}
            </CreaterPrice>

            {discountInPercent && discountInPercent !== 0 ? (
              <DiscountedPrice>
                {currency}
                {price}
              </DiscountedPrice>
            ) : null}
          </CreaterPriceWrapper>

          <OrderID>{orderId}</OrderID>
        </CreaterMeta>
      </CreaterInfo>
    </CreaterCardWrapper>
  );
};

export default CreaterCard;
