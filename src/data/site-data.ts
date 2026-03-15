// import { Alumni } from '@/features/alumni/types/alumni.types';
// import { Event } from '@/features/events/types/event.types';
// import { LeadershipMember } from '@/features/leadership/types/leadership.types';
// import { Project } from '@/features/projects/types/project.types';
// import { NewsItem } from '@/features/announcements/types/announcement.types';

// import Image2 from '/leadership-2.png';
// import Image3 from '/leadership-3.png';
// import Image4 from '/leadership-4.png';
// import Image5 from '/leadership-5.png';
// import Image6 from '/leadership-6.png';

// import Leadership1 from '/leadership-1.png';
// import Leadership2 from '/leadership-2.png';
// import Leadership3 from '/leadership-3.png';
// import Leadership4 from '/leadership-4.png';
// import Leadership5 from '/leadership-5.png';
// import Leadership6 from '/leadership-6.png';
// import Leadership7 from '/leadership-7.png';

// export const alumni = [
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo',
//     chapter: 'Arts & Design',
//     year: 1990,
//     short_bio: 'Creative Director & Visual Artist',
//     long_bio:
//       'Abigal is a celebrated creative director and visual artist whose work spans brand identity, editorial design, and fine art exhibitions across Nigeria and beyond.',
//     photo: Image2,
//     email: 'abigal.ojo@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'Studio Ojo Creative',
//     position: 'Creative Director',
//     skills: ['Brand Identity', 'Visual Art', 'Illustration', 'Art Direction', 'Typography'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'Studio Ojo Creative',
//         position: 'Creative Director',
//         duration: '2015 - Present',
//         description: 'Leading creative strategy and visual identity for top Nigerian brands.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Arts in Fine & Applied Arts',
//         institution: 'University of Lagos',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Visual Art', 'Design', 'Culture', 'Fashion'],
//     social: { linkedin: '', twitter: '' },
//   },
//   {
//     name: 'Precious Ojeka',
//     slug: 'precious-ojeka',
//     chapter: 'Business & Finance',
//     year: 1990,
//     short_bio: 'Banker',
//     long_bio:
//       'Precious is a seasoned banking professional with over two decades of experience in commercial and retail banking across Nigeria.',
//     photo: Image3,
//     email: 'precious.ojeka@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'First Bank of Nigeria',
//     position: 'Senior Relationship Manager',
//     skills: ['Banking', 'Finance', 'Customer Relations', 'Credit Analysis', 'Risk Management'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'First Bank of Nigeria',
//         position: 'Senior Relationship Manager',
//         duration: '2010 - Present',
//         description: 'Managing high-value client portfolios and corporate banking relationships.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Science in Banking & Finance',
//         institution: 'University of Benin',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Finance', 'Investment', 'Mentorship', 'Travel'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Theresa Ojo',
//     slug: 'theresa-ojo',
//     chapter: 'Health Sciences',
//     year: 1990,
//     short_bio: 'Nurse',
//     long_bio:
//       'Theresa is a dedicated registered nurse specialising in maternal and child health, serving communities across Lagos State.',
//     photo: Image4,
//     email: 'theresa.ojo@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'Lagos University Teaching Hospital',
//     position: 'Registered Nurse',
//     skills: ['Patient Care', 'Maternal Health', 'Paediatrics', 'Community Health', 'First Aid'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'Lagos University Teaching Hospital',
//         position: 'Registered Nurse',
//         duration: '2005 - Present',
//         description: 'Providing specialist maternal and child healthcare services.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Nursing Science',
//         institution: 'University of Lagos',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Healthcare', 'Community Service', 'Public Health', 'Wellness'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-ceo',
//     chapter: 'Fashion & Entrepreneurship',
//     year: 1990,
//     short_bio: "C.E.O Abi's stitches",
//     long_bio:
//       "Founder and CEO of Abi's Stitches, a leading Nigerian fashion label known for contemporary African-inspired designs.",
//     photo: Image5,
//     email: 'abigal.ceo@email.com',
//     location: 'Lagos, Nigeria',
//     company: "Abi's Stitches",
//     position: 'CEO & Fashion Designer',
//     skills: ['Fashion Design', 'Entrepreneurship', 'Textile Arts', 'Brand Building', 'Tailoring'],
//     projects: [],
//     work_experience: [
//       {
//         company: "Abi's Stitches",
//         position: 'CEO & Fashion Designer',
//         duration: '2012 - Present',
//         description: 'Building a premium African fashion brand with nationwide reach.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Diploma in Fashion Design',
//         institution: 'Yaba College of Technology',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Fashion', 'Entrepreneurship', 'African Culture', 'Design'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-dev',
//     chapter: 'Technology',
//     year: 1990,
//     short_bio: 'Web developer',
//     long_bio:
//       'A skilled front-end web developer building digital products for Nigerian startups and SMEs.',
//     photo: Image2,
//     email: 'abigal.dev@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'Freelance',
//     position: 'Web Developer',
//     skills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI Design'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'Freelance',
//         position: 'Web Developer',
//         duration: '2018 - Present',
//         description: 'Building responsive websites and web applications for clients.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Science in Computer Science',
//         institution: 'University of Lagos',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Technology', 'Web Design', 'Open Source', 'Innovation'],
//     social: { linkedin: '', github: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-chef',
//     chapter: 'Culinary Arts',
//     year: 1990,
//     short_bio: 'Chef',
//     long_bio:
//       'A renowned chef celebrated for her fusion of traditional Nigerian cuisine with contemporary cooking techniques.',
//     photo: Image4,
//     email: 'abigal.chef@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'The Pepper Soup Kitchen',
//     position: 'Executive Chef',
//     skills: ['Culinary Arts', 'Menu Development', 'Food Styling', 'Catering', 'Nutrition'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'The Pepper Soup Kitchen',
//         position: 'Executive Chef',
//         duration: '2016 - Present',
//         description: 'Creating signature Nigerian fusion dishes and leading kitchen operations.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Diploma in Culinary Arts',
//         institution: 'Lagos Culinary Academy',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Cooking', 'Food Culture', 'Travel', 'Wellness'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-artist-2',
//     chapter: 'Arts & Design',
//     year: 1990,
//     short_bio: 'Creative Director & Visual Artist',
//     long_bio:
//       'A multidisciplinary visual artist working across photography, painting, and digital media.',
//     photo: Image5,
//     email: 'abigal.artist2@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'Self-employed',
//     position: 'Visual Artist',
//     skills: ['Photography', 'Painting', 'Digital Art', 'Creative Direction', 'Storytelling'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'Self-employed',
//         position: 'Visual Artist',
//         duration: '2014 - Present',
//         description: 'Creating and exhibiting visual art locally and internationally.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Arts in Fine Arts',
//         institution: 'Obafemi Awolowo University',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Art', 'Photography', 'Culture', 'Travel'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-artist-3',
//     chapter: 'Arts & Design',
//     year: 1990,
//     short_bio: 'Creative Director & Visual Artist',
//     long_bio:
//       'Creative director with a focus on visual storytelling for NGOs and social impact organisations across West Africa.',
//     photo: Image3,
//     email: 'abigal.artist3@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'Impact Creatives',
//     position: 'Creative Director',
//     skills: [
//       'Visual Storytelling',
//       'NGO Communication',
//       'Graphic Design',
//       'Branding',
//       'Video Production',
//     ],
//     projects: [],
//     work_experience: [
//       {
//         company: 'Impact Creatives',
//         position: 'Creative Director',
//         duration: '2017 - Present',
//         description: 'Leading creative campaigns for social impact and nonprofit organisations.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Arts in Mass Communication',
//         institution: 'University of Nigeria, Nsukka',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Social Impact', 'Design', 'Media', 'Community'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-artist-4',
//     chapter: 'Arts & Design',
//     year: 1990,
//     short_bio: 'Creative Director & Visual Artist',
//     long_bio:
//       'Award-winning creative director known for her bold visual identity work for fashion and lifestyle brands.',
//     photo: Image6,
//     email: 'abigal.artist4@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'Bold Studio',
//     position: 'Creative Director',
//     skills: ['Art Direction', 'Brand Strategy', 'Photography', 'Fashion', 'Campaign Design'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'Bold Studio',
//         position: 'Creative Director',
//         duration: '2019 - Present',
//         description: 'Directing visual identity and campaign strategy for fashion brands.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Arts in Visual Communication',
//         institution: 'Covenant University',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Fashion', 'Photography', 'Branding', 'Lifestyle'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-artist-5',
//     chapter: 'Arts & Design',
//     year: 1990,
//     short_bio: 'Creative Director & Visual Artist',
//     long_bio:
//       'A creative director with expertise in digital media, content strategy, and visual communications for tech companies.',
//     photo: Image3,
//     email: 'abigal.artist5@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'TechMedia Lagos',
//     position: 'Creative Director',
//     skills: [
//       'Digital Media',
//       'Content Strategy',
//       'UX Design',
//       'Visual Communication',
//       'Social Media',
//     ],
//     projects: [],
//     work_experience: [
//       {
//         company: 'TechMedia Lagos',
//         position: 'Creative Director',
//         duration: '2021 - Present',
//         description: 'Leading digital creative strategy for a fast-growing tech media company.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Science in Information Technology',
//         institution: 'Babcock University',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Tech', 'Media', 'Design', 'Innovation'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-artist-6',
//     chapter: 'Arts & Design',
//     year: 1990,
//     short_bio: 'Creative Director & Visual Artist',
//     long_bio:
//       'Passionate visual artist and creative educator dedicated to nurturing the next generation of Nigerian artists.',
//     photo: Image4,
//     email: 'abigal.artist6@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'Lagos Art Academy',
//     position: 'Art Educator & Creative Director',
//     skills: ['Art Education', 'Creative Direction', 'Curriculum Design', 'Painting', 'Drawing'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'Lagos Art Academy',
//         position: 'Art Educator & Creative Director',
//         duration: '2016 - Present',
//         description: 'Teaching visual arts and directing the creative curriculum.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Education in Fine Arts',
//         institution: 'Lagos State University',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Education', 'Art', 'Youth Development', 'Culture'],
//     social: { linkedin: '' },
//   },
//   {
//     name: 'Abigal Ojo',
//     slug: 'abigal-ojo-artist-7',
//     chapter: 'Arts & Design',
//     year: 1990,
//     short_bio: 'Creative Director & Visual Artist',
//     long_bio:
//       'A visual artist and creative consultant helping brands find their unique visual voice through strategy and design.',
//     photo: Image6,
//     email: 'abigal.artist7@email.com',
//     location: 'Lagos, Nigeria',
//     company: 'Freelance',
//     position: 'Creative Consultant',
//     skills: ['Consulting', 'Brand Design', 'Visual Arts', 'Strategy', 'Mentorship'],
//     projects: [],
//     work_experience: [
//       {
//         company: 'Freelance',
//         position: 'Creative Consultant',
//         duration: '2020 - Present',
//         description: 'Providing creative direction and brand consultancy services.',
//       },
//     ],
//     education: [
//       {
//         degree: 'Bachelor of Arts in Fine Arts',
//         institution: 'University of Ibadan',
//         year: 1990,
//         gpa: '',
//       },
//     ],
//     achievements: [],
//     interests: ['Art', 'Strategy', 'Mentorship', 'Design'],
//     social: { linkedin: '' },
//   },
// ];

