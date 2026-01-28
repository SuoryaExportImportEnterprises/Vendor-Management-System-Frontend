import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, Plus, Download, Eye, Pencil, Trash2, LogOut, Settings } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<VendorProduct[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/vendors`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    setData(res.data);
  } catch (err) {
    console.error("Failed to load vendor entries:", err);
    toast.error("Failed to load vendor entries");
  }
};


  useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    toast.error("Session expired. Please log in again.");
    navigate("/", { replace: true });
  }
}, [navigate]);

interface VendorProduct {
  _id: string;
  vendorName: string;
  companyName: string;
  vendorState: string;
  vendorCity: string;
  otherAreaName?: string;
  vendorAddress: string;
  gstNumber: string;
  phones: string[];
  emails: string[];
  productDescription: string;
  website?: string;
  priceRange: string;
  visitingCardImageUrl: string;
  productImageUrl: string;
  createdAt: string;
}
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    toast.info("Logged out successfully");
    navigate("/", { replace: true });
  };


const handleDelete = useCallback(async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this entry?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/vendors/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    setData(prev => prev.filter(item => item._id !== id));
    toast.success("Entry deleted successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete entry");
  }
}, []);

  const exportToCSV = () => {
    const filteredData = table.getFilteredRowModel().rows.map(row => row.original);
    
    if (filteredData.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const headers = [
      "Vendor Name", "Company Name", "State", "City", "Other Area", "Address",
      "GST Number", "Phone", "Email", "Website", "Product Description",
      "Price Range", "Created At"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        row.vendorName,
        row.companyName,
        row.vendorState,
        row.vendorCity,
        row.otherAreaName || "",
        row.vendorAddress,
        row.gstNumber,
        row.phones?.join(" | "),
        row.emails?.join(" | "),
        row.website || "",
        row.productDescription,
        row.priceRange,
        new Date(row.createdAt).toLocaleDateString("en-GB")
      ].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor-products-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

const columns = useMemo<ColumnDef<VendorProduct>[]>(() => [

  {
    accessorKey: "vendorName",
    header: "Vendor Name",
  },

  {
    accessorKey: "companyName",
    header: "Company Name",
  },

  {
    accessorKey: "vendorState",
    header: "State",
  },

  {
    accessorKey: "vendorCity",
    header: "City",
  },

  {
  accessorKey: "productDescription",
  header: "Product Description",
  cell: ({ row }) => (
    <div className="max-w-[260px] truncate" title={row.original.productDescription}>
      {row.original.productDescription}
    </div>
  ),
},


  {
    accessorKey: "gstNumber",
    header: "GST",
  },

  {
    accessorKey: "priceRange",
    header: "Price Range",
  },

{
  id: "phones",
  header: "Phone(s)",
  cell: ({ row }) => (
    <div className="space-y-1">
      {row.original.phones?.length
        ? row.original.phones.map((p, i) => (
            <div key={i}>{p}</div>
          ))
        : "-"}
    </div>
  ),
},

{
  id: "emails",
  header: "Email(s)",
  cell: ({ row }) => (
    <div className="space-y-1">
      {row.original.emails?.length
        ? row.original.emails.map((e, i) => (
            <div key={i}>{e}</div>
          ))
        : "-"}
    </div>
  ),
},


  {
    accessorKey: "visitingCardImageUrl",
    header: () => <div className="text-center w-full">Visiting Card</div>,
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.original.visitingCardImageUrl}
          alt="Card"
          className="h-10 w-16 object-cover rounded"
        />
      </div>
    ),
  },

  {
    accessorKey: "productImageUrl",
    header: () => <div className="text-center w-full">Product</div>,
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.original.productImageUrl}
          alt="Product"
          className="h-10 w-16 object-cover rounded"
        />
      </div>
    ),
  },

{
  accessorKey: "website",
  header: "Website",
  cell: ({ row }) =>
    row.original.website ? (
      <a
        href={
          row.original.website.startsWith("http")
            ? row.original.website
            : `https://${row.original.website}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {row.original.website}
      </a>
    ) : (
      "-"
    ),
},


  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => navigate(`/view/${row.original._id}`)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => navigate(`/edit/${row.original._id}`)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleDelete(row.original._id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },

], [navigate, handleDelete]);


const globalFilterFn = (row, columnId, filterValue) => {
  const value = filterValue.toLowerCase();
  const d = row.original;

  return (
    d.vendorName?.toLowerCase().includes(value) ||
    d.companyName?.toLowerCase().includes(value) ||
    d.vendorState?.toLowerCase().includes(value) ||
    d.vendorCity?.toLowerCase().includes(value) ||
    d.otherAreaName?.toLowerCase().includes(value) ||
    d.vendorAddress?.toLowerCase().includes(value) ||
    d.gstNumber?.toLowerCase().includes(value) ||
    // d.productCategory?.toLowerCase().includes(value) ||
    d.productDescription?.toLowerCase().includes(value) ||
    d.priceRange?.toLowerCase().includes(value) ||
    d.website?.toLowerCase().includes(value) ||
    // d.keywords?.toLowerCase().includes(value) ||
    d.phones?.some(p => p.toLowerCase().includes(value)) ||
    d.emails?.some(e => e.toLowerCase().includes(value))

  );
};



  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    globalFilterFn,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold text-primary">Vendor Management System</h1>
    <p className="text-muted-foreground">Manage your vendor and product entries</p>
  </div>

  <div className="flex items-center gap-4">
    <span className="text-sm text-muted-foreground">
      Logged in as: <b>{localStorage.getItem("username")}</b>
    </span>

    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleLogout}
      className="text-red-600 hover:text-red-800"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  </div>
</div>


        <Card className="p-6">
          <div className="flex justify-between items-center mb-4 gap-4">
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-2">

              <Button onClick={exportToCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={() => navigate("/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Entry
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">

              <thead className="bg-muted">

  {table.getHeaderGroups().map((headerGroup) => (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th key={header.id} className="px-4 py-3 text-left text-sm font-medium">
          {header.isPlaceholder
            ? null
            : header.column.getCanSort() ? (
                <Button
                  variant="ghost"
                  onClick={() =>
                    header.column.toggleSorting(header.column.getIsSorted() === "asc")
                  }
                  className="p-0 font-semibold"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                flexRender(header.column.columnDef.header, header.getContext())
              )}
        </th>
      ))}
    </tr>
  ))}

  <tr>
    {table.getVisibleLeafColumns().map((column) => (
      <th key={column.id} className="px-4 py-2">
        {column.getCanFilter() && (
          <Input
            placeholder="Filter..."
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="h-8"
          />
        )}
      </th>
    ))}
  </tr>
</thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {table.getFilteredRowModel().rows.length} of {data.length} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
