const ServiceCard = ({ title }) => {
  return (
    <div className="border p-6 rounded shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">
        Premium quality service delivered by expert stylists.
      </p>
    </div>
  );
};

export default ServiceCard;
