import React, { useContext, useRef, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Button, Form } from "../../components/Form";
import { Col, Row } from "../../components/FlexBox/FlexBox";
import Uploader from "../../components/Uploader/Uploader";
import imageCompression from "browser-image-compression";
import { gql, useMutation } from "@apollo/client";
import { Storage } from "aws-amplify";
import { AuthContext } from "../../context/auth";
import { v1 } from "uuid";
import { Divider } from "@material-ui/core";
import { Textarea } from "./../../components/Textarea/Textarea";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 500,
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
    },
  })
);

const CREATE_PRODUCT = gql`
  mutation addProduct($pro: ProductInput!) {
    addProduct(data: $pro) {
      id
      name
      coverMedia
      type
      userid
      unit
      categories
      price
      productTags
      url
      viewers
      description
      expiryDate
    }
  }
`;

interface ProductData {
  id: string;
  name: string;
  type: string;
  description: string;
  coverMedia: string;
  price: number;
  unit: string;
  productTags: string;
  url: string;
  viewers: string;
  expiryDate: string;
  quantity: number;
  slug: string;
}

type Props = {};

export const ProductForm = ({ isOpen, onClose }) => {
  const initialRef = useRef();
  const finalRef = useRef();
  const classes = useStyles();

  const [id, setId] = useState(v1());
  const [name, setName] = useState("");
  const [type] = useState("");
  const toast = useToast();
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [url, setUrl] = useState("");

  const [productTag, setProductTags] = useState([]);
  const { currentUser } = useContext(AuthContext);
  Storage.configure({ level: "public" });

  //let history = useHistory();
  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue("description", value);
    setDescription(value);
  };

  const handleUploader = async (files) => {
    const imageFile = files[0];

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 440,
      useWebWorker: true,
      maxIteration: 20,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);

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

  const [Product, { error: mutationError, loading }] =
    useMutation(CREATE_PRODUCT);
  if (loading) return <p>Loading...</p>;

  const onSubmit = async ({ image }) => {
    const filename = `${Date.now()}-${image}`;

    setId(v1());
    await Storage.put(filename, image, {
      contentType: image.type,
    });

    const newProduct = {
      id: id,
      name: name,
      productTags: productTag || "no",
      url: url || "no",
      viewers: 0,
      expiryDate: 0,
      type: type || "one",
      description: description,
      coverMedia: filename || "one",
      price: price || 0,
      unit: "i",
      slug: name || "nono",
      userid: currentUser?.userId,
      categories: categories || "one",
    };
    Product({
      variables: { pro: newProduct },
    });

    // refetch();
    toast({
      title: "Product Added :)",
      position: "top",
      isClosable: true,
    });
    onClose();
    // history.push(PRODUCTS);
  };

  if (loading) return <p>Loading...</p>;
  if (mutationError) return <p>Error :( Please try again</p>;
  //console.log(productTag);
  //let arr = Array(productTag.length).fill({});

  const tags = productTag.map((tag) => {
    console.log(productTag[0]);
    const filledArray = new Array(productTag.length).fill({ tag: 1 });

    filledArray[0].productTag[0] = v1();
    console.log(filledArray);
  });

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent backgroundColor="#f3f3f3">
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody size="xl">
          <Box>
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  inputRef={register({ required: true, maxLength: 20 })}
                  name="Add Title"
                  placeholder="Add Title"
                  onChange={(e) => setName(e.target.value)}
                />

                <FormLabel>Tags</FormLabel>
                <Input
                  name="email"
                  type="text"
                  placeholder="electronics"
                  inputRef={register}
                  //onChange={(e) => setProductTags(e.target.value)}
                />

                <Autocomplete
                  multiple
                  id="tags-filled"
                  options={[]}
                  //defaultValue={[top100Films[13].title]}
                  freeSolo
                  renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        {...setProductTags(value)}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="freeSolo"
                      placeholder="Favorites"
                    />
                  )}
                />

                <FormLabel>Category</FormLabel>
                <Input
                  name="categories"
                  type="text"
                  placeholder="hardware"
                  inputRef={register}
                  onChange={(e) => setCategories(e.target.value)}
                />

                <FormLabel>Price</FormLabel>
                <Input
                  name="categories"
                  type="number"
                  placeholder="hardware"
                  inputRef={register}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <FormLabel>Product Link</FormLabel>
                <Input
                  name="url"
                  type="text"
                  placeholder="https://site.com || App store"
                  inputRef={register}
                  onChange={(e) => setUrl(e.target.value)}
                />

                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={handleDescriptionChange}
                />

                <Divider />
                <Row>
                  <Col md={6}>
                    <FormLabel>Add Image</FormLabel>

                    <Uploader onChange={handleUploader} />
                  </Col>
                </Row>
              </FormControl>

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
                Publish
              </Button>
            </Form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
