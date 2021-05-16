import React, { useContext, useEffect, useState } from "react";
import { withStyle } from "baseui";
import { AuthContext } from "../../context/auth";
import { Auth, Storage } from "aws-amplify";
import { gql, useMutation, useQuery } from "@apollo/client";
import Fade from "react-reveal/Fade";
import { CURRENCY } from "../../settings/constants";
import {
  Col,
  Grid,
  Row as Rows,
  //Col as Column,
} from "../../components/FlexBox/FlexBox";
import { InLineLoader } from "../../components/InlineLoader/InlineLoader";
import ProductCard from "../../components/Cards/ProductCard/ProductCard";
import NoResult from "../../components/NoResult/NoResult";
import { LoaderItem, LoaderWrapper } from "../ProductForm/Products";
import Placeholder from "../../components/Placeholder/Placeholder";

import { Helmet } from "react-helmet";

const Row = withStyle(Rows, () => ({
  "@media only screen and (min-width: 768px)": {
    alignItems: "center",
  },
}));

const GET_USER = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      id
      firstname
    }
  }
`;

const CREATE_USER = gql`
  mutation addUser($user: UserInput!) {
    addUser(data: $user) {
      id
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts($lmt: Float!, $off: Float!) {
    Products(limit: $lmt, offset: $off) {
      id
      name
      type
      coverMedia
      url
      userid

      description
      categories
      price
    }
  }
`;
type User = {
  userId: string;
};

export default function Home() {
  const { currentUser } = useContext(AuthContext);

  const [tUser, setCurrentUser] = useState<User | undefined>();
  const { data } = useQuery(GET_PRODUCTS, {
    variables: {
      off: 1,
      lmt: 90,
    },
  });

  useEffect(() => {
    onLoad();
  }, []);
  async function onLoad() {
    try {
      const userInfo = await Auth.currentUserInfo();

      setCurrentUser(userInfo.username);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
  }

  const id = currentUser?.userId !== undefined ? currentUser?.userId : tUser;

  const {
    //data: userInfo,
    loading,
    error,
  } = useQuery(GET_USER, {
    variables: { id: id },
  });

  const getImg = async (coverMedia) => {
    return Storage.get(coverMedia, { level: "public" });
  };

  const [addUser, { error: mutationError }] = useMutation(CREATE_USER);
  const createUser = async () => {
    const newUser = {
      id: currentUser?.userId,
      firstname: "",
      lastname: "",
      email: currentUser?.email,
      avatar: "",
      followers: {
        follow_id: 0,
      },
      following: { following_id: 0 },
      addresses: {
        id: 0,
        street: "",
        city: "",
        code: "",
        state: "",
        country: "",
      },
    };
    await addUser({
      variables: { user: newUser },
    });
  };
  if (loading) return <InLineLoader />;
  if (error) {
    createUser();
  }

  if (mutationError) {
    console.log("user failed to create");
  }

  return (
    <Grid fluid={true}>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Madoola" />
      </Helmet>

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
  );
}
