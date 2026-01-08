import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config/api";

interface VendorEntry {
  _id: string;
  vendorName: string;
  companyName: string;
  vendorState: string;
  vendorCity: string;
  otherAreaName?: string;
  vendorAddress: string;
  gstNumber?: string;
  phones?: string[];
  emails?: string[];
  productDescription: string;
  priceRange?: string;
  visitingCardImageUrl?: string;
  productImageUrl?: string;
  createdAt: string;
}


export default function ViewEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<VendorEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // FETCH ENTRY FROM BACKEND
  // ---------------------------
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/vendors/${id}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("authToken")}` 
          },
        });

        setEntry(res.data);
      } catch (err) {
        console.error("Error loading entry:", err);
        toast.error("Failed to load entry");
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  // ---------------------------
  // DELETE ENTRY
  // ---------------------------
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/vendors/${id}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("authToken")}` 
        },
      });

      toast.success("Entry deleted");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete entry");
    }
  };

  // ---------------------------
  // LOADER
  // ---------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading entry...</p>
      </div>
    );
  }

  // ---------------------------
  // NOT FOUND
  // ---------------------------
  if (!entry) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Entry not found</p>
            <Button className="mt-4 w-full" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------------------
  // MAIN UI (same as old mock UI, with real data)
  // ---------------------------
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex gap-2">
            <Button onClick={() => navigate(`/edit/${id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div>
                <p className="text-sm text-muted-foreground">Vendor Name</p>
                <p className="font-medium">{entry.vendorName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{entry.companyName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">
                  {entry.vendorCity === "Others" && entry.otherAreaName 
                    ? `${entry.otherAreaName}, ${entry.vendorState}`
                    : `${entry.vendorCity}, ${entry.vendorState}`
                  }
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{entry.vendorAddress}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">GST Number</p>
                <p className="font-medium font-mono">
  {entry.gstNumber || "-"}
</p>


              </div>

<div>
  <p className="text-sm text-muted-foreground">Phone(s)</p>

  {entry.phones && entry.phones.length > 0 ? (
    entry.phones.map((phone, index) => (
      <p key={index} className="font-medium">
        {phone}
      </p>
    ))
  ) : (
    <p className="font-medium">-</p>
  )}
</div>


<div>
  <p className="text-sm text-muted-foreground">Email(s)</p>

  {entry.emails && entry.emails.length > 0 ? (
    entry.emails.map((email, index) => (
      <p key={index} className="font-medium">
        {email}
      </p>
    ))
  ) : (
    <p className="font-medium">-</p>
  )}
</div>


              <div>
                <p className="text-sm text-muted-foreground mb-2">Visiting Card</p>
                {entry.visitingCardImageUrl ? (
  <img
    src={entry.visitingCardImageUrl}
    alt="Visiting Card"
    className="w-full rounded-lg border"
  />
) : (
  <p className="font-medium">-</p>
)}


              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            

              <div>
                <p className="text-sm text-muted-foreground">Product Description</p>
                <p className="font-medium">{entry.productDescription}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Price Range</p>
                <p className="font-medium">
  {entry.priceRange || "-"}
</p>


              </div>


              <div>
                <p className="text-sm text-muted-foreground mb-2">Product Photo</p>
                {entry.productImageUrl ? (
  <img
    src={entry.productImageUrl}
    alt="Product"
    className="w-full rounded-lg border"
  />
) : (
  <p className="font-medium">-</p>
)}

              </div>

              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
