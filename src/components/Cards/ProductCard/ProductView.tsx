import React, { useRef } from "react";
import {
  Divider,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Tag,
} from "@chakra-ui/react";
import {
  HeadWrapper,
  ProductInfo,
  ProductTitle,
  TagsWrapper,
} from "./ProductView.style";
import { ProfileImg } from "../../../containers/Layout/Topbar/Topbar.style";
import { Avatars } from "../../Avatars/Avatars";
import { Details } from "../../Notification/Notification.style";

import { FacebookIcon, FacebookShareButton } from "react-share";

export const ProductView = ({ isOpen, onClose, ProductData }) => {
  const initialRef = useRef();
  const finalRef = useRef();
  let shareUrl = `https://www.madoola.com/#/views/${ProductData.id}`;

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent backgroundColor="#f3f3f3">
        <ModalBody size="xl">
          <HeadWrapper>
            <ProductInfo>
              <ProfileImg>
                <Avatars userData={ProductData.userid} />
              </ProfileImg>

              {ProductData.firstname && (
                <ProductTitle>{`${ProductData.firstname.getUser.firstname} ${ProductData.lastname.getUser.lastname}'s`}</ProductTitle>
              )}
            </ProductInfo>
          </HeadWrapper>{" "}
          <Divider />
          <HeadWrapper>
            <ProductTitle>
              {" "}
              {ProductData.title}
              <Details>{ProductData.description}</Details>
            </ProductTitle>
          </HeadWrapper>
          <HeadWrapper>
            <Divider />
          </HeadWrapper>
          <HeadWrapper>
            <TagsWrapper>
              <Tag size="sm" variant="solid" colorScheme="teal">
                {ProductData.productTag}
              </Tag>
            </TagsWrapper>
          </HeadWrapper>{" "}
          <Divider />
          <Heading>Share</Heading>
          <HStack>
            <div className="Demo__some-network">
              <FacebookShareButton
                url={shareUrl}
                quote={ProductData.title}
                className="Demo__some-network__share-button"
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </div>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
