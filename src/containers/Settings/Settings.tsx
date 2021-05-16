import React, { useCallback } from "react";
import SettingsCard from "../../components/SettingsCard/SettingsCard";
import { useDrawerDispatch } from "../../context/DrawerContext";
import { PROFILE } from "../../settings/constants";
import { styled } from "baseui";
import { OrderIcon, CouponIcon } from "../../components/AllSvgIcon";
import { Grid, Row, Col as Column } from "../../components/FlexBox/FlexBox";
import { useHistory } from "react-router-dom";
import Image from "../../components/Image/Image";
import { ProfileImg } from "../Layout/Topbar/Topbar.style";

const Col = styled(Column, () => ({
  "@media only screen and (max-width: 767px)": {
    marginBottom: "20px",

    ":last-child": {
      marginBottom: 0,
    },
  },
}));

export default function Settings() {
  let history = useHistory();
  const dispatch = useDrawerDispatch();

  const openStaffForm = useCallback(
    () =>
      dispatch({ type: "OPEN_DRAWER", drawerComponent: "STAFF_MEMBER_FORM" }),
    [dispatch]
  );

  /*
  const openProfileForm = useCallback(
    () => dispatch({ type: "OPEN_DRAWER", drawerComponent: "PROFILE_FORM" }),
    [dispatch]
  );*/

  const openCouponForm = useCallback(
    () => dispatch({ type: "OPEN_DRAWER", drawerComponent: "CAMPAING_FORM" }),
    [dispatch]
  );

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={6}>
          <SettingsCard
            icon={
              <ProfileImg>
                <Image
                  url="https://www.w3schools.com/html/img_girl.jpg"
                  alt="tho"
                />
              </ProfileImg>
            }
            title={""}
            subtitle="View and update your Profile"
            onClick={() => history.push(PROFILE)}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <SettingsCard
            icon={<OrderIcon width="56px" height="56px" />}
            title="Add Staff Members"
            subtitle="Add your staff members from here"
            onClick={openStaffForm}
          />
        </Col>
        <Col md={6}>
          <SettingsCard
            icon={<CouponIcon width="56px" height="56px" />}
            title="Add Coupons"
            subtitle="Add coupons from here"
            onClick={openCouponForm}
          />
        </Col>
      </Row>
    </Grid>
  );
}
