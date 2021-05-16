import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import {
  SidebarWrapper,
  NavLink,
  MenuWrapper,
  Svg,
  LogoutBtn,
} from "./Sidebar.style";
import { PRODUCTS, HOME } from "../../../settings/constants";
import { AuthContext } from "../../../context/auth";
import {
  ProductIcon,
  SidebarCategoryIcon,
  LogoutIcon,
} from "../../../components/AllSvgIcon";

const sidebarMenus = [
  {
    name: "Home",
    path: HOME,
    exact: true,
    icon: <SidebarCategoryIcon />,
  },

  {
    name: "Products",
    path: PRODUCTS,
    exact: false,
    icon: <ProductIcon />,
  },

  //{
  // name: "Orders",
  //path: ORDERS,
  //exact: false,
  //icon: <OrderIcon />,
  //},
  //{
  //name: "Customers",
  //path: CUSTOMERS,
  // exact: false,
  // icon: <CustomerIcon />,
  //},
  // {
  // name: "Projects",
  //path: PROJECTS,
  //exact: false,
  //icon: <CouponIcon />,
  //},
  // {
  // name: "Settings",
  //path: SETTINGS,
  //exact: false,
  //icon: <SettingIcon />,
  //},
];

export default withRouter(function Sidebar({
  refs,
  style,
  onMenuItemClick,
}: any) {
  const { signout } = useContext(AuthContext);
  return (
    <SidebarWrapper ref={refs} style={style}>
      <MenuWrapper>
        {sidebarMenus.map((menu: any, index: number) => (
          <NavLink
            to={menu.path}
            key={index}
            exact={menu.exact}
            activeStyle={{
              color: "#00C58D",
              backgroundColor: "#f7f7f7",
              borderRadius: "50px 0 0 50px",
            }}
            onClick={onMenuItemClick}
          >
            {menu.icon ? <Svg>{menu.icon}</Svg> : ""}
            {menu.name}
          </NavLink>
        ))}
      </MenuWrapper>

      <LogoutBtn
        onClick={() => {
          signout();
        }}
      >
        <Svg>
          <LogoutIcon />
        </Svg>
        Logout
      </LogoutBtn>
    </SidebarWrapper>
  );
});