// const leadership: LeadershipMember[] = [
//   {
//     id: 1,
//     name: 'Mrs. Stella Alochi',
//     role: 'President',
//     image: Leadership1,
//     featured: true,
//     bio: `Welcome to the official website of the Federal Government Girls Collage (FGGC) Alumnae Association. We are more than graduates—we are the fire forged in shared halls, the quiet strength that shatters ceilings, and the unstoppable force lifting the next generation.\n\nFrom boardrooms to classrooms, from startups to policy tables, our alumnae prove every day: education here didn't just open doors—it built empires, healed communities, and changed nations.\n\nAs your Alumnae President, I see you: the doctors saving lives, the entrepreneurs building legacies, the mothers raising revolutionaries, the leaders shaping tomorrow.`,
//   },
//   {
//     id: 2,
//     name: 'Mrs. Abigal Ojo',
//     role: 'Vice President',
//     image: Leadership2,
//   },
//   {
//     id: 3,
//     name: 'Mrs. Josephine Adeka',
//     role: 'P.R.O',
//     image: Leadership3,
//   },
//   {
//     id: 4,
//     name: 'Mrs. Favour Adah',
//     role: 'Secretary',
//     image: Leadership4,
//   },
//   {
//     id: 5,
//     name: 'Mrs. Lilian Ojo',
//     role: 'Secretary Gen',
//     image: Leadership5,
//   },
//   {
//     id: 6,
//     name: 'Mrs. Goodness Adeka',
//     role: 'Cashier',
//     image: Leadership6,
//   },
//   {
//     id: 7,
//     name: 'Mrs. Bella Adah',
//     role: 'Event Planner',
//     image: Leadership7,
//   },
// ];

// // ─── Projects ─────────────────────────────────────────────────────────────────
// export const projects: Project[] = [
//   {
//     id: '1',
//     title: 'Computer Donation 2025',
//     description: '87/88 Set donated computer sets to support digital learning',
//     budget: '₦897,908.00',
//     image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80', // computers / tech lab
//   },
//   {
//     id: '2',
//     title: 'Whiteboards & Markers',
//     description: 'Complete classroom whiteboard installation for better learning',
//     budget: '₦993,200.00',
//     image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80', // classroom with whiteboard
//   },
//   {
//     id: '3',
//     title: 'School Perimeter Fencing',
//     description: 'Enhanced security through comprehensive perimeter fencing project',
//     budget: '₦698,090.00',
//     image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80', // perimeter fence / security
//   },
// ];

