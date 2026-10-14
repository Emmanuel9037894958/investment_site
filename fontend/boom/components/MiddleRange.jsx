"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import CheckIcon from "./CheckIcon";

const features = [
  "We are innovative: bringing future-driven solutions for modern investors.",
  "We are timely: delivering results when you need them most.",
  "We are reliable: trusted by clients across borders to safeguard and grow their wealth.",
];

function MiddleRange() {
  return (
    <section className="relative w-full bg-white text-gray-900 overflow-hidden">
      <div className="mx-auto grid min-h-[600px] w-full max-w-[1920px] grid-cols-1 lg:grid-cols-2 lg:items-center">
        {/* Left Content Area - Completely flat, text directly on the page background */}
        <div className="flex w-full flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 md:px-16 lg:px-20 xl:px-28 2xl:px-36">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-gray-950 sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
              Investment That Is{" "}
              <span className="text-orange-500">Suitable for You</span>
            </h2>

            <p className="mt-5 text-base font-medium leading-7 text-gray-600 sm:text-lg sm:leading-8 md:text-xl">
              Your financial freedom is our success.
            </p>

            {/* Feature List - Plain layout without any borders or card elements */}
            <div className="mt-10 space-y-6">
              {features.map((text, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                    <CheckIcon size={18} />
                  </div>

                  <p className="text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-4 border-t border-gray-100 pt-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-orange-400">
                <ArrowUpRight className="h-6 w-6" />
              </div>

              <div>
                <p className="font-bold text-gray-900 text-base sm:text-lg">
                  Built Around Your Ambitions
                </p>
                <p className="mt-0.5 text-sm text-gray-500 sm:text-base">
                  Explore opportunities that match your financial goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Media Area - Immersive responsive video view */}
        <div className="relative min-h-[420px] w-full overflow-hidden bg-gray-950 sm:min-h-[520px] lg:min-h-[720px] xl:min-h-[800px]">
          <video
            src="/woman.mp4"
            loop
            muted
            autoPlay
            playsInline
            preload="metadata"
            aria-label="Energy-vest promotional video"
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src="/woman.mp4" type="video/mp4" />
            Your browser does not support the video element.
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          <div className="absolute inset-x-0 top-0 p-6 sm:p-10 md:p-12">
            <span className="inline-flex rounded-full border border-white/30 bg-black/30 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              Energy-vest
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-12 lg:p-16">
            <div className="max-w-xl">
              <div className="mb-4 h-1.5 w-16 rounded-full bg-orange-500" />

              <h3 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Financial Freedom Is Our Success.
              </h3>

              <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base sm:leading-7 md:text-lg">
                Discover our approach to investment and building a future
                around your financial ambitions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MiddleRange;