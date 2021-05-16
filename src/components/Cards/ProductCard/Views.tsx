import { gql, useQuery } from "@apollo/client";
import { Divider, Tag } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ProfileImg } from "../../../containers/Layout/Topbar/Topbar.style";
import { Avatars } from "../../Avatars/Avatars";
import { Grid } from "../../FlexBox/FlexBox";
import { Details } from "./ProductCard.style";
import {
  HeadWrapper,
  ProductInfo,
  ProductTitle,
  TagsWrapper,
} from "./ProductView.style";
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../../../context/auth";
import { ChatIcon } from "@chakra-ui/icons";
import styled from "styled-components";

type Props = any;
const GET_PRODUCT = gql`
  query GetProduct($prdId: String!) {
    Product(id: $prdId) {
      id
      name
      type
      coverMedia
      url
      userid
      productTag
      description
      categories
      price
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

const Views: React.FC<Props> = () => {
  const location = useLocation();
  let path = location.pathname.substring(7);
  const { currentUser } = useContext(AuthContext);
  let auth = currentUser;

  const { data, loading } = useQuery(GET_PRODUCT, {
    variables: { prdId: path },
  });

  if (loading) return <p>.</p>;

  return (
    <Grid fluid={true}>
      {data && (
        <>
          <HeadWrapper>
            <ProductInfo>
              <ProfileImg>
                <Avatars userData={data.Product.userid} />
              </ProfileImg>

              {data.Product && <ProductTitle>Chat with user</ProductTitle>}
              {auth && (
                <>
                  {auth.userId !== data.Product.userid && (
                    <FollowAndMessage>
                      <Message to={`/messages/${data.Product.userid}`}>
                        <ChatIcon size="sm">Chat</ChatIcon>
                      </Message>
                    </FollowAndMessage>
                  )}
                </>
              )}
            </ProductInfo>
          </HeadWrapper>
          <Divider />
          <HeadWrapper>
            <ProductTitle>
              {data.Product.name}
              <Details> {data.Product.description}</Details>
            </ProductTitle>
          </HeadWrapper>
          <HeadWrapper>
            <TagsWrapper>
              <Tag size="sm" variant="solid" colorScheme="teal">
                {data.Product.productTag}
              </Tag>
            </TagsWrapper>
          </HeadWrapper>
        </>
      )}
    </Grid>
  );
};

export default Views;
