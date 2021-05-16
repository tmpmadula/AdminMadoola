import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link, generatePath, NavLink } from "react-router-dom";
import { Storage } from "aws-amplify";
import { H1 } from "../../components/Text";
import ProfileImageUpload from "./ProfileImageUpload";
import { AuthContext } from "../../context/auth";
import { MESSAGES, EDIT_PROFILE } from "../../settings/constants";
import { Button } from "@chakra-ui/react";

//import { useStore } from "store";

//import * as Routes from "routes";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.div`
  display: -webkit-inline-box;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const FullName = styled.div`
  display: block;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  position: relative;

  ${H1} {
    font-size: 20px;
  }

  @media (min-width: 1007px) {
    ${H1} {
      font-size: 34px;
    }
  }
`;

const FollowAndMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
`;

const Message = styled(Link)`
  text-decoration: none;
  font-size: 14px;
`;

/**
 * Renders user information in profile page
 */
const ProfileInfo = ({ user }) => {
  const { currentUser } = useContext(AuthContext);
  let auth = currentUser;

  const [img, setImg] = useState({});
  const [pic, setPic] = useState({ hits: [] });
  const getImg = async () => {
    const im = await Storage.get(user.avatar, { level: "public" });
    setImg(im);
    return im;
  };
  getImg();
  useEffect(() => {
    const fetchData = async () => {
      const result = pic;
      setPic(result);
    };

    fetchData();
  }, [pic]);

  /*
  const { data, loading } = useSubscription(IS_USER_ONLINE_SUBSCRIPTION, {
    variables: { authUserId: auth.user.id, userId: user.id },
  });

  let isUserOnline = user.isOnline;
  if (!loading && data) {
    isUserOnline = data.isUserOnline.isOnline;
  }*/

  return (
    <Root>
      <ProfileImage>
        <ProfileImageUpload
          userId={user.id}
          image={img}
          imagePublicId={user.imagePublicId}
          username={user.firstname}
        />

        <FullName>
          <FollowAndMessage>
            <H1>{user.firstname + " " + user.lastname} </H1>
          </FollowAndMessage>

          {auth.userId !== user.id && (
            <FollowAndMessage>
              <Message to={generatePath(MESSAGES, { userId: user.id })}>
                <Button> Message</Button>
              </Message>
            </FollowAndMessage>
          )}
          {auth.userId === user.id && (
            <FollowAndMessage>
              <Button>
                <NavLink to={EDIT_PROFILE} exact={false}>
                  Edit Profile
                </NavLink>
              </Button>
            </FollowAndMessage>
          )}
        </FullName>
      </ProfileImage>
    </Root>
  );
};

ProfileInfo.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileInfo;
