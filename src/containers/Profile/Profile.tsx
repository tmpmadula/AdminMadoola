import React, { useEffect, useState } from "react";
//import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import { Container, Spacing } from "../../components/Layout";
import ProfileInfo from "./ProfileInfo";
import Head from "../../components/Head";
import { Auth } from "aws-amplify";
import { InLineLoader } from "../../components/InlineLoader/InlineLoader";

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      firstname
      lastname
      avatar
    }
  }
`;
//import { useStore } from 'store';

const Root = styled.div`
  width: 100%;

  @media (min-width: 1100px) {
    margin-left: 5px;
    padding: 0;
  }
`;

/**
 * User Profile Page
 */

type User = {
  userId: string;
};

const Profile = ({ match }) => {
  //const [{ auth }] = useStore();
  //const { currentUser } = useContext(AuthContext);
  //let auth = currentUser;
  const { username } = match.params;
  const [tUser, setCurrentUser] = useState<User | undefined>();

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

  const currentRoute = window.location.hash;
  const newstr = currentRoute.substr(-36);

  const id = newstr.search("profile") === -1 ? newstr : tUser;
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: id },
  });

  //console.log(data);
  const renderContent = () => {
    if (loading) {
      return (
        <Container padding="xxs">
          <Container maxWidth="sm">
            <Spacing top="lg" bottom="lg"></Spacing>
          </Container>
        </Container>
      );
    }

    if (error || !data.getUser) return <InLineLoader />;

    return (
      <Container padding="xxs">
        <ProfileInfo user={data.getUser} />
      </Container>
    );
  };

  return (
    <Root>
      <Head title={username} />

      {renderContent()}
    </Root>
  );
};

Profile.propTypes = {
  //match: PropTypes.object.isRequired,
};

export default withRouter(Profile);
