const Settings = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <label className="block mb-2">Salon Name</label>
        <input className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2">Contact Email</label>
        <input className="w-full border p-2 rounded mb-4" />

        <button className="bg-black text-white px-6 py-2 rounded">
          Save Changes
        </button>
      </div>
    </>
  );
};

export default Settings;