// // ─── Events ───────────────────────────────────────────────────────────────────
// export const events: Event[] = [
//   {
//     slug: 'annual-homecoming-weekend-gala',
//     title: 'Annual Homecoming Weekend & Grand Gala',
//     description:
//       'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
//     image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&q=80',
//     location: 'Transcorp Hilton, Abuja',
//     attire: 'Formal Attire',
//     date: '2026-12-12',
//     type: 'upcoming',
//     isVirtual: false,
//     category: 'Reunion',
//     tags: ['reunion', 'gala', 'networking', 'homecoming'],
//     featured: true,
//     content: `# Annual Homecoming Weekend & Grand Gala\n\nA spectacular reunion bringing together alumnae from every set and every corner of the world.`,
//   },
//   {
//     slug: 'diaspora-virtual-networking-night',
//     title: 'Diaspora Virtual Networking Night',
//     description:
//       'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
//     image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=700&q=80',
//     location: 'Zoom, Global',
//     attire: '',
//     date: '2026-12-12',
//     type: 'upcoming',
//     isVirtual: true,
//     category: 'Networking',
//     tags: ['diaspora', 'virtual', 'networking', 'global'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'child-birth-of-one-us',
//     title: 'Child Birth Of One Us',
//     description:
//       'A spectacular reunion bringing together alumnae from every set and every corner of the world.',
//     image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&q=80',
//     location: 'Transcorp Hilton, Abuja',
//     attire: 'Formal Attire',
//     date: '2028-12-12',
//     type: 'upcoming',
//     isVirtual: false,
//     category: 'Celebration',
//     tags: ['celebration', 'community', 'maternal', 'support'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'donation-for-project',
//     title: 'Donation For Project',
//     description:
//       'A spectacular reunion bringing together alumnae from every set and every corner of the world.',
//     image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=700&q=80',
//     location: 'Zoom, Global',
//     attire: '',
//     date: '2026-12-12',
//     type: 'upcoming',
//     isVirtual: true,
//     category: 'Fundraising',
//     tags: ['donation', 'fundraising', 'project', 'giveback'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'school-opening',
//     title: 'School Opening',
//     description:
//       'A spectacular reunion bringing together alumnae from every set and every corner of the world.',
//     image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80',
//     location: 'Transcorp Hilton, Abuja',
//     attire: 'Formal Attire',
//     date: '2026-12-12',
//     type: 'upcoming',
//     isVirtual: false,
//     category: 'Education',
//     tags: ['education', 'school', 'opening', 'ceremony'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'night-party',
//     title: 'Night Party',
//     description:
//       'A spectacular reunion bringing together alumnae from every set and every corner of the world.',
//     image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&q=80',
//     location: 'Zoom, Global',
//     attire: '',
//     date: '2026-12-12',
//     type: 'upcoming',
//     isVirtual: true,
//     category: 'Social',
//     tags: ['party', 'social', 'virtual', 'fun'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'annual-alumni-meet-2024',
//     title: 'Annual Alumni Meet 2024',
//     description:
//       'Join us for our most anticipated event of the year! The Annual Alumni Meet brings together graduates from all batches for an evening of networking, celebration, and inspiration.',
//     image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=80',
//     location: 'Main Campus Auditorium, NCIT',
//     attire: 'Smart Casual',
//     date: '2024-12-15',
//     type: 'past',
//     isVirtual: false,
//     category: 'Reunion',
//     tags: ['reunion', 'networking', 'annual', 'alumni'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'startup-pitch-competition-2024',
//     title: 'Startup Pitch Competition 2024',
//     description:
//       'Annual startup pitch competition showcasing innovative ideas from our alumni community.',
//     image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=700&q=80',
//     location: 'Innovation Hub, University Campus',
//     attire: 'Business Casual',
//     date: '2024-04-20',
//     type: 'past',
//     isVirtual: false,
//     category: 'Entrepreneurship',
//     tags: ['startup', 'pitch', 'entrepreneurship', 'innovation'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'tech-career-fair-2024',
//     title: 'Tech Career Fair 2024',
//     description: 'Annual technology career fair connecting alumni with top tech companies.',
//     image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80',
//     location: 'Convention Center, Downtown',
//     attire: 'Business Formal',
//     date: '2024-03-15',
//     type: 'past',
//     isVirtual: false,
//     category: 'Career',
//     tags: ['career', 'technology', 'jobs', 'networking'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'scholarship-award-night-2024',
//     title: 'Scholarship Award Night 2024',
//     description:
//       'Celebrating our brightest students with the annual scholarship award ceremony, honouring academic excellence and community service.',
//     image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&q=80',
//     location: 'Grand Ballroom, Eko Hotel, Lagos',
//     attire: 'Black Tie',
//     date: '2024-02-10',
//     type: 'past',
//     isVirtual: false,
//     category: 'Education',
//     tags: ['scholarship', 'awards', 'education', 'excellence'],
//     featured: true,
//     content: '',
//   },
//   {
//     slug: 'virtual-mentorship-summit-2023',
//     title: 'Virtual Mentorship Summit 2023',
//     description:
//       'A virtual summit connecting senior alumnae mentors with recent graduates to share career guidance and life lessons.',
//     image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=700&q=80',
//     location: 'Zoom, Global',
//     attire: '',
//     date: '2023-11-05',
//     type: 'past',
//     isVirtual: true,
//     category: 'Mentorship',
//     tags: ['mentorship', 'virtual', 'career', 'guidance'],
//     featured: false,
//     content: '',
//   },
//   {
//     slug: 'cultural-day-celebration-2023',
//     title: 'Cultural Day Celebration 2023',
//     description:
//       'A vibrant celebration of Nigerian culture, heritage, and the bonds that unite FGGC alumnae across generations.',
//     image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=700&q=80',
//     location: 'National Arts Theatre, Lagos',
//     attire: 'Traditional Attire',
//     date: '2023-10-01',
//     type: 'past',
//     isVirtual: false,
//     category: 'Networking',
//     tags: ['networking', 'celebration', 'alumni', 'annual'],
//     featured: true,
//     content: '',
//   },
// ];

// // ─── Businesses ───────────────────────────────────────────────────────────────
// export const businesses = [
//   {
//     slug: 'ngozis-catering-service',
//     name: "Ngozi's Catering Service",
//     category: 'Food & Beverages',
//     description:
//       'Premium catering services for weddings, corporate events, and private parties. Specialising in local and continental dishes.',
//     images: [
//       'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
//       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 801 123 5678',
//     website: 'www.ngozycatering.com',
//     owner: 'Ngozi Okafor',
//     slug_owner: 'ngozi-okafor',
//   },
//   {
//     slug: 'johnnys-tech-limited',
//     name: "Johnny's Tech Limited",
//     category: 'Technology',
//     description:
//       'Leading provider of IT solutions, phone sales, repairs, and software services for businesses and individuals across Lagos.',
//     images: [
//       'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
//       'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 801 123 5654',
//     website: 'www.agottech.com',
//     owner: 'Johnny Adaeze',
//     slug_owner: 'johnny-adaeze',
//   },
//   {
//     slug: 'obes-phones-limited-1',
//     name: "Obe's Phones Limited",
//     category: 'Technology',
//     description:
//       'Your one-stop shop for the latest smartphones, accessories, and expert phone repair services in Lagos.',
//     images: [
//       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
//       'https://images.unsplash.com/photo-1574920162043-b872873f19bc?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 801 123 6878',
//     website: 'www.obes.com',
//     owner: 'Obe Chioma',
//     slug_owner: 'obe-chioma',
//   },
//   {
//     slug: 'obes-phones-limited-2',
//     name: "Obe's Phones Limited",
//     category: 'Technology',
//     description:
//       'Your one-stop shop for the latest smartphones, accessories, and expert phone repair services in Lagos.',
//     images: [
//       'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
//       'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 802 341 5679',
//     website: 'www.agottech.com',
//     owner: 'Obe Chioma',
//     slug_owner: 'obe-chioma-2',
//   },
//   {
//     slug: 'ngozis-consulting-service',
//     name: "Ngozi's Consulting Service",
//     category: 'Consulting',
//     description:
//       'Professional business consulting, strategy development, and management advisory services for SMEs and corporates.',
//     images: [
//       'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
//       'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 803 234 5679',
//     website: 'www.ngozitech.com',
//     owner: 'Ngozi Adaeze',
//     slug_owner: 'ngozi-adaeze',
//   },
//   {
//     slug: 'johnnys-tech-limited-2',
//     name: "Johnny's Tech Limited",
//     category: 'Technology',
//     description:
//       'Leading provider of IT solutions, phone sales, repairs, and software services for businesses and individuals across Lagos.',
//     images: [
//       'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
//       'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 801 234 5679',
//     website: 'www.agottech.com',
//     owner: 'Johnny Adaeze',
//     slug_owner: 'johnny-adaeze-2',
//   },
//   {
//     slug: 'obes-phones-limited-3',
//     name: "Obe's Phones Limited",
//     category: 'Technology',
//     description:
//       'Your one-stop shop for the latest smartphones, accessories, and expert phone repair services in Lagos.',
//     images: [
//       'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80',
//       'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 802 345 6789',
//     website: 'www.agottech.com',
//     owner: 'Obe Chioma',
//     slug_owner: 'obe-chioma-3',
//   },
//   {
//     slug: 'ngozis-consulting-service-2',
//     name: "Ngozi's Consulting Service",
//     category: 'Consulting',
//     description:
//       'Professional business consulting, strategy development, and management advisory services for SMEs and corporates.',
//     images: [
//       'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
//       'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 803 456 7890',
//     website: 'www.ngozitech.com',
//     owner: 'Ngozi Adaeze',
//     slug_owner: 'ngozi-adaeze-2',
//   },
//   {
//     slug: 'johnnys-tech-limited-3',
//     name: "Johnny's Tech Limited",
//     category: 'Technology',
//     description:
//       'Leading provider of IT solutions, phone sales, repairs, and software services for businesses and individuals across Lagos.',
//     images: [
//       'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
//       'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80',
//     ],
//     location: 'Lekki, Lagos',
//     phone: '+234 801 567 8901',
//     website: 'www.agottech.com',
//     owner: 'Johnny Adaeze',
//     slug_owner: 'johnny-adaeze-3',
//   },
// ];

