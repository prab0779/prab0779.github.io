import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ScrollText } from "lucide-react";
import GradientText from "../Shared/GradientText";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-semibold text-white mb-3 border-b border-white/10 pb-2">{title}</h2>
    <div className="text-gray-400 leading-relaxed space-y-3 text-sm">{children}</div>
  </div>
);

export const TermsOfServicePage: React.FC = () => {
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
        <ScrollText className="w-7 h-7 text-yellow-500" />
        <GradientText variant="gold" className="text-3xl font-bold">
          Terms of Service
        </GradientText>
      </div>
      <p className="text-gray-500 text-sm mb-10">Last updated: May 3, 2026</p>

      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using <strong className="text-gray-300">AOT:R Value Hub</strong> ("the Site"), you agree to
          be bound by these Terms of Service. If you do not agree, please do not use the Site.
        </p>
        <p>
          AOT:R Value Hub is a third-party fan site and is not affiliated with, endorsed by, or connected to Attack on
          Titan Revolution or Roblox Corporation in any way.
        </p>
      </Section>

      <Section title="2. Use of the Site">
        <p>You agree to use the Site only for lawful purposes and in a manner that does not:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Violate any applicable laws or regulations.</li>
          <li>Infringe the rights of others, including intellectual property rights.</li>
          <li>Transmit spam, malware, or other harmful content.</li>
          <li>Attempt to gain unauthorised access to any part of the Site or its infrastructure.</li>
          <li>Scrape, harvest, or extract data from the Site without prior written consent.</li>
        </ul>
      </Section>

      <Section title="3. User Accounts">
        <p>
          To use certain features (such as posting trade advertisements), you must create an account. You are
          responsible for:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Maintaining the confidentiality of your login credentials.</li>
          <li>All activity that occurs under your account.</li>
          <li>Providing accurate information when registering.</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>
      </Section>

      <Section title="4. User-Generated Content">
        <p>
          The Site allows users to post trade advertisements and other content. By submitting content, you:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Confirm you have the right to post it.</li>
          <li>
            Grant us a non-exclusive, royalty-free licence to display it on the Site.
          </li>
          <li>
            Agree not to post content that is offensive, deceptive, harmful, or in violation of any laws.
          </li>
        </ul>
        <p>
          We reserve the right to remove any content at our discretion without notice.
        </p>
      </Section>

      <Section title="5. Item Values & Accuracy">
        <p>
          All item values displayed on AOT:R Value Hub are community estimates and opinions only. They do not
          represent official values and may not reflect current in-game market conditions.
        </p>
        <p>
          We make no guarantees regarding the accuracy, completeness, or timeliness of any value information. Use it
          as a guide only — trades are made at your own risk.
        </p>
      </Section>

      <Section title="6. Advertisements">
        <p>
          The Site displays third-party advertisements via <strong className="text-gray-300">Google AdSense</strong>.
          We are not responsible for the content of advertisements or the products/services they promote. Clicking
          on ads is entirely at your own discretion.
        </p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          All original content on the Site (including design, layout, and code) is owned by AOT:R Value Hub. Game
          assets, names, and imagery related to Attack on Titan Revolution belong to their respective owners.
        </p>
        <p>
          You may not reproduce, distribute, or create derivative works from Site content without explicit permission.
        </p>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <p>
          The Site is provided <strong className="text-gray-300">"as is"</strong> without warranties of any kind,
          express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses
          or other harmful components.
        </p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, AOT:R Value Hub and its operators shall not be liable for any
          indirect, incidental, special, or consequential damages arising from your use of or inability to use the
          Site, including but not limited to loss of in-game items or trades.
        </p>
      </Section>

      <Section title="10. Changes to These Terms">
        <p>
          We may modify these Terms at any time. Changes take effect immediately upon posting. Your continued use of
          the Site after changes are posted constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="11. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with applicable law. Any disputes shall be resolved
          through our community channels where possible.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions about these Terms? Reach out via our{" "}
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
        <Link to="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
        <Link to="/" className="hover:text-gray-300 transition">Home</Link>
      </div>

    </div>
  );
};
