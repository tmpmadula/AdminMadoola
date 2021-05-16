import React from "react";
import InvoicePage from "../containers/Apps/Invoicing/components/InvoicePage";
//import "../../invoicing/scss/main.scss";
import "../containers/Apps/Invoicing/scss/main.scss";
type Props = any;

const FreeInvoice: React.FC<Props> = (props) => {
  return (
    <>
      <div className="app">
        <h1 className="center fs-30">Madoola Invoice Generator</h1>
        <InvoicePage />
      </div>
      <br />
    </>
  );
};

export default FreeInvoice;
