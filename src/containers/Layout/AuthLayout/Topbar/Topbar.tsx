import React from "react";
import { Link } from "react-router-dom";
import { LOGIN, INVOICE } from "../../../../settings/constants";
import { ProductIcon } from "../../../../components/AllSvgIcon";
import {
  TopbarWrapper,
  Logo,
  LogoImage,
  NavLink,
  TopMidWrapper,
} from "./Topbar.style";
import Logoimage from "../../../../image/m.png";

const sidebarMenus = [
  {
    name: "Login",
    path: LOGIN,
    exact: false,
    icon: <ProductIcon />,
  },
  {
    name: "Create Invoice",
    path: INVOICE,
    exact: false,
    icon: <ProductIcon />,
  },
];

type User = {
  userId: string;
};

const Topbar = ({ refs, onMenuItemClick }: any) => {
  return (
    <TopbarWrapper ref={refs}>
      <Logo>
        <Link to="/">
          <LogoImage src={Logoimage} alt="pickbazar-admin" />
        </Link>
      </Logo>

      <TopMidWrapper>
        {sidebarMenus.map((menu: any, index: number) => (
          <NavLink
            to={menu.path}
            key={index}
            exact={menu.exact}
            activeStyle={{
              color: "#00C58D",
              backgroundColor: "#f7f7f7",
              borderRadius: "50px 0 50px 50px",
            }}
            onClick={onMenuItemClick}
          >
            {menu.name}
          </NavLink>
        ))}
      </TopMidWrapper>
    </TopbarWrapper>
  );
};

export default Topbar;
