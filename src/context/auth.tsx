import React, { useState, useEffect, useCallback } from "react";
import { Auth } from "aws-amplify";

type User = {
  email: string;
  name: string;
  userId: string;
  userRole: string;
  token: string;
};

type AuthProps = {
  isAuthenticated: boolean;
  userHasAuthenticated: Function;
  signout: Function;

  currentUser?: User;
  refetchUser: () => void;
};
export const AuthContext = React.createContext({} as AuthProps);

const isValidToken = () => {
  const token = localStorage.getItem("pickbazar_token");
  // JWT decode & check token validity & expiration.
  if (token) return true;
  return false;
};

const AuthProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const session = await Auth.currentSession();
      const userInfo = await Auth.currentUserInfo();

      const currUser: User = {
        email: userInfo.attributes.email,
        name: userInfo.attributes.name,
        userId: userInfo.username,
        userRole: userInfo.attributes["custom:user_role"],
        token: session.getIdToken().getJwtToken(),
      };

      setCurrentUser(currUser);
    } catch (e) {
      setCurrentUser(undefined);
      if (e !== "No current user") {
        console.log(e);
      }
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const [isAuthenticated, makeAuthenticated] = React.useState(isValidToken());
  function userHasAuthenticated({ username, password }, cb) {
    makeAuthenticated(true);
    localStorage.setItem("pickbazar_token", `${username}.${password}`);
    setTimeout(cb, 100); // fake async
  }
  function signout(cb) {
    makeAuthenticated(false);

    localStorage.clear();
    sessionStorage.clear();
    setTimeout(cb, 100);
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userHasAuthenticated,
        signout,
        currentUser,
        refetchUser: fetchCurrentUser,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
