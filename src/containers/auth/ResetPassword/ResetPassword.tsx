import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../../context/auth";
import { Auth } from "aws-amplify";
import {
  FormFields,
  FormLabel,
  FormTitle,
  Error,
} from "../../../components/FormFields/FormFields";
import {
  Wrapper,
  FormWrapper,
  LogoImage,
  LogoWrapper,
} from "./ResetPassword.style";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Logoimage from "../../../image/m.png";
import TextField from "@material-ui/core/TextField";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { useToast } from "@chakra-ui/react";

const initialValues = {
  username: "",
  password: "",
};

const getResetPasswordValidationSchema = () => {
  return Yup.object().shape({
    username: Yup.string().required("Username is Required!"),
  });
};

const MyInput = ({ field, form, ...props }) => {
  return <Input {...field} {...props} />;
};

export default () => {
  let history = useHistory();

  const { userHasAuthenticated } = useContext(AuthContext);

  const toast = useToast();
  const [confirmation, showConfirmation] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  let resetpassword = async ({ username }) => {
    try {
      await Auth.forgotPassword(username);
      setUsername(username);
      showConfirmation(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleConfirmationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log(username);
    try {
      await Auth.forgotPasswordSubmit(username, confirmationCode, password);
      userHasAuthenticated(true);

      console.log("password reset");
      history.push("/");
    } catch (e) {
      console.log(e);
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
            noValidate
            onSubmit={handleConfirmationSubmit}
          >
            <DialogContent>
              <DialogContentText>
                To reset your password, please enter the confirmation code sent
                to your email address here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label="Confirmation code"
                type="code"
                onChange={(e) => setConfirmationCode(e.target.value)}
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="New Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
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
                Reset Password
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
        <Formik
          initialValues={initialValues}
          onSubmit={resetpassword}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FormFields>
                <LogoWrapper>
                  <LogoImage src={Logoimage} alt="pickbazar-admin" />
                </LogoWrapper>
              </FormFields>
              <FormTitle>Reset Password</FormTitle>
              <FormFields>
                <FormLabel>Username</FormLabel>
                <Field
                  type="username"
                  name="username"
                  component={MyInput}
                  placeholder="Ex: demo@demo.com"
                />
                {errors.username && touched.username && (
                  <Error>{errors.username}</Error>
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
          validationSchema={getResetPasswordValidationSchema}
        />
      </FormWrapper>
      {confirmationForm()}
    </Wrapper>
  );
};
