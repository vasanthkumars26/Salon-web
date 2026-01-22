import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://salon-server-gurw.onrender.com/api/services";
const BASE_URL = "https://salon-server-gurw.onrender.com";

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  /* FETCH SERVICES */
  const fetchServices = async () => {
    const res = await axios.get(API);
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* IMAGE PREVIEW */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  /* ADD / UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    if (editId) {
      await axios.put(`${API}/${editId}`, formData);
    } else {
      await axios.post(API, formData);
    }

    setForm({ name: "", price: "", description: "", image: null });
    setEditId(null);
    setPreview(null);
    fetchServices();
  };

  /* EDIT */
  const handleEdit = (service) => {
    setEditId(service._id);
    setForm({
      name: service.name,
      price: service.price,
      description: service.description,
      image: null,
    });
    setPreview(`${BASE_URL}${service.image}`);
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (confirm("Delete this service?")) {
      await axios.delete(`${API}/${id}`);
      fetchServices();
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Manage Services</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-10 space-y-4 max-w-xl"
      >
        <h2 className="text-xl font-semibold">
          {editId ? "Edit Service" : "Add Service"}
        </h2>

        <input
          placeholder="Service Name"
          required
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Price (₹)"
          required
          className="w-full border p-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-full object-cover rounded border"
          />
        )}

        <button className="bg-black text-white px-6 py-2 rounded">
          {editId ? "Update Service" : "Add Service"}
        </button>
      </form>

      {/* SERVICES LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s._id} className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg">{s.name}</h3>
            <p className="text-gray-600">₹{s.price}</p>
            <p className="text-sm mt-1 text-gray-500">{s.description}</p>

            {s.image && (
              <img
                src={`${BASE_URL}${s.image}`}
                alt={s.name}
                className="h-32 w-full object-cover rounded mt-3"
              />
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(s)}
                className="border px-4 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="border px-4 py-1 rounded text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ServicesAdmin;
