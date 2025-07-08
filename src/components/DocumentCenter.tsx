import React from "react";
import { StaffDocumentCenter } from "@/components/StaffDocumentCenter";
import { SupplierDocumentCenter } from "@/components/SupplierDocumentCenter";
import { VeterinarianDocumentCenter } from "@/components/VeterinarianDocumentCenter";
import { CustomerDocumentCenter } from "@/components/CustomerDocumentCenter";

interface DocumentCenterProps {
  userRole?: "staff" | "supplier" | "veterinarian" | "customer";
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({ userRole = "staff" }) => {
  switch (userRole) {
    case "staff":
      return <StaffDocumentCenter />;
    case "supplier":
      return <SupplierDocumentCenter />;
    case "veterinarian":
      return <VeterinarianDocumentCenter />;
    case "customer":
      return <CustomerDocumentCenter />;
    default:
      return <StaffDocumentCenter />;
  }
};