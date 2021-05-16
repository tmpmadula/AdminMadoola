import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useQuery, gql } from "@apollo/client";

//import { LoadingDots } from 'components/Loading';
import MessagesChatConversation from "./MessagesChatConversation";
import MessagesChatHeading from "./MessagesChatHeading";

import { useLocation } from "react-router-dom";
import Empty from "../../components/Empty";

const GET_USERS = gql`
  query {
    getUsers {
      id
    }
  }
`;
const GET_MESSAGES = gql`
  query getMessageBy($msg: String!, $ui: String!) {
    getMessageBy(userid: $msg, uid: $ui) {
      id
      author
      receiver
      message
      addedAt
      isFirstMessage
      seen
    }
  }
`;

//import { GET_MESSAGES, GET_MESSAGES_SUBSCRIPTION, UPDATE_MESSAGE_SEEN } from 'graphql/messages';
//import { GET_USER, GET_CONVERSATIONS, GET_AUTH_USER } from 'graphql/user';

//import * as Routes from 'routes';

const Root = styled.div`
  width: 100%;
  height: 100%;
`;

/**
 * Messages chat wrapper
 */
const MessagesChat = ({ authUser }) => {
  const location = useLocation();
  let path = location.pathname.substring(10);

  const { data: messages, refetch } = useQuery(GET_MESSAGES, {
    variables: { msg: authUser, ui: path },

    fetchPolicy: "network-only",
  });

  const { loading } = useQuery(GET_USERS);

  //console.log(messages);

  if (loading) {
    return (
      <Root>
        <p>...</p>
      </Root>
    );
  }

  let chatUser = null;

  chatUser = path;
  //console.log("user", chatUser);

  return (
    <Root>
      <MessagesChatHeading chatUser={chatUser} />
      {chatUser !== "" ? (
        <MessagesChatConversation
          authUser={authUser}
          messages={messages ? messages.getMessageBy : []}
          chatUser={chatUser}
          data={messages}
          refetch={refetch}
          // match={chatUser}
        />
      ) : (
        <Empty />
      )}
    </Root>
  );
};

MessagesChat.propTypes = {
  //match: PropTypes.object.isRequired,
  authUser: PropTypes.string.isRequired,
};

export default MessagesChat;
