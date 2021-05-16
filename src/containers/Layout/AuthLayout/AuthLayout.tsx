import React from "react";
import useComponentSize from "../../../settings/useComponentSize";
//import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import DrawerItems from "../../DrawerItems/DrawerItems";
import { DrawerProvider } from "../../../context/DrawerContext";
import {
  LayoutWrapper,
  ContentWrapper,
  ContentInnerWrapper,
} from "./AuthLayout.style";
import { useDeviceType } from "../../../settings/useDeviceType";
import { styled } from "baseui";
import { Alert, AlertIcon } from "@chakra-ui/react";

const SidedbarDesktop = styled("div", () => ({
  "@media only screen and (max-width: 1199px)": {
    display: "none",
  },
}));

const AuthLayout = ({ children }: any) => {
  let [topbarRef, { height }] = useComponentSize();
  let [{ width }] = useComponentSize();
  const { desktop } = useDeviceType();

  return (
    <DrawerProvider>
      <Alert status="info">
        <AlertIcon />
        This is a Beta version.
      </Alert>
      <Topbar refs={topbarRef} />
      <LayoutWrapper
        style={{
          height: `calc(100vh - ${height}px)`,
        }}
      >
        {desktop ? (
          <>
            <ContentWrapper
              style={{
                width: `calc(100% - ${width}px)`,
              }}
            >
              <ContentInnerWrapper>{children}</ContentInnerWrapper>
            </ContentWrapper>
            <SidedbarDesktop></SidedbarDesktop>
          </>
        ) : (
          <ContentWrapper
            style={{
              width: "100%",
            }}
          >
            <h3>
              width: {width} , height: {height}
            </h3>
            <ContentInnerWrapper>{children}</ContentInnerWrapper>
          </ContentWrapper>
        )}
      </LayoutWrapper>
      <DrawerItems />
    </DrawerProvider>
  );
};

export default AuthLayout;
