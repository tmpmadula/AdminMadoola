import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { generatePath, withRouter, Link } from "react-router-dom";

import Search from "../../components/Search";
import { USER_PROFILE } from "../../settings/constants";
import { gql, useQuery } from "@apollo/client";
import { ProfileImg } from "../Layout/Topbar/Topbar.style";
import { Avatars } from "../../components/Avatars/Avatars";

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      firstname
      lastname
      username
    }
  }
`;

const Root = styled.div`
  position: relative;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #e0e0e0;
  z-index: 1;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  color: rgba(0, 0, 0, 0.54);
  font-size: 14px;
`;

const To = styled.div`
  margin-top: 1px;
`;

const User = styled(Link)`
  margin: 0 5px;
  padding: 5px 5px;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
`;

const Info = styled.div`
  padding-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FullName = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 600;
`;

/**
 * Heading component for messages chat
 */
const MessagesChatHeading = ({ chatUser }: any) => {
  const { data } = useQuery(GET_USER, {
    variables: { id: chatUser },
  });

  if (!data) {
    return (
      <Root>
        <InputContainer>
          <To>To:</To>
          <Search
            location={"location"}
            backgroundColor="white"
            hideIcon
            forMessage
            placeholder="Type the name of a person"
            autoFocus
          />
        </InputContainer>
      </Root>
    );
  }

  if (data) {
    return (
      <Root>
        <User
          to={generatePath(USER_PROFILE, {
            username: data.getUser.username,
          })}
        >
          <ProfileImg>
            <ProfileImg>
              <Avatars userData={data.getUser.id} />
            </ProfileImg>
          </ProfileImg>

          <Info>
            <FullName>{data.getUser.firstname}</FullName>
          </Info>
        </User>
      </Root>
    );
  }

  return null;
};

MessagesChatHeading.propTypes = {
  //amatch: PropTypes.object.isRequired,
  chatUser: PropTypes.object,
};

export default withRouter(MessagesChatHeading);
