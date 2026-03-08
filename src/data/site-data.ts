// import { AlumniEntry } from '@/group/shared/types/alumni';

import { Alumni } from '@/features/alumni/types/alumni.types';
import { BlogPost } from '@/features/announcements/types/announcement.types';
import { Event } from '@/features/events/types/event.types';

const alumni = [
  {
    name: 'Emma Rodriguez',
    slug: 'emma-rodriguez',
    chapter: 'Civil Engineering',
    year: 2023,
    short_bio: 'Civil engineer focused on sustainable infrastructure and green building design',
    long_bio:
      'Emma is a passionate civil engineer dedicated to creating sustainable infrastructure solutions. She specializes in green building design and environmental impact assessment.',
    photo: '/images/avatars/default-avatar.svg',
    email: 'emma.rodriguez@email.com',
    location: 'Portland, OR',
    company: 'GreenBuild Engineering',
    position: 'Sustainability Engineer',
    skills: [
      'Structural Design',
      'Sustainability',
      'LEED Certification',
      'AutoCAD',
      'Environmental Assessment',
    ],
    projects: [
      {
        name: 'Eco-Friendly Office Complex',
        description: 'LEED Platinum certified office building with sustainable features',
        url: 'https://greenbuild.com/office-complex',
      },
      {
        name: 'Green Bridge Design',
        description: 'Sustainable bridge design incorporating renewable materials',
        url: 'https://greenbuild.com/bridge',
      },
    ],
    work_experience: [
      {
        company: 'GreenBuild Engineering',
        position: 'Sustainability Engineer',
        duration: '2023 - Present',
        description: 'Leading sustainable design projects and LEED certification',
      },
      {
        company: 'City Planning Department',
        position: 'Civil Engineer Intern',
        duration: '2022 - 2023',
        description: 'Assisted in urban planning and infrastructure projects',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Engineering in Civil Engineering',
        institution: 'University of Technology',
        year: 2023,
        gpa: '3.7/4.0',
      },
    ],
    achievements: [
      'LEED Green Associate Certification',
      'Environmental Engineering Excellence Award',
      'Student Leadership Award',
    ],
    interests: ['Sustainability', 'Green Building', 'Urban Planning', 'Environmental Conservation'],
    social: {
      linkedin: 'https://linkedin.com/in/emma-rodriguez',
      twitter: 'https://twitter.com/emmarodriguez',
      github: 'https://github.com/emmarodriguez',
    },
  },
  {
    name: 'John Doe',
    slug: 'john-doe',
    chapter: 'Software Engineering',
    year: 2020,
    short_bio: 'Senior Software Engineer at TechCorp, specializing in AI and cloud solutions',
    long_bio:
      'John is a passionate software engineer with expertise in full-stack development, machine learning, and cloud technologies. He graduated with honors and has been working on innovative projects that solve real-world problems.',
    photo: '/logo.png',
    email: 'john.doe@email.com',
    location: 'San Francisco, CA',
    company: 'TechCorp',
    position: 'Senior Software Engineer',
    skills: [
      'JavaScript',
      'Python',
      'React',
      'Node.js',
      'AWS',
      'Machine Learning',
      'Docker',
      'Kubernetes',
    ],
    projects: [
      {
        name: 'AI-Powered Chatbot',
        description: 'Developed an intelligent chatbot using natural language processing',
        url: 'https://github.com/johndoe/ai-chatbot',
      },
      {
        name: 'Cloud Migration Tool',
        description: 'Built a tool to automate cloud infrastructure migration',
        url: 'https://github.com/johndoe/cloud-migrator',
      },
    ],
    work_experience: [
      {
        company: 'TechCorp',
        position: 'Senior Software Engineer',
        duration: '2022 - Present',
        description: 'Leading development of cloud-native applications and AI solutions',
      },
      {
        company: 'StartupXYZ',
        position: 'Software Engineer',
        duration: '2020 - 2022',
        description: 'Full-stack development and DevOps practices implementation',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Engineering in Software Engineering',
        institution: 'Nepal College of Information Technology',
        year: 2020,
        gpa: '3.9/4.0',
      },
    ],
    achievements: [
      'Graduated with First Class Honors',
      'Best Final Year Project Award',
      'Microsoft Student Partner',
      'Published 3 research papers',
    ],
    interests: ['AI/ML', 'Cloud Computing', 'Open Source', 'Research'],
    social: {
      linkedin: 'https://linkedin.com/in/john-doe',
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe',
    },
  },
  {
    name: 'Michael Chen',
    slug: 'michael-chen',
    chapter: 'Electronics Engineering',
    year: 2021,
    short_bio: 'Electronics engineer specializing in IoT and embedded systems',
    long_bio:
      'Michael is an innovative electronics engineer with deep expertise in IoT devices, embedded systems, and hardware design. He has successfully launched several IoT products in the market.',
    photo: '/images/avatars/default-avatar.svg',
    email: 'michael.chen@email.com',
    location: 'Austin, TX',
    company: 'IoT Solutions Inc.',
    position: 'Lead Hardware Engineer',
    skills: ['IoT', 'Embedded Systems', 'PCB Design', 'C/C++', 'Python', 'Arduino'],
    projects: [
      {
        name: 'Smart Home Hub',
        description: 'Centralized IoT hub for smart home automation',
        url: 'https://github.com/michaelchen/smarthome',
      },
      {
        name: 'Environmental Monitor',
        description: 'IoT device for monitoring air quality and temperature',
        url: 'https://github.com/michaelchen/envmonitor',
      },
    ],
    work_experience: [
      {
        company: 'IoT Solutions Inc.',
        position: 'Lead Hardware Engineer',
        duration: '2021 - Present',
        description: 'Leading hardware design and development for IoT products',
      },
      {
        company: 'TechStart',
        position: 'Electronics Engineer',
        duration: '2019 - 2021',
        description: 'Designed and prototyped various electronic devices',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Engineering in Electronics Engineering',
        institution: 'University of Technology',
        year: 2021,
        gpa: '3.9/4.0',
      },
    ],
    achievements: [
      'Innovation Award for IoT Product Design',
      'Patent for Smart Sensor Technology',
      'Best Graduate Student Award',
    ],
    interests: ['IoT', 'Hardware Hacking', 'Electronics', 'Innovation'],
    social: {
      portfolio: 'https://michaelchen.io',
      linkedin: 'https://linkedin.com/in/michael-chen',
      twitter: 'https://twitter.com/michaelchen',
      github: 'https://github.com/michaelchen',
    },
  },
  {
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    chapter: 'Computer Engineering',
    year: 2022,
    short_bio: 'Full-stack developer passionate about creating user-friendly web applications',
    long_bio:
      'Sarah is a talented full-stack developer with expertise in React, Node.js, and cloud technologies. She loves solving complex problems and mentoring junior developers.',
    photo: '/images/avatars/default-avatar.svg',
    email: 'sarah.johnson@email.com',
    location: 'San Francisco, CA',
    company: 'TechCorp',
    position: 'Senior Software Engineer',
    skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'MongoDB'],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Built a scalable e-commerce solution using React and Node.js',
        url: 'https://github.com/sarahjohnson/ecommerce',
      },
      {
        name: 'Task Management App',
        description: 'Collaborative task management application with real-time updates',
        url: 'https://github.com/sarahjohnson/taskapp',
      },
    ],
    work_experience: [
      {
        company: 'TechCorp',
        position: 'Senior Software Engineer',
        duration: '2022 - Present',
        description: 'Leading development of web applications and mentoring junior developers',
      },
      {
        company: 'StartupXYZ',
        position: 'Full-stack Developer',
        duration: '2020 - 2022',
        description: 'Built and maintained multiple web applications using modern technologies',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Engineering in Computer Engineering',
        institution: 'University of Technology',
        year: 2022,
        gpa: '3.8/4.0',
      },
    ],
    achievements: [
      'Best Final Year Project Award',
      "Dean's List for 3 consecutive years",
      'Hackathon Winner - Tech Innovation Challenge',
    ],
    interests: ['Web Development', 'Open Source', 'Tech Meetups', 'Reading'],
    social: {
      linkedin: 'https://linkedin.com/in/sarah-johnson',
      twitter: 'https://twitter.com/sarahjohnson',
      github: 'https://github.com/sarahjohnson',
    },
  },
];

