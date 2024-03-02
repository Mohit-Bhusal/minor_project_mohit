import React, { useEffect } from 'react';

const Home = () => {
  return (
    <div className="h-screen px-2 lg:px-12 pt-20 lg:pt-24 flex flex-col lg:flex-row lg:justify-between bg-gradient-to-r from-amber-200 to-yellow-400 overflow-hidden gap-4 lg:gap-8 lg:my-0">
      <div className="flex flex-col gap-3 lg:gap-5 items-center lg:items-start lg:w-1/2 order-2 lg:order-1">
        <h1 className="text-8xl lg:text-[130px] font-bold lg:font-black">
          RAC
        </h1>
        <p className="text-xl text-center lg:text-start font-medium">
        <h2>Dear RAC Club Member,</h2>
      <p>Welcome to the RAC Inventory Access Request Page. Here, you can request access to our inventory of resources and services tailored to enhance your RAC club experience. Please proceed with your access request below. Should you have any queries or require assistance, feel free to reach out to our dedicated support team, who are here to assist you every step of the way.</p>
      <p>Warm regards,</p>
      <p>[RAC President]</p>

        </p>
        <button
          className="px-4 py-2 text-lg bg-amber-100 border-yellow-500 border-2 rounded-sm active:scale-95 duration-500 hover:bg-yellow-500 hover:text-white font-semibold"
          onClick={() => alert('Button Clicked')}
        >
          Click Me
        </button>
      </div>
      <div className="lg:w-1/2 order-1 lg:order-2">
        <img src="/hero.jpg" alt="RAC" className="w-full rounded" />
      </div>
    </div>
  );
};
export default Home;
