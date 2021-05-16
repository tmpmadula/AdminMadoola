import React, { useContext, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../../context/auth";
import { Auth } from "aws-amplify";
import {
  FormFields,
  FormLabel,
  Error,
} from "../../../components/FormFields/FormFields";
import { Wrapper, FormWrapper, LogoImage, LogoWrapper } from "./SignUp.style";
import Input from "../../../components/Input/Input";
import Logoimage from "../../../image/m.png";
import { isEmpty } from "lodash-es";
import TextField from "@material-ui/core/TextField";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { Button, Divider, Heading, Spacer, useToast } from "@chakra-ui/react";
import { LOGIN } from "../../../settings/constants";

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

  const [confirmation, showConfirmation] = useState(false);

  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  let signup = async ({ username, password }) => {
    Auth.signUp({
      username: username,
      password,
    })
      .then((user) => {
        setUsername(username);
        setPassword(password);
        showConfirmation(true);
      })
      .catch((err) => {
        if (err.code === "UserNotConfirmedException") {
          showConfirmation(true);
        }
        console.log(err);
        toast({
          title: err.message,
          position: "top",
          isClosable: true,
        });
      });
  };

  const handleConfirmationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!isEmpty(confirmationCode)) {
      try {
        await Auth.confirmSignUp(username, confirmationCode);
        setUsername(username);
        await Auth.signIn(username, password);
        userHasAuthenticated(true);
        refetchUser();
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

      toast({
        title: "We sent you a new verification code",
        position: "top",
        isClosable: true,
      });
      console.log("We sent you a new verification code");
    } catch (error) {
      toast({
        title: "Error sending new code.",
        position: "top",
        isClosable: true,
      });
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
                To create your account successfully, please enter the
                confirmation code sent to your email address here.
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
      <FormWrapper>
        <FormFields>
          <LogoWrapper>
            <LogoImage src={Logoimage} alt="Planturion" />
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
          <NavLink to={LOGIN} exact={false}>
            {"Already a member? Sign In"}
          </NavLink>
        </Button>
        <Formik
          initialValues={initialValues}
          onSubmit={signup}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <Spacer />
              <Divider />
              <FormFields>
                <Heading size="md">Sign up to Planturion</Heading>
              </FormFields>

              <FormFields>
                <FormLabel>Email</FormLabel>
                <Field
                  type="username"
                  name="username"
                  component={MyInput}
                  // placeholder="joe@Planturion.com"
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
                  //placeholder="p@ssw0d"
                />
                {errors.password && touched.password && (
                  <Error>{errors.password}</Error>
                )}
              </FormFields>
              <Button
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
            </Form>
          )}
          validationSchema={getLoginValidationSchema}
        />
      </FormWrapper>
      {confirmationForm()}
    </Wrapper>
  );
};
