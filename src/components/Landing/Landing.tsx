import React from "react";
import { LandingWrapper, VisitorWrapper, NoteHeader } from "./Landing.style";
import coverimg from "../../image/workspace.jpg";
import invoice from "../../image/Screenshot.png";
import { gql, useQuery } from "@apollo/client";
import { InLineLoader } from "../InlineLoader/InlineLoader";
import { Button, Heading } from "@chakra-ui/react";
import { CURRENCY, LOGIN } from "../../settings/constants";
import { NavLink } from "react-router-dom";
import {
  LoaderItem,
  LoaderWrapper,
} from "../../containers/ProductForm/Products";
import Placeholder from "../Placeholder/Placeholder";
import NoResult from "../NoResult/NoResult";
import { Col, Grid, Row } from "../FlexBox/FlexBox";
import { Helmet } from "react-helmet";
import ProductCard from "../Cards/ProductCard/ProductCard";
import Fade from "react-reveal/Fade";
import { Storage } from "aws-amplify";

const GET_PRODUCTS = gql`
  query GetProducts($lmt: Float!, $off: Float!) {
    Products(limit: $lmt, offset: $off) {
      id
      name
      type
      coverMedia
      url
      userid
      productTag {
        ProductTag
      }
      description
      categories
      price
    }
  }
`;

export default function Landing() {
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: {
      off: 0,
      lmt: 4,
    },
  });

  if (loading)
    return (
      <p>
        <InLineLoader />
      </p>
    );
  if (error) return <p>error</p>;
  const getImg = async (coverMedia) => {
    const im = await Storage.get(coverMedia, { level: "public" });

    return im;
  };

  return (
    <>
      <LandingWrapper>
        <div data-purpose="billboard" className="billboard--billboard--3-fQr">
          <div className="billboard--image-container--2JRqQ">
            <img src={coverimg} width="1040" height="200" alt="" />
          </div>
          <VisitorWrapper>
            <NoteHeader>Dream up</NoteHeader>
            <p
              className="udlite-text-md"
              data-purpose="safely-set-inner-html:billboard:subtitle"
            >
              Explore and Trade Expertise. Share and Monetize your Creativity.
              The Omni Makertplace.
            </p>
            <div className="udlite-search-form-autocomplete billboard--search-bar--3s2y1 udlite-form-group">
              <label className="udlite-sr-only udlite-form-label udlite-heading-sm">
                For more info email:{" "}
                <a href="mailto:support@madoola.com">
                  {" "}
                  <b>Madoola</b>
                </a>
              </label>
            </div>
            <NavLink to={LOGIN} exact={false}>
              <Button>Sign Up</Button>
            </NavLink>
          </VisitorWrapper>
        </div>
      </LandingWrapper>
      <Grid fluid={true}>
        <LandingWrapper>
          <div className="billboard--image-container--2JRqQ">
            <img src={invoice} width="1040" height="200" alt="" />
          </div>
        </LandingWrapper>
      </Grid>
      <Grid fluid={true}>
        <Helmet>
          <title>Home</title>
          <meta name="description" content="Madoola" />
        </Helmet>
        <Heading>Top Rated Products</Heading>
        <Heading size="xs">(Login to get more details.)</Heading>
        <Row>
          {data ? (
            data.Products && data.Products.length !== 0 ? (
              data.Products.map((item: any, index: number) => (
                <Col
                  md={4}
                  lg={3}
                  sm={6}
                  xs={12}
                  key={index}
                  style={{ margin: "15px 0" }}
                >
                  {" "}
                  <Fade bottom duration={800} delay={index * 10}>
                    <ProductCard
                      id={item.id}
                      title={item.name}
                      weight={item.unit}
                      coverMedia={getImg(item.coverMedia)}
                      currency={CURRENCY}
                      price={item.price}
                      userid={item.userid}
                      description={item.description}
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
        </Row>
      </Grid>
    </>
  );
}
