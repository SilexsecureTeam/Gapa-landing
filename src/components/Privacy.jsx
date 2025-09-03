import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 text-[#414141]">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link to="/" className="text-accent hover:underline">
          Home
        </Link>{" "}
        <span className="mx-2">›</span>
        <span className="text-secondary">Terms & Privacy Policy</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-primary mb-2">
        Terms & Privacy Policy
      </h1>
      <p className="text-sm text-text mb-6">Last Updated: 02/09/2025</p>

      {/* Introduction */}
      <section className="mb-8">
        <p className="leading-relaxed mb-4">
          GAPA Fix Ltd is committed to protecting your privacy and ensuring the
          security of your personal data in line with the Nigeria Data
          Protection Regulation (NDPR) 2019. By using our website, mobile app,
          or services; automobile repairs, maintenance, diagnostics, and related
          support, you agree to the terms outlined in this Policy.
        </p>
      </section>

      {/* Section 1: Information We Collect */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          1. Information We Collect
        </h2>
        <p className="leading-relaxed mb-4">
          We may collect the following categories of personal data:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4 text-text leading-relaxed">
          <li>
            <strong>Identity Data:</strong> Name, date of birth, gender,
            identification numbers.
          </li>
          <li>
            <strong>Contact Data:</strong> Phone number, email address, postal
            address.
          </li>
          <li>
            <strong>Transaction Data:</strong> Payment details, repair and
            service history, vehicle service history records.
          </li>
          <li>
            <strong>Technical Data:</strong> Device information, IP address,
            cookies, and browsing data.
          </li>
          <li>
            <strong>Sensitive Data (only if required):</strong> Health,
            biometric, or financial information (with explicit consent).
          </li>
        </ul>
      </section>

      {/* Section 2: Legal Basis for Processing */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          2. Legal Basis for Processing
        </h2>
        <p className="leading-relaxed mb-4">
          We process your data under the following lawful bases as provided by
          NDPR:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4 text-text leading-relaxed">
          <li>Consent</li>
          <li>Performance of a contract</li>
          <li>Legal obligation</li>
          <li>Vital interest</li>
          <li>Legitimate interest</li>
        </ul>
      </section>

      {/* Section 3: How We Use Your Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          3. How We Use Your Information
        </h2>
        <p className="leading-relaxed mb-4">We use your data to:</p>
        <ul className="list-disc list-inside space-y-2 mt-4 text-text leading-relaxed">
          <li>Provide and improve our services.</li>
          <li>
            Process transactions and deliver auto repair and maintenance
            services.
          </li>
          <li>
            Communicate important updates, security alerts, or policy changes.
          </li>
          <li>
            Personalize customer experience and recommend suitable car care
            solutions.
          </li>
          <li>Comply with regulatory and legal obligations.</li>
        </ul>
      </section>

      {/* Section 4: Data Subject Rights */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          4. Data Subject Rights (NDPR)
        </h2>
        <p className="leading-relaxed mb-4">
          Under the NDPR, you have the right to:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4 text-text leading-relaxed">
          <li>Request access to your personal data.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion (“right to be forgotten”).</li>
          <li>Withdraw consent at any time.</li>
          <li>Request data portability.</li>
          <li>Object to processing or restrict processing.</li>
        </ul>
      </section>

      {/* Section 5: Data Sharing & Third Parties */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          5. Data Sharing & Third Parties
        </h2>
        <p className="leading-relaxed mb-4">
          We do not sell your personal data. We may share information with:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4 text-text leading-relaxed">
          <li>
            Service providers and partners who help us operate our services.
          </li>
          <li>
            Regulators, law enforcement, or authorities where required by law.
          </li>
          <li>International partners, subject to NDPR-compliant safeguards.</li>
        </ul>
      </section>

      {/* Section 6: Data Retention */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          6. Data Retention
        </h2>
        <p className="leading-relaxed mb-4">
          We retain your personal data only as long as necessary for the
          purposes collected, unless a longer retention period is required by
          law.
        </p>
      </section>

      {/* Section 7: Security Measures */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          7. Security Measures
        </h2>
        <p className="leading-relaxed mb-4">
          We apply appropriate technical and organizational measures to protect
          your personal data from unauthorized access, disclosure, alteration,
          or destruction.
        </p>
      </section>

      {/* Section 8: International Data Transfers */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          8. International Data Transfers
        </h2>
        <p className="leading-relaxed mb-4">
          Where personal data is transferred outside Nigeria, we ensure such
          transfers comply with NDPR requirements, including adequate safeguards
          or user consent.
        </p>
      </section>

      {/* Section 9: Cookies & Tracking */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          9. Cookies & Tracking
        </h2>
        <p className="leading-relaxed mb-4">
          We use cookies and similar technologies to improve user experience.
          You may disable cookies in your browser settings, though some features
          may not work properly.
        </p>
      </section>

      {/* Section 10: Children’s Data */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          10. Children’s Data
        </h2>
        <p className="leading-relaxed mb-4">
          Our services are not directed at children under the age of 13, as
          vehicle repair and maintenance is an adult-focused service. We do not
          knowingly collect personal data from children without parental
          consent.
        </p>
      </section>

      {/* Section 11: Changes to this Policy */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          11. Changes to this Policy
        </h2>
        <p className="leading-relaxed mb-4">
          We may update this Policy periodically. Users will be notified of
          significant changes via email or platform notice.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
