import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import axios from "axios";
import { ArrowLeft, LogOut } from "lucide-react";

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
  gstNumber?: string;
  emails: { value: string }[];
  phones: { value: string }[];
  // productCategory: string;
  website?: string;
  productDescription: string;
  priceRange?: string;
  // keywords: string;
}


export default function AddEntry() {
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = 
useForm<AddEntryForm>({
  defaultValues: {
    emails: [{ value: "" }],
    phones: [{ value: "" }],
  },
});
const {
  fields: emailFields,
  append: addEmail,
  remove: removeEmail,
} = useFieldArray({
  control,
  name: "emails",
});

const {
  fields: phoneFields,
  append: addPhone,
  remove: removePhone,
} = useFieldArray({
  control,
  name: "phones",
});


  const [visitingCardFile, setVisitingCardFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const MAX_FILE_SIZE = 25 * 1024 * 1024; 


  const [isLoading, setIsLoading] = useState(false);

  const selectedState = watch("vendorState");
  const selectedCity = watch("vendorCity");

  const [stateList, setStateList] = useState([]);
const [cityList, setCityList] = useState([]);

const [selectedStateValue, setSelectedStateValue] = useState("");
const [selectedStateCode, setSelectedStateCode] = useState("");
const [selectedCityValue, setSelectedCityValue] = useState("");
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    toast.info("Logged out successfully");
    navigate("/", { replace: true });
  };
useEffect(() => {
  async function loadStates() {
    try {
      const res = await axios.get(`${API_BASE_URL}/location/states`);
      setStateList(res.data);
    } catch (error) {
      console.error("Failed to load states", error);
    }
  }
  loadStates();
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



  const onSubmit = async (data: AddEntryForm) => {

    
const cleanedEmails = data.emails
  .map(e => e.value.trim())
  .filter(Boolean);

const cleanedPhones = data.phones
  .map(p => p.value.trim())
  .filter(Boolean);


    setIsLoading(true);

    try {
      
      let visitingCardUrl = null;
      let productImageUrl = null;
      if (visitingCardFile) {
        visitingCardUrl = await uploadImage(visitingCardFile);
      }
      if (productImageFile) {
        productImageUrl = await uploadImage(productImageFile);
      }

      const payload = {
  ...data,
  emails: cleanedEmails,
  phones: cleanedPhones,
  ...(visitingCardUrl && { visitingCardImageUrl: visitingCardUrl }),
  ...(productImageUrl && { productImageUrl: productImageUrl }),
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

        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>


        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              Add New Vendor-Product Entry
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Vendor Name *</Label>
                <Input
                  {...register("vendorName", { required: "Required" })}
                  className={errors.vendorName ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  {...register("companyName", { required: "Required" })}
                  className={errors.companyName ? "border-destructive" : ""}
                />
              </div>



<div className="space-y-2">
  <Label>Vendor State *</Label>

  <Select
    value={selectedStateValue}
    onValueChange={(value) => {
      const [stateName, stateCode] = value.split("||");

      setValue("vendorState", stateName);

      setSelectedStateValue(value);

      setSelectedStateCode(stateCode);

      setValue("vendorCity", "");
      setCityList([]);

      axios
        .get(`${API_BASE_URL}/location/cities/${stateCode}`)
        .then((res) => setCityList(res.data))
        .catch((err) => console.error("City fetch error", err));
    }}
  >
    <SelectTrigger className={errors.vendorState ? "border-destructive" : ""}>
      <SelectValue placeholder="Select state" />
    </SelectTrigger>

    <SelectContent>
      {stateList.map((s) => (
        <SelectItem key={s.isoCode} value={`${s.name}||${s.isoCode}`}>
          {s.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  <input type="hidden" {...register("vendorState", { required: true })} />
</div>

{selectedCity === "Others" && (
                <div className="space-y-2">
                  <Label>Other Area Name *</Label>
                  <Input
                    {...register("otherAreaName", { required: "Required" })}
                  />
                </div>
              )}
<div className="space-y-2">
  <Label>Vendor City *</Label>

  <Select
    value={selectedCity || ""}
    disabled={cityList.length === 0}
    onValueChange={(cityName) => {
      setValue("vendorCity", cityName);
    }}
  >
    <SelectTrigger className={errors.vendorCity ? "border-destructive" : ""}>
      <SelectValue placeholder="Select city" />
    </SelectTrigger>

    <SelectContent>
      {cityList.map((c) => (
        <SelectItem key={c.name} value={c.name}>
          {c.name}
        </SelectItem>
      ))}
      <SelectItem value="Others">Others</SelectItem>
    </SelectContent>
  </Select>

  <input type="hidden" {...register("vendorCity", { required: true })} />
</div>

              <div className="space-y-2">
                <Label>Vendor Address *</Label>
                <Textarea {...register("vendorAddress", { required: "Required" })} />
              </div>

              <Label>GST Number</Label>
              <Input
              {...register("gstNumber", {
                pattern: {
                  value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                  message: "Invalid GST"
                }
                })}
              />

              <div className="space-y-2">
                <Label>Product Description *</Label>
                <Textarea {...register("productDescription", { required: "Required" })} />
              </div>

              <div className="space-y-2">
                <Label>Price Range</Label>
                <Input {...register("priceRange")} />
              </div>

              <div className="space-y-2">
  <Label>Phone Number(s)</Label>

  {phoneFields.map((field, index) => (
    <div key={field.id} className="flex gap-2">
<Input
  placeholder="10-digit phone"
  {...register(`phones.${index}.value`, {
    pattern: {
      value: /^[0-9]{10}$/,
      message: "10 digits only",
    },
  })}
/>


      {phoneFields.length > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => removePhone(index)}
        >
          ✕
        </Button>
      )}
    </div>
  ))}

  <Button type="button" variant="ghost" onClick={() => addPhone({ value: "" })}>
    + Add another phone
  </Button>
</div>


              <div className="space-y-2">
  <Label>Email(s)</Label>

  {emailFields.map((field, index) => (
    <div key={field.id} className="flex gap-2">
<Input
  type="email"
  placeholder="Enter email"
  {...register(`emails.${index}.value`, {
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email",
    },
  })}
/>


      {emailFields.length > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => removeEmail(index)}
        >
          ✕
        </Button>
      )}
    </div>
  ))}

  <Button type="button" variant="ghost" onClick={() => addEmail({ value: "" })}>
    + Add another email
  </Button>
</div>



<div className="space-y-2">
  <Label>Website</Label>
  <Input
    placeholder="https://example.com"
    {...register("website")}
  />
</div>



              <div className="space-y-2">
                <Label>Visiting Card Image</Label>
                <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > MAX_FILE_SIZE) {
                      toast.error("File too large! Max allowed is 25MB");
                      return;
                    }
                    setVisitingCardFile(file);
                  }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Product Image</Label>
                <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > MAX_FILE_SIZE) {
                      toast.error("File too large! Max allowed is 25MB");
                      return;
                    }
                    setProductImageFile(file);
                  }
                  }}
                />
              </div>

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