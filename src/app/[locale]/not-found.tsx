import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-dvh grid place-items-center font-sf">
      <div className="flex flex-col items-center gap-y-5">
        <h1 className="xl:text-[12vw] font-inter font-semibold sm:text-9xl text-8xl leading-[0.9] text-primary-blue animate-pulse">
          404
        </h1>
        <h3 className="font-inter capitalize font-medium text-center sm:text-3xl text-xl">
          the page you are looking not found
        </h3>
        <Link
          href={"/"}
          className=" bg-primary-blue mt-5 cursor-pointer duration-300  text-white w-56 md:h-14 h-12 text-lg py-2 rounded-full grid place-items-center font-semibold hover:bg-white hover:text-primary-blue border border-primary-blue "
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
