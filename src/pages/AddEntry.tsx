// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "react-toastify";
// import { states, citiesByState } from "@/data/mockData";
// import { ArrowLeft } from "lucide-react";
// import { getFormFieldOptions } from "@/services/formFieldOptionsService";
// import axios from "axios";


// interface AddEntryForm {
//   vendorName: string;
//   companyName: string;
//   vendorState: string;
//   vendorCity: string;
//   otherAreaName?: string;
//   vendorAddress: string;
//   gstNumber: string;
//   phone: string;
//   email: string;
//   productCategory: string;
//   productDescription: string;
//   priceRange: string;
//   keywords: string;
// }

// export default function AddEntry() {
//   const navigate = useNavigate();
//   const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AddEntryForm>();
//   const [visitingCardFile, setVisitingCardFile] = useState<File | null>(null);
//   const [productImageFile, setProductImageFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [productCategories, setProductCategories] = useState<string[]>([]);

//   const selectedState = watch("vendorState");
//   const selectedCity = watch("vendorCity");
//   const cities = selectedState ? citiesByState[selectedState] || ["Others"] : [];
//   const uploadImage = async (file) => {
//   const formData = new FormData();
//   formData.append("image", file);

//   try {
//     const res = await axios.post("http://localhost:5000/api/upload/image", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//     });

//     return res.data.imageUrl; // S3 URL
//   } catch (err) {
//     console.error("Image upload failed:", err);
//     toast.error("Image upload failed");
//     return null;
//   }
// };


//   useEffect(() => {
//     // Load dynamic product categories
//     const categories = getFormFieldOptions("productCategory");
//     setProductCategories(categories.map(opt => opt.optionValue));
//   }, []);

//   // const onSubmit = (data: AddEntryForm) => {
//   //   if (!visitingCardFile) {
//   //     toast.error("Visiting card photo is required");
//   //     return;
//   //   }
//   //   if (!productImageFile) {
//   //     toast.error("Product photo is required");
//   //     return;
//   //   }

//   //   setIsLoading(true);
    
//   //   // Mock submission
//   //   setTimeout(() => {
//   //     toast.success("Entry added successfully!");
//   //     navigate("/dashboard");
//   //     setIsLoading(false);
//   //   }, 1500);
//   // };

//   const onSubmit = async (data) => {
//   try {
//     let visitingCardUrl = null;
//     let productImageUrl = null;

//     // Upload visiting card
//     if (data.visitingCardImage[0]) {
//       visitingCardUrl = await uploadImage(data.visitingCardImage[0]);
//     }

//     // Upload product image
//     if (data.productImage[0]) {
//       productImageUrl = await uploadImage(data.productImage[0]);
//     }

    

//     const payload = {
//       vendorName: data.vendorName,
//       companyName: data.companyName,
//       vendorState: data.vendorState,
//       vendorCity: data.vendorCity,
//       vendorAddress: data.vendorAddress,
//       gstNumber: data.gstNumber,
//       productCategory: data.productCategory,
//       productDescription: data.productDescription,
//       priceRange: data.priceRange,
//       keywords: data.keywords,
//       phone: data.phone,
//       email: data.email,
//       visitingCardImageUrl: visitingCardUrl,
//       productImageUrl: productImageUrl,
//     };

//     await axios.post("http://localhost:5000/api/vendor/add", payload, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//     });

//     toast.success("Vendor entry added!");
//     navigate("/dashboard");
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to add vendor entry");
//   }
// };


//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <Button variant="ghost" onClick={() => navigate("/dashboard")}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Dashboard
//         </Button>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-2xl text-primary">Add New Vendor-Product Entry</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               {/* Vendor Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="vendorName">Vendor Name *</Label>
//                 <Input
//                   id="vendorName"
//                   {...register("vendorName", { required: "Required" })}
//                   className={errors.vendorName ? "border-destructive" : ""}
//                 />
//                 {errors.vendorName && <p className="text-sm text-destructive">{errors.vendorName.message}</p>}
//               </div>

//               {/* Company Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="companyName">Company Name *</Label>
//                 <Input
//                   id="companyName"
//                   {...register("companyName", { required: "Required" })}
//                   className={errors.companyName ? "border-destructive" : ""}
//                 />
//                 {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
//               </div>

//               {/* Vendor State */}
//               <div className="space-y-2">
//                 <Label htmlFor="vendorState">Vendor State *</Label>
//                 <Select onValueChange={(value) => {
//                   setValue("vendorState", value);
//                   setValue("vendorCity", "");
//                 }}>
//                   <SelectTrigger className={errors.vendorState ? "border-destructive" : ""}>
//                     <SelectValue placeholder="Select state" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-popover z-50">
//                     {states.map((state) => (
//                       <SelectItem key={state} value={state}>
//                         {state}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <input type="hidden" {...register("vendorState", { required: "Required" })} />
//                 {errors.vendorState && <p className="text-sm text-destructive">{errors.vendorState.message}</p>}
//               </div>

//               {/* Vendor City */}
//               <div className="space-y-2">
//                 <Label htmlFor="vendorCity">Vendor City *</Label>
//                 <Select onValueChange={(value) => setValue("vendorCity", value)} disabled={!selectedState}>
//                   <SelectTrigger className={errors.vendorCity ? "border-destructive" : ""}>
//                     <SelectValue placeholder="Select city" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-popover z-50">
//                     {cities.map((city) => (
//                       <SelectItem key={city} value={city}>
//                         {city}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <input type="hidden" {...register("vendorCity", { required: "Required" })} />
//                 {errors.vendorCity && <p className="text-sm text-destructive">{errors.vendorCity.message}</p>}
//               </div>

