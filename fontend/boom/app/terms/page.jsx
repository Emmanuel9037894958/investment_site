import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-900 mb-6 text-center sm:text-left">
        Terms & ConditionS
      </h1>
      <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed text-center sm:text-left">
        Welcome to Energy-Vest. These Terms & Conditions (“Terms”) govern your
        access to and use of our platform, services, and investment
        opportunities. By accessing or using Energy-Vest, you agree to these
        Terms. If you do not agree, please discontinue using our services.
      </p>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          1. General Information
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Energy-Vest is an innovative investment platform offering access to
          diversified financial and energy-based opportunities. By registering
          on our platform, you acknowledge that you are at least 18 years old
          and have the legal capacity to enter into a binding agreement.
        </p>
        <p className="text-gray-700 leading-relaxed">
          These Terms apply to all services, including portfolio management,
          trading tools, analytics dashboards, and educational resources
          provided through Energy-Vest. We may update these Terms at any time,
          and it is your responsibility to review them periodically.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          2. Eligibility & Account Creation
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          To use our services, you must complete the registration process by
          providing accurate personal and financial details. You are responsible
          for maintaining the confidentiality of your account credentials. Any
          unauthorized use of your account should be reported immediately.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We reserve the right to suspend or terminate accounts if fraudulent
          activity, misuse, or violation of these Terms is detected.
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          3. Investment Disclaimer & Risk Warning
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Investing involves risk, including the potential loss of capital.
          Energy-Vest provides access to investment opportunities but does not
          guarantee profits or returns. All investment decisions are made at
          your discretion, and we encourage you to seek independent financial
          advice before committing funds.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Past performance of investments does not indicate future performance.
          Energy-Vest is not liable for market losses or unexpected fluctuations
          in asset value.
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          4. Platform Usage & Restrictions
        </h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4">
          <li>You may not use Energy-Vest for fraudulent or illegal activities.</li>
          <li>Users must not attempt to hack, exploit, or disrupt platform security.</li>
          <li>All transactions must comply with AML and KYC policies.</li>
          <li>Unauthorized duplication or sharing of platform data is prohibited.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed">
          Failure to comply with these guidelines may result in account
          suspension or legal action.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          5. Fees & Withdrawals
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Energy-Vest is committed to providing a transparent and fair
          investment experience. We do{" "}
          <strong>not charge any fees</strong> for account creation, deposits,
          trading, or withdrawals. All profits you earn are 100% yours, and you
          may withdraw funds at any time in accordance with our security
          verification procedures.
        </p>
        <p className="text-gray-700 leading-relaxed">
          While we do not charge fees, please note that your payment provider or
          bank may apply standard transfer or processing fees. Energy-Vest has
          no control over these third-party charges.
        </p>
      </section>

      {/* Section 6 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          6. Security & Compliance
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We implement bank-grade encryption and strict regulatory compliance to
          ensure your data and funds remain secure. Users must comply with KYC
          verification and AML regulations for full access to trading features.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Any suspicious activity may lead to account suspension while
          investigations are conducted.
        </p>
      </section>

      {/* Section 7 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          7. Termination of Services
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Energy-Vest reserves the right to terminate or restrict access to
          accounts at any time, with or without notice, if these Terms are
          violated or fraudulent activity is suspected.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Users may close their accounts by contacting customer support, subject
          to settlement of outstanding obligations.
        </p>
      </section>

      {/* Section 8 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          8. Intellectual Property
        </h2>
        <p className="text-gray-700 leading-relaxed">
          All platform content, branding, designs, and data belong to
          Energy-Vest. Unauthorized reproduction or redistribution is strictly
          prohibited.
        </p>
      </section>

      {/* Section 9 */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          9. Governing Law
        </h2>
        <p className="text-gray-700 leading-relaxed">
          These Terms shall be governed by and interpreted under the laws of the
          jurisdiction in which Energy-Vest operates. Users agree to resolve any
          disputes through binding arbitration.
        </p>
      </section>

      <p className="text-gray-700 leading-relaxed mt-10 text-center sm:text-left">
        By using Energy-Vest, you acknowledge that you have read, understood,
        and agreed to these Terms & Conditions. We recommend reviewing this page
        regularly to stay informed about updates and changes.
      </p>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
