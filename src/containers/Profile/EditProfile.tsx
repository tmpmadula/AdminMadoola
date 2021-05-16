import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
//import { useHistory } from "react-router-dom";
import Uploader from "../../components/Uploader/Uploader";
import Input from "../../components/Input/Input";
//import { Textarea } from "../../components/Textarea/Textarea";

import Button from "../../components/Button/Button";
import DrawerBox from "../../components/DrawerBox/DrawerBox";
import {
  Grid,
  Row as Rows,
  Col as Column,
} from "../../components/FlexBox/FlexBox";
import { Form } from "../DrawerItems/DrawerItems.style";
import "react-google-places-autocomplete/dist/index.min.css";
import { FormFields, FormLabel } from "../../components/FormFields/FormFields";
import { AuthContext } from "../../context/auth";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Storage, Auth } from "aws-amplify";
import { InLineLoader } from "../../components/InlineLoader/InlineLoader";
import {
  Button as CButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  FormControl,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { v1 } from "uuid";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import { useHistory } from "react-router";
import imageCompression from "browser-image-compression";
import { styled } from "baseui";

const CREATE_USER = gql`
  mutation addUser($user: UserInput!) {
    addUser(data: $user) {
      id
    }
  }
`;

const UPDATE_ADDRESS = gql`
  mutation updateUserAddress($id: String!, $data: AddressInput!) {
    updateUserAddress(id: $id, data: $data) {
      addresses {
        id
        street
        city
        state
        country
        code
      }
    }
  }
`;

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      firstname
      lastname
      avatar
      #email
      addresses {
        street
      }
    }
  }
