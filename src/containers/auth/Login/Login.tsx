import React, { useContext, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../../context/auth";
import { Auth } from "aws-amplify";

import { Button, Divider, Heading, Spacer, useToast } from "@chakra-ui/react";

import { Link as RouterLink } from "react-router-dom";

import Link from "@material-ui/core/Link";
import {
  FormFields,
  FormLabel,
  Error,
} from "../../../components/FormFields/FormFields";
import { Wrapper, FormWrapper, LogoImage, LogoWrapper } from "./Login.style";
import Logoimage from "../../../image/m.png";
import Input from "../../../components/Input/Input";

import { SIGNUP, RESETPASSWORD } from "../../../settings/constants";
import TextField from "@material-ui/core/TextField";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { isEmpty } from "lodash-es";

const initialValues = {
  username: "",
  password: "",
};

const getLoginValidationSchema = () => {
  return Yup.object().shape({
    username: Yup.string().required("Username is Required!"),
    password: Yup.string().required("Password is Required!"),
  });
};

const MyInput = ({ field, form, ...props }) => {
  return <Input {...field} {...props} />;
};

export default () => {
  let history = useHistory();

  const { refetchUser, userHasAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, showConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const toast = useToast();

  const [helperTexts, setHelperText] = useState({
    confirmation: "",
    other: "",
  });

  let login = async ({ username, password }) => {
    try {
      await Auth.signIn(username, password);
      setUsername(username);
      setPassword(password);
      userHasAuthenticated(true);
      refetchUser();
      history.push("/");
    } catch (e) {
      setUsername(username);
      if (e.code === "UserNotConfirmedException") {
        showConfirmation(true);
      }
      setHelperText({
        ...helperTexts,
        other: e.message,
      });

      toast({
        title: e.message,
        position: "top",
        isClosable: true,
      });
    }
  };

  const handleConfirmationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!isEmpty(confirmationCode)) {
      try {
        await Auth.confirmSignUp(username, confirmationCode);
        await Auth.signIn(username, password);

        userHasAuthenticated(true);
        console.log("created user successfully");
        history.push("/");
      } catch (e) {
        setConfirmationCode("");
        showConfirmation(true);
        console.log(e);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const resendSignup = async () => {
    try {
      if (!username) return console.log("no user");
      await Auth.resendSignUp(username);
      console.log("We sent you a new verification code");
    } catch (error) {
      console.log("Error sending new code.", { variant: "error" });
    }
  };

  const confirmationForm = () => {
    return (
      <div>
        <Dialog open={confirmation} aria-labelledby="form-dialog-title">
          <form
            name="confirmation"
            //className={classes.form}
            noValidate
            onSubmit={handleConfirmationSubmit}
          >
            <DialogContent>
              <DialogContentText>
                please enter the confirmation code sent to your email address
                here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label="Confirmation Code"
                type="code"
                onChange={(e) => setConfirmationCode(e.target.value)}
                fullWidth
              />
            </DialogContent>

            <DialogActions>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                //className={classes.submit}
              >
                Sign Up
              </Button>

              <Button onClick={resendSignup}>Resend verification code</Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  };

  return (
    <Wrapper>
      <Link component={RouterLink} to={SIGNUP} variant="body2"></Link>

      <FormWrapper>
        <FormFields>
          <LogoWrapper>
            <LogoImage src={Logoimage} alt="pickbazar-admin" />
          </LogoWrapper>
        </FormFields>
        <Button
          colorScheme="orange"
          variant="solid"
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: "100%",
                marginLeft: "auto",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
                borderBottomLeftRadius: "3px",
                borderBottomRightRadius: "3px",
              }),
            },
          }}
        >
          <NavLink to={SIGNUP} exact={false}>
            {"Not a Member? Sign Up Now"}
          </NavLink>
        </Button>
        <Formik
          initialValues={initialValues}
          onSubmit={login}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <Spacer />
              <Divider />
              <FormFields>
                <Heading size="md">Sign in to Planturion</Heading>
              </FormFields>
              <FormFields>
                <FormLabel>Email</FormLabel>
                <Field
                  type="email"
                  name="username"
                  component={MyInput}
                  //placeholder="joe@Planturion.com"
                />
                {errors.username && touched.username && (
                  <Error>{errors.username}</Error>
                )}
              </FormFields>
              <FormFields>
                <FormLabel>Password</FormLabel>
                <Field
                  type="password"
                  name="password"
                  component={MyInput}
                  helperText="Some important text"
                  // placeholder="P@ssw0rd@"
                />
                {errors.password && touched.password && (
                  <Error>{errors.password}</Error>
                )}
              </FormFields>
              <Button
                colorScheme="orange"
                variant="solid"
                type="submit"
                disabled={isSubmitting}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      width: "100%",
                      marginLeft: "auto",
                      borderTopLeftRadius: "3px",
                      borderTopRightRadius: "3px",
                      borderBottomLeftRadius: "3px",
                      borderBottomRightRadius: "3px",
                    }),
                  },
                }}
              >
                Submit
              </Button>

              <FormFields>
                <Link component={RouterLink} to={RESETPASSWORD} variant="body2">
                  {"Forgot your password?"}
                </Link>
              </FormFields>
            </Form>
          )}
          validationSchema={getLoginValidationSchema}
        />
      </FormWrapper>

      {confirmationForm()}
    </Wrapper>
  );
};
