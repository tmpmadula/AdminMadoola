import React, { useContext, lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import {
  LOGIN,
  RESETPASSWORD,
  SIGNUP,
  PRODUCTS,
  HOME,
  DASHBOARD,
  ORDERS,
  SETTINGS,
  CUSTOMERS,
  PROJECTS,
  PROFILE,
  USER_PROFILE,
  EDIT_PROFILE,
  TEST,
  MESSAGES,
  USERMESSAGES,
  ONBOARDING,
  EXPLORER,
  FREEINVOICE,
  PRODUCTSVIEW,
  INVOICE,
} from "./settings/constants";
import AuthProvider, { AuthContext } from "./context/auth";
import { InLineLoader } from "./components/InlineLoader/InlineLoader";
import ReactGA from "react-ga";
import AuthLayout from "./containers/Layout/AuthLayout/AuthLayout";

const Products = lazy(() => import("./containers/ProductForm/Products"));
const Views = lazy(() => import("./components/Cards/ProductCard/Views"));

const AdminLayout = lazy(() => import("./containers/Layout/Layout"));
const Dashboard = lazy(() => import("./containers/Dashboard/Dashboard"));
const Home = lazy(() => import("./containers/Home/Home"));
const Orders = lazy(() => import("./containers/Orders/Orders"));
const Settings = lazy(() => import("./containers/Settings/Settings"));
const Profile = lazy(() => import("./containers/Profile/Profile"));
const EditProfile = lazy(() => import("./containers/Profile/EditProfile"));
const Test = lazy(() => import("./components/test"));
const Messages = lazy(() => import("./containers/Messages/Messages"));
const FreeInvoice = lazy(() => import("./components/FreeInvoice"));
const Onboarding = lazy(() => import("./components/Landing/Onboarding"));

const Customers = lazy(() => import("./containers/Customers/Customers"));
const Projects = lazy(() => import("./containers/Projects/Projects"));
const Login = lazy(() => import("./containers/auth/Login/Login"));
const Explorer = lazy(() => import("./components/Landing/Landing"));
const ResetPassword = lazy(
  () => import("./containers/auth/ResetPassword/ResetPassword")
);
const SignUp = lazy(() => import("./containers/auth/SignUp/SignUp"));
const NotFound = lazy(() => import("./containers/NotFound/NotFound"));
//import { ProductView } from './components/Cards/ProductCard/ProductView';

/**
 *
 *  A wrapper for <Route> that redirects to the login
 * screen if you're not yet authenticated.
 *
 */

function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/explorer",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const Routes = (props) => {
  ReactGA.pageview(window.location.pathname + window.location.search);
  return (
    <AuthProvider>
      <Suspense fallback={<InLineLoader />}>
        <Switch>
          <PrivateRoute path={DASHBOARD}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Dashboard />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={PRODUCTS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Products />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={PRODUCTSVIEW}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Views />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute exact={true} path={HOME}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Home />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={ORDERS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Orders />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={CUSTOMERS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Customers />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={PROJECTS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Projects />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={SETTINGS}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Settings />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={EDIT_PROFILE}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <EditProfile />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={FREEINVOICE}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <FreeInvoice />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <Route path={INVOICE}>
            <AuthLayout>
              <Suspense fallback={<InLineLoader />}>
                <FreeInvoice />
              </Suspense>
            </AuthLayout>
          </Route>
          <PrivateRoute path={PROFILE}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Profile />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={USER_PROFILE}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Profile />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={MESSAGES}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Messages />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <PrivateRoute path={USERMESSAGES}>
            <AdminLayout>
              <Suspense fallback={<InLineLoader />}>
                <Messages />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
          <Route path={TEST}>
            <AuthLayout>
              <Suspense fallback={<InLineLoader />}>
                <Test />
              </Suspense>
            </AuthLayout>
          </Route>
          <Route path={EXPLORER}>
            <AuthLayout>
              <Suspense fallback={<InLineLoader />}>
                <Explorer />
              </Suspense>
            </AuthLayout>
          </Route>
          <Route path={ONBOARDING}>
            <AuthLayout>
              <Suspense fallback={<InLineLoader />}>
                <Onboarding />
              </Suspense>
            </AuthLayout>
          </Route>
          <Route path={LOGIN}>
            <Login />
          </Route>
          <Route path={RESETPASSWORD}>
            <ResetPassword />
          </Route>
          <Route path={SIGNUP}>
            <SignUp />
          </Route>

          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AuthProvider>
  );
};

export default Routes;
