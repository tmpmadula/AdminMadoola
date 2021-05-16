import React, { useEffect, useState } from "react";
import {
  ProductCardWrapper,
  ProductImageWrapper,
  ProductInfo,
  Image,
  ProductTitle,
  ProductWeight,
  ProductMeta,
  OrderID,
  ProductPriceWrapper,
  ProductPrice,
  DiscountedPrice,
} from "./ProductCard.style";
import { Button } from "baseui/button";
import { gql, useMutation } from "@apollo/client";

import { useToast } from "@chakra-ui/react";

type ProductCardProps = {
  id: string;
  title: string;
  coverMedia: any;
  weight?: string;
  currency?: string;
  description?: string;
  price: number;
  userid: string;
  orderId?: number;

  data: any;
};

const DELETE_PRODUCT = gql`
  mutation($productId: String!) {
    removeProduct(id: $productId)
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  coverMedia,
  weight,
  price,
  userid,
  currency,
  data,
  orderId,

  ...props
}) => {
  const [img, setImg] = useState({ hits: [] });

  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const result = await coverMedia;

      setImg(result);
    };

    fetchData();
  }, [coverMedia]);

  const [RemoveProduct] = useMutation(DELETE_PRODUCT, {
    variables: { productId: id },
  });

  const handleDelete = async () => {
    RemoveProduct({
      variables: { productId: id },
    });
    toast({
      title: "Product Deleted.",
      position: "top",
      isClosable: true,
    });
  };
  return (
    <ProductCardWrapper
      {...props}
      className="product-card"
      // onClick={openDrawer}
    >
      <ProductImageWrapper>
        <Image url={img} className="product-image" />
      </ProductImageWrapper>
      <ProductInfo>
        <ProductTitle>{title}</ProductTitle>
        <ProductWeight>{weight}</ProductWeight>
        <ProductMeta>
          <ProductPriceWrapper>
            <ProductPrice>
              {currency}
              {price}
            </ProductPrice>

            <DiscountedPrice>
              {currency}
              {price}
            </DiscountedPrice>
          </ProductPriceWrapper>

          <OrderID>{orderId}</OrderID>
        </ProductMeta>
      </ProductInfo>

      <Button onClick={handleDelete}>Delete</Button>
    </ProductCardWrapper>
  );
};

export default ProductCard;
