const Hero = () => {
  return (
    <section className="relative h-[90vh] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e')"
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6">
        <div className="text-white max-w-xl">
          <h1 className="text-5xl font-bold mb-4 tracking-wide">
            WELCOME TO AURELIA SALON
          </h1>
          <p className="mb-6 text-lg">
            Premium unisex salon experience crafted by expert stylists.
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold">
            EXPLORE
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
