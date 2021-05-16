import { gql, useQuery } from "@apollo/client";
import React from "react";
import { ProfileImg } from "../../containers/Layout/Topbar/Topbar.style";

import { Avatars } from "../Avatars/Avatars";
import { Title, Message, Time, TitleWrapper, Dot } from "./Notification.style";

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      firstname
    }
  }
`;

export default function NotificationCard({ notificationType, time, author }) {
  const { data, loading } = useQuery(GET_USER, {
    variables: { id: author },
  });

  if (loading) return <p>.</p>;

  return (
    <Message to={`/messages/${author}`}>
      <TitleWrapper>
        <Title>
          <ProfileImg>
            <Avatars userData={author} />
          </ProfileImg>
          {`New ${notificationType} from ${data.getUser.firstname}`}
        </Title>
        <Dot />
        <Time>{time}</Time>
      </TitleWrapper>
    </Message>
  );
}
