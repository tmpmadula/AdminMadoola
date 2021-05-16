import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

//import { SearchIcon } from "../icons";


const Root = styled.div`
  width: 100%;
  position: relative;
  z-index: 50;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 10px;
`;

const Input = styled.input`
  outline: 0;
  height: 40px;
  width: 100%;
  border: 0;
  border-radius: 6px;
  padding-left: ${(p) => (p.hideIcon ? '10px' : '40px')};
  padding-right:  '40px';
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  background-color:  '#eeeeee'};
  transition: border-color 0.1s;

  &:focus {
    &::placeholder {
      color: #9e9e9e;
    }
  }
`;

/**
 * Component for rendering search input
 */
const SearchInput = ({
  onChange,
  onFocus,
  value,
  inputRef,
  backgroundColor,
  placeholder,
  hideIcon,
  children,
  autoFocus,
}) => {
  return (
    <Root>
      {!hideIcon && <IconContainer></IconContainer>}

      <Input
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        ref={inputRef}
        backgroundColor={backgroundColor}
        type="text"
        placeholder={placeholder}
        hideIcon={hideIcon}
        autoFocus={autoFocus}
      />

      {children}
    </Root>
  );
};

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  value: PropTypes.string.isRequired,
  ref: PropTypes.object,
  backgroundColor: PropTypes.string,
  placeholder: PropTypes.string,
  hideIcon: PropTypes.bool,
  children: PropTypes.node,
  autoFocus: PropTypes.bool,
};

export default SearchInput;
