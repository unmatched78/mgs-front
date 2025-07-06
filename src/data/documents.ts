export interface Template {
  id: string;
  name: string;
  description: string;
  schema: { components: any[] }; // Formio schema
  created_at: string;
  updated_at: string;
  shop: number; // ShopProfile ID
}

export interface Document {
  id: string;
  template: string; // ID of the DocumentTemplate
  data: { schema?: { components: any[] }; [key: string]: any }; // Formio submission data
  created_by: string; // Username of the submitter
  created_at: string;
  status: "pending" | "approved" | "rejected";
}


export const pendingDocuments: Document[] = [
  {
    id: "101",
    title: "Slaughter Approval #45892",
    type: "Approval",
    status: "pending",
    date: "2023-06-10",
    submittedBy: "John Butcher",
  },
  {
    id: "102",
    title: "Health Certificate #12345",
    type: "Certificate",
    status: "pending",
    date: "2023-06-09",
    submittedBy: "Sarah Meats",
  },
  {
    id: "103",
    title: "Purchase Order #78901",
    type: "Order",
    status: "pending",
    date: "2023-06-08",
    submittedBy: "Quality Meats Inc.",
  },
];

export const repositoryDocuments: Document[] = [
  {
    id: "201",
    title: "Invoice #INV-2023-001",
    type: "Invoice",
    status: "approved",
    date: "2023-05-20",
    submittedBy: "System",
  },
  {
    id: "202",
    title: "Delivery Note #DEL-2023-042",
    type: "Delivery",
    status: "approved",
    date: "2023-05-25",
    submittedBy: "Jane Doe",
  },
  {
    id: "203",
    title: "Slaughter Certificate #SC-2023-015",
    type: "Certificate",
    status: "approved",
    date: "2023-05-18",
    submittedBy: "Dr. Smith",
  },
  {
    id: "204",
    title: "Purchase Order #PO-2023-089",
    type: "Order",
    status: "rejected",
    date: "2023-05-15",
    submittedBy: "Premium Beef Co.",
  },
];

