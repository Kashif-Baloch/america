"use client";

const CountdownTimer = ({
  timeLeft,
}: {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}) => {
  return (
    <div className="relative w-full bg-[#1A1A1A] rounded py-4 px-4 sm:px-6 lg:px-8 ">
      <div className="absolute z-50 md:top-[-50px] md:left-[-40px] top-[-20px] left-[-20px]">
        <img src="/images/Logo.webp" className="h-[100px] w-auto" alt="" />
        <img
          src="/svgs/10.svg"
          alt="Logo"
          className="h-[100px] w-auto mt-[-5px]"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="font-bold md:text-8xl text-6xl mb-2 text-center text-white">
          20% de
        </h1>
        <div className="flex justify-end items-end w-full">
          <button className="bg-[red] mr-[-10px] text-white w-fit mb-[-33px] font-bold py-3 px-16 rounded-md text-2xl  transition-colors duration-300">
            DESCUENTO
          </button>
        </div>
        <div className="flex flex-col mt-14 items-center">
          {/* Timer */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-black">
                  {timeLeft.days.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-sm text-gray-300 mt-2">Days</span>
            </div>

            <div className="text-3xl font-bold text-white -mt-4">:</div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-black">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-sm text-gray-300 mt-2">Hours</span>
            </div>

            <div className="text-3xl font-bold text-white -mt-4">:</div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-black">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-sm text-gray-300 mt-2">Minutes</span>
            </div>

            <div className="text-3xl font-bold text-white -mt-4">:</div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-black">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-sm text-gray-300 mt-2">Seconds</span>
            </div>
          </div>

          <button className="bg-golden text-white w-full md:scale-[1.3] md:mb-[-33px] font-bold py-3 px-8 rounded-md transition-colors duration-300">
            ACCEDE A +240.000 EMPLEOS EN EE.UU
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
