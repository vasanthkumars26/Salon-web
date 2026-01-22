import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import {auth} from "../config/firebase";
import ProductCard from "../components/ProductCard";

// const API = "https://salon-server-gurw.onrender.com/api/products";
const PRODUCTS_API = import.meta.env.VITE_PRODUCTS_API;

const ADMIN_UID = "YuGcmQdwEHd8zeLcsk1Oiq62v9b2";

/* 🔹 Animation Variants */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState(null);

  /* 🔐 ADMIN CHECK */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.uid === ADMIN_UID);
    });
    return () => unsub();
  }, []);

  /* FETCH PRODUCTS */
  const fetchProducts = async () => {
    const res = await fetch(PRODUCTS_API);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* FILE PREVIEW */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  /* ADD / UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${PRODUCTS_API}/${editId}` : PRODUCTS_API;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);

    if (file) formData.append("image", file);
    else formData.append("imageUrl", form.image);

    await fetch(url, { method, body: formData });

    setForm({ name: "", price: "", image: "" });
    setFile(null);
    setPreview("");
    setEditId(null);
    fetchProducts();
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, price: p.price, image: p.image });
    setPreview(p.image);
    setEditId(p._id);
    setFile(null);
  };

  const handleDelete = async (id) => {
    await fetch(`${PRODUCTS_API}/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 px-6 max-w-7xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center mb-8">
        Salon Products
      </h2>

      {/* 🔐 ADMIN PANEL (unchanged logic) */}
      {isAdmin && (
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-lg p-6 rounded-xl max-w-xl mx-auto mb-12 space-y-4"
          onSubmit={handleSubmit}
        >
          <h3 className="text-xl font-semibold text-center">
            {editId ? "Edit Product" : "Add Product"}
          </h3>

          <input
            placeholder="Product Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            required
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <input
            type="url"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={(e) => {
              setForm({ ...form, image: e.target.value });
              setPreview(e.target.value);
              setFile(null);
            }}
            className="w-full border p-3 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-3 rounded"
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="h-40 mx-auto rounded object-cover"
            />
          )}

          <button className="w-full bg-black text-white py-2 rounded">
            {editId ? "Update" : "Add Product"}
          </button>
        </motion.form>
      )}

      {/* 🛍 PRODUCTS GRID WITH SCROLL ANIMATION */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
  {products.map((p) => (
    <motion.div
      key={p._id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ProductCard
        product={p}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </motion.div>
  ))}
</div>
    </motion.section>
  );
};

export default Products;
