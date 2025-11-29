// import { Navigate } from "react-router-dom";

// export default function PrivateRoute({ children }: { children: JSX.Element }) {
//   const token = localStorage.getItem("authToken");

//   if (!token) {
//     // If token is missing → go back to login
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }







import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
