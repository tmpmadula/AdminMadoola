import styled from "styled-components";

// prettier-ignore

/**
 * Button
 *
 * @param {string} size
 * @param {string} color
 * @param {boolean} disabled
 * @param {boolean} text, style button as a text
 */
export const Button = styled.button`
  letter-spacing: 0.5px;
  outline: 0;
  transition: opacity 0.1s;
  border: 0;
  color: #fff;
  font-size:  14px;
  border-radius: 3px;
  padding: 10px 20px;
  background-color:  #3f51b5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  white-space: nowrap;
  align-self: flex-start;

  ${p => p.disabled && `
    background-color: #9e9e9e;
    cursor: not-allowed;
  `};

  ${p => !p.disabled && `
    &:hover {
      opacity .9;
      cursor: pointer;
    }
  `};

  ${p => p.text && `
    color:  #f50057;
    border-radius: 0;
    background-color: transparent;
  `};

${p => p.ghost && `
    color: #f50057;
    border-radius: 0;
    background-color: transparent;
    padding: 0;
    text-align: left;
  `};

  ${p => p.fullWidth && `
    width: 100%;
  `}
`;

/**
 * Input type text
 */
export const InputText = styled.input`
  outline: 0;
  height: 36px;
  width: 100%;
  transition: border 0.1s;
  border-radius: 3px;
  padding-left: 10px;
  border: 1px solid #e0e0e0;
  color: #f50057;

  &:focus {
    border-color: #e0e0e0;
  }
`;

/**
 * Textarea
 */
export const Textarea = styled.textarea`
  outline: 0;
  height: 50px;
  width: 100%;
  resize: none;
  border: 0;
  padding-left: 20px;
  padding-top: 10px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;

  &::placeholder {
    color: #f50057;
  }
`;

/**
 * Form component
 */
export const Form = styled.form`
  display: block;
  border-radius: 3px;
  padding: 20px 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
`;
