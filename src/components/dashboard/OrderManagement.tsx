import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Search,
  CalendarIcon,
  FileText,
  Truck,
  Printer,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import api from "@/api/api";
import { useAuth } from "@/context/AuthContext";

// Updated Cow interface
interface Cow {
  id: string;
  tag_number: string;
  unit_price: number;
  available_quantity: number; // Calculated from stock entries minus exits
}

// Updated Order interface
interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  lines: {
    name: string; // Will be cow.tag_number
    quantity: number; // Now in kilograms (decimal)
    unit_price: number;
    line_total: number;
  }[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const OrderManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);
  const [createOrderOpen, setCreateOrderOpen] = useState<boolean>(false);
  const [createCustomerOpen, setCreateCustomerOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableCows, setAvailableCows] = useState<Cow[]>([]); // Changed from availableItems
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState<{
    customer_id: string;
    items: { cow_id: string; quantity: number }[]; // Changed item_id to cow_id
  }>({ customer_id: "", items: [] });
  const [newCustomer, setNewCustomer] = useState<{
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  }>({ customer_name: "", customer_email: "", customer_phone: "" });
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      if (authLoading || !user || user.role !== "shop") {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Order[]>("/orders/orders/");
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to load orders";
        setError(errorMessage);
        toast.error(errorMessage);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [authLoading, user]);

  // Fetch customers and cows with polling
  useEffect(() => {
    async function fetchData() {
      if (authLoading || !user || user.role !== "shop") return;
      try {
        const [cowsResponse, customersResponse] = await Promise.all([
          api.get<Cow[]>("/inventory/cows/"), // Updated endpoint
          api.get<{ id: number; customer_name: string; customer_email: string; customer_phone: string; created: string; updated: string }[]>("/customers/"),
        ]);
        console.log("Cows response:", cowsResponse.data);
        console.log("Customers response:", customersResponse.data);
        setAvailableCows(Array.isArray(cowsResponse.data) ? cowsResponse.data : []);
        setCustomers(
          Array.isArray(customersResponse.data)
            ? customersResponse.data.map((customer) => ({
              id: String(customer.id),
              name: customer.customer_name || "Unknown",
              email: customer.customer_email || "No email",
              phone: customer.customer_phone || "",
            }))
            : []
        );
      } catch (err: any) {
        console.error("Fetch error:", err.response?.data || err.message);
        toast.error("Failed to load cows or customers: " + (err.response?.data?.detail || err.message));
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [authLoading, user]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "all" && order.status !== activeTab) return false;
    if (
      searchQuery &&
      !(
        String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
      return false;
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (dateRange) {
      const orderDate = new Date(order.date);
      if (
        orderDate.getFullYear() !== dateRange.getFullYear() ||
        orderDate.getMonth() !== dateRange.getMonth() ||
        orderDate.getDate() !== dateRange.getDate()
      )
        return false;
    }
    return true;
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500";
      case "confirmed":
        return "bg-yellow-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleCreateOrder = async () => {
    if (!newOrder.customer_id || !newOrder.items.length) {
      toast.error("Please select a customer and at least one cow");
      return;
    }
    try {
      const response = await api.post<Order>("/orders/orders/", {
        customer_id: newOrder.customer_id,
        // shop: user?.shop_profile?.id,
        lines: newOrder.items.map((item) => ({
          cow_id: item.cow_id, // Updated to cow_id
          quantity: item.quantity,
        })),
      });
      setOrders([...orders, response.data]);
      setCreateOrderOpen(false);
      setNewOrder({ customer_id: "", items: [] });
      toast.success(`Order ${response.data.id} created successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to create order");
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.customer_name || !newCustomer.customer_email || !newCustomer.customer_phone) {
      toast.error("Please fill in all customer details");
      return;
    }
    try {
      const response = await api.post<{ id: number; customer_name: string; customer_email: string; customer_phone: string }>(
        "/register-customer/",
        {
          customer_name: newCustomer.customer_name,
          customer_email: newCustomer.customer_email,
          customer_phone: newCustomer.customer_phone,
          password: "Client123?",
        }
      );
      const newCustomerData: Customer = {
        id: String(response.data.id),
        name: response.data.customer_name || "Unknown",
        email: response.data.customer_email || "No email",
        phone: response.data.customer_phone || "",
      };
      setCustomers((prev) => [...prev, newCustomerData]);
      setNewOrder({ ...newOrder, customer_id: String(response.data.id) });
      setCreateCustomerOpen(false);
      setNewCustomer({ customer_name: "", customer_email: "", customer_phone: "" });
      toast.success(`Customer ${response.data.customer_name} created successfully`);
      // Refetch customers
      async function fetchCustomers() {
        try {
          const response = await api.get<{ id: number; customer_name: string; customer_email: string; customer_phone: string; created: string; updated: string }[]>("/customers/");
          setCustomers(
            Array.isArray(response.data)
              ? response.data.map((customer) => ({
                id: String(customer.id),
                name: customer.customer_name || "Unknown",
                email: customer.customer_email || "No email",
                phone: customer.customer_phone || "",
              }))
              : []
          );
        } catch (err: any) {
          console.error("Fetch customers error:", err.response?.data || err.message);
        }
      }
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to create customer");
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await api.patch<Order>(`/orders/orders/${orderId}/`, { status });
      setOrders(orders.map((o) => (o.id === orderId ? response.data : o)));
      setSelectedOrder(response.data);
      toast.success(`Order ${orderId} status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update order status");
    }
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/orders/${orderId}/invoice/`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Invoice generated for order ${orderId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to generate invoice");
    }
  };

  const handleCreateDeliveryNote = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/orders/${orderId}/delivery_note/`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `delivery_note_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Delivery note created for order ${orderId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create delivery note");
    }
  };

  const handlePrintOrder = async (orderId: string) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>Order ${orderId}</title></head>
              <body>
                <h1>Order ${order.id}</h1>
                <p>Customer: ${order.customer.name || "Unknown"}</p>
                <p>Email: ${order.customer.email || "N/A"}</p>
                <p>Phone: ${order.customer.phone || "N/A"}</p>
                <p>Date: ${format(new Date(order.date), "MMMM dd, yyyy")}</p>
                <p>Status: ${order.status}</p>
                <p>Total: RWF ${order.total.toFixed(2)}</p>
                <h2>Cows</h2>
                <table border="1">
                  <tr><th>Cow Tag</th><th>Quantity (kg)</th><th>Price per kg</th><th>Subtotal</th></tr>
                  ${order.lines
              .map(
                (line) =>
                  `<tr><td>${line.name}</td><td>${line.quantity.toFixed(2)}</td><td>RWF ${line.unit_price.toFixed(2)}</td><td>RWF ${line.line_total.toFixed(2)}</td></tr>`
              )
              .join("")}
                </table>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
      toast.success(`Print initiated for order ${orderId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to print order");
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="w-full bg-background p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Dialog open={createOrderOpen} onOpenChange={setCreateOrderOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="mr-2 h-4 w-4" /> Create New Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Enter customer details and select cows to create a new order.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <Select
                  value={newOrder.customer_id}
                  onValueChange={(value) => {
                    if (value === "create_new") {
                      setCreateCustomerOpen(true);
                    } else {
                      setNewOrder({ ...newOrder, customer_id: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create_new">
                      <div className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" /> Create New Customer
                      </div>
                    </SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name || "Unknown"} ({customer.email || "No email"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cows</Label>
                <Select
                  onValueChange={(cowId) =>
                    setNewOrder({
                      ...newOrder,
                      items: [...newOrder.items, { cow_id: cowId, quantity: 1 }],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cow" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCows.map((cow) => (
                      <SelectItem key={cow.id} value={cow.id}>
                        {cow.tag_number} (
                        RWF {(cow.unit_price ?? 0).toFixed(2)}/kg,
                        {(cow.available_quantity ?? 0).toFixed(2)} kg available
                        )
                      </SelectItem>
                    ))}
                  </SelectContent>

                </Select>
              </div>
              {newOrder.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>{availableCows.find((c) => c.id === item.cow_id)?.tag_number || "Unknown"}</span>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        items: newOrder.items.map((i, idx) =>
                          idx === index ? { ...i, quantity: parseFloat(e.target.value) || 0 } : i
                        ),
                      })
                    }
                    className="w-20"
                    min="0"
                    step="0.01" // Allow decimal values
                    placeholder="kg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setNewOrder({
                        ...newOrder,
                        items: newOrder.items.filter((_, idx) => idx !== index),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOrderOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
                disabled={!newOrder.customer_id || !newOrder.items.length}
              >
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Customer Dialog */}
        <Dialog open={createCustomerOpen} onOpenChange={setCreateCustomerOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Customer</DialogTitle>
              <DialogDescription>Enter details for the new customer.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newCustomer.customer_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_name: e.target.value })}
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newCustomer.customer_email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_email: e.target.value })}
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newCustomer.customer_phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_phone: e.target.value })}
                  placeholder="Phone Number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateCustomerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCustomer}>Create Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search orders by ID, customer name, or email"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange ? format(dateRange, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {(searchQuery || statusFilter !== "all" || dateRange) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setDateRange(undefined);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleOrderClick(order)}
                        >
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer.name || "Unknown"}</div>
                              <div className="text-sm text-muted-foreground">{order.customer.email || "No email"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${getStatusBadgeColor(order.status)} text-white`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>RWF {Number(order.total).toFixed(2)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleGenerateInvoice(order.id)}>
                                  <FileText className="mr-2 h-4 w-4" /> Generate Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCreateDeliveryNote(order.id)}>
                                  <Truck className="mr-2 h-4 w-4" /> Create Delivery Note
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePrintOrder(order.id)}>
                                  <Printer className="mr-2 h-4 w-4" /> Print Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No orders found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && format(new Date(selectedOrder.date), "MMMM dd, yyyy")}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {selectedOrder.customer.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedOrder.customer.email || "No email"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {selectedOrder.customer.phone || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Status:</span>
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}
                      >
                        <SelectTrigger className="w-[180px] ml-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </p>
                    <p>
                      <span className="font-medium">Total Weight:</span>{" "}
                      {Number(selectedOrder.lines.reduce((sum, line) => sum + line.quantity, 0)).toFixed(2)} kg
                    </p>
                    <p>
                      <span className="font-medium">Total Amount:</span> RWF{" "}
                      {Number(selectedOrder.total).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cow Tag</TableHead>
                        <TableHead>Quantity (kg)</TableHead>
                        <TableHead>Price per kg</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.lines.map((line, index) => (
                        <TableRow key={index}>
                          <TableCell>{line.name}</TableCell>
                          <TableCell>{Number(line.quantity).toFixed(2)}</TableCell>
                          <TableCell>RWF {Number(line.unit_price).toFixed(2)}</TableCell>
                          <TableCell>RWF {Number(line.line_total).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
                Close
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleGenerateInvoice(selectedOrder?.id || "")}>
                <FileText className="mr-2 h-4 w-4" /> Generate Invoice
              </Button>
              <Button variant="outline" onClick={() => handleCreateDeliveryNote(selectedOrder?.id || "")}>
                <Truck className="mr-2 h-4 w-4" /> Create Delivery Note
              </Button>
              <Button onClick={() => handlePrintOrder(selectedOrder?.id || "")}>
                <Printer className="mr-2 h-4 w-4" /> Print Order
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;