import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Popover, { PLACEMENT } from "../../../components/Popover/Popover";
import Notification from "../../../components/Notification/Notification";
import { AuthContext } from "../../../context/auth";
//import { Storage } from "aws-amplify";
import Search from "../../../components/Search";
import {
  FREEINVOICE,
  HOME,
  PRODUCTS,
  PROFILE,
} from "../../../settings/constants";
import {
  NotificationIcon,
  AlertDotIcon,
  ArrowLeftRound,
  SidebarCategoryIcon,
  ProductIcon,
} from "../../../components/AllSvgIcon";

import {
  TopbarWrapper,
  Logo,
  LogoImage,
  TopbarRightSide,
  ProfileImg,
  AlertDot,
  NotificationIconWrapper,
  UserDropdowItem,
  NavLink,
  LogoutBtn,
  DrawerIcon,
  CloseButton,
  DrawerWrapper,
  TopMidWrapper,
  SearchWrapper,
} from "./Topbar.style";
import Logoimage from "../../../image/m.png";
import { MenuIcon } from "../../../components/AllSvgIcon";
import Drawer, { ANCHOR } from "../../../components/Drawer/Drawer";
import Sidebar from "../Sidebar/Sidebar";

import { gql, useQuery } from "@apollo/client";
import { Auth } from "aws-amplify";

import { MESSAGES } from "./../../../settings/constants";
import { Avatars } from "../../../components/Avatars/Avatars";
import {
  Avatar,
  InputGroup,
  Input,
  InputLeftElement,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { Search2Icon } from "@chakra-ui/icons";
import { ProductForm } from "../../ProductForm/ProductForm";

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
  {
    name: "Create Invoice",
    path: FREEINVOICE,
    exact: false,
    icon: <ProductIcon />,
  },
];

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      firstname
    }
  }
`;

const GET_NOTIFICATION = gql`
  query getNotification($userid: String!) {
    getNotificationByUser(userid: $userid) {
      id
      author
      notificationType
    }
  }
`;

type User = {
  userId: string;
};

const Topbar = ({ refs, onMenuItemClick }: any) => {
  const { signout } = React.useContext(AuthContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(null);
  const [tUser, setCurrentUser] = useState<User | undefined>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    onLoad();
  }, []);
  async function onLoad() {
    try {
      const userInfo = await Auth.currentUserInfo();
      setCurrentUser(userInfo.username);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }
  }

  const { currentUser } = useContext(AuthContext);

  const id = currentUser?.userId !== undefined ? currentUser?.userId : tUser;

  const { data, loading } = useQuery(GET_USER, {
    variables: { id: id },
  });
  const { data: notifyData } = useQuery(GET_NOTIFICATION, {
    variables: { userid: id },
  });
  if (loading) return <p>.</p>;

  return (
    <TopbarWrapper ref={refs}>
      <Logo>
        <Link to="/">
          <LogoImage src={Logoimage} alt="pickbazar-admin" />
        </Link>
      </Logo>

      <DrawerWrapper>
        <DrawerIcon onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon />
        </DrawerIcon>
        <Drawer
          isOpen={isDrawerOpen}
          anchor={ANCHOR.left}
          onClose={() => setIsDrawerOpen(false)}
          overrides={{
            Root: {
              style: {
                zIndex: "1",
              },
            },
            DrawerBody: {
              style: {
                marginRight: "0",
                marginLeft: "0",
                "@media only screen and (max-width: 767px)": {
                  marginLeft: "30px",
                },
              },
            },
            DrawerContainer: {
              style: {
                width: "270px",
                "@media only screen and (max-width: 767px)": {
                  width: "80%",
                },
              },
            },
            Close: {
              component: () => (
                <CloseButton onClick={() => setIsDrawerOpen(false)}>
                  <ArrowLeftRound />
                </CloseButton>
              ),
            },
          }}
        >
          <Sidebar onMenuItemClick={() => setIsDrawerOpen(false)} />
        </Drawer>
      </DrawerWrapper>
      <SearchWrapper>
        <Popover
          content={({ close }) => (
            <Search
              location={""}
              backgroundColor="white"
              hideIcon
              forMessage={false}
              placeholder="Search"
              autoFocus
            />
          )}
          accessibilityType={"tooltip"}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: () => ({
                width: "330px",
                marginTop: "-40px",
                zIndex: 2,
              }),
            },
          }}
        >
          <NotificationIconWrapper>
            <InputGroup>
              <Input type="tel" placeholder="Search Planturion" />
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="gray.300" />}
              />
            </InputGroup>
          </NotificationIconWrapper>
        </Popover>
      </SearchWrapper>
      <TopMidWrapper>
        {sidebarMenus.map((menu: any, index: number) => (
          <NavLink
            to={menu.path}
            key={index}
            exact={menu.exact}
            activeStyle={{
              color: "#02475e",
              backgroundColor: "#f7f7f7",
              borderRadius: "25px 25px 25px 25px",
            }}
            onClick={onMenuItemClick}
          >
            {menu.name}
          </NavLink>
        ))}
      </TopMidWrapper>

      <TopbarRightSide>
        <Button onClick={onOpen}>Add Products</Button>{" "}
        <Popover
          content={({ close }) => (
            <Notification data={notifyData} onClear={close} />
          )}
          accessibilityType={"tooltip"}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: () => ({
                width: "330px",
                zIndex: 2,
              }),
            },
          }}
        >
          <NotificationIconWrapper>
            <NotificationIcon />
            <AlertDot>
              <AlertDotIcon />
            </AlertDot>
          </NotificationIconWrapper>
        </Popover>
        <Popover
          content={({ close }) => (
            <UserDropdowItem>
              <NavLink to={PROFILE} exact={false} onClick={close}>
                Profile
              </NavLink>

              <NavLink to={MESSAGES} exact={false} onClick={close}>
                Messages
              </NavLink>
              <NavLink
                to={`/messages/eda04dad-1068-4d0a-bbb3-e0aa819fa12c`}
                exact={false}
                onClick={close}
              >
                Planturion Support
              </NavLink>
              <LogoutBtn
                onClick={() => {
                  signout();
                  close();
                }}
              >
                Logout
              </LogoutBtn>
            </UserDropdowItem>
          )}
          accessibilityType={"tooltip"}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: () => ({
                width: "220px",
                zIndex: 2,
              }),
            },
          }}
        >
          <ProfileImg>
            {data && data.getUser ? (
              <Avatars userData={data.getUser.id} />
            ) : (
              <Avatar name="T" src="https://bit.ly/broken-link" />
            )}
          </ProfileImg>
        </Popover>
      </TopbarRightSide>
      <ProductForm isOpen={isOpen} onClose={onClose} />
    </TopbarWrapper>
  );
};

export default Topbar;
