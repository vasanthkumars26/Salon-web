const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div>
          <h4 className="font-bold mb-4">Corporate Office</h4>
          <p>Chennai, India</p>
          <p>+91 70944 79145</p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <span>FB</span>
            <span>IG</span>
          </div>
        </div>

        <iframe
          title="map"
          className="w-full h-40"
          src="https://maps.google.com/maps?q=chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
      </div>

        <div className="text-center py-6">© 2026 Luxury Unisex Salon. All Rights Reserved.</div>
      </footer>
    
  );
};

export default Footer;
