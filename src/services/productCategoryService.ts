import axios from "axios";

const API_URL = "http://localhost:5000/api/categories";

export async function fetchCategories() {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
  return res.data;
}

export async function addCategory(optionValue: string) {
  const res = await axios.post(
    API_URL,
    { optionValue },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    }
  );
  return res.data;
}

export async function updateCategory(id: string, optionValue: string) {
  const res = await axios.put(
    `${API_URL}/${id}`,
    { optionValue },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    }
  );
  return res.data;
}

export async function deleteCategory(id: string) {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
  return res.data;
}
