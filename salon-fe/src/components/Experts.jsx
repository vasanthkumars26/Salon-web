const Experts = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
      <img
        src="https://images.unsplash.com/photo-1519415943484-9fa1873496d4"
        className="rounded-lg"
        alt="expert"
      />

      <div>
        <span className="uppercase tracking-widest text-sm text-gray-500">
          Experts in Field
        </span>
        <h2 className="text-4xl font-bold my-4">
          Best Unisex Beauty Salon
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Our team of internationally trained stylists deliver premium
          grooming, hair styling, and beauty services in a luxurious ambience.
        </p>

        <button className="mt-6 underline font-semibold">
          More About Us
        </button>
      </div>
    </section>
  );
};

export default Experts;
