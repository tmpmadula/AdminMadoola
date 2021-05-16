import React from "react";
import useComponentSize from "../../settings/useComponentSize";
//import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import DrawerItems from "../DrawerItems/DrawerItems";
import { DrawerProvider } from "../../context/DrawerContext";
import {
  LayoutWrapper,
  ContentWrapper,
  ContentInnerWrapper,
} from "./Layout.style";
import { useDeviceType } from "../../settings/useDeviceType";
import { styled } from "baseui";
import { Scrollbars } from "react-custom-scrollbars";

const SidedbarDesktop = styled("div", () => ({
  "@media only screen and (max-width: 1199px)": {
    display: "none",
  },
}));

const AdminLayout = ({ children }: any) => {
  let [topbarRef, { height }] = useComponentSize();
  let [{ width }] = useComponentSize();
  const { desktop } = useDeviceType();

  return (
    <DrawerProvider>
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
              <SidedbarDesktop style={{ width: "15%" }}></SidedbarDesktop>
              <Scrollbars
                autoHide
                renderView={(props) => (
                  <div
                    {...props}
                    style={{ ...props.style, overflowX: "hidden" }}
                  />
                )}
                renderTrackHorizontal={(props) => (
                  <div
                    {...props}
                    style={{ display: "none" }}
                    className="track-horizontal"
                  />
                )}
              >
                <ContentInnerWrapper>{children}</ContentInnerWrapper>
              </Scrollbars>
              <SidedbarDesktop style={{ width: "15%" }}></SidedbarDesktop>
            </ContentWrapper>
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

export default AdminLayout;
