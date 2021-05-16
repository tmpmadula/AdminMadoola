import styled from "styled-components";

// prettier-ignore

/**
 * Container div for holding UI, using theme screen options
 *
 * @param {string} maxWidth
 * @param {string} padding
 * @param {boolean} bordered
 * @param {boolean} color
 */
export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  margin-top:0;
  width: 100%;
`;

export const Content = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  min-height: 500px;
`;

/**
 * Adds margins to UI, using theme spacing options
 *
 * @param {string} top
 * @param {string} right
 * @param {string} bottom
 * @param {string} left
 * @param {boolean} inline, converts block element to inline block
 */

export const Spacing = styled.div`
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  display: inline-block;
`;
/**
  @media (max-width: ${(p) => p.theme.screen.sm}) {
    display: none;
  }
`;


 * Overlay, on top of the whole UI
 */
export const Overlay = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(
    0,
    0,
    0,
    ${(p) => (p.transparency ? p.transparency : "0.8")}
  );
`;
