const Pricing = () => {
  const prices = [
    { role: "Creative Director", price: 1500 },
    { role: "Top Stylist", price: 1200 },
    { role: "Senior Stylist", price: 900 },
    { role: "Stylist", price: 800 },
    { role: "Kid's Haircut", price: 700 }
  ];

  return (
    <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
      <img
        src="https://images.unsplash.com/photo-1522337094846-8a818192de1a"
        className="rounded-lg"
      />

      <div>
        {prices.map((p, i) => (
          <div
            key={i}
            className="flex justify-between border-b py-4"
          >
            <h4 className="font-semibold">{p.role}</h4>
            <span className="font-bold">₹{p.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
