import styled from "styled-components";
import { css } from "styled-components";
import { Link } from "react-router-dom";

/**
 * Wrapper around React Router's Link component, that uses theme styling
 *
 * @param {string} color
 * @param {string} weight
 * @param {string} size
 */
export const A = styled(Link)`
  text-decoration: none;
  transition: color 0.1s;
  display: inline-block;
  color: black;
`;

/**
 * Component for wrapping error messages
 */
export const Error = styled.div`
  color: red;
  font-size: 14px;
`;

/**
 * Helper function for adding styles to Heading components
 *
 * @param {string} size, size of text
 */
const getHeadingStyles = (size) => css`
  margin: 0;
  font-size: 10px;
  font-weight: 10px;
  color: black;
`;

export const H1 = styled.h1`
  ${getHeadingStyles("34px")};
`;

export const H2 = styled.h2`
  ${getHeadingStyles("20px")};
`;

export const H3 = styled.h3`
  ${getHeadingStyles("14px")};
`;