const events = [
  {
    title: 'Annual Alumni Meet 2024',
    slug: 'annual-alumni-meet-2024',
    date: '2024-12-15',
    description:
      'Join us for our most anticipated event of the year! The Annual Alumni Meet brings together graduates from all batches for an evening of networking, celebration, and inspiration.',
    content: `# Annual Alumni Meet 2024

Join us for our most anticipated event of the year! The Annual Alumni Meet brings together graduates from all batches for an evening of networking, celebration, and inspiration.

## Event Details

- **Date**: December 15, 2024
- **Time**: 6:00 PM - 10:00 PM
- **Location**: Main Campus Auditorium, NCIT
- **Theme**: Building Bridges: Connecting Past, Present, and Future

## What to Expect

- Networking sessions with fellow alumni
- Keynote speeches from industry leaders
- Career development workshops
- Cultural performances and entertainment
- Delicious dinner and refreshments

## Registration

[Register Now](https://forms.gle/alumni-meet-2024)

## Contact

For more information: events@ncit.edu.np`,
    location: 'Main Campus Auditorium, NCIT',
    registration_url: 'https://forms.gle/alumni-meet-2024',
    image: '/images/events/default-event-banner.svg',
    category: 'Networking',
    tags: ['networking', 'celebration', 'alumni', 'annual'],
    featured: true,
  },
  {
    title: 'Startup Pitch Competition 2024',
    slug: 'startup-pitch-competition',
    date: '2024-04-20',
    description:
      'Annual startup pitch competition showcasing innovative ideas from our alumni community',
    content: `Calling all entrepreneurs and innovators! The annual Startup Pitch Competition is back with bigger prizes and more opportunities.

## What to Expect

- **Pitch Presentations** from 20 selected startups
- **Expert Judges** including successful alumni entrepreneurs
- **Networking** with investors and mentors
- **Prizes** worth over $50,000 in cash and services

## Competition Categories

- **Technology Innovation** - Software, AI, IoT solutions
- **Social Impact** - Solutions for community challenges
- **Sustainability** - Green tech and environmental solutions
- **Healthcare** - Medical technology and wellness

## Prizes

- **1st Place**: $25,000 + 6 months mentorship
- **2nd Place**: $15,000 + 3 months mentorship
- **3rd Place**: $10,000 + 1 month mentorship
- **People's Choice**: $5,000

## How to Apply

Submit your startup idea by March 31st, 2024.

[Apply Now](https://pitch.example.com)

## Judging Criteria

- Innovation and creativity (25%)
- Market potential (25%)
- Feasibility (20%)
- Presentation skills (15%)
- Social impact (15%)

## Contact

For questions: pitch@alumni.example.com`,
    location: 'Innovation Hub, University Campus',
    registration_url: 'https://pitch.example.com',
    image: '/images/events/default-event-banner.svg',
    category: 'Entrepreneurship',
    tags: ['startup', 'pitch', 'innovation', 'entrepreneurship', 'competition'],
    featured: true,
  },
  {
    title: 'Tech Career Fair 2024',
    slug: 'tech-career-fair-2024',
    date: '2024-03-15',
    description: 'Annual technology career fair connecting alumni with top tech companies',
    content: `Join us for the biggest tech career fair of the year! This event brings together:

- **50+ Tech Companies** including Google, Microsoft, Amazon, and local startups
- **Networking Sessions** with industry leaders and alumni
- **Resume Workshops** and interview preparation sessions
- **Job Opportunities** for all experience levels

## Schedule

- **9:00 AM** - Registration and Welcome
- **10:00 AM** - Company Presentations
- **11:30 AM** - Networking Lunch
- **1:00 PM** - Career Workshops
- **3:00 PM** - One-on-One Sessions
- **5:00 PM** - Closing Reception

## Registration

Early bird registration is now open! Alumni get priority access.

[Register Now](https://careerfair.example.com)

## Sponsors

This event is proudly sponsored by our alumni network and partner companies.

## Contact

For more information, contact: careers@alumni.example.com`,
    location: 'Convention Center, Downtown',
    registration_url: 'https://careerfair.example.com',
    image: '/images/events/default-event-banner.svg',
    category: 'Career Development',
    tags: ['career', 'networking', 'tech', 'jobs', 'workshops'],
    featured: true,
  },
];

