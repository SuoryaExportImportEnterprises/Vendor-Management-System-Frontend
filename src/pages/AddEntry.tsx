import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { states, citiesByState } from "@/data/mockData";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { getFormFieldOptions } from "@/services/formFieldOptionsService";
import { fetchCategories } from "@/services/productCategoryService";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import API_BASE_URL from "../config/api";



interface AddEntryForm {
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


export default function AddEntry() {
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<AddEntryForm>();

  // --------------------------
  // IMAGE STATES (Option B)
  // --------------------------
  const [visitingCardFile, setVisitingCardFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [productCategories, setProductCategories] = useState<string[]>([]);

  const selectedState = watch("vendorState");
  const selectedCity = watch("vendorCity");
  const cityList = selectedState ? citiesByState[selectedState] || ["Others"] : [];

  // --------------------------
  // FETCH DYNAMIC CATEGORY OPTIONS
  // --------------------------
  useEffect(() => {
  async function load() {
    const options = await fetchCategories();
    setProductCategories(options.map(o => o.optionValue));
  }
  load();
}, []);


  const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  try {


    const res = await axios.post(
  `${API_BASE_URL}/upload/image`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "multipart/form-data",
    },
  }
);


    return res.data.imageUrl;
  } catch (err) {
    console.error("UPLOAD ERROR:", err.response?.data || err);
    toast.error("Image upload failed");
    return null;
  }
};


  // --------------------------
  // SUBMIT FORM
  // --------------------------
  const onSubmit = async (data: AddEntryForm) => {
    if (!visitingCardFile) {
      toast.error("Visiting card image is required");
      return;
    }
    if (!productImageFile) {
      toast.error("Product image is required");
      return;
    }

    setIsLoading(true);

    try {
      // Upload images first
      const visitingCardUrl = await uploadImage(visitingCardFile);
      const productImageUrl = await uploadImage(productImageFile);

      if (!visitingCardUrl || !productImageUrl) {
        toast.error("Image upload failed. Cannot submit.");
        setIsLoading(false);
        return;
      }

      // Prepare full form payload
      const payload = {
        ...data,
        visitingCardImageUrl: visitingCardUrl,
        productImageUrl: productImageUrl,
      };

     await axios.post(`${API_BASE_URL}/vendors`, payload, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});


      toast.success("Vendor entry added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save vendor entry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Button
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button> */}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              Add New Vendor-Product Entry
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Vendor Name */}
              <div className="space-y-2">
                <Label>Vendor Name *</Label>
                <Input
                  {...register("vendorName", { required: "Required" })}
                  className={errors.vendorName ? "border-destructive" : ""}
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  {...register("companyName", { required: "Required" })}
                  className={errors.companyName ? "border-destructive" : ""}
                />
              </div>

              {/* Vendor State */}
              <div className="space-y-2">
                <Label>Vendor State *</Label>
                <Select
                  onValueChange={(v) => {
                    setValue("vendorState", v);
                    setValue("vendorCity", "");
                  }}
                >
                  <SelectTrigger className={errors.vendorState ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>

                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("vendorState", { required: "Required" })} />
              </div>

              {/* Vendor City */}
              <div className="space-y-2">
                <Label>Vendor City *</Label>
                <Select
                  disabled={!selectedState}
                  onValueChange={(v) => setValue("vendorCity", v)}
                >
                  <SelectTrigger className={errors.vendorCity ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>

                  <SelectContent>
                    {cityList.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("vendorCity", { required: "Required" })} />
              </div>

              {/* Other Area */}
              {selectedCity === "Others" && (
                <div className="space-y-2">
                  <Label>Other Area Name *</Label>
                  <Input
                    {...register("otherAreaName", { required: "Required" })}
                  />
                </div>
              )}

              {/* Vendor Address */}
              <div className="space-y-2">
                <Label>Vendor Address *</Label>
                <Textarea {...register("vendorAddress", { required: "Required" })} />
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <Label>GST Number *</Label>
                <Input
                  {...register("gstNumber", {
                    required: "Required",
                    pattern: {
                      value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                      message: "Invalid GST"
                    }
                  })}
                />
              </div>

              {/* Product Category */}
              {/* <div className="space-y-2">
                <Label>Product Category *</Label>
                <Select onValueChange={(v) => setValue("productCategory", v)}>
                  <SelectTrigger className={errors.productCategory ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {productCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <input type="hidden" {...register("productCategory", { required: "Required" })} />
              </div> */}

              <div className="space-y-2">
  <Label>Product Category *</Label>

  <Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      className={cn(
        "w-full justify-between",
        !watch("productCategory") && "text-muted-foreground"
      )}
    >
      {watch("productCategory") || "Select category"}
      <ChevronsUpDown className="h-4 w-4 opacity-50" />
    </Button>
  </PopoverTrigger>

  <PopoverContent
    align="start"
    side="bottom"
    className="w-[var(--radix-popover-trigger-width)] p-0"
  >
    <Command>
      <CommandInput placeholder="Search category..." />
      <CommandEmpty>No category found.</CommandEmpty>

      <CommandGroup>
        {productCategories.map((c) => (
          <CommandItem
            key={c}
            value={c}
            onSelect={() => {
              setValue("productCategory", c);
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                watch("productCategory") === c ? "opacity-100" : "opacity-0"
              )}
            />
            {c}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  </PopoverContent>
</Popover>

</div>


              {/* Product Description */}
              <div className="space-y-2">
                <Label>Product Description *</Label>
                <Textarea {...register("productDescription", { required: "Required" })} />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range *</Label>
                <Input {...register("priceRange", { required: "Required" })} />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input {...register("keywords")} placeholder="comma separated" />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  {...register("phone", {
                    required: "Required",
                    pattern: { value: /^[0-9]{10}$/, message: "10 digits only" }
                  })}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  {...register("email", { required: "Required" })}
                />
              </div>

              {/* Visiting Card Image */}
              <div className="space-y-2">
                <Label>Visiting Card Image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVisitingCardFile(e.target.files?.[0] || null)}
                />
              </div>

              {/* Product Image */}
              <div className="space-y-2">
                <Label>Product Image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Add Entry"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}