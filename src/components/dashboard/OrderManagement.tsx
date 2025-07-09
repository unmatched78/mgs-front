import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

interface Cow {
  id: string;
  tag_number: string;
  unit_price: number;
  available_quantity: number;
}

interface Order {
  id: string;
  customer: { id: string; name: string; email: string; phone?: string };
  date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  lines: {
    name: string;
    quantity: number;
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

const OrderManagement: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableCows, setAvailableCows] = useState<Cow[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [createCustomerOpen, setCreateCustomerOpen] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [newOrder, setNewOrder] = useState<{ customer_id: string; items: { cow_id: string; quantity: number }[] }>({
    customer_id: "",
    items: [],
  });
  const [newCustomer, setNewCustomer] = useState<{ customer_name: string; customer_email: string; customer_phone: string }>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
  });

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (authLoading || !user || user.role !== "shop") return setLoading(false);
      try {
        setLoading(true);
        const resp = await api.get<Order[]>("/orders/orders/");
        setOrders(Array.isArray(resp.data) ? resp.data : []);
      } catch (err: any) {
        const msg = err.response?.data?.detail || "Failed to load orders";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [authLoading, user]);

  // Fetch cows & customers
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user || user.role !== "shop") return;
      try {
        const [cowsRes, custRes] = await Promise.all([
          api.get<Cow[]>("/inventory/cows/"),
          api.get<any[]>("/customers/"),
        ]);
        setAvailableCows(Array.isArray(cowsRes.data) ? cowsRes.data : []);
        setCustomers(
          Array.isArray(custRes.data)
            ? custRes.data.map((c) => ({
                id: String(c.id),
                name: c.customer_name,
                email: c.customer_email,
                phone: c.customer_phone,
              }))
            : []
        );
      } catch (err: any) {
        toast.error("Failed to load cows/customers");
      }
    };
    fetchData();
    const iv = setInterval(fetchData, 30_000);
    return () => clearInterval(iv);
  }, [authLoading, user]);

  // Filtering
  const filteredOrders = orders.filter((o) => {
    if (activeTab !== "all" && o.status !== activeTab) return false;
    if (searchQuery && !`${o.id}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (dateRange && new Date(o.date).toDateString() !== dateRange.toDateString()) return false;
    return true;
  });

  const getStatusBadgeColor = (s: string) => {
    switch (s) {
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

  if (loading)
    return <div className="p-4 text-center text-muted-foreground">Loading orders...</div>;
  if (error)
    return <div className="p-4 text-center text-destructive">{error}</div>;

  return (
    <div className="w-full bg-background p-4 md:p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2 sm:mb-0">Order Management</h2>
        <Dialog open={createOrderOpen} onOpenChange={setCreateOrderOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <FileText className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Create New Order</span>
              <span className="sm:hidden">New Order</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Select customer & cows</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Customer Select */}
              <div>
                <Label>Customer</Label>
                <Select
                  value={newOrder.customer_id}
                  onValueChange={(v) => {
                    if (v === "create_new") setCreateCustomerOpen(true);
                    else setNewOrder({ ...newOrder, customer_id: v });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create_new">
                      <Plus className="mr-1 h-4 w-4" /> New
                    </SelectItem>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Cow Select */}
              <div>
                <Label>Cow</Label>
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
                        {cow.tag_number} ({Number(cow.available_quantity).toFixed(1)}kg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Items */}
              {newOrder.items.map((it, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{availableCows.find((c) => c.id === it.cow_id)?.tag_number}</span>
                  <Input
                    type="number"
                    value={it.quantity}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        items: newOrder.items.map((x, xi) =>
                          xi === i ? { ...x, quantity: parseFloat(e.target.value) || 0 } : x
                        ),
                      })
                    }
                    className="w-16"
                    min={0}
                    step={0.1}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setNewOrder({
                        ...newOrder,
                        items: newOrder.items.filter((_, xi) => xi !== i),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOrderOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {/* create order logic */}}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={createCustomerOpen} onOpenChange={setCreateCustomerOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newCustomer.customer_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_name: e.target.value })}
                  placeholder="Name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newCustomer.customer_email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_email: e.target.value })}
                  placeholder="Email"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newCustomer.customer_phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, customer_phone: e.target.value })}
                  placeholder="Phone"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateCustomerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {/* create customer logic */}}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
        <div className="relative flex-grow max-w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search orders"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{dateRange ? format(dateRange, "MMM d, yyyy") : "Date"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateRange} onSelect={setDateRange} />
          </PopoverContent>
        </Popover>
        {(searchQuery || statusFilter !== "all" || dateRange) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setDateRange(undefined); }}>
            Clear
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:-mx-0 sm:px-0">
        <TabsList className="inline-flex space-x-3 text-sm whitespace-nowrap">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        </div>
      </Tabs>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead className="hidden sm:table-cell">Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length ? (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-muted cursor-pointer"
                      onClick={() => { setSelectedOrder(order); setOrderDetailsOpen(true); }}
                    >
                      <TableCell className="font-medium text-sm">{order.id}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm truncate max-w-[100px]">
                        {order.customer.name}
                      </TableCell>
                      <TableCell className="text-sm">{format(new Date(order.date), "MMM d")}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeColor(order.status)} text-white text-xs px-2 py-1`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        RWF {Number(order.total).toFixed(0)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {/* invoice */}}>
                              <FileText className="mr-1 h-4 w-4" /> Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {/* delivery */}}>
                              <Truck className="mr-1 h-4 w-4" /> Delivery
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {/* print */}}>
                              <Printer className="mr-1 h-4 w-4" /> Print
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-lg sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {selectedOrder && format(new Date(selectedOrder.date), "PPP")}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Info */}
                <Card>
                  <CardContent>
                    <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customer.phone || "N/A"}</p>
                  </CardContent>
                </Card>
                {/* Summary */}
                <Card>
                  <CardContent>
                    <p>
                      <strong>Status:</strong>{" "}
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(v) => {/* update status */}}
                      >
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
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
                      <strong>Total Weight:</strong>{" "}
                      {Number(selectedOrder.lines.reduce((sum, l) => sum + l.quantity, 0)).toFixed(1)} kg
                    </p>
                    <p>
                      <strong>Total:</strong> RWF {Number(selectedOrder.total).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>
              {/* Items Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag</TableHead>
                      <TableHead>Qty (kg)</TableHead>
                      <TableHead>Price/kg</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.lines.map((l, i) => (
                      <TableRow key={i}>
                        <TableCell>{l.name}</TableCell>
                        <TableCell>{Number(l.quantity).toFixed(1)}</TableCell>
                        <TableCell>RWF {Number(l.unit_price).toFixed(2)}</TableCell>
                        <TableCell>RWF {Number(l.line_total).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="mr-1 h-4 w-4" /> Invoice
              </Button>
              <Button variant="outline">
                <Truck className="mr-1 h-4 w-4" /> Delivery
              </Button>
              <Button>
                <Printer className="mr-1 h-4 w-4" /> Print
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