const blogPosts = [
  {
    id: 'blog-1',
    title: 'Building Strong Alumni Networks: A Guide to Meaningful Connections',
    slug: 'building-strong-alumni-networks',
    description:
      'Discover effective strategies for creating and maintaining strong alumni networks that benefit both graduates and institutions. Learn from successful examples and practical tips.',
    author: 'NCIT Alumni Team',
    author_photo: '/team/alumni-team.jpg',
    author_bio:
      'Dedicated team working to strengthen our alumni community and foster meaningful connections.',
    publishDate: '2024-01-15',
    image: '/images/blog/default-blog-banner.svg',
    category: 'Community',
    tags: ['networking', 'alumni', 'community', 'professional-development'],
    featured: true,
    draft: false,
    excerpt:
      'Learn how to build and maintain strong alumni networks that create lasting value for graduates and institutions alike.',
    readingTime: 8,
    content: `# Building Strong Alumni Networks: A Guide to Meaningful Connections

Alumni networks are more than just a list of graduates—they're living, breathing communities that can provide immense value to both individuals and institutions.

## Why Alumni Networks Matter

Strong alumni networks offer numerous benefits:

- **Professional Opportunities**: Job referrals, business partnerships, and career advice
- **Mentorship**: Guidance from experienced professionals in your field
- **Knowledge Sharing**: Access to industry insights and best practices
- **Institutional Support**: Alumni can contribute to their alma mater's growth
- **Lifelong Learning**: Continuous education through workshops and events

## Key Strategies for Building Strong Networks

### 1. Regular Communication

Maintaining regular communication is crucial for keeping alumni engaged.

### 2. Meaningful Events

Events should provide real value to participants.

### 3. Digital Platforms

Leverage technology to maintain connections.

## Conclusion

Building strong alumni networks requires commitment, creativity, and consistent effort.`,
  },
  {
    id: 'blog-2',
    title: 'The Future of Remote Work: Insights from Alumni Leaders',
    slug: 'future-of-remote-work',
    description:
      'How remote work is reshaping the tech industry and what it means for our alumni community.',
    author: 'Alumni Editorial Team',
    author_photo: '/team/editorial-team.jpg',
    author_bio:
      'The editorial team curates insights, trends, and expert perspectives from across the alumni community.',
    publishDate: '2024-01-15',
    image: '/images/blog/default-blog-banner.svg',
    category: 'Career Development',
    tags: ['remote work', 'career', 'technology', 'workplace', 'future'],
    featured: false,
    draft: false,
    excerpt:
      'Remote work is transforming the global workforce. Discover insights from alumni leaders on how this shift is shaping careers and industries.',
    readingTime: 6,
    content: `# The Future of Remote Work: Insights from Alumni Leaders

The landscape of work has undergone a dramatic transformation in recent years, with remote work becoming a fundamental shift in how we approach our careers.

## The New Normal

According to our alumni survey:

- **78% of tech professionals** work remotely at least part-time
- **45% work fully remote**

## Benefits for Alumni

### Geographic Flexibility

- Work for companies regardless of location
- Maintain connections with family and community

### Career Growth

- Access to global job markets
- Reduced commuting time

### Cost Savings

- No daily commute expenses
- Reduced need for expensive city housing

## Looking Ahead

The future of work is hybrid and flexible, creating new opportunities for alumni worldwide.`,
  },
];

export function getEvents(): Event[] {
  return events;
}

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((entry) => entry.slug === slug);
}

export function getAlumni(): Alumni[] {
  return alumni;
}

export function getAlumnusBySlug(slug: string): Alumni | undefined {
  return alumni.find((entry) => entry.slug === slug);
}

export function getBlogPosts(): BlogPost[] {
  return [...blogPosts].filter((post) => !post.draft);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((entry) => entry.slug === slug);
}