`;

export const Col = styled(Column, () => ({
  "@media only screen and (max-width: 767px)": {
    marginBottom: "20px",

    ":last-child": {
      marginBottom: 0,
    },
  },
}));

const Row = styled(Rows, () => ({
  "@media only screen and (min-width: 768px) and (max-width: 991px)": {
    alignItems: "center",
  },
}));

type User = {
  userId: string;
};
type Props = {};

const ProfileUpdateForm: React.FC<Props> = () => {
  const { register, handleSubmit, formState, setValue } = useForm();
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const toast = useToast();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [tUser, setCurrentUser] = useState<User | undefined>();
  //const [description, setDescription] = React.useState("");
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isSubmitting } = formState;

  const initialRef = React.useRef();
  const finalRef = React.useRef();

  Storage.configure({ level: "public" });

  const initialState = {
    street: "",
    suburb: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
  };

  const [state, setState] = useState(initialState);

  const populateAddressFromAutocomplete = (response) => {
    geocodeByPlaceId(response.place_id)
      .then((results) => {
        if (!results[0].address_components) {
          console.error(
            "populateAddressFromAutocomplete: No address components."
          );
          return;
        }
        const fullAddress: any = results[0].address_components;

        const city = fullAddress.filter((item: any) =>
          item.types.includes("locality", "administrative_area_level_2")
        );
        const postalCode = fullAddress.filter((item: any) =>
          item.types.includes("postal_code")
        );
        const regionName = fullAddress.filter((item: any) =>
          item.types.includes("administrative_area_level_1")
        );
        const country = fullAddress.filter((item: any) =>
          item.types.includes("country")
        );

        setState((prevState) => ({
          ...prevState,
          street: `${response.terms[0]?.value}, ${response.terms[1]?.value}`,

          city: city[0]?.long_name || "",
          state: regionName[0]?.long_name || "",
          postalCode: postalCode[0]?.long_name || "",
          country: country[0]?.long_name || "",
        }));

        // showAddressFields();
        // TODO hide autocomplete field, reveal full address fields.
      })
      .catch((error) => console.error("geocodeByPlaceId error", error));
  };
  const setValu = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleUploader = async (files) => {
    // console.log(files);
    const imageFile = files[0];
    //console.log("originalFile instanceof Blob", imageFile instanceof Blob);
    //console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 440,
      useWebWorker: true,
      maxIteration: 20,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      // console.log("compressedFile instanceof Blob",compressedFile instanceof Blob);
      //console.log(        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`      );
      setValue("image", compressedFile);
      // await uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    register({ name: "reactSelect" });
    register({ name: "image" });
  }, [register]);

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

  const currentRoute = window.location.hash;
  const newstr = currentRoute.substr(-36);

  const id = newstr.search("profile") === -1 ? newstr : tUser;

  const { data, loading, refetch } = useQuery(GET_USER, {
    variables: { id: id },
  });

  const [addUser, { error: mutationError }] = useMutation(CREATE_USER);

  const onSubmit = async ({ image }) => {
    if (!image) {
      //const filename = ;
      console.log(data.getUser.avatar);
      const newUser = {
        id: currentUser?.userId,
        firstname: firstname || data.getUser.firstname,
        lastname: lastname || data.getUser.lastname,
        email: currentUser?.email || email,
        avatar: data.getUser.avatar,
        followers: {
          follow_id: 0,
        },
        following: { following_id: 0 },
        addresses: {
          id: 0,
          street: "",
          city: "",
          code: "",
          state: "",
          country: "",
        },
      };
      await addUser({
        variables: { user: newUser },
      });
      history.go(0);
    } else {
      const filename = `${Date.now()}-${image.name}`;

      await Storage.put(filename, image, {
        contentType: image.type,
      });
      console.log(filename);
      const newUser = {
        id: currentUser?.userId,
        firstname: firstname || data.getUser.firstname,
        lastname: lastname || data.getUser.lastname,
        email: currentUser?.email || email,
        avatar: filename || data.getUser.firstname,
        followers: {
          follow_id: 0,
        },
        following: { following_id: 0 },
        addresses: {
          id: 0,
          street: "",
          city: "",
          code: "",
          state: "",
          country: "",
        },
      };
      await addUser({
        variables: { user: newUser },
      });

      refetch();
      toast({
        title: "Profile Updated :)",
        position: "top",
        isClosable: true,
      });
      history.go(0);
    }
    //const data = Storage.get(image);
    //console.log(newUser, "newUser");
  };
  const [updateUserAddress] = useMutation(UPDATE_ADDRESS);
  const UpdateAddress = async () => {
    try {
      const newAddress = {
        addresses: {
          id: v1(),
          street: state.street,
          city: state.city,
          code: state.postalCode,
          state: state.state,
          country: state.country,
        },
      };
      await updateUserAddress({
        variables: { id: currentUser?.userId, data: newAddress },
      });

      //console.log(currentUser?.userId, newAddress, "newAddress");
      onClose();
      history.go(0);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading)
    return (
      <p>
        <InLineLoader />
      </p>
    );
  // if (error) return <p>error</p>;
  if (mutationError) return <p>Error :( Please try again</p>;

  return (
    <>
      {data ? (
        data.getUser && data.getUser.length !== 0 ? (
          <Grid fluid={true}>
            <>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                style={{ paddingBottom: 0 }}
                noValidate
              >
                <Row>
                  <Col md={8}>
                    <DrawerBox>
                      <Uploader
                        onChange={handleUploader}
                        // imageURL={data.getUser.avatar}
                      />
                    </DrawerBox>
                  </Col>
                </Row>

                <Row>
                  <Col md={8}>
                    <DrawerBox>
                      <FormFields>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          inputRef={register({
                            //required: true,
                            maxLength: 20,
                          })}
                          name="firstName"
                          placeholder={data.getUser.firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </FormFields>
                      <FormFields>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          inputRef={register({
                            //required: ,
                            maxLength: 20,
                          })}
                          name="lastName"
                          onChange={(e) => setLastname(e.target.value)}
                          placeholder={data.getUser.lastname}
                        />
                      </FormFields>
                      <FormFields>
                        <FormLabel>Email</FormLabel>
                        <Input
                          inputRef={register({
                            required: false,
                            maxLength: 20,
                          })}
                          name="email"
                          disabled
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={currentUser?.email}
                        />
                      </FormFields>

                      <FormFields>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                width: "50%",
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
                      </FormFields>
                    </DrawerBox>
                  </Col>
                </Row>
              </Form>
              <br />
              <Form
                //onSubmit={handleSubmit(onSubmit)}
                style={{ paddingBottom: 0 }}
              >
                <Row>
                  <Col md={8}>
                    <DrawerBox>
                      <FormFields>
                        <FormLabel>Location</FormLabel>
                        <Input
                          inputRef={register({
                            required: false,
                            maxLength: 20,
                          })}
                          name="addresses"
                          disabled
                          placeholder={data.getUser.addresses[0].street}
                        />
                        <Button onClick={onOpen}>Update Location</Button>
                        <Modal
                          initialFocusRef={initialRef}
                          finalFocusRef={finalRef}
                          isOpen={isOpen}
                          onClose={onClose}
                        >
                          <form
                            name="updateaddress"
                            //className={classes.form}
                            noValidate
                            onSubmit={UpdateAddress}
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <GooglePlacesAutocomplete
                                apiKey="AIzaSyBubK54aeUT7oVkduqNTiVtTJykosyKEOo"
                                onSelect={populateAddressFromAutocomplete}
                                idPrefix="new-address"
                                placeholder="enter address"
                              />
                              <ModalCloseButton />
                              <ModalBody pb={6}>
                                <FormControl>
                                  <FormLabel>Street name</FormLabel>
                                  <Input
                                    ref={initialRef}
                                    placeholder={state.street || "Street Name"}
                                    onChange={(e) =>
                                      setValu("street", e.target.value)
                                    }
                                  />
                                </FormControl>

                                <FormControl mt={4}>
                                  <FormLabel>City</FormLabel>
                                  <Input
                                    placeholder={state.city}
                                    onChange={(e) =>
                                      setValu("city", e.target.value)
                                    }
                                  />
                                </FormControl>

                                <FormControl mt={4}>
                                  <FormLabel>State/Province</FormLabel>
                                  <Input
                                    placeholder={state.state}
                                    onChange={(e) =>
                                      setValu("state", e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormControl mt={4}>
                                  <FormLabel>Code</FormLabel>
                                  <Input
                                    placeholder={state.postalCode}
                                    onChange={(e) =>
                                      setValu("postalCode", e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormControl mt={4}>
                                  <FormLabel>Country</FormLabel>
                                  <Input
                                    placeholder={state.country}
                                    onChange={(e) =>
                                      setValu("country", e.target.value)
                                    }
                                  />
                                </FormControl>
                              </ModalBody>

                              <ModalFooter>
                                <CButton
                                  type="submit"
                                  colorScheme="blue"
                                  mr={3}
                                  variant="outline"
                                >
                                  Save
                                </CButton>
                                <CButton onClick={onClose}>Cancel</CButton>
                              </ModalFooter>
                            </ModalContent>
                          </form>
                        </Modal>
                      </FormFields>
                    </DrawerBox>
                  </Col>
                </Row>
              </Form>
            </>
          </Grid>
        ) : (
          <Grid fluid={true}>
            <>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                style={{ paddingBottom: 0 }}
              >
                <Row>
                  <Col md={8}>
                    <DrawerBox>
                      <Uploader onChange={handleUploader} />
                    </DrawerBox>
                  </Col>
                </Row>

                <Row>
                  <Col md={8}>
                    <DrawerBox>
                      <FormFields>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          inputRef={register({ required: true, maxLength: 20 })}
                          name="firstName"
                          // placeholder={data.getUser.firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </FormFields>
                      <FormFields>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          inputRef={register({
                            required: true,
                            maxLength: 20,
                          })}
                          name="lastName"
                          onChange={(e) => setLastname(e.target.value)}
                        />
                      </FormFields>
                      <FormFields>
                        <FormLabel>Email</FormLabel>
                        <Input
                          inputRef={register({
                            required: false,
                            maxLength: 20,
                          })}
                          name="email"
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={currentUser?.email}
                        />
                      </FormFields>
                      <FormFields>
                        <FormLabel>Address</FormLabel>
                        <Input
                          inputRef={register({
                            required: false,
                            maxLength: 20,
                          })}
                          name="addresses"
                          //placeholder={data.getUser.addresses[0].street}
                        />
                        <Button onClick={onOpen}>Update Address</Button>
                        <Modal
                          initialFocusRef={initialRef}
                          finalFocusRef={finalRef}
                          isOpen={isOpen}
                          onClose={onClose}
                        >
                          <form
                            name="updateaddress"
                            //className={classes.form}
                            noValidate
                            onSubmit={UpdateAddress}
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <GooglePlacesAutocomplete
                                apiKey="AIzaSyBubK54aeUT7oVkduqNTiVtTJykosyKEOo"
                                onSelect={populateAddressFromAutocomplete}
                                idPrefix="new-address"
                                placeholder="enter address"
                              />
                              <ModalCloseButton />
                              <ModalBody pb={6}>
                                <FormControl>
                                  <FormLabel>Street name</FormLabel>
                                  <Input
                                    ref={initialRef}
                                    placeholder={state.street || "Street Name"}
                                    onChange={(e) =>
                                      setValu("street", e.target.value)
                                    }
                                  />
                                </FormControl>

                                <FormControl mt={4}>
                                  <FormLabel>City</FormLabel>
                                  <Input
                                    placeholder={state.city}
                                    onChange={(e) =>
                                      setValu("city", e.target.value)
                                    }
                                  />
                                </FormControl>

                                <FormControl mt={4}>
                                  <FormLabel>State/Province</FormLabel>
                                  <Input
                                    placeholder={state.state}
                                    onChange={(e) =>
                                      setValu("state", e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormControl mt={4}>
                                  <FormLabel>Code</FormLabel>
                                  <Input
                                    placeholder={state.postalCode}
                                    onChange={(e) =>
                                      setValu("postalCode", e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormControl mt={4}>
                                  <FormLabel>Country</FormLabel>
                                  <Input
                                    placeholder={state.country}
                                    onChange={(e) =>
                                      setValu("country", e.target.value)
                                    }
                                  />
                                </FormControl>
                              </ModalBody>

                              <ModalFooter>
                                <CButton
                                  type="submit"
                                  colorScheme="blue"
                                  mr={3}
                                  variant="outline"
                                >
                                  Save
                                </CButton>
                                <CButton onClick={onClose}>Cancel</CButton>
                              </ModalFooter>
                            </ModalContent>
                          </form>
                        </Modal>
                      </FormFields>

                      <FormFields>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                width: "50%",
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
                      </FormFields>
                    </DrawerBox>
                  </Col>
                </Row>
              </Form>
            </>
          </Grid>
        )
      ) : (
        <Grid fluid={true}>
          <>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              style={{ paddingBottom: 0 }}
            >
              <Row>
                <Col md={8}>
                  <DrawerBox>
                    <Uploader onChange={handleUploader} />
                  </DrawerBox>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <DrawerBox>
                    <FormFields>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        inputRef={register({ required: true, maxLength: 20 })}
                        name="firstName"
                        // placeholder={data.getUser.firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </FormFields>
                    <FormFields>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        inputRef={register({
                          required: true,
                          maxLength: 20,
                        })}
                        name="lastName"
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </FormFields>
                    <FormFields>
                      <FormLabel>Email</FormLabel>
                      <Input
                        inputRef={register({
                          required: false,
                          maxLength: 20,
                        })}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={currentUser?.email}
                      />
                    </FormFields>
                    <FormFields>
                      <FormLabel>Address</FormLabel>
                      <Input
                        inputRef={register({
                          required: false,
                          maxLength: 20,
                        })}
                        name="addresses"
                        //placeholder={data.getUser.addresses[0].street}
                      />
                    </FormFields>

                    <FormFields>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        overrides={{
                          BaseButton: {
                            style: ({ $theme }) => ({
                              width: "50%",
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
                    </FormFields>
                  </DrawerBox>
                </Col>
              </Row>
            </Form>
          </>
        </Grid>
      )}
    </>
  );
};

export default ProfileUpdateForm;
