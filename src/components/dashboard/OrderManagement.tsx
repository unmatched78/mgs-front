import React, { useState } from "react";
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
  Calendar as CalendarIcon,
  Filter,
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

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: Date;
  status: "new" | "processing" | "completed" | "cancelled";
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("new");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);

  // Mock data for orders
  const mockOrders: Order[] = [
    {
      id: "ORD-001",
      customer: {
        name: "John Smith",
        email: "john@example.com",
        phone: "+1 555-123-4567",
      },
      date: new Date(2023, 5, 15),
      status: "new",
      total: 156.75,
      items: [
        { name: "Premium Beef Steak", quantity: 2, price: 45.5 },
        { name: "Organic Chicken Breast", quantity: 3, price: 21.75 },
      ],
    },
    {
      id: "ORD-002",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1 555-987-6543",
      },
      date: new Date(2023, 5, 16),
      status: "processing",
      total: 89.25,
      items: [
        { name: "Ground Beef", quantity: 2, price: 18.75 },
        { name: "Pork Chops", quantity: 4, price: 12.95 },
      ],
    },
    {
      id: "ORD-003",
      customer: {
        name: "Michael Brown",
        email: "michael@example.com",
        phone: "+1 555-456-7890",
      },
      date: new Date(2023, 5, 14),
      status: "completed",
      total: 210.5,
      items: [
        { name: "Lamb Rack", quantity: 1, price: 85.5 },
        { name: "Beef Tenderloin", quantity: 2, price: 62.5 },
      ],
    },
  ];

  // Filter orders based on active tab, search query, status filter, and date range
  const filteredOrders = mockOrders.filter((order) => {
    // Filter by tab (status)
    if (activeTab !== "all" && order.status !== activeTab) return false;

    // Filter by search query
    if (
      searchQuery &&
      !(
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
      return false;

    // Filter by status if selected
    if (statusFilter && statusFilter !== "all" && order.status !== statusFilter)
      return false;

    // Filter by date if selected
    if (
      dateRange &&
      (order.date.getFullYear() !== dateRange.getFullYear() ||
        order.date.getMonth() !== dateRange.getMonth() ||
        order.date.getDate() !== dateRange.getDate())
    )
      return false;

    return true;
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button>
          <FileText className="mr-2 h-4 w-4" /> Create New Order
        </Button>
      </div>

      <div className="flex flex-col space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search orders by ID, customer name or email"
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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

          {(searchQuery || statusFilter || dateRange) && (
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
        <Tabs
          defaultValue="new"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="new">New Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>

          {/* Tab Content - Same table structure for all tabs, filtered by the tab value */}
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
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleOrderClick(order)}
                        >
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {order.customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customer.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(order.date, "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${getStatusBadgeColor(order.status)} text-white`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />{" "}
                                    Generate Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 h-4 w-4" /> Create
                                    Delivery Note
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Printer className="mr-2 h-4 w-4" /> Print
                                    Order
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-gray-500"
                        >
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
              Placed on{" "}
              {selectedOrder && format(selectedOrder.date, "MMMM dd, yyyy")}
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
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.customer.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.customer.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedOrder.customer.phone}
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
                      <Badge
                        variant="secondary"
                        className={`${getStatusBadgeColor(selectedOrder.status)} text-white ml-2`}
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Total Items:</span>{" "}
                      {selectedOrder.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Total Amount:</span> $
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
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            ${(item.quantity * item.price).toFixed(2)}
                          </TableCell>
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
              <Button
                variant="outline"
                onClick={() => setOrderDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Generate Invoice
              </Button>
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" /> Create Delivery Note
              </Button>
              <Button>
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
