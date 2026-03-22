// ── Blog / Stories Data ─────────────────────────────────────────────
// Static data for the blog pages. Replace with CMS / API when ready.

export interface BlogAuthor {
	name: string;
	role: string;
	bio: string;
	avatar: string | null;
}

export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	highlight: string;
	content: BlogContentBlock[];
	category: string;
	featuredImage: string;
	author: BlogAuthor;
	publishedAt: string; // ISO date
	readTime: number; // minutes
	isFeatured: boolean;
}

export type BlogContentBlock =
	| { type: 'paragraph'; text: string }
	| { type: 'heading'; text: string }
	| { type: 'quote'; text: string }
	| { type: 'image'; src: string; alt: string; caption?: string };

export const BLOG_CATEGORIES = ['All', 'Education', 'Environment', 'Community'] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_AUTHORS: Record<string, BlogAuthor> = {
	kavita: {
		name: 'David Raju',
		role: 'Author',
		bio: 'A passionate advocate for social change and community development.',
		avatar: null,
	},
	rahul: {
		name: 'Rahul Sharma',
		role: 'Volunteer Coordinator',
		bio: 'Leading volunteer initiatives and sharing stories of impact from the field.',
		avatar: null,
	},
	priya: {
		name: 'Priya Menon',
		role: 'Content Writer',
		bio: 'Documenting the journey of communities transforming through education and care.',
		avatar: null,
	},
};

