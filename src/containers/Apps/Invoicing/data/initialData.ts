import { ProductLine, Invoice } from "./types";

export const initialProductLine: ProductLine = {
  description: "",
  quantity: "1",
  rate: "0.00",
};

export const initialInvoice: Invoice = {
  title: "INVOICE",
  companyName: "",
  name: "",
  companyAddress: "",
  companyAddress2: "",
  companyCountry: "South Africa",
  billTo: "Bill To:",
  clientName: "",
  clientAddress: "",
  clientAddress2: "",
  clientCountry: "South Africa",
  invoiceTitleLabel: "Invoice#",
  invoiceTitle: "",
  invoiceDateLabel: "Invoice Date",
  invoiceDate: "",
  invoiceDueDateLabel: "Due Date",
  invoiceDueDate: "",
  productLineDescription: "Item Description",
  productLineQuantity: "Qty",
  productLineQuantityRate: "Rate",
  productLineQuantityAmount: "Amount",
  productLines: [
    {
      description: "Brochure Design",
      quantity: "2",
      rate: "100.00",
    },
    { ...initialProductLine },
    { ...initialProductLine },
  ],
  subTotalLabel: "Sub Total",
  taxLabel: "Sale Tax (10%)",
  totalLabel: "TOTAL",
  currency: "R",
  notesLabel: "Notes",
  notes: "It was great doing business with you.",
  termLabel: "Terms & Conditions",
  term: "Please make the payment by the due date.",
};
