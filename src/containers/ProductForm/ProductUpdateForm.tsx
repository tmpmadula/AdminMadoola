import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Scrollbars } from "react-custom-scrollbars";
import { useDrawerDispatch, useDrawerState } from "../../context/DrawerContext";
import Uploader from "../../components/Uploader/Uploader";
import Button, { KIND } from "../../components/Button/Button";
import DrawerBox from "../../components/DrawerBox/DrawerBox";
import { Row, Col } from "../../components/FlexBox/FlexBox";
import Input from "../../components/Input/Input";
import { Textarea } from "../../components/Textarea/Textarea";
import Select from "../../components/Select/Select";
import { FormFields, FormLabel } from "../../components/FormFields/FormFields";
import { v1 } from "uuid";
import { Storage } from "aws-amplify";

import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from "../DrawerItems/DrawerItems.style";

import { gql, useMutation } from "@apollo/client";

const options = [
  { value: "Fruits & Vegetables", name: "Fruits & Vegetables", id: "1" },
  { value: "Meat & Fish", name: "Meat & Fish", id: "2" },
  { value: "Purse", name: "Purse", id: "3" },
  { value: "Hand bags", name: "Hand bags", id: "4" },
  { value: "Shoulder bags", name: "Shoulder bags", id: "5" },
  { value: "Wallet", name: "Wallet", id: "6" },
  { value: "Laptop bags", name: "Laptop bags", id: "7" },
  { value: "Women Dress", name: "Women Dress", id: "8" },
  { value: "Outer Wear", name: "Outer Wear", id: "9" },
  { value: "Pants", name: "Pants", id: "10" },
];

const typeOptions = [
  { value: "grocery", name: "Grocery", id: "1" },
  { value: "women-cloths", name: "Women Cloths", id: "2" },
  { value: "bags", name: "Bags", id: "3" },
  { value: "makeup", name: "Makeup", id: "4" },
];

type Props = any;

const DELETE_PRODUCT = gql`
  mutation($productId: String!) {
    removeProduct(id: $productId)
  }
`;

const AddProduct: React.FC<Props> = () => {
  const dispatch = useDrawerDispatch();
  const ProductData = useDrawerState("data");
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), [
    dispatch,
  ]);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: ProductData,
  });
  const [type, setType] = useState([{ value: ProductData.type }]);
  const [tag, setTag] = useState([]);
  const [description, setDescription] = useState(ProductData.description);
  React.useEffect(() => {
    register({ name: "type" });
    register({ name: "categories" });
    register({ name: "coverMedia" });
    register({ name: "description" });
  }, [register]);

  const handleMultiChange = ({ value }) => {
    setValue("categories", value);
    setTag(value);
  };
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue("description", value);
    setDescription(value);
  };

  const handleTypeChange = ({ value }) => {
    setValue("type", value);
    setType(value);
  };
  const handleUploader = (files) => {
    setValue("coverMedia", files[0].path);
  };

  const getImg = async () => {
    return await Storage.get(ProductData.coverMedia, { level: "public" });
  };

  const onSubmit = () => {
    const newProduct = {
      id: v1(),
      name: ProductData.name,
      type: ProductData.type[0].value,
      description: ProductData.description,
      coverMedia: ProductData.coverMedia,
      price: Number(ProductData.price),
      unit: ProductData.unit,
      salePrice: Number(ProductData.salePrice),
      discountInPercent: Number(ProductData.discountInPercent),
      quantity: Number(ProductData.quantity),
      slug: ProductData.name,
      creation_date: new Date(),
    };
    console.log(newProduct, "newProduct data");
    closeDrawer();
  };
  const [RemoveProduct] = useMutation(DELETE_PRODUCT, {
    variables: { productId: ProductData.id },
  });

  const handleDelete = async () => {
    await Storage.remove(ProductData.coverMedia, { level: "public" });
    RemoveProduct({
      variables: { productId: ProductData.id },
    });
    console.log("Product Deleted");
    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Update Product</DrawerTitle>
      </DrawerTitleWrapper>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{ height: "100%" }}
        noValidate
      >
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: "hidden" }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: "none" }}
              className="track-horizontal"
            />
          )}
        >
          <Row>
            <Col lg={4}>
              <FieldDetails>Upload your Product image here</FieldDetails>
            </Col>
            <Col lg={8}>
              <DrawerBox>
                <Uploader onChange={handleUploader} coverMediaURL={getImg()} />
              </DrawerBox>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add your Product description and necessary information from here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Name</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="name"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Unit</FormLabel>
                  <Input type="text" inputRef={register} name="unit" />
                </FormFields>

                <FormFields>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="price"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Sale Price</FormLabel>
                  <Input type="number" inputRef={register} name="salePrice" />
                </FormFields>

                <FormFields>
                  <FormLabel>Discount In Percent</FormLabel>
                  <Input
                    type="number"
                    inputRef={register}
                    name="discountInPercent"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Product Quantity</FormLabel>
                  <Input type="number" inputRef={register} name="quantity" />
                </FormFields>

                <FormFields>
                  <FormLabel>Type</FormLabel>
                  <Select
                    options={typeOptions}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Product Type"
                    value={type}
                    searchable={false}
                    onChange={handleTypeChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      OptionContent: {
                        style: ({ $theme, $selected }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $selected
                              ? $theme.colors.textDark
                              : $theme.colors.textNormal,
                          };
                        },
                      },
                      SingleValue: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 },
                            },
                          },
                        },
                      },
                    }}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Categories</FormLabel>
                  <Select
                    options={options}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Product Tag"
                    value={tag}
                    onChange={handleMultiChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 },
                            },
                          },
                        },
                      },
                    }}
                    multi
                  />
                </FormFields>
              </DrawerBox>
            </Col>
          </Row>
        </Scrollbars>

        <ButtonGroup>
          <Button
            kind={KIND.minimal}
            onClick={closeDrawer}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "50%",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  marginRight: "15px",
                  color: $theme.colors.red400,
                }),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            kind={KIND.minimal}
            onClick={handleDelete}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "50%",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  marginRight: "15px",
                  color: $theme.colors.red400,
                }),
              },
            }}
          >
            Delete
          </Button>
          <Button
            type="submit"
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "50%",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                }),
              },
            }}
          >
            Update Product
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;