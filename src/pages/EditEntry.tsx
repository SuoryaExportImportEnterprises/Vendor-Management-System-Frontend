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
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { useRef } from "react";

interface EditEntryForm {
  vendorName: string;
  companyName: string;
  vendorState: string;
  vendorCity: string;
  otherAreaName?: string;
  vendorAddress: string;
  gstNumber?: string;
  phone?: string;
  email?: string;
  productDescription: string;
  priceRange?: string;
}

interface StateItem {
  name: string;
  isoCode: string;
}

interface CityItem {
  name: string;
}


export default function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isInitialLoad = useRef(true);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<EditEntryForm>();
  const [visitingCardFile, setVisitingCardFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stateList, setStateList] = useState<StateItem[]>([]);
  const [cityList, setCityList] = useState<CityItem[]>([]);
  const selectedCity = watch("vendorCity");
  const [userChangedState, setUserChangedState] = useState(false);
  const hasInitialized = useRef(false);
  const [showLocationEditor, setShowLocationEditor] = useState(false);


  

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


//   useEffect(() => {
//   const init = async () => {
//     try {
//       const [entryRes, statesRes] = await Promise.all([
//         axios.get(`${API_BASE_URL}/vendors/${id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }),
//         axios.get(`${API_BASE_URL}/location/states`),
//       ]);

//       const entry = entryRes.data;
//       const states = statesRes.data;

//       // 1️⃣ states set
//       setStateList(states);

//       // 2️⃣ poora form reset (THIS IS IMPORTANT)
//       reset(entry);

//       // 3️⃣ selected state se cities nikaalo
//       const matchedState = states.find(
//         (s: StateItem) => s.name === entry.vendorState
//       );

//       if (matchedState) {
//         const cityRes = await axios.get(
//           `${API_BASE_URL}/location/cities/${matchedState.isoCode}`
//         );

//         // 4️⃣ city list set
//         setCityList(cityRes.data);
//         // ⚠️ city value reset se already set ho chuki hoti hai
//       }
//     } catch (err) {
//       toast.error("Failed to load entry");
//       navigate("/dashboard");
//     }
//   };

//   init();
// }, [id, reset, navigate]);


useEffect(() => {
  if (hasInitialized.current) return; // 👈 STOP second run
  hasInitialized.current = true;

  const init = async () => {
    try {
      const [entryRes, statesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/vendors/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }),
        axios.get(`${API_BASE_URL}/location/states`),
      ]);

      const entry = entryRes.data;
      const states = statesRes.data;

      setStateList(states);

      // reset once
      reset(entry);

      const matchedState = states.find(
        (s: StateItem) => s.name === entry.vendorState
      );

      if (matchedState) {
        const cityRes = await axios.get(
          `${API_BASE_URL}/location/cities/${matchedState.isoCode}`
        );

        setCityList(cityRes.data);
      }
    } catch (err) {
      toast.error("Failed to load entry");
      navigate("/dashboard");
    }
  };

  init();
}, [id, reset, navigate]);



const onSubmit = async (data: EditEntryForm) => {
  setIsLoading(true);

  try {
    let visitingCardUrl;
    let productImageUrl;

    if (visitingCardFile) {
      visitingCardUrl = await uploadImage(visitingCardFile);
    }

    if (productImageFile) {
      productImageUrl = await uploadImage(productImageFile);
    }

    const payload = {
      ...data,
      ...(visitingCardUrl && { visitingCardImageUrl: visitingCardUrl }),
      ...(productImageUrl && { productImageUrl: productImageUrl }),
    };

    await axios.put(`${API_BASE_URL}/vendors/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    toast.success("Entry updated successfully!");
    navigate("/dashboard");
  } catch (err) {
    toast.error("Failed to update entry");
  } finally {
    setIsLoading(false);
  }
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

                  {!showLocationEditor && (
  <div className="space-y-2 border rounded-md p-3 bg-muted">
    <p className="text-sm">
      <strong>State:</strong> {watch("vendorState") || "—"}
    </p>
    <p className="text-sm">
      <strong>City:</strong> {watch("vendorCity") || "—"}
    </p>

    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setShowLocationEditor(true)}
    >
      Change Location
    </Button>
  </div>
)}

                  {/* <div className="space-y-2">
  <Label>State *</Label>
  <select
    className="w-full border rounded-md p-2"
    {...register("vendorState", { required: "Required" })}
   onChange={(e) => {
  const stateName = e.target.value;
  setUserChangedState(true); // 👈 user action
  setValue("vendorState", stateName);

  const matchedState = stateList.find(
    (s) => s.name === stateName
  );

  if (!matchedState) return;

  axios
    .get(`${API_BASE_URL}/location/cities/${matchedState.isoCode}`)
    .then((res) => {
      setCityList(res.data);

      // 👇 NOW clear city ONLY because user changed state
      setValue("vendorCity", "");
    });
}}

  >
    <option value="">Select state</option>
    {stateList.map((s) => (
      <option key={s.isoCode} value={s.name}>
        {s.name}
      </option>
    ))}
  </select>
</div>


<div className="space-y-2">
  <Label>City *</Label>
  <select
    className="w-full border rounded-md p-2"
    {...register("vendorCity", { required: "Required" })}
  >
    <option value="">Select city</option>
    {cityList.map((c) => (
      <option key={c.name} value={c.name}>
        {c.name}
      </option>
    ))}
    <option value="Others">Others</option>
  </select>
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
                  )} */}
                  {showLocationEditor && (
  <>
    {/* State dropdown */}
    <div className="space-y-2">
      <Label>State *</Label>
      <select
        className="w-full border rounded-md p-2"
        {...register("vendorState", { required: "Required" })}
        onChange={(e) => {
          const stateName = e.target.value;
          setValue("vendorState", stateName);
          setValue("vendorCity", "");

          const matchedState = stateList.find(
            (s) => s.name === stateName
          );

          if (!matchedState) return;

          axios
            .get(`${API_BASE_URL}/location/cities/${matchedState.isoCode}`)
            .then((res) => setCityList(res.data));
        }}
      >
        <option value="">Select state</option>
        {stateList.map((s) => (
          <option key={s.isoCode} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
    </div>

    {/* City dropdown */}
    <div className="space-y-2">
      <Label>City *</Label>
      <select
        className="w-full border rounded-md p-2"
        {...register("vendorCity", { required: "Required" })}
      >
        <option value="">Select city</option>
        {cityList.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
        <option value="Others">Others</option>
      </select>
    </div>
  </>
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
  <Label htmlFor="gstNumber">GST Number</Label>
  <Input
    id="gstNumber"
    {...register("gstNumber", {
      pattern: {
        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        message: "Invalid GST format",
      },
    })}
    className={errors.gstNumber ? "border-destructive" : ""}
  />
  {errors.gstNumber && (
    <p className="text-sm text-destructive">{errors.gstNumber.message}</p>
  )}
</div>


                  <div className="space-y-2">
  <Label htmlFor="phone">Phone</Label>
  <Input
    id="phone"
    {...register("phone", {
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Must be 10 digits",
      },
    })}
    className={errors.phone ? "border-destructive" : ""}
  />
  {errors.phone && (
    <p className="text-sm text-destructive">{errors.phone.message}</p>
  )}
</div>


                  <div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    {...register("email")}
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
  <Label htmlFor="priceRange">Price Range</Label>
  <Input
    id="priceRange"
    {...register("priceRange")}
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