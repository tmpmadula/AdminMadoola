import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

//import { useStore } from 'store';

//import { HEADER_HEIGHT } from 'constants/Layout';

import MessagesUsers from "./MessagesUsers";
import MessagesChat from "./MessagesChat";
import { AuthContext } from "../../context/auth";

const Root = styled.div`
  background-color: #fff;
  position: relative;
  margin-top: -0px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;

  @media (min-width: 1007px) {
    margin-left: 10px;

    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }
`;

/**
 * Messages page
 */
const Messages = ({ match }) => {
  // const [{ auth }] = useStore();
  const { currentUser } = useContext(AuthContext);

  let auth = currentUser?.userId;

  return (
    <Root>
      <MessagesUsers
        // match={match}
        authUser={auth}
      />

      <MessagesChat
        //match={match}
        authUser={auth}
      />
    </Root>
  );
};

Messages.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Messages;
