import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider } from "baseui";
import { theme } from "./theme";
import Routes from "./routes";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import * as serviceWorker from "./serviceWorker";
import "./theme/global.css";
import Amplify, { Auth } from "aws-amplify";
import { ChakraProvider } from "@chakra-ui/react";

import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import { title } from "process";
const TRACKING_ID = "UA-174941276-1"; // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

const config = require("./config").default;

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URL });

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      "x-api-key": "9bRvVcK9Ws1XGkFDEzwrD7SYf2qRdIpO30E945Sa",
    },
  });

  return forward(operation);
});

const client2 = new ApolloClient({
  link: authLink.concat(httpLink), // Chain it with the HttpLink
  cache: new InMemoryCache(),
});

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "tru-fan",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

function App() {
  const engine = new Styletron();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentUserInfo();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  const props = {
    isAuthenticated,
    userHasAuthenticated,
  };

  return (
    <ApolloProvider client={client2 as any}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <ChakraProvider>
            <HashRouter>
              {!isAuthenticating && (
                  <Helmet>
                    <title>{title}</title>
                    <meta name="description" content="Madoola" />
                  </Helmet>
                ) && <Routes {...props} />}
            </HashRouter>
          </ChakraProvider>
        </BaseProvider>
      </StyletronProvider>
    </ApolloProvider>
  );
}

ReactDOM.render(
  <App />,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
