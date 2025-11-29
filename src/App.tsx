// // import { Toaster } from "@/components/ui/toaster";
// // import { Toaster as Sonner } from "@/components/ui/sonner";
// // import { TooltipProvider } from "@/components/ui/tooltip";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import Login from "./pages/Login";
// // import Dashboard from "./pages/Dashboard";
// // import AddEntry from "./pages/AddEntry";
// // import EditEntry from "./pages/EditEntry";
// // import ViewEntry from "./pages/ViewEntry";
// // import FormFieldSettings from "./pages/FormFieldSettings";
// // import NotFound from "./pages/NotFound";
// // import PrivateRoute from "@/components/PrivateRoute";

// // const queryClient = new QueryClient();

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <TooltipProvider>
// //       <Toaster />
// //       <Sonner />
// //       <ToastContainer position="top-right" autoClose={3000} />
// //       <BrowserRouter>
// //         <Routes>
// //           <Route path="/" element={<Login />} />
// //           <Route path="/dashboard" element={<Dashboard />} />
// //           <Route path="/add" element={<AddEntry />} />
// //           <Route path="/edit/:id" element={<EditEntry />} />
// //           <Route path="/view/:id" element={<ViewEntry />} />
// //           <Route path="/form-field-settings" element={<FormFieldSettings />} />
// //           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
// //           <Route path="*" element={<NotFound />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </TooltipProvider>
// //   </QueryClientProvider>
// // );

// // export default App;























// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Pages
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import AddEntry from "./pages/AddEntry";
// import EditEntry from "./pages/EditEntry";
// import ViewEntry from "./pages/ViewEntry";
// import FormFieldSettings from "./pages/FormFieldSettings";
// import NotFound from "./pages/NotFound";

// // Auth wrapper
// import PrivateRoute from "@/components/PrivateRoute";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <ToastContainer position="top-right" autoClose={3000} />

//       <BrowserRouter>
//         <Routes>

//           {/* Public Route */}
//           <Route path="/" element={<Login />} />

//           {/* Protected Routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/add"
//             element={
//               <PrivateRoute>
//                 <AddEntry />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/:id"
//             element={
//               <PrivateRoute>
//                 <EditEntry />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/view/:id"
//             element={
//               <PrivateRoute>
//                 <ViewEntry />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/form-field-settings"
//             element={
//               <PrivateRoute>
//                 <FormFieldSettings />
//               </PrivateRoute>
//             }
//           />

//           {/* Catch-All */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;













































import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import EditEntry from "./pages/EditEntry";
import ViewEntry from "./pages/ViewEntry";
import FormFieldSettings from "./pages/FormFieldSettings";
import NotFound from "./pages/NotFound";
import PrivateRoute from "@/components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddEntry />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditEntry />
              </PrivateRoute>
            }
          />

          <Route
            path="/view/:id"
            element={
              <PrivateRoute>
                <ViewEntry />
              </PrivateRoute>
            }
          />

          <Route
            path="/form-field-settings"
            element={
              <PrivateRoute>
                <FormFieldSettings />
              </PrivateRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
