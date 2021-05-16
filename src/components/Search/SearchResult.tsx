import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { generatePath } from "react-router-dom";
import { Spacing } from "../Layout";
import { A } from "../Text";
import { USER_PROFILE } from "../../settings/constants";
import { ProfileImg } from "../../containers/Layout/Topbar/Topbar.style";
import { Avatars } from "../Avatars/Avatars";

//import * as Routes from "routes";

const Root = styled.div`
  width: 100%;
  max-height: 350px;
  min-height: 40px;
  overflow: auto;
  position: absolute;
  top: 50px;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background-color: #fff;
`;

const StyledA = styled(A)`
  display: block;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const Name = styled.div`
  font-weight: 600;
`;

const UserName = styled.div`
  font-size: 13px;
`;

const NoSearchResult = styled.div`
  text-align: center;
  padding: 10px;
  color: rgba(0, 0, 0, 0.87);
`;
/**
 * Displays search result, meant to be used in Search component
 */

const SearchResult = ({ users, forMessage }) => {
  console.log(users);
  if (users.length < 1) {
    return (
      <Root>
        <NoSearchResult>No search results.</NoSearchResult>
      </Root>
    );
  }

  return (
    <Root>
      {users.map((user) => (
        <StyledA
          key={user.id}
          to={
            forMessage
              ? `/messages/${user.id}`
              : generatePath(USER_PROFILE, { username: user.username })
          }
        >
          <Item>
            <ProfileImg>
              <Avatars userData={user.id} />
            </ProfileImg>
            <Spacing left="xs">
              <Name>{user.firstname + " "}</Name>{" "}
              <UserName>{user.lastname}</UserName>
            </Spacing>
          </Item>
        </StyledA>
      ))}
    </Root>
  );
};

SearchResult.propTypes = {
  users: PropTypes.array.isRequired,
  forMessage: PropTypes.bool,
};

export default SearchResult;
