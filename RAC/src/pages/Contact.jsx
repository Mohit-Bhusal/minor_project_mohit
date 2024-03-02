// ContactPage.js
import React from 'react';

const Contact = () => {
  return (
    <div className="contact-page lg:h-screen">
      <header>
        <h1 className="text-6xl font-black py-4 lg:py-8 text-center">
          Contact Us
        </h1>
      </header>
      <div className="grid lg:grid-cols-2">
        <div className="text-2xl bg-white text-black border lg:border-r-0 py-8 lg:py-20 px-4 lg:px-20">
          <h2 className="font-bold">Email</h2>
          <a href="mailto:info@example.com">info@example.com</a>
        </div>
        <div className="text-2xl bgwhite text-black border lg:border-r-0 py-8 lg:py-20 px-4 lg:px-20">
          <h2 className="font-bold">Phone Number</h2>
          <a href="tel:+19864410395" className="font-mono">
            +1 986 441 0395
          </a>
        </div>
      </div>

      <div className="flex items-center flex-col lg:flex-row text-xl w-full justify-around py-8 lg:py-20">
        <div className="pb-6">
          <h2 className="font-bold text-3xl">Where Can You Find Us?</h2>
          <p>123 Main Street, Cityville, Country</p>
        </div>

        <section className="map select-none">
          <iframe
            title="Google Map"
            className=" w-full lg:w-96 h-64"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?q=123+Main+Street,Cityville,Country&key=YOUR_GOOGLE_MAPS_API_KEY`}
          ></iframe>
        </section>
      </div>
    </div>
  );
};

export default Contact;
