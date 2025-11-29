import axios from "axios";
import API_BASE_URL from "../config/api";

const API_URL = `${API_BASE_URL}/categories`;

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
