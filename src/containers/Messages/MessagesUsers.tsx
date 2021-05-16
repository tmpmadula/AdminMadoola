import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { NavLink, generatePath } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import Search from "../../components/Search";
import { PencilIcon } from "../../components/icons";
//import { LoadingDots } from '../../components/Loading';
import { MESSAGES, NEW_ID_VALUE } from "../../settings/constants";
import { InLineLoader } from "../../components/InlineLoader/InlineLoader";

import { ProfileImg } from "../Layout/Topbar/Topbar.style";
import { Avatars } from "../../components/Avatars/Avatars";

//import * as Routes from 'routes';

const Root = styled.div`
  width: 80px;
  height: 100%;
  border-right: 1px solid #e0e0e0;

  @media (min-width: 1100px) {
    width: 330px;
  }
`;

const HeadingContainer = styled.div`
  border-bottom: 1px solid #e0e0e0;
  height: 60px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (min-width: 1100px) {
    justify-content: space-between;
  }
`;

const Heading = styled.h3`
  display: none;
  color: rgba(0, 0, 0, 0.87);
  margin: 0;

  @media (min-width: 1100px) {
    display: block;
  }
`;

const NewMessage = styled(NavLink)`
  width: 40px;
  height: 40px;
  background-color: #eeeeee;
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: none;
  border-bottom: 1px solid #e0e0e0;

  @media (min-width: 1100px) {
    display: block;
  }
`;

const UserContainer = styled.div`
  margin-top: 20px;
  padding: 0 5px;
`;

const User = styled(NavLink)`
  width: 100%;
  padding: 5px 5px;
  margin-bottom: 5px;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);

  @media (max-width: 1100px) {
    ${(p) =>
      !p.seen &&
      `
        
      `};
  }

  &.selected {
    background-color: #f5f5f5;
  }
`;

const Info = styled.div`
  width: 100%;
  display: none;
  padding: 0 10px;

  @media (min-width: 1100px) {
    display: block;
  }
`;

const FullNameUnSeen = styled.div`
  width: 100%;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FullName = styled.div`
  text-overflow: ellipsis;
  width: 100%;
`;

const LastMessage = styled.div`
  margin-top: 5px;
  font-size: 13px;
  color: #9e9e9e;
  text-overflow: ellipsis;
`;

const GET_USERS = gql`
  query {
    getUsers {
      id
      firstname
      lastname
      avatar
    }
  }
`;

const MessagesUsers = ({ authUser }) => {
  const { data, loading } = useQuery(GET_USERS);

  if (loading)
    return (
      <p>
        <InLineLoader />
      </p>
    );

  return (
    <Root>
      <HeadingContainer>
        <Heading>Chats</Heading>

        <NewMessage
          exact
          activeClassName="selected"
          to={generatePath(MESSAGES, { userId: NEW_ID_VALUE })}
        >
          <PencilIcon />
        </NewMessage>
      </HeadingContainer>

      <SearchContainer>
        <Search
          location={"location"}
          backgroundColor="white"
          forMessage
          placeholder="Search message"
          hideIcon
          autoFocus
        />
      </SearchContainer>

      {loading}

      {!loading && (
        <UserContainer>
          {data.getUsers
            .filter((users) => users.id !== authUser)
            .map((user) => {
              return (
                <User
                  key={user.id}
                  activeClassName="selected"
                  to={`/messages/${user.id}`}
                  s
                >
                  <span>
                    <ProfileImg>
                      <Avatars userData={user.id} />
                    </ProfileImg>
                  </span>

                  <Info>
                    <FullNameUnSeen>
                      <FullName>
                        {user.firstname + " " + user.lastname}
                      </FullName>
                    </FullNameUnSeen>

                    <LastMessage>
                      {user.lastMessageSender && "You:"} {user.lastMessage}
                    </LastMessage>
                  </Info>
                </User>
              );
            })}
        </UserContainer>
      )}
    </Root>
  );
};

MessagesUsers.propTypes = {
  // location: PropTypes.object.isRequired,
  authUser: PropTypes.string.isRequired,
};

export default MessagesUsers;
