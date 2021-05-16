import { Divider, Tag, useDisclosure } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { ChatIcon } from "@chakra-ui/icons";
import {
  ProductCardWrapper,
  ProductImageWrapper,
  HeadWrapper,
  ProductInfo,
  Image,
  ProductTitle,
  TopCardWrapper,
  TagsWrapper,
  Details,
} from "./ProductCard.style";

import { generatePath, Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../../context/auth";
import { ProfileImg } from "../../../containers/Layout/Topbar/Topbar.style";
import { Avatars } from "../../Avatars/Avatars";
import { gql, useQuery } from "@apollo/client";

import { LOGIN } from "./../../../settings/constants";
import { ProductView } from "./ProductView";

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      firstname
      lastname
    }
  }
`;

const FollowAndMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
`;

const Message = styled(Link)`
  text-decoration: none;
  font-size: 14px;
`;

type ProductCardProps = {
  title: string;
  coverMedia: any;
  weight?: string;
  currency?: string;
  description?: string;
  price: number;
  salePrice?: number;
  orderId?: number;
  discountInPercent?: number;
  userid?: string;
  id: any;
  data: any;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  coverMedia,
  weight,
  price,
  salePrice,
  description,
  discountInPercent,
  currency,
  userid,
  data,
  orderId,
  id,
  ...props
}) => {
  const [img, setImg] = useState({ hits: [] });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  let auth = currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const result = await coverMedia;

      setImg(result);
    };

    fetchData();
  }, [coverMedia]);

  const { data: userInfo, loading } = useQuery(GET_USER, {
    variables: { id: userid },
  });
  if (loading) return <p>.</p>;

  const ProductData = {
    id: id,
    title: title,
    coverMedia: coverMedia,
    price: price,
    currency: currency,
    userid: userid,
    productTag: data.productTag,
    description: data.description,
    categories: data.categories,
    firstname: userInfo,
    lastname: userInfo,
  };

  return (
    <>
      {isAuthenticated ? (
        <ProductCardWrapper
          {...props}
          className="product-card"
          onClick={onOpen}
        >
          <HeadWrapper>
            <TopCardWrapper>
              <ProductImageWrapper>
                <Image url={img} className="product-image" />
              </ProductImageWrapper>

              <ProductTitle>
                {" "}
                {title}
                <Details>{description}</Details>
              </ProductTitle>
            </TopCardWrapper>

            <Divider />
            <ProductInfo>
              <ProfileImg>
                <Avatars userData={userid} />
              </ProfileImg>
              {userInfo && (
                <ProductTitle>{`${userInfo.getUser.firstname} ${userInfo.getUser.lastname}`}</ProductTitle>
              )}
              {auth && (
                <>
                  {auth.userId !== userid && (
                    <FollowAndMessage>
                      <Message to={`/messages/${userid}`}>
                        {" "}
                        <ChatIcon size="sm">Chat</ChatIcon>
                      </Message>
                    </FollowAndMessage>
                  )}
                </>
              )}
            </ProductInfo>
            <TagsWrapper>
              <Tag size="sm" variant="solid" colorScheme="teal">
                {ProductData.productTag}
              </Tag>
            </TagsWrapper>
          </HeadWrapper>
          {ProductData && (
            <ProductView
              isOpen={isOpen}
              onClose={onClose}
              ProductData={ProductData}
            />
          )}
        </ProductCardWrapper>
      ) : (
        <ProductCardWrapper
          {...props}
          className="product-card"
          to={generatePath(LOGIN)}
        >
          <HeadWrapper>
            <TopCardWrapper>
              <ProductImageWrapper>
                <Image url={img} className="product-image" />
              </ProductImageWrapper>

              <ProductTitle>
                {" "}
                {title}
                <Details>{description}</Details>
              </ProductTitle>
            </TopCardWrapper>

            <Divider />
            <ProductInfo>
              <ProfileImg>
                <Avatars userData={userid} />
              </ProfileImg>
              {userInfo && (
                <ProductTitle>{`${userInfo.getUser.firstname} ${userInfo.getUser.lastname}'s`}</ProductTitle>
              )}
              {auth && (
                <>
                  {auth.userId !== userid && (
                    <FollowAndMessage>
                      <Message to={`/messages/${userid}`}>
                        {" "}
                        <ChatIcon size="sm">Chat</ChatIcon>
                      </Message>
                    </FollowAndMessage>
                  )}
                </>
              )}
            </ProductInfo>
            <TagsWrapper>
              <Tag size="sm" variant="solid" colorScheme="teal">
                {ProductData.productTag}
              </Tag>
            </TagsWrapper>
          </HeadWrapper>
        </ProductCardWrapper>
      )}
    </>
  );
};

export default ProductCard;
