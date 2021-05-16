import React, { useState } from "react";

import { styled, withStyle } from "baseui";
import { Col as Column } from "../../../components/FlexBox/FlexBox";
import Input, { SIZE } from "../../Input/Input";

import { Wrapper, Header, Heading } from "../../WrapperStyle";

import {
  StyledTable,
  StyledHead as BaseStyledHead,
  StyledHeadCell as BaseStyledHeadCell,
  StyledBody as BaseStyledBody,
  //StyledCell as BaseStyledCell,
} from "baseui/table";

type CustomThemeT = { red400: string; textNormal: string; colors: any };

const Col = styled(Column, () => ({
  "@media only screen and (max-width: 767px)": {
    marginBottom: "20px",

    ":last-child": {
      marginBottom: 0,
    },
  },
}));

const TableWrapper = styled("div", () => ({
  width: "100%",
  height: "400px",
  padding: "0 25px 25px",
}));

const StyledHead = withStyle(BaseStyledHead, () => ({
  width: "100%",

  "@media only screen and (max-width: 767px)": {
    width: "1000px",
  },
}));

const StyledBody = withStyle(BaseStyledBody, () => ({
  width: "100%",

  "@media only screen and (max-width: 767px)": {
    width: "1000px",
  },
}));

const StyledHeadCell = withStyle(BaseStyledHeadCell, () => ({
  fontFamily: "'Lato', sans-serif",
  fontWeight: 700,
  color: "#161F6A !important",
}));

const SmallHeadCell = withStyle(StyledHeadCell, () => ({
  maxWidth: "70px",
}));

export default function Orders() {
  const [search, setSearch] = useState([]);

  function handleSearch(event) {
    const { value } = event.currentTarget;
    setSearch(value);
  }
  return (
    <Wrapper>
      <Header style={{ padding: "25px 10px" }}>
        <Col md={2}>
          <Heading>Orders</Heading>
        </Col>

        <Col md={10}>
          <Input
            value={search}
            size={SIZE.compact}
            placeholder="Quick Search"
            onChange={handleSearch}
            clearable
          />
        </Col>
      </Header>

      <TableWrapper>
        <StyledTable>
          <StyledHead $width="100%">
            <SmallHeadCell>Id</SmallHeadCell>
            <StyledHeadCell>Time</StyledHeadCell>
            <StyledHeadCell>Delivery Address</StyledHeadCell>
            <StyledHeadCell>Amount</StyledHeadCell>
            <StyledHeadCell>Payment Method</StyledHeadCell>
            <StyledHeadCell>Contact</StyledHeadCell>
            <StyledHeadCell>Status</StyledHeadCell>
          </StyledHead>
          <StyledBody $width="100%">{""}</StyledBody>
        </StyledTable>
      </TableWrapper>
    </Wrapper>
  );
}
