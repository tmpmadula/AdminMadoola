import React, { useState, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { v1 } from "uuid";
import { Button, Textarea } from "../../components/Form";
//import { SendIcon } from '../../components/icons';

import { SendIcon } from "../../components/icons/SendIcon";
import { gql, useMutation } from "@apollo/client";
import { currentDate } from "../../settings/date";

import _ from "lodash";

//import { CREATE_MESSAGE } from 'graphql/messages';

const CREATE_MESSAGE = gql`
  mutation addMessage($msg: AddMessageInput!, $nts: AddNotificationInput!) {
    addMessage(data: $msg, alertData: $nts) {
      id
      author
      receiver
      message
      isFirstMessage
      seen
    }
  }
`;

const Root = styled.div`
  padding: 0 20px;
  overflow-y: auto;
  height: 100vh;
  margin-top: -120px;
  padding-top: 120px;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #9e9e9e;
    border-radius: 12px;
    visibility: hidden;

    &:hover {
      background-color: #757575;
    }
  }

  &:hover {
    ::-webkit-scrollbar-thumb {
      visibility: visible;
    }
  }
`;

const Conversation = styled.div`
  flex: 1;
`;

const MessageDate = styled.span`
  position: absolute;
  bottom: -20px;
  left: ${(p) => !p.userMessage && "40px"};
  right: -${(p) => p.userMessage && 0};
  display: none;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.54);
`;

const MessageWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: ${(p) => p.userMessage && "flex-end"};
  margin: 30px 0;

  &:hover ${MessageDate} {
    display: block;
  }
`;

const Message = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  max-width: 300px;
  line-height: 21px;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 12px;
  color: #fff;
  background-color: ${(p) => (p.userMessage ? "#7986cb" : "#757575")};
`;

const Form = styled.form`
  background-color: #fff;
  position: sticky;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 5px;
`;

const StyledTextarea = styled(Textarea)`
  height: 38px;
  border-radius: 12px;
  background-color: #eeeeee;
`;

const SendButton = styled(Button)`
  margin-left: 20px;
  align-self: center;
`;

/**
 * Component that renders messages conversations UI
 */
const MessagesChatConversation = ({
  messages,
  authUser,
  chatUser,
  refetch,
  data,
  match,
}) => {
  const bottomRef = useRef(null);

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");

  const [createMessage] = useMutation(CREATE_MESSAGE);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(messageText);
    setText(messageText);
    setSending(true);
    if (!messageText) return;

    setMessageText("");
    //sending = true;

    createMessage({
      variables: {
        msg: {
          id: v1(),
          author: authUser,
          receiver: chatUser ? chatUser : null,
          message: messageText,
          isFirstMessage: true,
          seen: true,
          addedAt: Date.now(),
        },
        nts: {
          id: v1(),
          author: authUser,
          userid: chatUser,
          notificationType: "Message",
          seen: false,
        },
      },
    });
    refetch();
    setSending(false);
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage(e);
    }
  };
  const keys = _.sortBy(messages, "addedAt");

  return (
    <Root>
      <Conversation>
        {keys.map((chat) => {
          const isAuthUserReceiver = authUser === chat.author;

          return (
            <MessageWrapper userMessage={isAuthUserReceiver} key={chat.id}>
              <Message userMessage={isAuthUserReceiver}>{chat.message}</Message>

              <MessageDate userMessage={isAuthUserReceiver}>
                {currentDate(chat.addedAt)}
              </MessageDate>
            </MessageWrapper>
          );
        })}
        <div ref={bottomRef} />
        {sending && (
          <MessageWrapper userMessage={authUser}>
            <Message userMessage={authUser}>{text}</Message>
          </MessageWrapper>
        )}
      </Conversation>

      <Form onSubmit={sendMessage}>
        <StyledTextarea
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={onEnterPress}
        />

        <SendButton ghost>
          <SendIcon />
        </SendButton>
      </Form>
    </Root>
  );
};

MessagesChatConversation.propTypes = {
  messages: PropTypes.array.isRequired,
  authUser: PropTypes.object.isRequired,
  chatUser: PropTypes.object,
  data: PropTypes.any,
  match: PropTypes.object.isRequired,
};

export default MessagesChatConversation;
