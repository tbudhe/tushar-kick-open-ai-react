import React from 'react';
import ProfileCard from '../profile-card/profile-card';

const Home: React.FC = () => {
	const profileData = {
		name: 'Tushar Budhe',
		title: 'Staff Software Engineer',
		location: 'Nutley, NJ',
		email: 'tbudhe23@gmail.com',
		phone: '+1(551)-XXX-XXX6',
		professionalSummary:
			'Over 16 years of experience managing full project life cycles, covering architecture, analysis, design, development, testing, and implementation. Currently landed as a Staff Software Engineer with a proven track record in productivity and efficiency. Expertise in algorithm optimization, cloud computing, and scalability. Experienced in leading cross-functional teams to deliver projects on time, while meeting quality standards.',
		skillGroups: [
			{
				title: 'Full-stack & web development',
				items: [
					'JavaScript',
					'TypeScript',
					'Node.js',
					'Java',
					'Kotlin',
					'Python',
					'HTML5',
					'CSS',
					'Bootstrap',
					'AngularJS',
					'REST APIs',
					'SOAP APIs',
					'GraphQL',
					'Web API',
					'XML',
					'XSLT',
					'jQuery',
					'MongoDB',
					'Redis',
				],
			},
			{
				title: 'Microsoft/.NET & MEAN/MERN',
				items: [
					'Microsoft stack',
					'.NET',
					'C#',
					'ASP.NET',
					'MVC',
					'WCF',
					'SQL Server',
					'Python',
					'MEAN',
					'MERN',
				],
			},
			{
				title: 'Cloud platforms',
				items: ['AWS', 'Azure', 'Salesforce', 'Google Cloud Platform'],
			},
			{
				title: 'Database core',
				items: [
					'Relational: replication, read replicas, failover',
					'NoSQL: replica sets, sharding, partitioning',
					'Indexing and query tuning',
					'Consistency and durability tradeoffs',
				],
			},
			{
				title: 'AI/ML architecture and MLOps',
				items: [
					'AI strategy',
					'Deep learning engineering',
					'MLOps pipeline optimization',
					'AI consulting',
					'Predictive analytics',
					'Statistical modeling',
				],
			},
			{
				title: 'Leadership and communication',
				items: ['Analytical thinking', 'Problem solving', 'Team leadership', 'Communication'],
			},
			{
				title: 'DevOps Tools',
				items: [
					'Docker',
					'Kubernetes',
					'Torbit',
					'Looper',
					'Jenkins',
					'Traffic Manager',
					'Load Balancer',
					'CDN',
					'DNS configuration',
					'VNet and subnet security',
					'IP whitelisting',
					'Blue-Green Deployment',
					'CI/CD Setup',
					'Canary Deployment',
					'Sticky sessions (Apache)',
					'Docker session management',
				],
			},
		],
		experience: [
			{
				company: 'Walmart Global Tech',
				role: 'Staff Software Engineer',
				duration: 'Oct 2021 – Present',
				description: 'Led Scan & Go fuel integration and AI-driven catalog management.',
			},
			{
				company: 'Fidelity',
				role: 'Senior Software Developer',
				duration: 'Jan 2016 – Oct 2021',
				description: 'Built microservices and crypto trading platform.',
			},
			{
				company: 'EY (Ernst & Young)',
				role: 'Senior Software Developer',
				duration: 'Aug 2009 – Jan 2016',
				description:
					'Developed core audit applications (OGS, GMS, SSO) for global tax filing, optimized SQL databases, and engineered secure onboarding systems.',
			},
		],
		socialLinks: {
			linkedIn: 'https://www.linkedin.com/in/tbudhe',
			github: 'https://github.com/tbudhe',
		},
	};

	return (
		<div className="ProfilePage" style={{ textAlign: 'left', padding: '12px' }}>
			<ProfileCard {...profileData} />
		</div>
	);
};

export default Home;
