import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";


export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <Image 
      src ="/investments.jpg"
      alt="investors_hub.jpg"
      width={300}
      height={300}
      className="rounded-xl shadow-lg object-cover w-full mb-10"
      />
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-green-900 mb-10 text-center">
        About EnergyVest
      </h1>

      <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-10 max-w-4xl mx-auto">
        At <span className="font-semibold text-green-700">Energy-Vest</span>, we are redefining
        the way people invest in the future. We are a global platform that merges
        financial intelligence with sustainability, empowering investors to build
        long-term wealth while accelerating innovation in renewable energy and
        environmentally conscious projects. Our mission is simple yet powerful:
        <strong> make smart investing accessible, transparent, and impactful for
        everyone.</strong>
      </p>

      {/* Who We Are */}
      <section className="mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
          Who We Are
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          Energy-Vest was founded by a team of passionate financial experts,
          engineers, and sustainability leaders who saw the need for a trusted,
          easy-to-use platform that combines wealth growth with real-world
          impact. We are proud to offer an ecosystem that is not only secure and
          regulated but also designed to simplify investing for both beginners
          and professionals.  
          <br /><br />
          Our platform allows you to access cutting-edge tools, detailed
          analytics, and verified investment opportunities while ensuring that
          every decision is backed by transparency and technology.  
          <br /><br />
          With a growing network of investors across the globe, Energy-Vest has
          become a symbol of financial empowerment and innovation.
        </p>
      </section>

      {/* Vision */}
      <section className="mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
          Our Vision
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          We envision a world where financial success and sustainability go hand
          in hand. With the global energy sector shifting rapidly towards
          renewable and eco-friendly solutions, our goal is to connect everyday
          investors to opportunities that not only deliver strong returns but
          also contribute to a healthier planet.  
          <br /><br />
          By leveraging advanced technologies such as AI-powered forecasting,
          blockchain-based transparency, and energy-sector analytics, we empower
          our community to invest smarter, faster, and with greater confidence.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
          Why Choose Energy-Vest
        </h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed text-sm sm:text-base space-y-2">
          <li>
            <strong>Full Transparency:</strong> Live reporting, real-time analytics,
            and full control over your portfolio.
          </li>
          <li>
            <strong>No Hidden Fees:</strong> We never charge for deposits or withdrawals —
            your money is fully yours.
          </li>
          <li>
            <strong>Bank-Grade Security:</strong> Multi-layer encryption, secure wallets,
            and regulated operations.
          </li>
          <li>
            <strong>Global Reach:</strong> Access investment opportunities worldwide
            across multiple sectors.
          </li>
          <li>
            <strong>Smart Technology:</strong> AI-driven insights and predictive analytics
            for better investment decisions.
          </li>
          <li>
            <strong>Impact-Driven:</strong> Every investment supports sustainable,
            environmentally conscious projects.
          </li>
        </ul>
      </section>

      {/* Our Core Values */}
      <section className="mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
          Our Core Values
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
          At Energy-Vest, we do not just invest in markets — we invest in people
          and a brighter future. Our core values define everything we do:
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed text-sm sm:text-base space-y-2">
          <li>
            <strong>Integrity:</strong> Honesty, fairness, and trust guide all
            our relationships and operations.
          </li>
          <li>
            <strong>Innovation:</strong> We constantly evolve with technology to
            give our users the best experience possible.
          </li>
          <li>
            <strong>Sustainability:</strong> We prioritize eco-conscious projects
            that protect our planet.
          </li>
          <li>
            <strong>Empowerment:</strong> We make financial growth simple and
            accessible to all.
          </li>
          <li>
            <strong>Excellence:</strong> We strive for exceptional service and
            results for every client.
          </li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          Join Us on the Journey
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto mb-6">
          Energy-Vest isn it just a platform; it is a movement. We are reshaping
          the future of investing by connecting thousands of investors to
          high-potential projects that drive wealth creation and positive
          environmental change. Whether you are a first-time investor or a
          seasoned trader, we are here to guide you every step of the way.
          <br /><br />
          <span className="font-semibold">Be part of a future where your
          investments create both profits and purpose.</span>
        </p>
      <Link href="/register">
       <button className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition">
          Start Your Investment Journey
        </button>
      </Link>
      <div className="mt-10">
        <Footer />
      </div>
      </section>
    </div>
  );
}