// export const categories = [
//   'Food & Beverages',
//   'Technology',
//   'Consulting',
//   'Fashion & Beauty',
//   'Health & Wellness',
//   'Education',
//   'Real Estate',
//   'Events & Entertainment',
// ];

// // ─── Announcements ────────────────────────────────────────────────────────────
// const newsItems: NewsItem[] = [
//   {
//     id: 1,
//     slug: 'association-awards-45m-scholarships',
//     title: 'Association Awards ₦45M in Scholarships — Largest in Our History',
//     date: 'March 1, 2026',
//     image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&q=80', // scholarship award ceremony
//     tag: 'SCHOLARSHIP',
//     excerpt:
//       'In an emotional prize-giving ceremony held at FGGC Abuja, the Alumnae Association announced its highest-ever scholarship disbursement — directly supporting 180 students across three arms of the school, with special focus on STEM and the Arts.',
//     featured: true,
//   },
//   {
//     id: 2,
//     slug: 'houston-chapter-officially-launched',
//     title: 'Houston Chapter Officially Launched — Our 32nd Global Chapter',
//     date: 'March 1, 2026',
//     image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80', // group of women celebrating
//   },
//   {
//     id: 3,
//     slug: 'new-science-laboratory-wing-commissioned',
//     title: 'New Science Laboratory Wing Commissioned at FGGC Calabar',
//     date: 'March 1, 2026',
//     image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=700&q=80', // school/university building exterior
//   },
//   {
//     id: 4,
//     slug: 'alumna-of-the-year-2025-dr-chiamaka-obi',
//     title: 'Alumna of the Year 2025 — Dr. Chiamaka Obi Honoured in Abuja',
//     date: 'March 1, 2026',
//     image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=700&q=80', // woman being honoured / award
//   },
//   {
//     id: 5,
//     slug: 'digital-yearbook-archive-now-live',
//     title: "Digital Yearbook Archive Now Live — Access Your Set's Photos",
//     date: 'March 1, 2026',
//     image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=700&q=80', // people looking at old photos / memories
//   },
// ];

// // ─── Getters ──────────────────────────────────────────────────────────────────

// export function getEvents(): Event[] {
//   return events;
// }
// export function getEventBySlug(slug: string): Event | undefined {
//   return events.find((e) => e.slug === slug);
// }

// export function getAlumni(): Alumni[] {
//   return alumni;
// }
// export function getAlumnusBySlug(slug: string): Alumni | undefined {
//   return alumni.find((a) => a.slug === slug);
// }

// export function getLeadership(): LeadershipMember[] {
//   return leadership;
// }
// export function getLeaderById(id: number): LeadershipMember | undefined {
//   return leadership.find((m) => m.id === id);
// }

// export function getProjects(): Project[] {
//   return projects;
// }
// export function getProjectById(id: string): Project | undefined {
//   return projects.find((p) => p.id === id);
// }

// // export function getBlogPosts(): NewsItem[]                              { return [...newsItems].filter((p) => !p.draft); }
// export function getAnnouncements(): NewsItem[] {
//   return newsItems;
// }
// export function getAnnouncementBySlug(slug: string): NewsItem | undefined {
//   return newsItems.find((n) => n.slug === slug);
// }









// src/data/site-data.ts
//
// All relational keys now use memberId (MBR-{year}-{hex}).
// Leadership excos are linked to real MockAuthAccount memberIds.
// Businesses are linked to real member owners via ownerId (memberId).
// Events have createdBy + registrations[].
// Announcements have createdBy.

import { generateMemberId } from '@/features/authentication/constants/mockAccounts';
import { DEFAULT_CHAPTER_ID } from '@/data/chapters';

import { Alumni }          from '@/features/alumni/types/alumni.types';
import { Event }           from '@/features/events/types/event.types';
import { LeadershipMember } from '@/features/leadership/types/leadership.types';
import { Project }         from '@/features/projects/types/project.types';
import { NewsItem }        from '@/features/announcements/types/announcement.types';

import Leadership1 from '/leadership-1.png';
import Leadership2 from '/leadership-2.png';
import Leadership3 from '/leadership-3.png';
import Leadership4 from '/leadership-4.png';
import Leadership5 from '/leadership-5.png';
import Leadership6 from '/leadership-6.png';
import Leadership7 from '/leadership-7.png';

// ─── Pre-computed memberIds for cross-referencing ─────────────────────────────
// These mirror the generateMemberId calls in mockAccounts.ts exactly.
// The function is deterministic so the output is always the same.

const MBR_ADAEZE    = generateMemberId(1998, 'adaeze.okonkwo@email.com');
const MBR_NGOZI     = generateMemberId(2002, 'ngozi.ibrahim@email.com');
const MBR_CHIDINMA  = generateMemberId(2005, 'chidinma.eze@email.com');
const MBR_STELLA    = generateMemberId(1985, 'stella.alochi@email.com');
const MBR_ABIGAL_VP = generateMemberId(1987, 'abigal.vp@email.com');
const MBR_JOSEPHINE = generateMemberId(1989, 'josephine.adeka@email.com');
const MBR_FAVOUR    = generateMemberId(1991, 'favour.adah@email.com');
const MBR_LILIAN    = generateMemberId(1992, 'lilian.ojo@email.com');
const MBR_GOODNESS  = generateMemberId(1993, 'goodness.adeka@email.com');
const MBR_BELLA     = generateMemberId(1994, 'bella.adah@email.com');

// Historical alumni memberIds
const MBR_ABIGAL_OJO     = generateMemberId(1990, 'abigal.ojo@email.com');
const MBR_PRECIOUS       = generateMemberId(1990, 'precious.ojeka@email.com');
const MBR_THERESA        = generateMemberId(1990, 'theresa.ojo@email.com');
const MBR_ABIGAL_CEO     = generateMemberId(1990, 'abigal.ceo@email.com');
const MBR_ABIGAL_DEV     = generateMemberId(1990, 'abigal.dev@email.com');
const MBR_ABIGAL_CHEF    = generateMemberId(1990, 'abigal.chef@email.com');
const MBR_ABIGAL_ART2    = generateMemberId(1990, 'abigal.artist2@email.com');
const MBR_ABIGAL_ART3    = generateMemberId(1990, 'abigal.artist3@email.com');
const MBR_ABIGAL_ART4    = generateMemberId(1990, 'abigal.artist4@email.com');
const MBR_ABIGAL_ART5    = generateMemberId(1990, 'abigal.artist5@email.com');
const MBR_ABIGAL_ART6    = generateMemberId(1990, 'abigal.artist6@email.com');
const MBR_ABIGAL_ART7    = generateMemberId(1990, 'abigal.artist7@email.com');

