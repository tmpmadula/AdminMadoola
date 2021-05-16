import React, { useContext, useState } from "react";
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Button, Form } from "../../components/Form";
import { Col, Row } from "../../components/FlexBox/FlexBox";
import DrawerBox from "../../components/DrawerBox/DrawerBox";
import Uploader from "../../components/Uploader/Uploader";
import imageCompression from "browser-image-compression";
import { gql, useMutation } from "@apollo/client";
import { Storage } from "aws-amplify";
import { AuthContext } from "../../context/auth";
import { v1 } from "uuid";

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

export const AddProduct = () => {
  const [id, setId] = useState(v1());
  const [name, setName] = useState("");
  const [type] = useState("");
  //const price = useState("");
  //const unit = useState("");
  const [description, setDescription] = React.useState("");

  const [categories, setCategories] = useState("");
  const [url, setUrl] = useState("");
  //const expiryDate = useState("");
  //const viewers = useState();
  const [productTags, setProductTags] = useState("");
  const { currentUser } = useContext(AuthContext);
  Storage.configure({ level: "public" });

  //let history = useHistory();
  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

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

  const [Product, { error: mutationError, loading }] = useMutation(
    CREATE_PRODUCT
  );
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
      productTags: productTags || "no",
      url: url || "no",
      viewers: 0,
      expiryDate: 0,
      type: type || "one",
      description: description,
      coverMedia: filename || "one",
      price: 0,
      unit: "i",
      slug: name || "nono",
      userid: currentUser?.userId,
      categories: categories || "one",
    };
    Product({
      variables: { pro: newProduct },
    });
    console.log("newProduct", newProduct);
    //history.push(PRODUCTS);
  };

  if (loading) return <p>Loading...</p>;
  if (mutationError) return <p>Error :( Please try again</p>;

  return (
    <Box>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            inputRef={register({ required: true, maxLength: 20 })}
            name="Add Title"
            onChange={(e) => setName(e.target.value)}
          />

          <FormLabel>Tags</FormLabel>
          <Input
            name="email"
            type="text"
            inputRef={register}
            onChange={(e) => setProductTags(e.target.value)}
          />

          <FormLabel>Category</FormLabel>
          <Input
            name="categories"
            type="text"
            inputRef={register}
            onChange={(e) => setCategories(e.target.value)}
          />

          <FormLabel>Link</FormLabel>
          <Input
            name="url"
            type="text"
            inputRef={register}
            onChange={(e) => setUrl(e.target.value)}
          />

          <FormLabel>Description</FormLabel>
          <Input
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            inputRef={register({ required: true, maxLength: 20 })}
          />

          <div>
            <Row>
              <Col md={6}>
                <FormLabel>Add Image</FormLabel>
                <DrawerBox>
                  <Uploader onChange={handleUploader} />
                </DrawerBox>
              </Col>
            </Row>
          </div>
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
          Submit
        </Button>
      </Form>
    </Box>
  );
};
