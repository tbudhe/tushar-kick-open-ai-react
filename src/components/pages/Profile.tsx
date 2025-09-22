import React from 'react';
import ProfileCard from '../ProfileCard/ProfileCard';

const Profile: React.FC = () => {
    const profileData = {
        name: 'Tushar Budhe',
        title: 'Staff Software Engineer',
        location: 'Nutley, NJ',
        email: 'tbudhe23@gmail.com',
        phone: '+1(551)-XXX-XXX6',
        professionalSummary: 'Over 16 years of experience managing full project life cycles, covering architecture, analysis, design, development, testing, and implementation. Currently landed as a Staff Software Engineer with a proven track record in productivity and efficiency. Expertise in algorithm optimization, cloud computing, and scalability. Experienced in leading cross-functional teams to deliver projects on time, while meeting quality standards.',
        skills: [
            'Skilled in full stack development with JavaScript, TypeScript, Node.js, Microsoft stack, Java, Python, AI & ML etc.',
            'Expertise in web application development using C#, Java, ASP.NET, SQL Server, NodeJS, Python, AngularJS, Bootstrap, MVC, WCF, REST APIs, GraphQL, JavaScript, XML, XSLT, jQuery, MongoDB, HTML5, CSS, Redis, and both relational and non-relational databases.',
            'Proficient in MEAN/MERN stacks and Microsoft technologies (.NET, C#, ASP.NET, MVC, SQL, jQuery, Web API).',
            'Experience designing and implementing cloud solutions on AWS, Azure, Salesforce, and Google Cloud Platform.',
            'Experience in machine learning model architecture design with AI strategy development and implementation, deep learning systems engineering, MLOps pipeline optimization, and AI consulting and client advisory, predictive analytics, and statistical modeling.',
            'Strong analytical, problem-solving, and communication skills, with the ability to lead teams and manage multiple projects.',
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
                description: 'Developed core audit applications (OGS, GMS, SSO) for global tax filing, optimized SQL databases, and engineered secure onboarding systems.',
            }
        ],
        socialLinks: {
            linkedIn: 'https://www.linkedin.com/in/tbudhe',
            github: 'https://github.com/tbudhe',
        },
    };

    return (
        <div className="ProfilePage" style={{ textAlign: 'left', padding: '20px' }}>
            <ProfileCard {...profileData} />
        </div>
    );
};

export default Profile;
