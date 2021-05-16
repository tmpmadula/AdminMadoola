import React, { useState } from "react";
import { Avatar } from "baseui/avatar";
import { gql, useQuery } from "@apollo/client";
import { Storage } from "aws-amplify";

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      avatar
      firstname
    }
  }
`;

export const Avatars = ({ userData }) => {
  const [img, setImg] = useState({});
  const { data, loading } = useQuery(GET_USER, {
    variables: { id: userData },
  });
  if (loading) return <p>.</p>;

  const getImg = async () => {
    const im = await Storage.get(data.getUser.avatar, { level: "public" });
    setImg(im);
    return im;
  };
  //if (data && data.getUser) {
  getImg();
  // }

  return (
    <>
      {data && data.getUser ? (
        <Avatar src={img.toString()} name={data.getUser.firstname} />
      ) : (
        <Avatar name="" src="https://bit.ly/broken-link" />
      )}
    </>
  );
};
