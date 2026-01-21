const Appointment = () => {
  return (
    <section className="py-16 px-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Book Appointment
      </h2>

      <form className="space-y-4">
        <input className="w-full border p-2" placeholder="Name" />
        <input type="date" className="w-full border p-2" />
        <select className="w-full border p-2">
          <option>Select Service</option>
          <option>Haircut</option>
          <option>Facial</option>
          <option>Makeup</option>
        </select>
        <button className="bg-black text-white w-full py-2 rounded">
          Book Now
        </button>
      </form>
    </section>
  );
};

export default Appointment;
