export default function Features() {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">
          Why Choose <span className="text-blue-700">Energvest?</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Secure Investments</h3>
            <p className="text-gray-600">
              Your funds are protected with the highest level of security and transparency.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">High Returns</h3>
            <p className="text-gray-600">
              Earn up to <span className="font-bold">15% ROI</span> on selected plans.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Fast Withdrawals</h3>
            <p className="text-gray-600">
              Withdraw your profits quickly and securely anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
