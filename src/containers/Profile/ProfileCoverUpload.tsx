import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
//import { useApolloClient } from "@apollo/client";

//import { UploadImageIcon } from "../../components/icons";

//import { MAX_USER_COVER_IMAGE_SIZE } from "constants/ImageSize";

//import { GET_AUTH_USER, GET_USER, UPLOAD_PHOTO } from "graphql/user";
//import { GET_FOLLOWED_POSTS } from "graphql/post";

import defaultBackgroundImage from "./background.jpg";
import { AuthContext } from "../../context/auth";

//port { useStore } from "store";

//import { useGlobalMessage } from "hooks/useGlobalMessage";

const Root = styled.div`
  width: 100%;
  height: 250px;
  position: relative;
  background-image: url(${(p) => (p.image ? p.image : defaultBackgroundImage)});
  background-size: cover;
  background-position: center;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  position: absolute;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  left: 20px;
  top: 20px;
  padding: 5px 10px;
  border-radius: 3px;
  transition: background-color 0.4s;
  background-color: rgba(0, 0, 0, 0.6);

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

/**
 * Displays and Updates user Cover image
 */
const ProfileCoverUpload = ({ coverImagePublicId, coverImage, userId }) => {
  const { currentUser } = useContext(AuthContext);
  let auth = currentUser;
  //onst client = useApolloClient();
  //const [loading] = useState(false);

  //const message = useGlobalMessage();
  /*
  const handleImageChange = async (e) => {
    setLoading(true);

    const file = e.target.files[0];
    e.target.value = "";

    if (!file) return;

    if (file.size >= MAX_USER_COVER_IMAGE_SIZE) {
      message.error(
        `File size should be less then ${MAX_USER_COVER_IMAGE_SIZE / 1000000}MB`
      );
      setLoading(false);
      return;
    }

    try {
      await client.mutate({
        mutation: UPLOAD_PHOTO,
        variables: {
          input: {
            id: auth.user.id,
            image: file,
            imagePublicId: coverImagePublicId,
            isCover: true,
          },
        },
        refetchQueries: () => [
          { query: GET_FOLLOWED_POSTS, variables: { userId: auth.user.id } },
          { query: GET_AUTH_USER },
          { query: GET_USER, variables: { username: auth.user.username } },
        ],
      });
    } catch (err) {
      message.error(err.graphQLErrors[0].message);
    }

    setLoading(false);
  };
*/
  return (
    <Root image={coverImage}>
      <Input
        name="coverImage"
        type="file"
        id="coverImage"
        // onChange={handleImageChange}
        accept="image/x-png,image/jpeg"
      />

      {auth.userId === userId && <Label htmlFor="coverImage"></Label>}
    </Root>
  );
};

ProfileCoverUpload.propTypes = {
  userId: PropTypes.string.isRequired,
  coverImagePublicId: PropTypes.string,
  coverImage: PropTypes.string,
};

export default ProfileCoverUpload;
