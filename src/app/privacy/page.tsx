import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for WhimsicalWrites',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto prose prose-neutral prose-headings:font-heading prose-headings:font-bold prose-headings:uppercase prose-a:underline-offset-4">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p>Welcome to WhimsicalWrites. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website.</p>

        <h2>1. Information We Collect</h2>
        <p>We do not collect personal information unless you explicitly provide it to us (e.g., through a contact form or newsletter signup). We may automatically collect non-personally identifiable information, such as IP address, browser type, and operating system, for analytics purposes.</p>

        <h2>2. Cookies and Tracking</h2>
        <p>WhimsicalWrites uses cookies to enhance your browsing experience. A cookie is a small text file stored on your device. We use cookies for analytics and to serve relevant advertisements.</p>

        <h2>3. Google Analytics</h2>
        <p>We use Google Analytics 4 to understand how visitors interact with our website. Google Analytics uses cookies to collect data such as page views, time on site, and referral sources. This data is aggregated and anonymized. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.</p>

        <h2>4. Advertising and Google AdSense</h2>
        <p>We may use Google AdSense to display advertisements on our site. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your browsing history. You may opt out of personalized advertising by visiting Google's Ads Settings.</p>

        <h2>5. Third-Party Links</h2>
        <p>Our website may contain links to carefully selected third-party sites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.</p>

        <h2>6. Data Security</h2>
        <p>We take reasonable measures to protect your data from unauthorized access, alteration, or disclosure. However, no internet transmission is entirely secure, and we cannot guarantee absolute security.</p>

        <h2>7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@whimsicalwrites.com">hello@whimsicalwrites.com</a>.</p>
      </div>
    </div>
  );
}