//               {/* Other Area Name (conditional) */}
//               {selectedCity === "Others" && (
//                 <div className="space-y-2">
//                   <Label htmlFor="otherAreaName">Other Area Name *</Label>
//                   <Input
//                     id="otherAreaName"
//                     {...register("otherAreaName", { required: selectedCity === "Others" ? "Required when city is Others" : false })}
//                     className={errors.otherAreaName ? "border-destructive" : ""}
//                   />
//                   {errors.otherAreaName && <p className="text-sm text-destructive">{errors.otherAreaName.message}</p>}
//                 </div>
//               )}

//               {/* Vendor Address */}
//               <div className="space-y-2">
//                 <Label htmlFor="vendorAddress">Vendor Address *</Label>
//                 <Textarea
//                   id="vendorAddress"
//                   {...register("vendorAddress", { required: "Required" })}
//                   className={errors.vendorAddress ? "border-destructive" : ""}
//                 />
//                 {errors.vendorAddress && <p className="text-sm text-destructive">{errors.vendorAddress.message}</p>}
//               </div>

//               {/* GST Number */}
//               <div className="space-y-2">
//                 <Label htmlFor="gstNumber">GST Number *</Label>
//                 <Input
//                   id="gstNumber"
//                   {...register("gstNumber", {
//                     required: "Required",
//                     pattern: {
//                       value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
//                       message: "Invalid GST format"
//                     }
//                   })}
//                   maxLength={15}
//                   className={errors.gstNumber ? "border-destructive" : ""}
//                 />
//                 {errors.gstNumber && <p className="text-sm text-destructive">{errors.gstNumber.message}</p>}
//               </div>

//               {/* Product Category */}
//               <div className="space-y-2">
//                 <Label htmlFor="productCategory">Product Category *</Label>
//                 <Select onValueChange={(value) => setValue("productCategory", value)}>
//                   <SelectTrigger className={errors.productCategory ? "border-destructive" : ""}>
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-popover z-50">
//                     {productCategories.map((category) => (
//                       <SelectItem key={category} value={category}>
//                         {category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <input type="hidden" {...register("productCategory", { required: "Required" })} />
//                 {errors.productCategory && <p className="text-sm text-destructive">{errors.productCategory.message}</p>}
//               </div>

//               {/* Product Description */}
//               <div className="space-y-2">
//                 <Label htmlFor="productDescription">Product Description *</Label>
//                 <Textarea
//                   id="productDescription"
//                   {...register("productDescription", { required: "Required" })}
//                   className={errors.productDescription ? "border-destructive" : ""}
//                 />
//                 {errors.productDescription && <p className="text-sm text-destructive">{errors.productDescription.message}</p>}
//               </div>

//               {/* Price Range */}
//               <div className="space-y-2">
//                 <Label htmlFor="priceRange">Price Range *</Label>
//                 <Input
//                   id="priceRange"
//                   {...register("priceRange", { required: "Required" })}
//                   placeholder="e.g., ₹1,000 - ₹50,000"
//                   className={errors.priceRange ? "border-destructive" : ""}
//                 />
//                 {errors.priceRange && <p className="text-sm text-destructive">{errors.priceRange.message}</p>}
//               </div>

//               {/* Keywords */}
//               <div className="space-y-2">
//                 <Label htmlFor="keywords">Keywords</Label>
//                 <Input
//                   id="keywords"
//                   {...register("keywords")}
//                   placeholder="Comma-separated keywords"
//                 />
//               </div>

//               {/* Phone Number */}
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone Number *</Label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   {...register("phone", {
//                     required: "Required",
//                     pattern: {
//                       value: /^[0-9]{10}$/,
//                       message: "Must be 10 digits"
//                     }
//                   })}
//                   maxLength={10}
//                   className={errors.phone ? "border-destructive" : ""}
//                 />
//                 {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
//               </div>

//               {/* Email ID */}
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email ID *</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   {...register("email", {
//                     required: "Required",
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: "Invalid email"
//                     }
//                   })}
//                   className={errors.email ? "border-destructive" : ""}
//                 />
//                 {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
//               </div>

//               {/* Photo 1 - Visiting Card */}
//               {/* <div className="space-y-2">
//                 <Label htmlFor="visitingCard">Photo 1 - Visiting Card *</Label>
//                 <Input
//                   id="visitingCard"
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setVisitingCardFile(e.target.files?.[0] || null)}
//                 />
//               </div> */}

//               {/* Photo 2 - Product Photo */}
//               {/* <div className="space-y-2">
//                 <Label htmlFor="productImage">Photo 2 - Product Photo *</Label>
//                 <Input
//                   id="productImage"
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
//                 />
//               </div> */}

//               <div className="space-y-2">
//                 <label>Visiting Card Image</label>
//                 <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setVisitingCardFile(e.target.files?.[0] || null)}
//                 required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label>Product Image</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
//                   required
//                 />
//               </div>



//               <div className="flex gap-4 justify-end">
//                 <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Saving..." : "Add Entry"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


















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
  // --------------------------
  // UPLOAD IMAGE → S3
  // --------------------------
  // const uploadImage = async (file: File | null) => {
  //   if (!file) return null;

  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5000/api/upload/image",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //         },
  //       }
  //     );

  //     return res.data.imageUrl; // public S3 URL
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     toast.error("Image upload failed");
  //     return null;
  //   }
  // };

  const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    // const res = await axios.post("http://localhost:5000/api/upload/image", formData, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    //   },
    // });

    const res = await axios.post("http://localhost:5000/api/upload/image", formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "multipart/form-data",
  },
});


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

      await axios.post("http://localhost:5000/api/vendors", payload, {
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