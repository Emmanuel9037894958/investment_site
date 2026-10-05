export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-900">
          Terms and Conditions
        </h1>

        <div className="space-y-6 text-gray-700 leading-7">
          <p>
            Welcome to Energy-Vest. By accessing or using this platform, you
            agree to comply with these Terms and Conditions.
          </p>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Use of the Platform
            </h2>
            <p>
              You agree to provide accurate information when creating and
              maintaining your account and to use the platform lawfully.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the security of your account
              credentials and for activities performed through your account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Transactions
            </h2>
            <p>
              All transactions submitted through the platform are subject to
              the applicable verification and processing procedures.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Changes to These Terms
            </h2>
            <p>
              Energy-Vest may update these Terms and Conditions when necessary.
              Updated terms will be made available through the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Contact
            </h2>
            <p>
              If you have questions about these Terms and Conditions, please
              contact the Energy-Vest support team.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}