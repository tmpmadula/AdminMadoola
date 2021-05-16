import React, { useContext } from "react";
import { styled } from "baseui";
import { Button } from "baseui/button";
import {
  Grid,
  Row as Rows,
  Col as Column,
} from "../../components/FlexBox/FlexBox";

import { gql, useQuery } from "@apollo/client";
import { Header, Heading } from "../../components/WrapperStyle";
import Fade from "react-reveal/Fade";
import ProductCard from "../../components/ProductCard/ProductCard";
import NoResult from "../../components/NoResult/NoResult";
import { CURRENCY } from "../../settings/constants";
import Placeholder from "../../components/Placeholder/Placeholder";

import { Storage } from "aws-amplify";
import { AuthContext } from "../../context/auth";
import { ProductForm } from "./ProductForm";
import { useDisclosure } from "@chakra-ui/react";

export const ProductsRow = styled("div", ({ $theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  marginTop: "25px",
  backgroundColor: $theme.colors.backgroundF7,
  position: "relative",
  zIndex: "1",

  "@media only screen and (max-width: 767px)": {
    marginLeft: "-7.5px",
    marginRight: "-7.5px",
    marginTop: "15px",
  },
}));

export const Col = styled(Column, () => ({
  "@media only screen and (max-width: 767px)": {
    marginBottom: "20px",

    ":last-child": {
      marginBottom: 0,
    },
  },
}));

const Row = styled(Rows, () => ({
  "@media only screen and (min-width: 768px) and (max-width: 991px)": {
    alignItems: "center",
  },
}));

export const ProductCardWrapper = styled("div", () => ({
  height: "100%",
}));

export const LoaderWrapper = styled("div", () => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  flexWrap: "wrap",
}));

export const LoaderItem = styled("div", () => ({
  width: "25%",
  padding: "0 15px",
  marginBottom: "30px",
}));

const GET_PRODUCTS = gql`
  query Products($userid: String!) {
    getProductBy(userid: $userid) {
      id
      name
      type
      coverMedia
      description
      productTag {
        productTag
      }
      url
      categories
      # views
      # sales
      #price
    }
  }
`;

type User = {
  userId: string;
};

export default function Products() {
  const { currentUser } = useContext(AuthContext);

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { userid: currentUser?.userId },
  });

  const { isOpen, onClose, onOpen } = useDisclosure();
  if (loading) return <p>Loading...</p>;
  if (error) {
    return <div>Loading...</div>;
  }

  const getImg = async (coverMedia) => {
    return Storage.get(coverMedia, { level: "public" });
  };

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header style={{ marginBottom: 15 }}>
            <Col md={2} xs={12}>
              <Heading>Products</Heading>
            </Col>

            <Col md={10} xs={12}>
              <Row>
                <Col md={3} xs={12}>
                  <Button onClick={onOpen}>Add Products</Button>
                </Col>
              </Row>
            </Col>
          </Header>

          <Row>
            {data ? (
              data.getProductBy && data.getProductBy.length !== 0 ? (
                data.getProductBy.map((item: any, index: number) => (
                  <Col
                    md={4}
                    lg={3}
                    sm={6}
                    xs={12}
                    key={index}
                    style={{ margin: "15px 0" }}
                  >
                    <Fade bottom duration={800} delay={index * 10}>
                      <ProductCard
                        id={item.id}
                        title={item.name}
                        weight={item.unit}
                        coverMedia={getImg(item.coverMedia)}
                        currency={CURRENCY}
                        price={item.price}
                        userid={item.userid}
                        data={item}
                        //refetch={refetch}
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
          </Row>
          {data && data.getProductBy && data.getProductBy.hasMore && (
            <Row>
              <Col
                md={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                //onClick={loadMore}
                >
                  Load More
                </Button>
              </Col>
            </Row>
          )}
        </Col>
        <ProductForm isOpen={isOpen} onClose={onClose} />
      </Row>
    </Grid>
  );
}
