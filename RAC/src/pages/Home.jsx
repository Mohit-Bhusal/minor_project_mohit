import React, { useEffect } from 'react';

const Home = () => {
  return (
    <div className="h-screen px-2 lg:px-12 pt-20 lg:pt-24 flex flex-col lg:flex-row lg:justify-between bg-gradient-to-r from-amber-200 to-yellow-400 overflow-hidden gap-4 lg:gap-8 lg:my-0">
      <div className="flex flex-col gap-3 lg:gap-5 items-center lg:items-start lg:w-1/2 order-2 lg:order-1">
        <h1 className="text-8xl lg:text-[130px] font-bold lg:font-black">
          RAC
        </h1>
        <p className="text-xl text-center lg:text-start font-medium">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste,
          voluptatibus. Unde, at? Ipsa laboriosam animi atque provident
          voluptatum nam inventore vel, ullam, soluta blanditiis culpa.
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
