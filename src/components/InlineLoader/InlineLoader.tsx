import React, { FC, memo } from "react";
import { styled } from "baseui";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Logoimage from "../../image/m.png";
import { LogoImage } from "../../containers/auth/Login/Login.style";

const Container = styled("div", () => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "500px",
  width: "100%",
  padding: "5%",
  position: "relative",
}));

export interface InLineLoaderProps {
  color?: string;
}

export const InLineLoader: FC<InLineLoaderProps> = memo((props) => {
  const { color = "#4092de" } = props;

  return (
    <Container color={color}>
      <Loader
        type="MutatingDots"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={5000}
      />
      <LogoImage src={Logoimage} alt="madoola" />
    </Container>
  );
});