export const BLOG_POSTS: BlogPost[] = [
	{
		slug: 'how-education-transforms-communities',
		title: 'How Education Transforms Communities: Stories from the Field',
		excerpt:
			'Discover how our education programs are creating ripple effects of change in rural communities across India.',
		highlight:
			'Discover how our education programs are creating ripple effects of change in rural communities across India.',
		content: [
			{
				type: 'paragraph',
				text: 'Education is the most powerful weapon which you can use to change the world. At Hridayam Hope Foundation, we\'ve witnessed this firsthand through our programs...',
			},
			{
				type: 'paragraph',
				text: 'At Hridayam Hope Foundation, we believe that every individual has the power to create meaningful change. Through our programs, we\'ve witnessed countless stories of transformation, resilience, and hope. This article explores the journey of those we serve and the impact of community-driven initiatives.',
			},
			{
				type: 'heading',
				text: 'The Power of Community',
			},
			{
				type: 'paragraph',
				text: 'Our work is built on the foundation of community engagement. When people come together with a shared purpose, incredible things happen. We\'ve seen villages transform, children gain access to education, and families find stability through collective action.',
			},
			{
				type: 'heading',
				text: 'Looking Forward',
			},
			{
				type: 'paragraph',
				text: 'As we continue our mission, we remain committed to transparency, impact, and sustainable change. Every donation, every volunteer hour, and every act of kindness contributes to building a better future for those who need it most.',
			},
		],
		category: 'Education',
		featuredImage: '/program_2.webp',
		author: BLOG_AUTHORS.kavita,
		publishedAt: '2026-03-11',
		readTime: 5,
		isFeatured: true,
	},
	{
		slug: '1000-trees-and-counting',
		title: '1000 Trees and Counting: Our Green Earth Journey',
		excerpt:
			'A look back at our tree plantation drive milestones and the environmental impact we\'ve created together.',
		highlight:
			'Our plantation drives have grown from small community events to large-scale environmental restoration projects across multiple districts.',
		content: [
			{
				type: 'paragraph',
				text: 'When we planted our first sapling two years ago, we had a simple dream — to make our surroundings greener. Today, that dream has blossomed into something far greater. With over 1,000 trees planted across multiple districts, we\'re not just adding greenery — we\'re building ecosystems.',
			},
			{
				type: 'heading',
				text: 'From One Sapling to a Forest',
			},
			{
				type: 'paragraph',
				text: 'Our journey began in Chevella, where a small group of 15 volunteers planted 50 saplings on a hot March morning. The energy was infectious — locals joined in, children asked questions about the species we were planting, and by the end of the day, something had shifted. People started caring more about their environment.',
			},
			{
				type: 'quote',
				text: 'Every tree we plant is a promise to future generations. It\'s not just about oxygen — it\'s about hope, shade, and a cooler planet.',
			},
			{
				type: 'heading',
				text: 'The Ripple Effect',
			},
			{
				type: 'paragraph',
				text: 'What started as plantation drives evolved into comprehensive environmental awareness campaigns. Schools began incorporating tree-planting into their calendars. Local panchayats reached out to collaborate. And our volunteers became environmental ambassadors in their own neighbourhoods.',
			},
			{
				type: 'heading',
				text: 'What\'s Next',
			},
			{
				type: 'paragraph',
				text: 'Our goal for 2027 is ambitious — 5,000 trees across 10 districts. We\'re partnering with forest departments, agricultural universities, and corporate sponsors to make this possible. If you\'d like to sponsor a tree or join a drive, we\'d love to have you.',
			},
		],
		category: 'Environment',
		featuredImage: '/blog_2.webp',
		author: BLOG_AUTHORS.rahul,
		publishedAt: '2026-03-11',
		readTime: 4,
		isFeatured: false,
	},
	{
		slug: 'volunteer-spotlight-heroes-behind-our-mission',
		title: 'Volunteer Spotlight: Meet the Heroes Behind Our Mission',
		excerpt:
			'Celebrating the incredible volunteers who dedicate their time and skills to making a difference.',
		highlight:
			'Behind every successful program is a team of passionate volunteers who give their time, energy, and heart to the cause.',
		content: [
			{
				type: 'paragraph',
				text: 'At the heart of every initiative at Hridayam Hope Foundation are our volunteers — the incredible individuals who show up, roll up their sleeves, and create change. This month, we\'re shining a spotlight on three volunteers whose dedication has been truly extraordinary.',
			},
			{
				type: 'heading',
				text: 'Sanjay — The Weekend Warrior',
			},
			{
				type: 'paragraph',
				text: 'Sanjay is a software engineer by profession, but every weekend, he transforms into a passionate educator. From teaching math to rural students to conducting digital literacy workshops, Sanjay has clocked over 200 volunteer hours in the past year alone. "I get more than I give," he says with a smile.',
			},
			{
				type: 'heading',
				text: 'Meera — The Community Connector',
			},
			{
				type: 'paragraph',
				text: 'Meera\'s superpower is her ability to connect with people. She\'s helped us forge partnerships with 12 local organisations, facilitated health camps in 8 villages, and trained 30 new volunteers. Her warmth and organisational skills are the backbone of our outreach programs.',
			},
			{
				type: 'quote',
				text: 'Volunteering isn\'t about having extra time. It\'s about making time for what matters. — Meera',
			},
			{
				type: 'heading',
				text: 'Arvind — The Green Champion',
			},
			{
				type: 'paragraph',
				text: 'Arvind has been part of every single plantation drive we\'ve organised. He surveys locations, identifies native species, and coordinates logistics. Thanks to his efforts, our tree survival rate is an impressive 87% — well above the national average for plantation programs.',
			},
			{
				type: 'heading',
				text: 'Join the Tribe',
			},
			{
				type: 'paragraph',
				text: 'These three represent hundreds of volunteers who power our mission every day. If their stories inspire you, consider joining our volunteer family. Whether you have a few hours a week or a full day a month, your contribution matters more than you think.',
			},
		],
		category: 'Community',
		featuredImage: '/volunteers.webp',
		author: BLOG_AUTHORS.priya,
		publishedAt: '2026-02-15',
		readTime: 6,
		isFeatured: false,
	},
];

export function getBlogPost(slug: string): BlogPost | undefined {
	return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getFilteredPosts(category: BlogCategory): BlogPost[] {
	if (category === 'All') return BLOG_POSTS;
	return BLOG_POSTS.filter((post) => post.category === category);
}

export function getFeaturedPost(): BlogPost | undefined {
	return BLOG_POSTS.find((post) => post.isFeatured);
}

export function getRelatedPosts(currentSlug: string, limit = 2): BlogPost[] {
	const current = getBlogPost(currentSlug);
	if (!current) return BLOG_POSTS.slice(0, limit);
	return BLOG_POSTS.filter((post) => post.slug !== currentSlug && post.category === current.category).slice(0, limit);
}
