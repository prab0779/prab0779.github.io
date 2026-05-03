import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import GradientText from "../Shared/GradientText";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">{title}</h2>
    <div className="text-gray-400 leading-relaxed space-y-3 text-sm">{children}</div>
  </div>
);

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">

      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-10 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-7 h-7 text-yellow-500" />
        <GradientText variant="gold" className="text-3xl font-bold">
          Privacy Policy
        </GradientText>
      </div>
      <p className="text-gray-500 text-sm mb-10">Last updated: May 3, 2026</p>

      <Section title="1. Introduction">
        <p>
          Welcome to <strong className="text-gray-300">AOT:R Value Hub</strong> ("we", "us", or "our"), operated at{" "}
          <span className="text-gray-300">aotrvalue.com</span>. This Privacy Policy explains how we collect, use, and
          protect information when you visit our website.
        </p>
        <p>
          AOT:R Value Hub is a third-party fan site and is not affiliated with, endorsed by, or connected to Attack on
          Titan Revolution or Roblox Corporation in any way.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>We may collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <strong className="text-gray-300">Account information</strong> — email address and password when you
            register or log in.
          </li>
          <li>
            <strong className="text-gray-300">Trade advertisements</strong> — content you voluntarily submit, such as
            trade posts and Discord usernames.
          </li>
          <li>
            <strong className="text-gray-300">Usage data</strong> — anonymous data such as pages visited and time
            spent, collected via standard web analytics.
          </li>
          <li>
            <strong className="text-gray-300">Cookies</strong> — small files stored in your browser to maintain your
            session and preferences.
          </li>
        </ul>
        <p>We do not collect payment information. We do not knowingly collect data from children under 13.</p>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Operate and maintain the website and its features.</li>
          <li>Display trade advertisements you create.</li>
          <li>Authenticate your account securely.</li>
          <li>Improve the website experience through aggregate analytics.</li>
          <li>Display relevant advertisements via Google AdSense.</li>
        </ul>
        <p>We do not sell, rent, or trade your personal information to third parties.</p>
      </Section>

      <Section title="4. Google AdSense & Third-Party Advertising">
        <p>
          We use <strong className="text-gray-300">Google AdSense</strong> to display advertisements. Google may use
          cookies and similar technologies to show ads based on your prior visits to this and other websites.
        </p>
        <p>
          You can opt out of personalised advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 underline"
          >
            Google Ad Settings
          </a>{" "}
          or{" "}
          <a
            href="https://www.aboutads.info/choices"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 underline"
          >
            aboutads.info
          </a>
          .
        </p>
      </Section>

      <Section title="5. Data Storage & Security">
        <p>
          User data is stored securely using <strong className="text-gray-300">Supabase</strong>, which employs
          industry-standard encryption in transit and at rest. We implement reasonable security measures, but no
          method of transmission over the internet is 100% secure.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Object to or restrict certain processing.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us via our{" "}
          <a
            href="https://discord.gg/tradingcorps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 underline"
          >
            Discord server
          </a>
          .
        </p>
      </Section>

      <Section title="7. Links to Third-Party Sites">
        <p>
          Our website may contain links to external sites (e.g., Discord, Roblox). We are not responsible for the
          privacy practices or content of those sites. We encourage you to review their privacy policies.
        </p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last
          updated" date above. Continued use of the site after changes constitutes acceptance.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          If you have any questions about this Privacy Policy, please reach out via our{" "}
          <a
            href="https://discord.gg/tradingcorps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 underline"
          >
            Discord server
          </a>
          .
        </p>
      </Section>

      <div className="border-t border-white/10 pt-8 flex gap-6 text-sm text-gray-500">
        <Link to="/terms" className="hover:text-gray-300 transition">Terms of Service</Link>
        <Link to="/" className="hover:text-gray-300 transition">Home</Link>
      </div>

    </div>
  );
};
