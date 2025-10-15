"use client";
import React from "react";
import CheckIcon from "./CheckIcon";

function MiddleRange() {
  return (
    <section className="p-6 grid md:grid-cols-2 gap-8 items-center">
      {/* Text & Features */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Investment that is suitable for you
        </h1>
        <p className="text-orange-500 text-lg sm:text-xl mt-2">
          Your financial freedom is our success
        </p>

        <div className="mt-6 space-y-3">
          {[
            "We are innovative: bringing future-driven solutions for modern investors.",
            "We are timely: delivering results when you need them most.",
            "We are reliable: trusted by clients across borders to safeguard and grow their wealth.",
          ].map((text, index) => (
            <div key={index} className="flex gap-3 items-center">
              <CheckIcon size={18} />
              <h4 className="text-gray-800 font-medium text-sm sm:text-base">
                {text}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        {/* Overlay Text */}
        <h3
          className="absolute top-6 sm:top-10 left-3 sm:left-5 
                     text-sm sm:text-lg md:text-xl lg:text-2xl 
                     font-bold text-white drop-shadow-md max-w-[80%]"
        >
          Financial freedom is our success.
        </h3>

        {/* Video */}
        <video
          src="/woman.mp4"
          loop
          muted
          autoPlay
          playsInline
          className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] object-cover"
        >
          <source src="/woman.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

export default MiddleRange;
