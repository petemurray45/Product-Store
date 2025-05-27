import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";

export const useProductStore = create((set, get) => ({
  // products state
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");

      // close modal
      document.getElementById("add_product_modal").close();
    } catch (err) {
      console.log("Error in add product function", err);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      if (err.status === 429) {
        set({ error: "Rate limit exceeded", products: [] });
      } else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    console.log("Detele product function called", id);
    set({ loading: true });

    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.log("Error deleting product");
      if (err.response?.status === 429) toast.error("Something went wrong.");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });

    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, // prefill form with current product data
        error: null,
      });
    } catch (err) {
      console.log("Error in fetchProduct function", err);
      set({ err: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true });

    try {
      const { formData } = get();
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        formData
      );
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
    } catch (err) {
      toast.err("Something went wrong");
      console.log("Error in update product function", err);
    } finally {
      set({ loading: false });
    }
  },
}));
