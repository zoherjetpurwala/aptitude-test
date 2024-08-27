import { useEffect, useState } from "react";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: "02",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const countdownDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const endTime = new Date().getTime() + countdownDuration;

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const hours = String(
        Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
        2,
        "0"
      );

      setTimeLeft({ hours, minutes, seconds });
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex items-start justify-center w-full gap-2">
      <div className="w-16">
        <div className="bg-primary py-4 px-2 rounded-lg overflow-hidden">
          <h3 className="font-semibold text-2xl text-center text-white">
            {timeLeft.hours}
          </h3>
        </div>
        <p className="text-lg font-medium mt-1 text-center w-full">hours</p>
      </div>
      <h3 className="font-semibold text-2xl">:</h3>
      <div className="w-16">
        <div className="bg-primary py-4 px-2 rounded-lg overflow-hidden">
          <h3 className=" font-semibold text-2xl text-center text-white">
            {timeLeft.minutes}
          </h3>
        </div>
        <p className="text-lg font-normal mt-1 text-center w-full">minutes</p>
      </div>
      <h3 className="font-semibold text-2xl ">:</h3>
      <div className="w-16">
        <div className=" py-4 px-2 bg-primary rounded-lg overflow-hidden">
          <h3 className="font-semibold text-2xl text-center text-white">
            {timeLeft.seconds}
          </h3>
        </div>
        <p className="text-lg font-normal  mt-1 text-center w-full">seconds</p>
      </div>
    </div>
  );
};

export default Countdown;
