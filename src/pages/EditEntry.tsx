import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { states, citiesByState, mockVendorProducts } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import { getFormFieldOptions } from "@/services/formFieldOptionsService";

interface EditEntryForm {
  vendorName: string;
  companyName: string;
  vendorState: string;
  vendorCity: string;
  otherAreaName?: string;
  vendorAddress: string;
  gstNumber: string;
  phone: string;
  email: string;
  productCategory: string;
  productDescription: string;
  priceRange: string;
  keywords: string;
}

export default function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<EditEntryForm>();
  const [visitingCardFile, setVisitingCardFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const selectedState = watch("vendorState");
  const selectedCity = watch("vendorCity");
  const cities = selectedState ? citiesByState[selectedState] || ["Others"] : [];

  useEffect(() => {
    // Load dynamic product categories
    const categories = getFormFieldOptions("productCategory");
    setProductCategories(categories.map(opt => opt.optionValue));
  }, []);

  useEffect(() => {
    const entry = mockVendorProducts.find(v => v._id === id);
    if (entry) {
      setCurrentCategory(entry.productCategory);
      reset({
        vendorName: entry.vendorName,
        companyName: entry.companyName,
        vendorState: entry.vendorState,
        vendorCity: entry.vendorCity,
        otherAreaName: entry.otherAreaName || "",
        vendorAddress: entry.vendorAddress,
        gstNumber: entry.gstNumber,
        phone: entry.phone,
        email: entry.email,
        productCategory: entry.productCategory,
        productDescription: entry.productDescription,
        priceRange: entry.priceRange,
        keywords: entry.keywords,
      });
    } else {
      toast.error("Entry not found");
      navigate("/dashboard");
    }
  }, [id, reset, navigate]);

  const onSubmit = (data: EditEntryForm) => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast.success("Entry updated successfully!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Edit Vendor-Product Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Vendor Information - Same as AddEntry */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Vendor Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">Vendor Name *</Label>
                    <Input
                      id="vendorName"
                      {...register("vendorName", { required: "Required" })}
                      className={errors.vendorName ? "border-destructive" : ""}
                    />
                    {errors.vendorName && <p className="text-sm text-destructive">{errors.vendorName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      {...register("companyName", { required: "Required" })}
                      className={errors.companyName ? "border-destructive" : ""}
                    />
                    {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendorState">State *</Label>
                    <Select value={selectedState} onValueChange={(value) => {
                      setValue("vendorState", value);
                      setValue("vendorCity", "");
                    }}>
                      <SelectTrigger className={errors.vendorState ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("vendorState", { required: "Required" })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendorCity">City *</Label>
                    <Select value={selectedCity} onValueChange={(value) => setValue("vendorCity", value)} disabled={!selectedState}>
                      <SelectTrigger className={errors.vendorCity ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("vendorCity", { required: "Required" })} />
                  </div>

                  {selectedCity === "Others" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="otherAreaName">Other Area Name *</Label>
                      <Input
                        id="otherAreaName"
                        {...register("otherAreaName", { required: selectedCity === "Others" ? "Required when city is Others" : false })}
                        className={errors.otherAreaName ? "border-destructive" : ""}
                      />
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="vendorAddress">Address *</Label>
                    <Textarea
                      id="vendorAddress"
                      {...register("vendorAddress", { required: "Required" })}
                      className={errors.vendorAddress ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number *</Label>
                    <Input
                      id="gstNumber"
                      {...register("gstNumber", {
                        required: "Required",
                        pattern: {
                          value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                          message: "Invalid GST format"
                        }
                      })}
                      maxLength={15}
                      className={errors.gstNumber ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone", {
                        required: "Required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Must be 10 digits"
                        }
                      })}
                      maxLength={10}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email"
                        }
                      })}
                      className={errors.email ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitingCard">Update Visiting Card Photo</Label>
                    <Input
                      id="visitingCard"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setVisitingCardFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Product Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Product Category *</Label>
                    <Select value={watch("productCategory")} onValueChange={(value) => setValue("productCategory", value)}>
                      <SelectTrigger className={errors.productCategory ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {/* Show current category even if deleted */}
                        {currentCategory && !productCategories.includes(currentCategory) && (
                          <SelectItem key={currentCategory} value={currentCategory}>
                            {currentCategory} (Original)
                          </SelectItem>
                        )}
                        {/* Show active categories */}
                        {productCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("productCategory", { required: "Required" })} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range *</Label>
                    <Input
                      id="priceRange"
                      {...register("priceRange", { required: "Required" })}
                      className={errors.priceRange ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="productDescription">Product Description *</Label>
                    <Textarea
                      id="productDescription"
                      {...register("productDescription", { required: "Required" })}
                      className={errors.productDescription ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productImage">Update Product Photo</Label>
                    <Input
                      id="productImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      {...register("keywords")}
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Entry"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
