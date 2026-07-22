'use client';

import { motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { renderMarkdown } from '@/lib/markdown';
import { fadeUp } from '@/lib/animations';

const PRIVACY_POLICY_MD = `# Privacy Policy

**Last Updated:** June 20, 2026

Welcome to **Hridayam Hope Foundation**. Your privacy is extremely important to us. This Privacy Policy describes how we collect, use, process, and protect your personal information when you visit our website, donate to our campaigns, apply for volunteer opportunities, or interact with our services.

---

### 1. Information We Collect

We collect information to provide better services to our donors, volunteers, and beneficiaries. The types of information we collect include:

- **Personal Information:** Name, email address, phone number, mailing address, date of birth, and identity proof (when required for volunteer vetting).
- **Payment Information:** When you make a donation, our third-party payment gateways (e.g., Razorpay) collect transaction details. We do not store credit/debit card numbers or bank credentials on our servers.
- **Engagement Information:** Details about your interests, volunteer preferences, languages spoken, skills, and emergency contacts.
- **Technical Data:** IP address, browser type, device information, and website usage data collected through cookies and similar technologies.

---

### 2. How We Use Your Information

We use the collected information for the following purposes:

- **Donation Processing:** To process donations securely and keep you updated on the impact of your contribution.
- **Volunteer Management:** To evaluate volunteer applications, coordinate campaign activities, and contact emergency relations if necessary.
- **Communication:** To send newsletter updates, campaign reports, event invitations, and respond to your inquiries. You can opt-out of newsletters at any time.
- **Security & Compliance:** To prevent fraud, ensure the security of our platform, and comply with legal and statutory requirements under Indian law.

---

### 3. Sharing of Information

Hridayam Hope Foundation does not sell, trade, or rent your personal information to third parties. We may share your data only in the following limited circumstances:

- **Service Providers:** Trusted partners who assist in operating our website, processing payments (e.g., Razorpay), or sending emails. These partners are bound by strict confidentiality agreements.
- **Legal Requirements:** If required by law, court order, or government authority to comply with legal obligations or protect the rights, safety, and security of the foundation, our community, or the public.

---

### 4. Data Security

We implement robust administrative, technical, and physical security measures to safeguard your personal data from unauthorized access, alteration, disclosure, or destruction. However, no transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.

---

### 5. Cookies and Tracking

Our website uses cookies to enhance your browsing experience, analyze site traffic, and understand how visitors interact with our content. You can choose to disable cookies through your browser settings, though some features of the website may not function optimally as a result.

---

### 6. Your Rights

You have the right to access, update, correct, or request the deletion of your personal information in our records. If you wish to exercise any of these rights, please contact us at [hridayamhopefoundation@gmail.com](mailto:hridayamhopefoundation@gmail.com).

---

### 7. Changes to this Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or statutory requirements. The updated policy will be posted on this page with the revised "Last Updated" date.

---

### 8. Contact Us

If you have any questions, concerns, or feedback regarding this Privacy Policy, please reach out to us:

**Hridayam Hope Foundation**  
Email: [hridayamhopefoundation@gmail.com](mailto:hridayamhopefoundation@gmail.com)  
Phone: +91 76740 28833  
Address: Andhra Pradesh, India`;

export default function PrivacyPolicyPage() {
	const htmlContent = renderMarkdown(PRIVACY_POLICY_MD);

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50/50">
				{/* Header Hero Area */}
				<section className="relative pt-20 pb-8 sm:pt-24 sm:pb-10 overflow-hidden bg-white border-b border-gray-100">
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute -top-12 -right-12 w-[250px] h-[250px] rounded-full bg-hp-primary/5 blur-[50px]" />
						<div className="absolute top-1/2 -left-12 w-[200px] h-[200px] rounded-full bg-hp-accent/5 blur-[50px]" />
					</div>

					<div className="relative z-10 mx-auto max-w-3xl px-5 lg:px-8 text-center">
						<motion.div
							initial="hidden"
							animate="visible"
							variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
						>
							<motion.h1
								variants={fadeUp}
								className="font-(family-name:--font-poppins) text-2xl sm:text-3xl md:text-4xl font-bold text-hp-text-dark leading-[1.1] tracking-tight"
							>
								Privacy Policy
							</motion.h1>
							<motion.p
								variants={fadeUp}
								className="mt-3 text-hp-text-light text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
							>
								We are committed to protecting your personal information and your right to privacy.
							</motion.p>
						</motion.div>
					</div>
				</section>

				{/* Markdown Content Section */}
				<section className="py-12 sm:py-16">
					<div className="mx-auto max-w-4xl px-5 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="bg-white rounded-2xl p-6 sm:p-10 md:p-16 border border-gray-100 shadow-xl shadow-black/[0.02]"
						>
							<div
								className="rich-content"
								dangerouslySetInnerHTML={{ __html: htmlContent }}
							/>
						</motion.div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
