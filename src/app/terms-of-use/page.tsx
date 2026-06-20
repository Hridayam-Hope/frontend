'use client';

import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { renderMarkdown } from '@/lib/markdown';
import { fadeUp } from '@/lib/animations';

const TERMS_OF_USE_MD = `# Terms of Use

**Last Updated:** June 20, 2026

Welcome to the website of **Hridayam Hope Foundation** ("we", "us", "our"). By accessing or using our website, donating, volunteering, or interacting with our services, you agree to comply with and be bound by the following Terms of Use. Please read them carefully.

---

### 1. Acceptance of Terms

By using this website, you acknowledge that you have read, understood, and agreed to these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our website.

---

### 2. Use of the Website

- You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit the use and enjoyment of this site by any third party.
- Harassment, posting defamatory, offensive, or obscene content, or disrupting the normal flow of dialogue within this website is strictly prohibited.
- You must not attempt to gain unauthorized access to our servers, databases, or systems through hacking, password mining, or any other malicious means.

---

### 3. Donations and Refund Policy

- **Donations:** All donations made to Hridayam Hope Foundation are voluntary. Donors must provide accurate personal and payment information.
- **Refunds:** As a non-profit organization utilizing funds for charitable activities, donations are generally non-refundable. However, if a donation was made in error or unauthorized, please contact us within 7 days of the transaction at [hridayamhopefoundation@gmail.com](mailto:hridayamhopefoundation@gmail.com) to request a review.

---

### 4. Intellectual Property

- All content on this website (including text, graphics, logos, images, audio/video clips, and software) is the property of Hridayam Hope Foundation or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
- You may view, download, and print content for personal, non-commercial use only. Any other use, including reproduction, modification, distribution, transmission, or display of the content, without prior written permission is strictly prohibited.

---

### 5. Third-Party Links

Our website may contain links to external websites operated by third parties (e.g., payment processors, social media networks). These links are provided for your convenience only. We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party websites.

---

### 6. Disclaimer of Warranties and Limitation of Liability

- This website and its content are provided on an "as is" and "as available" basis without any warranties of any kind, express or implied.
- Hridayam Hope Foundation does not guarantee that the website will be uninterrupted, error-free, secure, or free from viruses or other harmful components.
- In no event shall the foundation, its trustees, employees, or volunteers be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use or inability to use this website.

---

### 7. Indemnification

You agree to indemnify, defend, and hold harmless Hridayam Hope Foundation, its trustees, officers, employees, and volunteers from and against any claims, liabilities, damages, losses, or expenses (including legal fees) arising out of your violation of these Terms of Use or your misuse of the website.

---

### 8. Governing Law and Jurisdiction

These Terms of Use shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Andhra Pradesh, India.

---

### 9. Contact Information

If you have any questions or feedback regarding these Terms of Use, please contact us:

**Hridayam Hope Foundation**  
Email: [hridayamhopefoundation@gmail.com](mailto:hridayamhopefoundation@gmail.com)  
Phone: +91 76740 28833  
Address: Andhra Pradesh, India`;

export default function TermsOfUsePage() {
	const htmlContent = renderMarkdown(TERMS_OF_USE_MD);

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
								Terms of Use
							</motion.h1>
							<motion.p
								variants={fadeUp}
								className="mt-3 text-hp-text-light text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
							>
								Please read these terms carefully before using our website or donating.
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
