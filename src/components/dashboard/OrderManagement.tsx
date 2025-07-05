// export default OrderManagement;
// src/components/dashboard/OrderManagement.tsx
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
import { InventoryItem } from "./InventoryOverview";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string; // ISO string from backend
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  lines: {
    name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableItems, setAvailableItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState<{
    customer_id: string;
    items: { item_id: string; quantity: number }[];
  }>({ customer_id: "", items: [] });
  const [customers, setCustomers] = useState<{ id: string; name: string; email: string }[]>([]);

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
        const response = await api.get<Order[]>("/orders/");
        console.log("Orders API Response:", response.data); // Debug log
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        console.error("Orders API Error:", err.response?.data); // Debug log
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

  // Fetch available items and customers
  useEffect(() => {
    async function fetchData() {
      if (authLoading || !user || user.role !== "shop") return;
      try {
        const [itemsResponse, customersResponse] = await Promise.all([
          api.get<InventoryItem[]>("/inventory/"),
          api.get<{ id: string; name: string; email: string }[]>("/customers/"),
        ]);
        console.log("Inventory API Response:", itemsResponse.data); // Debug log
        console.log("Customers API Response:", customersResponse.data); // Debug log
        setAvailableItems(Array.isArray(itemsResponse.data) ? itemsResponse.data : []);
        setCustomers(Array.isArray(customersResponse.data) ? customersResponse.data : []);
      } catch (err: any) {
        console.error("Data API Error:", err.response?.data); // Debug log
        toast.error("Failed to load inventory or customers");
      }
    }
    fetchData();
  }, [authLoading, user]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "all" && order.status !== activeTab) return false;
    if (
      searchQuery &&
      !(
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    try {
      const response = await api.post<Order>("/orders/", {
        customer_id: newOrder.customer_id,
        shop: user?.shop_profile?.id,
        lines: newOrder.items,
      });
      setOrders([...orders, response.data]);
      setCreateOrderOpen(false);
      setNewOrder({ customer_id: "", items: [] });
      toast.success(`Order ${response.data.id} created successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create order");
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await api.patch<Order>(`/orders/${orderId}/`, { status });
      setOrders(orders.map((o) => (o.id === orderId ? response.data : o)));
      setSelectedOrder(response.data);
      toast.success(`Order ${orderId} status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update order status");
    }
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice/`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Invoice generated for order ${orderId}`);
    } catch (err: any) {
      console.error("Invoice API Error:", err.response?.data); // Debug log
      toast.error(err.response?.data?.detail || "Failed to generate invoice");
    }
  };

  const handleCreateDeliveryNote = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/delivery_note/`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `delivery_note_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Delivery note created for order ${orderId}`);
    } catch (err: any) {
      console.error("Delivery Note API Error:", err.response?.data); // Debug log
      toast.error(err.response?.data?.detail || "Failed to create delivery note");
    }
  };

  const handlePrintOrder = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/print/`);
      console.log("Print Order API Response:", response.data); // Debug log
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>Order ${orderId}</title></head>
              <body>
                <h1>Order ${order.id}</h1>
                <p>Customer: ${order.customer.name}</p>
                <p>Email: ${order.customer.email}</p>
                <p>Phone: ${order.customer.phone}</p>
                <p>Date: ${format(new Date(order.date), "MMMM dd, yyyy")}</p>
                <p>Status: ${order.status}</p>
                <p>Total: RWF ${order.total.toFixed(2)}</p>
                <h2>Items</h2>
                <table border="1">
                  <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>
                  ${order.lines
                    .map(
                      (line) =>
                        `<tr><td>${line.name}</td><td>${line.quantity}</td><td>RWF ${line.unit_price.toFixed(2)}</td><td>RWF ${line.line_total.toFixed(2)}</td></tr>`
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
      console.error("Print Order API Error:", err.response?.data); // Debug log
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
              <DialogDescription>Enter customer details and select items to create a new order.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <Select
                  value={newOrder.customer_id}
                  onValueChange={(value) => setNewOrder({ ...newOrder, customer_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Items</Label>
                <Select
                  onValueChange={(itemId) =>
                    setNewOrder({
                      ...newOrder,
                      items: [...newOrder.items, { item_id: itemId, quantity: 1 }],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} (RWF {item.unit_price.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newOrder.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span>{availableItems.find((i) => i.id === item.item_id)?.name}</span>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        items: newOrder.items.map((i, idx) =>
                          idx === index ? { ...i, quantity: Number(e.target.value) } : i
                        ),
                      })
                    }
                    className="w-20"
                    min="1"
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
      </div>

      <div className="flex flex-col space-y-4">
        {/* Search and Filter Bar */}
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

        {/* Tabs */}
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
                              <div className="font-medium">{order.customer.name}</div>
                              <div className="text-sm text-muted-foreground">{order.customer.email}</div>
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
                          <TableCell>RWF {order.total.toFixed(2)}</TableCell>
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

      {/* Order Details Dialog */}
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
                      <span className="font-medium">Name:</span> {selectedOrder.customer.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedOrder.customer.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {selectedOrder.customer.phone}
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
                      <span className="font-medium">Total Items:</span>{" "}
                      {selectedOrder.lines.reduce((sum, line) => sum + line.quantity, 0)}
                    </p>
                    <p>
                      <span className="font-medium">Total Amount:</span> RWF{" "}
                      {selectedOrder.total.toFixed(2)}
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
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.lines.map((line, index) => (
                        <TableRow key={index}>
                          <TableCell>{line.name}</TableCell>
                          <TableCell>{line.quantity}</TableCell>
                          <TableCell>RWF {line.unit_price.toFixed(2)}</TableCell>
                          <TableCell>RWF {line.line_total.toFixed(2)}</TableCell>
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