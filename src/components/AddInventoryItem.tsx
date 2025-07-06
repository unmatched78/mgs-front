// src/components/dashboard/AddInventoryItem.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";

interface Cow {
  id: string;
  tag_number: string;
  status: "approved" | "pending" | "rejected" | "partial-rejection";
}

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  company_name: string;
}

interface AddInventoryItemProps {
  onItemAdded: () => void; // Callback to refetch inventory
}

const AddInventoryItem: React.FC<AddInventoryItemProps> = ({ onItemAdded }) => {
  const { user, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [createCowOpen, setCreateCowOpen] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [cows, setCows] = useState<Cow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [newItem, setNewItem] = useState<{
    cow_id: string;
    category_id: string;
    quantity: string;
    price_per_kg:string;
    batch_no: string;
    supplier_id?: string;
  }>({
    cow_id: "",
    category_id: "",
    quantity: "",
    price_per_kg:"",
    batch_no: "",
    supplier_id: "",
  });
  const [newCow, setNewCow] = useState<{
    tag_number: string;
    status: "approved" | "pending" | "rejected" | "partial-rejection";
  }>({
    tag_number: "",
    status: "pending",
  });
  const [newCategory, setNewCategory] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  // Fetch cows, categories, and suppliers on mount
  useEffect(() => {
    async function fetchData() {
      if (authLoading || !user || user.role !== "shop") return;
      try {
        const [cowsResponse, categoriesResponse, suppliersResponse] = await Promise.all([
          api.get<Cow[]>("/inventory/cows/"),
          api.get<Category[]>("/inventory/categories/"),
          api.get<Supplier[]>("/suppliers/"),
        ]);
        console.log("Cows response:", cowsResponse.data);
        console.log("Categories response:", categoriesResponse.data);
        console.log("Suppliers response:", suppliersResponse.data);
        setCows(Array.isArray(cowsResponse.data) ? cowsResponse.data : []);
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
        setSuppliers(Array.isArray(suppliersResponse.data) ? suppliersResponse.data : []);
      } catch (err: any) {
        console.error("Fetch error:", err.response?.data || err.message);
        toast.error("Failed to load data: " + (err.response?.data?.detail || err.message));
      }
    }
    fetchData();
  }, [authLoading, user]);

  // Handle cow creation
  const handleCreateCow = async () => {
    if (!newCow.tag_number) {
      toast.error("Please enter a tag number for the cow");
      return;
    }
    try {
      const response = await api.post<Cow>("/inventory/cows/", {
        tag_number: newCow.tag_number,
        status: newCow.status,
      });
      console.log("Created cow:", response.data);
      setCows((prev) => [...prev, response.data]);
      setNewItem({ ...newItem, cow_id: String(response.data.id) });
      setCreateCowOpen(false);
      setNewCow({ tag_number: "", status: "pending" });
      toast.success(`Cow ${response.data.tag_number} created successfully`);
    } catch (err: any) {
      console.error("Create cow error:", err.response?.data || err.message);
      toast.error(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to create cow");
    }
  };

  // Handle category creation
  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      const response = await api.post<Category>("/inventory/categories/", {
        name: newCategory.name,
        description: newCategory.description,
      });
      console.log("Created category:", response.data);
      setCategories((prev) => [...prev, response.data]);
      setNewItem({ ...newItem, category_id: String(response.data.id) });
      setCreateCategoryOpen(false);
      setNewCategory({ name: "", description: "" });
      toast.success(`Category ${response.data.name} created successfully`);
    } catch (err: any) {
      console.error("Create category error:", err.response?.data || err.message);
      toast.error(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to create category");
    }
  };

  // Handle adding meat to inventory
  const handleAddItem = async () => {
    if (!newItem.cow_id || !newItem.category_id || !newItem.quantity || !newItem.price_per_kg) {
      toast.error("Please select a cow, category, and enter a quantity");
      return;
    }
    const quantity = parseFloat(newItem.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity greater than 0");
      return;
    }
    //for price per kgs
    const price_per_kg = parseFloat(newItem.price_per_kg);
    if (isNaN(price_per_kg) || price_per_kg <= 0) {
      toast.error("Please enter a valid quantity greater than 0");
      return;
    }
    const selectedCow = cows.find((cow) => cow.id === newItem.cow_id);
    if (selectedCow && selectedCow.status !== "approved") {
      toast.error("Only approved cows can have meat added to stock");
      return;
    }
    try {
      const response = await api.post("/inventory/entries/", {
        cow: newItem.cow_id,
        category: newItem.category_id,
        quantity: quantity,
        price_per_kg:newItem.price_per_kg,
        batch_no: newItem.batch_no,
        supplier: newItem.supplier_id === "none" ? null : newItem.supplier_id,
      });
      console.log("Created stock entry:", response.data);
      setNewItem({ cow_id: "", category_id: "", quantity: "", batch_no: "", supplier_id: "", price_per_kg: "" });
      setOpen(false);
      onItemAdded();
      toast.success("Meat added to inventory successfully");
    } catch (err: any) {
      console.error("Add item error:", err.response?.data || err.message);
      toast.error(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to add meat to inventory");
    }
  };

  return (
    <>
      {/* Main Dialog for Adding Inventory Item */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add New Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meat to Inventory</DialogTitle>
            <DialogDescription>
              Select a cow and category, then enter the total meat weight after slaughtering.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Cow</Label>
              <Select
                value={newItem.cow_id}
                onValueChange={(value) => {
                  if (value === "create_new") {
                    setCreateCowOpen(true);
                  } else {
                    setNewItem({ ...newItem, cow_id: value });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create_new">Create New Cow</SelectItem>
                  {cows.map((cow) => (
                    <SelectItem key={cow.id} value={cow.id}>
                      {cow.tag_number} ({cow.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={newItem.category_id}
                onValueChange={(value) => {
                  if (value === "create_new") {
                    setCreateCategoryOpen(true);
                  } else {
                    setNewItem({ ...newItem, category_id: value });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create_new">Create New Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Total Meat Weight (kg)</Label>
              <Input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="Enter weight in kilograms"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <Label>price_per_kg (kg)</Label>
              <Input
                type="number"
                value={newItem.price_per_kg}
                onChange={(e) => setNewItem({ ...newItem, price_per_kg: e.target.value })}
                placeholder="Enter unit price"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label>Batch Number (Optional)</Label>
              <Input
                value={newItem.batch_no}
                onChange={(e) => setNewItem({ ...newItem, batch_no: e.target.value })}
                placeholder="Enter batch number"
              />
            </div>
            <div>
              <Label>Supplier (Optional)</Label>
              <Select
                value={newItem.supplier_id}
                onValueChange={(value) => setNewItem({ ...newItem, supplier_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add to Inventory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Cow Dialog */}
      <Dialog open={createCowOpen} onOpenChange={setCreateCowOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Cow</DialogTitle>
            <DialogDescription>Enter details for the new cow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tag Number</Label>
              <Input
                value={newCow.tag_number}
                onChange={(e) => setNewCow({ ...newCow, tag_number: e.target.value })}
                placeholder="Enter tag number (e.g., COW123)"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={newCow.status}
                onValueChange={(value) =>
                  setNewCow({ ...newCow, status: value as "approved" | "pending" | "rejected" | "partial-rejection" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="partial-rejection">Partial-rejection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCowOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCow}>Create Cow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>Enter details for the new category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name (e.g., Beef)"
              />
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Enter category description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddInventoryItem;