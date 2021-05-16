import React from "react";
//import { useMutation } from "@apollo/client";
import styled from "styled-components";

import { Container } from "../components/Layout";
import { Button } from "../components/Form";

const Root = styled(Container)`
  border: 0;
  border: 1px solid #e0e0e0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  margin: 0 10px;
  padding-left: 20px;
  padding-top: 10px;
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: ${(p) => (p.focus ? "80px" : "40px")};
  font-size: 14px;
  background-color: #f5f5f5;
  border-radius: 6px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

/**
 * Component for creating a post
 */
const CreatePost = () => {
  return (
    <>
      {
        //isFocused && <Overlay onClick={handleReset} />
      }

      <Root zIndex={"xs"} color="white" radius="sm" padding="sm">
        <form>
          <Wrapper>
            <Textarea
              type="textarea"
              name="title"
              //onFocus={handleOnFocus}
              //onChange={handleTitleChange}
              placeholder="Add a post"
            />
          </Wrapper>

          <Options>
            <Buttons>
              <Button
                text
                type="button"
                //onClick={handleReset}
              >
                Cancel
              </Button>
              <Button
                //disabled={isShareDisabled}
                type="submit"
              >
                Share
              </Button>
            </Buttons>
          </Options>
        </form>
      </Root>
    </>
  );
};

export default CreatePost;
