import React from "react";
import NotificationCard from "./NotificationCard";
import { Body, Header, Heading } from "./Notification.style";

export default function Notification({ data = [] }: any) {
  return (
    <div>
      <Header>
        <Heading>Notifications</Heading>
      </Header>
      <Body>
        {data.getNotificationByUser.map((item, index) => (
          <NotificationCard key={index} {...item} />
        ))}
      </Body>
    </div>
  );
}
