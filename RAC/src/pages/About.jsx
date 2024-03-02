import React from 'react';
const About = () => {
  return (
    <div className="lg:min-h-screen px-4 lg:px-20 py-4 lg:py-8">
      <div className="flex flex-col gap-1 pb-4">
        <p className="font-serif text-4xl">Header Title</p>
        <p className="font-serif text-2xl">Body Text</p>
      </div>
      <div className="relative lg:mb-32">
        <img
          src="https://emeritus.org/wp-content/uploads/2022/11/c11.png"
          alt=""
          className="w-full"
        />
        <div className="bg-[#fae7e0] text-black lg:w-96 flex justify-center items-start flex-col gap-2 p-6 my-4 w-full lg:mt-0 lg:absolute -bottom-32 left-32">
          <h1 className="text-xl font-bold">What we are</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel nemo
            velit recusandae voluptate. Sunt excepturi incidunt minima officiis
            fugit fuga.
          </p>
          <a href="/" className="underline text-slate-700">
            See More
          </a>
        </div>
        <p className="lg:absolute right-20 -bottom-24 text-2xl lg:text-4xl font-serif text-center">
          Text Here Lorem, ipsum.
        </p>
      </div>
    </div>
  );
};
export default About;