// ─── Alumni directory ─────────────────────────────────────────────────────────
export const alumni: Alumni[] = [
  {
    memberId: MBR_ABIGAL_OJO,
    name: 'Abigal Ojo',
    slug: 'abigal-ojo',
    chapterId: DEFAULT_CHAPTER_ID,
    year: 1990,
    short_bio: 'Creative Director & Visual Artist',
    long_bio: 'Abigal is a celebrated creative director and visual artist whose work spans brand identity, editorial design, and fine art exhibitions across Nigeria and beyond.',
    photo: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80',
    email: 'abigal.ojo@email.com',
    location: 'Lagos, Nigeria',
    company: 'Studio Ojo Creative',
    position: 'Creative Director',
    skills: ['Brand Identity', 'Visual Art', 'Illustration', 'Art Direction', 'Typography'],
    projects: [],
    work_experience: [{ company: 'Studio Ojo Creative', position: 'Creative Director', duration: '2015 - Present', description: 'Leading creative strategy and visual identity for top Nigerian brands.' }],
    education: [{ degree: 'Bachelor of Arts in Fine & Applied Arts', institution: 'University of Lagos', year: 1990, gpa: '' }],
    achievements: [], interests: ['Visual Art', 'Design', 'Culture', 'Fashion'],
    social: { linkedin: '', twitter: '' },
  },
  {
    memberId: MBR_PRECIOUS,
    name: 'Precious Ojeka',
    slug: 'precious-ojeka',
    chapterId: DEFAULT_CHAPTER_ID,
    year: 1990,
    short_bio: 'Banker',
    long_bio: 'Precious is a seasoned banking professional with over two decades of experience in commercial and retail banking across Nigeria.',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
    email: 'precious.ojeka@email.com',
    location: 'Lagos, Nigeria',
    company: 'First Bank of Nigeria',
    position: 'Senior Relationship Manager',
    skills: ['Banking', 'Finance', 'Customer Relations', 'Credit Analysis', 'Risk Management'],
    projects: [],
    work_experience: [{ company: 'First Bank of Nigeria', position: 'Senior Relationship Manager', duration: '2010 - Present', description: 'Managing high-value client portfolios and corporate banking relationships.' }],
    education: [{ degree: 'Bachelor of Science in Banking & Finance', institution: 'University of Benin', year: 1990, gpa: '' }],
    achievements: [], interests: ['Finance', 'Investment', 'Mentorship', 'Travel'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_THERESA,
    name: 'Theresa Ojo',
    slug: 'theresa-ojo',
    chapterId: DEFAULT_CHAPTER_ID,
    year: 1990,
    short_bio: 'Nurse',
    long_bio: 'Theresa is a dedicated registered nurse specialising in maternal and child health, serving communities across Lagos State.',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
    email: 'theresa.ojo@email.com',
    location: 'Lagos, Nigeria',
    company: 'Lagos University Teaching Hospital',
    position: 'Registered Nurse',
    skills: ['Patient Care', 'Maternal Health', 'Paediatrics', 'Community Health', 'First Aid'],
    projects: [],
    work_experience: [{ company: 'Lagos University Teaching Hospital', position: 'Registered Nurse', duration: '2005 - Present', description: 'Providing specialist maternal and child healthcare services.' }],
    education: [{ degree: 'Bachelor of Nursing Science', institution: 'University of Lagos', year: 1990, gpa: '' }],
    achievements: [], interests: ['Healthcare', 'Community Service', 'Public Health', 'Wellness'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_ABIGAL_CEO,
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-ceo',
    chapterId: DEFAULT_CHAPTER_ID,
    year: 1990,
    short_bio: "C.E.O Abi's stitches",
    long_bio: "Founder and CEO of Abi's Stitches, a leading Nigerian fashion label known for contemporary African-inspired designs.",
    photo: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=600&q=80',
    email: 'abigal.ceo@email.com',
    location: 'Lagos, Nigeria',
    company: "Abi's Stitches",
    position: 'CEO & Fashion Designer',
    skills: ['Fashion Design', 'Entrepreneurship', 'Textile Arts', 'Brand Building', 'Tailoring'],
    projects: [],
    work_experience: [{ company: "Abi's Stitches", position: 'CEO & Fashion Designer', duration: '2012 - Present', description: 'Building a premium African fashion brand with nationwide reach.' }],
    education: [{ degree: 'Diploma in Fashion Design', institution: 'Yaba College of Technology', year: 1990, gpa: '' }],
    achievements: [], interests: ['Fashion', 'Entrepreneurship', 'African Culture', 'Design'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_ABIGAL_DEV,
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-dev',
    chapterId: DEFAULT_CHAPTER_ID,
    year: 1990,
    short_bio: 'Web developer',
    long_bio: 'A skilled front-end web developer building digital products for Nigerian startups and SMEs.',
    photo: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&q=80',
    email: 'abigal.dev@email.com',
    location: 'Lagos, Nigeria',
    company: 'Freelance',
    position: 'Web Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI Design'],
    projects: [],
    work_experience: [{ company: 'Freelance', position: 'Web Developer', duration: '2018 - Present', description: 'Building responsive websites and web applications for clients.' }],
    education: [{ degree: 'Bachelor of Science in Computer Science', institution: 'University of Lagos', year: 1990, gpa: '' }],
    achievements: [], interests: ['Technology', 'Web Design', 'Open Source', 'Innovation'],
    social: { linkedin: '', github: '' },
  },
  {
    memberId: MBR_ABIGAL_CHEF,
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-chef',
    chapterId: DEFAULT_CHAPTER_ID,
    year: 1990,
    short_bio: 'Chef',
    long_bio: 'A renowned chef celebrated for her fusion of traditional Nigerian cuisine with contemporary cooking techniques.',
    photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    email: 'abigal.chef@email.com',
    location: 'Lagos, Nigeria',
    company: 'The Pepper Soup Kitchen',
    position: 'Executive Chef',
    skills: ['Culinary Arts', 'Menu Development', 'Food Styling', 'Catering', 'Nutrition'],
    projects: [],
    work_experience: [{ company: 'The Pepper Soup Kitchen', position: 'Executive Chef', duration: '2016 - Present', description: 'Creating signature Nigerian fusion dishes and leading kitchen operations.' }],
    education: [{ degree: 'Diploma in Culinary Arts', institution: 'Lagos Culinary Academy', year: 1990, gpa: '' }],
    achievements: [], interests: ['Cooking', 'Food Culture', 'Travel', 'Wellness'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_ABIGAL_ART2,
    name: 'Abigal Ojo', slug: 'abigal-ojo-artist-2', chapterId: DEFAULT_CHAPTER_ID, year: 1990,
    short_bio: 'Visual Artist', long_bio: 'A multidisciplinary visual artist working across photography, painting, and digital media.',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&q=80',
    email: 'abigal.artist2@email.com', location: 'Lagos, Nigeria', company: 'Self-employed', position: 'Visual Artist',
    skills: ['Photography', 'Painting', 'Digital Art', 'Creative Direction', 'Storytelling'],
    projects: [], work_experience: [], education: [], achievements: [], interests: ['Art', 'Photography', 'Culture', 'Travel'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_ABIGAL_ART3,
    name: 'Abigal Ojo', slug: 'abigal-ojo-artist-3', chapterId: DEFAULT_CHAPTER_ID, year: 1990,
    short_bio: 'Creative Director', long_bio: 'Creative director with a focus on visual storytelling for NGOs and social impact organisations.',
    photo: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&q=80',
    email: 'abigal.artist3@email.com', location: 'Lagos, Nigeria', company: 'Impact Creatives', position: 'Creative Director',
    skills: ['Visual Storytelling', 'NGO Communication', 'Graphic Design', 'Branding', 'Video Production'],
    projects: [], work_experience: [], education: [], achievements: [], interests: ['Social Impact', 'Design', 'Media', 'Community'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_ABIGAL_ART4,
    name: 'Abigal Ojo', slug: 'abigal-ojo-artist-4', chapterId: DEFAULT_CHAPTER_ID, year: 1990,
    short_bio: 'Creative Director', long_bio: 'Award-winning creative director known for her bold visual identity work for fashion and lifestyle brands.',
    photo: 'https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?w=600&q=80',
    email: 'abigal.artist4@email.com', location: 'Lagos, Nigeria', company: 'Bold Studio', position: 'Creative Director',
    skills: ['Art Direction', 'Brand Strategy', 'Photography', 'Fashion', 'Campaign Design'],
    projects: [], work_experience: [], education: [], achievements: [], interests: ['Fashion', 'Photography', 'Branding', 'Lifestyle'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_ABIGAL_ART5,
    name: 'Abigal Ojo', slug: 'abigal-ojo-artist-5', chapterId: DEFAULT_CHAPTER_ID, year: 1990,
    short_bio: 'Creative Director', long_bio: 'A creative director with expertise in digital media, content strategy, and visual communications for tech companies.',
    photo: 'https://images.unsplash.com/photo-1611432579699-484f7990b127?w=600&q=80',
    email: 'abigal.artist5@email.com', location: 'Lagos, Nigeria', company: 'TechMedia Lagos', position: 'Creative Director',
    skills: ['Digital Media', 'Content Strategy', 'UX Design', 'Visual Communication', 'Social Media'],
    projects: [], work_experience: [], education: [], achievements: [], interests: ['Tech', 'Media', 'Design', 'Innovation'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_ABIGAL_ART6,
    name: 'Abigal Ojo', slug: 'abigal-ojo-artist-6', chapterId: DEFAULT_CHAPTER_ID, year: 1990,
    short_bio: 'Art Educator', long_bio: 'Passionate visual artist and creative educator dedicated to nurturing the next generation of Nigerian artists.',
    photo: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&q=80',
    email: 'abigal.artist6@email.com', location: 'Lagos, Nigeria', company: 'Lagos Art Academy', position: 'Art Educator & Creative Director',
    skills: ['Art Education', 'Creative Direction', 'Curriculum Design', 'Painting', 'Drawing'],
    projects: [], work_experience: [], education: [], achievements: [], interests: ['Education', 'Art', 'Youth Development', 'Culture'],
    social: { linkedin: '' },
  },
  {
    memberId: MBR_ABIGAL_ART7,
    name: 'Abigal Ojo', slug: 'abigal-ojo-artist-7', chapterId: DEFAULT_CHAPTER_ID, year: 1990,
    short_bio: 'Creative Consultant', long_bio: 'A visual artist and creative consultant helping brands find their unique visual voice.',
    photo: 'https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?w=600&q=80',
    email: 'abigal.artist7@email.com', location: 'Lagos, Nigeria', company: 'Freelance', position: 'Creative Consultant',
    skills: ['Consulting', 'Brand Design', 'Visual Arts', 'Strategy', 'Mentorship'],
    projects: [], work_experience: [], education: [], achievements: [], interests: ['Art', 'Strategy', 'Mentorship', 'Design'],
    social: { linkedin: '' },
  },
];

// ─── Leadership ───────────────────────────────────────────────────────────────
// Excos are real registered members — linked via memberId.

export const leadership: LeadershipMember[] = [
  {
    id:       1,
    memberId: MBR_STELLA,
    name:     'Mrs. Stella Alochi',
    role:     'President',
    chapterId: DEFAULT_CHAPTER_ID,
    image:    Leadership1,
    featured: true,
    bio: `Welcome to the official website of the Federal Government Girls Collage (FGGC) Alumnae Association. We are more than graduates—we are the fire forged in shared halls, the quiet strength that shatters ceilings, and the unstoppable force lifting the next generation.\n\nFrom boardrooms to classrooms, from startups to policy tables, our alumnae prove every day: education here didn't just open doors—it built empires, healed communities, and changed nations.\n\nAs your Alumnae President, I see you: the doctors saving lives, the entrepreneurs building legacies, the mothers raising revolutionaries, the leaders shaping tomorrow.`,
  },
  { id: 2, memberId: MBR_ABIGAL_VP,  name: 'Mrs. Abigal Ojo',     role: 'Vice President', chapterId: DEFAULT_CHAPTER_ID, image: Leadership2 },
  { id: 3, memberId: MBR_JOSEPHINE,  name: 'Mrs. Josephine Adeka', role: 'P.R.O',          chapterId: DEFAULT_CHAPTER_ID, image: Leadership3 },
  { id: 4, memberId: MBR_FAVOUR,     name: 'Mrs. Favour Adah',     role: 'Secretary',      chapterId: DEFAULT_CHAPTER_ID, image: Leadership4 },
  { id: 5, memberId: MBR_LILIAN,     name: 'Mrs. Lilian Ojo',      role: 'Secretary Gen',  chapterId: DEFAULT_CHAPTER_ID, image: Leadership5 },
  { id: 6, memberId: MBR_GOODNESS,   name: 'Mrs. Goodness Adeka',  role: 'Cashier',        chapterId: DEFAULT_CHAPTER_ID, image: Leadership6 },
  { id: 7, memberId: MBR_BELLA,      name: 'Mrs. Bella Adah',      role: 'Event Planner',  chapterId: DEFAULT_CHAPTER_ID, image: Leadership7 },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: '1',
    title: 'Computer Donation 2025',
    description: '87/88 Set donated computer sets to support digital learning',
    budget: '₦897,908.00',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
  },
  {
    id: '2',
    title: 'Whiteboards & Markers',
    description: 'Complete classroom whiteboard installation for better learning',
    budget: '₦993,200.00',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80',
  },
  {
    id: '3',
    title: 'School Perimeter Fencing',
    description: 'Enhanced security through comprehensive perimeter fencing project',
    budget: '₦698,090.00',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────
// createdBy → admin memberId
// registrations → array of member memberIds who have RSVP'd

export const events: Event[] = [
  {
    slug:          'annual-homecoming-weekend-gala',
    title:         'Annual Homecoming Weekend & Grand Gala',
    description:   'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
    image:         'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&q=80',
    location:      'Transcorp Hilton, Abuja',
    attire:        'Formal Attire',
    date:          '2026-12-12',
    type:          'upcoming',
    isVirtual:     false,
    category:      'Reunion',
    tags:          ['reunion', 'gala', 'networking', 'homecoming'],
    featured:      true,
    content:       `# Annual Homecoming Weekend & Grand Gala\n\nA spectacular reunion bringing together alumnae from every set and every corner of the world.`,
    createdBy:     MBR_ADAEZE,
    registrations: [MBR_NGOZI, MBR_CHIDINMA, MBR_PRECIOUS, MBR_THERESA],
  },
  {
    slug: 'diaspora-virtual-networking-night', title: 'Diaspora Virtual Networking Night',
    description: 'Connecting alumnae in the diaspora for an evening of networking and shared stories.',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=700&q=80',
    location: 'Zoom, Global', attire: '', date: '2026-12-12', type: 'upcoming',
    isVirtual: true, category: 'Networking', tags: ['diaspora', 'virtual', 'networking', 'global'],
    featured: false, content: '',
    createdBy: MBR_ADAEZE, registrations: [MBR_ABIGAL_DEV, MBR_ABIGAL_ART5],
  },
  {
    slug: 'child-birth-of-one-us', title: 'Child Birth Of One Us',
    description: 'A celebration of new life and community support for our sisters.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&q=80',
    location: 'Transcorp Hilton, Abuja', attire: 'Formal Attire', date: '2028-12-12', type: 'upcoming',
    isVirtual: false, category: 'Celebration', tags: ['celebration', 'community', 'maternal', 'support'],
    featured: false, content: '',
    createdBy: MBR_STELLA, registrations: [MBR_NGOZI, MBR_ABIGAL_OJO],
  },
  {
    slug: 'donation-for-project', title: 'Donation For Project',
    description: 'Virtual fundraising drive for the school perimeter fencing project.',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=700&q=80',
    location: 'Zoom, Global', attire: '', date: '2026-12-12', type: 'upcoming',
    isVirtual: true, category: 'Fundraising', tags: ['donation', 'fundraising', 'project', 'giveback'],
    featured: false, content: '',
    createdBy: MBR_STELLA, registrations: [MBR_ADAEZE, MBR_NGOZI, MBR_CHIDINMA, MBR_PRECIOUS, MBR_THERESA],
  },
  {
    slug: 'school-opening', title: 'School Opening',
    description: 'Ceremony marking the opening of the new academic session at FGGC Owerri.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80',
    location: 'FGGC Owerri, Imo State', attire: 'Formal Attire', date: '2026-12-12', type: 'upcoming',
    isVirtual: false, category: 'Education', tags: ['education', 'school', 'opening', 'ceremony'],
    featured: false, content: '',
    createdBy: MBR_ADAEZE, registrations: [MBR_ADAEZE, MBR_STELLA, MBR_JOSEPHINE],
  },
  {
    slug: 'night-party', title: 'Night Party',
    description: 'An evening of music, fun, and sisterhood.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&q=80',
    location: 'Zoom, Global', attire: '', date: '2026-12-12', type: 'upcoming',
    isVirtual: true, category: 'Social', tags: ['party', 'social', 'virtual', 'fun'],
    featured: false, content: '',
    createdBy: MBR_BELLA, registrations: [MBR_NGOZI, MBR_CHIDINMA, MBR_ABIGAL_OJO, MBR_PRECIOUS],
  },
  {
    slug: 'annual-alumni-meet-2024', title: 'Annual Alumni Meet 2024',
    description: 'Join us for our most anticipated event of the year!',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=80',
    location: 'Main Campus Auditorium', attire: 'Smart Casual', date: '2024-12-15', type: 'past',
    isVirtual: false, category: 'Reunion', tags: ['reunion', 'networking', 'annual', 'alumni'],
    featured: false, content: '',
    createdBy: MBR_STELLA,
    registrations: [MBR_ADAEZE, MBR_NGOZI, MBR_CHIDINMA, MBR_PRECIOUS, MBR_THERESA, MBR_ABIGAL_OJO],
  },
  {
    slug: 'startup-pitch-competition-2024', title: 'Startup Pitch Competition 2024',
    description: 'Annual startup pitch competition showcasing innovative ideas from our alumni community.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=700&q=80',
    location: 'Innovation Hub, University Campus', attire: 'Business Casual', date: '2024-04-20', type: 'past',
    isVirtual: false, category: 'Entrepreneurship', tags: ['startup', 'pitch', 'entrepreneurship', 'innovation'],
    featured: false, content: '',
    createdBy: MBR_ADAEZE, registrations: [MBR_CHIDINMA, MBR_ABIGAL_CEO, MBR_ABIGAL_DEV],
  },
  {
    slug: 'tech-career-fair-2024', title: 'Tech Career Fair 2024',
    description: 'Annual technology career fair connecting alumni with top tech companies.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80',
    location: 'Convention Center, Downtown', attire: 'Business Formal', date: '2024-03-15', type: 'past',
    isVirtual: false, category: 'Career', tags: ['career', 'technology', 'jobs', 'networking'],
    featured: false, content: '',
    createdBy: MBR_ADAEZE, registrations: [MBR_CHIDINMA, MBR_ABIGAL_DEV, MBR_ABIGAL_ART5],
  },
  {
    slug: 'scholarship-award-night-2024', title: 'Scholarship Award Night 2024',
    description: 'Celebrating our brightest students with the annual scholarship award ceremony.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&q=80',
    location: 'Grand Ballroom, Eko Hotel, Lagos', attire: 'Black Tie', date: '2024-02-10', type: 'past',
    isVirtual: false, category: 'Education', tags: ['scholarship', 'awards', 'education', 'excellence'],
    featured: true, content: '',
    createdBy: MBR_STELLA,
    registrations: [MBR_ADAEZE, MBR_NGOZI, MBR_PRECIOUS, MBR_THERESA, MBR_STELLA, MBR_FAVOUR],
  },
  {
    slug: 'virtual-mentorship-summit-2023', title: 'Virtual Mentorship Summit 2023',
    description: 'A virtual summit connecting senior alumnae mentors with recent graduates.',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=700&q=80',
    location: 'Zoom, Global', attire: '', date: '2023-11-05', type: 'past',
    isVirtual: true, category: 'Mentorship', tags: ['mentorship', 'virtual', 'career', 'guidance'],
    featured: false, content: '',
    createdBy: MBR_ADAEZE,
    registrations: [MBR_NGOZI, MBR_CHIDINMA, MBR_ABIGAL_DEV, MBR_ABIGAL_ART5, MBR_ABIGAL_ART3],
  },
  {
    slug: 'cultural-day-celebration-2023', title: 'Cultural Day Celebration 2023',
    description: 'A vibrant celebration of Nigerian culture, heritage, and the bonds that unite FGGC alumnae.',
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=700&q=80',
    location: 'National Arts Theatre, Lagos', attire: 'Traditional Attire', date: '2023-10-01', type: 'past',
    isVirtual: false, category: 'Networking', tags: ['networking', 'celebration', 'alumni', 'annual'],
    featured: true, content: '',
    createdBy: MBR_BELLA,
    registrations: [MBR_ADAEZE, MBR_NGOZI, MBR_CHIDINMA, MBR_ABIGAL_OJO, MBR_PRECIOUS, MBR_THERESA, MBR_ABIGAL_CEO],
  },
];

// ─── Businesses (Marketplace) ─────────────────────────────────────────────────
// ownerId → memberId of the business owner

export const businesses = [
  {
    slug:        'ngozis-catering-service',
    businessId:  'BIZ-2024-001',
    ownerId:     MBR_ABIGAL_CHEF,   // Abigal Ojo (chef) — catering makes sense
    name:        "Ngozi's Catering Service",
    category:    'Food & Beverages',
    description: 'Premium catering services for weddings, corporate events, and private parties. Specialising in local and continental dishes.',
    images:      ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'],
    location:    'Lekki, Lagos',
    phone:       '+234 801 123 5678',
    website:     'www.ngozycatering.com',
    owner:       'Abigal Ojo',
  },
  {
    slug:        'johnnys-tech-limited',
    businessId:  'BIZ-2024-002',
    ownerId:     MBR_ABIGAL_DEV,    // Abigal Ojo (dev) — tech business
    name:        "Abigal's Tech Limited",
    category:    'Technology',
    description: 'Leading provider of IT solutions, phone sales, repairs, and software services for businesses and individuals across Lagos.',
    images:      ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80'],
    location:    'Yaba, Lagos',
    phone:       '+234 801 123 5654',
    website:     'www.abigaltech.com',
    owner:       'Abigal Ojo',
  },
  {
    slug:        'abi-fashion-house',
    businessId:  'BIZ-2024-003',
    ownerId:     MBR_ABIGAL_CEO,    // Abigal Ojo (CEO) — fashion brand
    name:        "Abi's Stitches Fashion House",
    category:    'Fashion & Beauty',
    description: 'Contemporary African-inspired fashion label offering bespoke designs, ready-to-wear, and styling services.',
    images:      ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80'],
    location:    'Lekki, Lagos',
    phone:       '+234 801 123 6878',
    website:     'www.abistitches.com',
    owner:       'Abigal Ojo',
  },
  {
    slug:        'ngozi-medical-consulting',
    businessId:  'BIZ-2024-004',
    ownerId:     MBR_NGOZI,         // Ngozi Ibrahim — medical professional
    name:        'Ngozi Medical Consulting',
    category:    'Health & Wellness',
    description: 'Professional medical consulting, health advisory, and wellness coaching for individuals and corporate clients.',
    images:      ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80'],
    location:    'Surulere, Lagos',
    phone:       '+234 805 678 9012',
    website:     'www.ngozimedicare.com',
    owner:       'Ngozi Blessing Ibrahim',
  },
  {
    slug:        'chidinma-software-studio',
    businessId:  'BIZ-2024-005',
    ownerId:     MBR_CHIDINMA,      // Chidinma Eze — software developer
    name:        'Chidinma Software Studio',
    category:    'Technology',
    description: 'Custom software development, mobile apps, and digital transformation consulting for Nigerian businesses.',
    images:      ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80'],
    location:    'Abuja, FCT',
    phone:       '+234 807 890 1234',
    website:     'www.chidinmastudio.com',
    owner:       'Chidinma Sandra Eze',
  },
  {
    slug:        'adaeze-consulting-group',
    businessId:  'BIZ-2024-006',
    ownerId:     MBR_ADAEZE,        // Adaeze Okonkwo — entrepreneur/consultant
    name:        'Adaeze Consulting Group',
    category:    'Consulting',
    description: 'Strategic business consulting, financial advisory, and nonprofit management services for organisations across Nigeria.',
    images:      ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80'],
    location:    'Lekki, Lagos',
    phone:       '+234 803 123 4567',
    website:     'www.adaezeconsulting.com',
    owner:       'Adaeze Chioma Okonkwo',
  },
  {
    slug:        'precious-investment-advisory',
    businessId:  'BIZ-2024-007',
    ownerId:     MBR_PRECIOUS,      // Precious Ojeka — banker
    name:        'Precious Investment Advisory',
    category:    'Consulting',
    description: 'Personal finance coaching, investment portfolio management, and banking advisory for high-net-worth individuals.',
    images:      ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80'],
    location:    'Lekki, Lagos',
    phone:       '+234 801 000 0002',
    website:     'www.preciousadvisory.com',
    owner:       'Precious Ojeka',
  },
  {
    slug:        'abigal-art-gallery',
    businessId:  'BIZ-2024-008',
    ownerId:     MBR_ABIGAL_ART2,
    name:        'Abigal Art Gallery & Studio',
    category:    'Events & Entertainment',
    description: 'Contemporary Nigerian art gallery showcasing photography, painting, and mixed media works. Available for private exhibitions and corporate art installations.',
    images:      ['https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=600&q=80', 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=600&q=80'],
    location:    'Ikeja, Lagos',
    phone:       '+234 801 000 0007',
    website:     'www.abigalartgallery.com',
    owner:       'Abigal Ojo',
  },
  {
    slug:        'impact-creative-agency',
    businessId:  'BIZ-2024-009',
    ownerId:     MBR_ABIGAL_ART3,
    name:        'Impact Creative Agency',
    category:    'Consulting',
    description: 'Creative communications agency specialising in NGO branding, social impact campaigns, and nonprofit storytelling across West Africa.',
    images:      ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80'],
    location:    'Gbagada, Lagos',
    phone:       '+234 801 000 0008',
    website:     'www.impactcreativeagency.com',
    owner:       'Abigal Ojo',
  },
];

export const categories = [
  'Food & Beverages', 'Technology', 'Consulting',
  'Fashion & Beauty', 'Health & Wellness', 'Education',
  'Real Estate', 'Events & Entertainment',
];

// ─── Announcements ────────────────────────────────────────────────────────────
// createdBy → admin memberId

const newsItems: NewsItem[] = [
  {
    id:        1,
    slug:      'association-awards-45m-scholarships',
    title:     'Association Awards ₦45M in Scholarships — Largest in Our History',
    date:      '2026-03-01',
    image:     'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&q=80',
    tag:       'SCHOLARSHIP',
    excerpt:   'In an emotional prize-giving ceremony held at FGGC Abuja, the Alumnae Association announced its highest-ever scholarship disbursement — directly supporting 180 students across three arms of the school, with special focus on STEM and the Arts.',
    featured:  true,
    createdBy: MBR_ADAEZE,
  },
  {
    id: 2, slug: 'houston-chapter-officially-launched',
    title:     'Houston Chapter Officially Launched — Our 32nd Global Chapter',
    date:      '2026-03-01',
    image:     'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80',
    createdBy: MBR_STELLA,
  },
  {
    id: 3, slug: 'new-science-laboratory-wing-commissioned',
    title:     'New Science Laboratory Wing Commissioned at FGGC Calabar',
    date:      '2026-03-01',
    image:     'https://images.unsplash.com/photo-1562774053-701939374585?w=700&q=80',
    createdBy: MBR_ADAEZE,
  },
  {
    id: 4, slug: 'alumna-of-the-year-2025-dr-chiamaka-obi',
    title:     'Alumna of the Year 2025 — Dr. Chiamaka Obi Honoured in Abuja',
    date:      '2026-03-01',
    image:     'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=700&q=80',
    createdBy: MBR_JOSEPHINE,
  },
  {
    id: 5, slug: 'digital-yearbook-archive-now-live',
    title:     "Digital Yearbook Archive Now Live — Access Your Set's Photos",
    date:      '2026-03-01',
    image:     'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=700&q=80',
    createdBy: MBR_ADAEZE,
  },
];

// ─── Getters ──────────────────────────────────────────────────────────────────

export function getEvents():                           Event[]            { return events; }
export function getEventBySlug(slug: string):          Event | undefined  { return events.find((e) => e.slug === slug); }

export function getAlumni():                           Alumni[]           { return alumni; }
export function getAlumnusBySlug(slug: string):        Alumni | undefined { return alumni.find((a) => a.slug === slug); }
export function getAlumnusByMemberId(id: string):      Alumni | undefined { return alumni.find((a) => a.memberId === id); }

export function getLeadership():                       LeadershipMember[] { return leadership; }
export function getLeaderById(id: number):             LeadershipMember | undefined { return leadership.find((m) => m.id === id); }
export function getLeaderByMemberId(memberId: string): LeadershipMember | undefined { return leadership.find((m) => m.memberId === memberId); }

export function getProjects():                         Project[]          { return projects; }
export function getProjectById(id: string):            Project | undefined { return projects.find((p) => p.id === id); }

export function getAnnouncements():                    NewsItem[]         { return newsItems; }
export function getAnnouncementBySlug(slug: string):   NewsItem | undefined { return newsItems.find((n) => n.slug === slug); }

export function getBusinesses():                               typeof businesses  { return businesses; }
export function getBusinessesByOwner(ownerId: string):         typeof businesses  { return businesses.filter((b) => b.ownerId === ownerId); }
export function getBusinessBySlug(slug: string):               typeof businesses[0] | undefined { return businesses.find((b) => b.slug === slug); }

export function getEventRegistrations(memberId: string):       Event[] { return events.filter((e) => e.registrations?.includes(memberId)); }
export function getEventAttendeeCount(eventSlug: string):      number  { return events.find((e) => e.slug === eventSlug)?.registrations?.length ?? 0; }
