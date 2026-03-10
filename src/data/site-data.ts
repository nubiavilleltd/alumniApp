
import { Alumni } from '@/features/alumni/types/alumni.types';
import { BlogPost } from '@/features/announcements/types/announcement.types';
import { Event } from '@/features/events/types/event.types';

import Image2 from '../../public/leadership-2.png';
import Image3 from '../../public/leadership-3.png';
import Image4 from '../../public/leadership-4.png';
import Image5 from '../../public/leadership-5.png';
import Image6 from '../../public/leadership-6.png';

export const alumni = [
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo',
    chapter: 'Arts & Design',
    year: 1990,
    short_bio: 'Creative Director & Visual Artist',
    long_bio:
      'Abigal is a celebrated creative director and visual artist whose work spans brand identity, editorial design, and fine art exhibitions across Nigeria and beyond.',
    photo: Image2,
    email: 'abigal.ojo@email.com',
    location: 'Lagos, Nigeria',
    company: 'Studio Ojo Creative',
    position: 'Creative Director',
    skills: ['Brand Identity', 'Visual Art', 'Illustration', 'Art Direction', 'Typography'],
    projects: [],
    work_experience: [
      {
        company: 'Studio Ojo Creative',
        position: 'Creative Director',
        duration: '2015 - Present',
        description: 'Leading creative strategy and visual identity for top Nigerian brands.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Arts in Fine & Applied Arts',
        institution: 'University of Lagos',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Visual Art', 'Design', 'Culture', 'Fashion'],
    social: { linkedin: '', twitter: '' },
  },
  {
    name: 'Precious Ojeka',
    slug: 'precious-ojeka',
    chapter: 'Business & Finance',
    year: 1990,
    short_bio: 'Banker',
    long_bio:
      'Precious is a seasoned banking professional with over two decades of experience in commercial and retail banking across Nigeria.',
    photo: Image3,
    email: 'precious.ojeka@email.com',
    location: 'Lagos, Nigeria',
    company: 'First Bank of Nigeria',
    position: 'Senior Relationship Manager',
    skills: ['Banking', 'Finance', 'Customer Relations', 'Credit Analysis', 'Risk Management'],
    projects: [],
    work_experience: [
      {
        company: 'First Bank of Nigeria',
        position: 'Senior Relationship Manager',
        duration: '2010 - Present',
        description: 'Managing high-value client portfolios and corporate banking relationships.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Banking & Finance',
        institution: 'University of Benin',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Finance', 'Investment', 'Mentorship', 'Travel'],
    social: { linkedin: '' },
  },
  {
    name: 'Theresa Ojo',
    slug: 'theresa-ojo',
    chapter: 'Health Sciences',
    year: 1990,
    short_bio: 'Nurse',
    long_bio:
      'Theresa is a dedicated registered nurse specialising in maternal and child health, serving communities across Lagos State.',
    photo: Image4,
    email: 'theresa.ojo@email.com',
    location: 'Lagos, Nigeria',
    company: 'Lagos University Teaching Hospital',
    position: 'Registered Nurse',
    skills: ['Patient Care', 'Maternal Health', 'Paediatrics', 'Community Health', 'First Aid'],
    projects: [],
    work_experience: [
      {
        company: 'Lagos University Teaching Hospital',
        position: 'Registered Nurse',
        duration: '2005 - Present',
        description: 'Providing specialist maternal and child healthcare services.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Nursing Science',
        institution: 'University of Lagos',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Healthcare', 'Community Service', 'Public Health', 'Wellness'],
    social: { linkedin: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-ceo',
    chapter: 'Fashion & Entrepreneurship',
    year: 1990,
    short_bio: "C.E.O Abi's stitches",
    long_bio:
      "Founder and CEO of Abi's Stitches, a leading Nigerian fashion label known for contemporary African-inspired designs.",
    photo: Image5,
    email: 'abigal.ceo@email.com',
    location: 'Lagos, Nigeria',
    company: "Abi's Stitches",
    position: 'CEO & Fashion Designer',
    skills: ['Fashion Design', 'Entrepreneurship', 'Textile Arts', 'Brand Building', 'Tailoring'],
    projects: [],
    work_experience: [
      {
        company: "Abi's Stitches",
        position: 'CEO & Fashion Designer',
        duration: '2012 - Present',
        description: 'Building a premium African fashion brand with nationwide reach.',
      },
    ],
    education: [
      {
        degree: 'Diploma in Fashion Design',
        institution: 'Yaba College of Technology',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Fashion', 'Entrepreneurship', 'African Culture', 'Design'],
    social: { linkedin: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-dev',
    chapter: 'Technology',
    year: 1990,
    short_bio: 'Web developer',
    long_bio:
      'A skilled front-end web developer building digital products for Nigerian startups and SMEs.',
    photo: Image2,
    email: 'abigal.dev@email.com',
    location: 'Lagos, Nigeria',
    company: 'Freelance',
    position: 'Web Developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI Design'],
    projects: [],
    work_experience: [
      {
        company: 'Freelance',
        position: 'Web Developer',
        duration: '2018 - Present',
        description: 'Building responsive websites and web applications for clients.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Lagos',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Technology', 'Web Design', 'Open Source', 'Innovation'],
    social: { linkedin: '', github: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-chef',
    chapter: 'Culinary Arts',
    year: 1990,
    short_bio: 'Chef',
    long_bio:
      'A renowned chef celebrated for her fusion of traditional Nigerian cuisine with contemporary cooking techniques.',
    photo: Image4,
    email: 'abigal.chef@email.com',
    location: 'Lagos, Nigeria',
    company: 'The Pepper Soup Kitchen',
    position: 'Executive Chef',
    skills: ['Culinary Arts', 'Menu Development', 'Food Styling', 'Catering', 'Nutrition'],
    projects: [],
    work_experience: [
      {
        company: 'The Pepper Soup Kitchen',
        position: 'Executive Chef',
        duration: '2016 - Present',
        description: 'Creating signature Nigerian fusion dishes and leading kitchen operations.',
      },
    ],
    education: [
      {
        degree: 'Diploma in Culinary Arts',
        institution: 'Lagos Culinary Academy',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Cooking', 'Food Culture', 'Travel', 'Wellness'],
    social: { linkedin: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-artist-2',
    chapter: 'Arts & Design',
    year: 1990,
    short_bio: 'Creative Director & Visual Artist',
    long_bio:
      'A multidisciplinary visual artist working across photography, painting, and digital media.',
    photo: Image5,
    email: 'abigal.artist2@email.com',
    location: 'Lagos, Nigeria',
    company: 'Self-employed',
    position: 'Visual Artist',
    skills: ['Photography', 'Painting', 'Digital Art', 'Creative Direction', 'Storytelling'],
    projects: [],
    work_experience: [
      {
        company: 'Self-employed',
        position: 'Visual Artist',
        duration: '2014 - Present',
        description: 'Creating and exhibiting visual art locally and internationally.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Arts in Fine Arts',
        institution: 'Obafemi Awolowo University',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Art', 'Photography', 'Culture', 'Travel'],
    social: { linkedin: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-artist-3',
    chapter: 'Arts & Design',
    year: 1990,
    short_bio: 'Creative Director & Visual Artist',
    long_bio:
      'Creative director with a focus on visual storytelling for NGOs and social impact organisations across West Africa.',
    photo: Image3,
    email: 'abigal.artist3@email.com',
    location: 'Lagos, Nigeria',
    company: 'Impact Creatives',
    position: 'Creative Director',
    skills: [
      'Visual Storytelling',
      'NGO Communication',
      'Graphic Design',
      'Branding',
      'Video Production',
    ],
    projects: [],
    work_experience: [
      {
        company: 'Impact Creatives',
        position: 'Creative Director',
        duration: '2017 - Present',
        description: 'Leading creative campaigns for social impact and nonprofit organisations.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Arts in Mass Communication',
        institution: 'University of Nigeria, Nsukka',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Social Impact', 'Design', 'Media', 'Community'],
    social: { linkedin: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-artist-4',
    chapter: 'Arts & Design',
    year: 1990,
    short_bio: 'Creative Director & Visual Artist',
    long_bio:
      'Award-winning creative director known for her bold visual identity work for fashion and lifestyle brands.',
    photo: Image6,
    email: 'abigal.artist4@email.com',
    location: 'Lagos, Nigeria',
    company: 'Bold Studio',
    position: 'Creative Director',
    skills: ['Art Direction', 'Brand Strategy', 'Photography', 'Fashion', 'Campaign Design'],
    projects: [],
    work_experience: [
      {
        company: 'Bold Studio',
        position: 'Creative Director',
        duration: '2019 - Present',
        description: 'Directing visual identity and campaign strategy for fashion brands.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Arts in Visual Communication',
        institution: 'Covenant University',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Fashion', 'Photography', 'Branding', 'Lifestyle'],
    social: { linkedin: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-artist-5',
    chapter: 'Arts & Design',
    year: 1990,
    short_bio: 'Creative Director & Visual Artist',
    long_bio:
      'A creative director with expertise in digital media, content strategy, and visual communications for tech companies.',
    photo: Image3,
    email: 'abigal.artist5@email.com',
    location: 'Lagos, Nigeria',
    company: 'TechMedia Lagos',
    position: 'Creative Director',
    skills: [
      'Digital Media',
      'Content Strategy',
      'UX Design',
      'Visual Communication',
      'Social Media',
    ],
    projects: [],
    work_experience: [
      {
        company: 'TechMedia Lagos',
        position: 'Creative Director',
        duration: '2021 - Present',
        description: 'Leading digital creative strategy for a fast-growing tech media company.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Information Technology',
        institution: 'Babcock University',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Tech', 'Media', 'Design', 'Innovation'],
    social: { linkedin: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-artist-6',
    chapter: 'Arts & Design',
    year: 1990,
    short_bio: 'Creative Director & Visual Artist',
    long_bio:
      'Passionate visual artist and creative educator dedicated to nurturing the next generation of Nigerian artists.',
    photo: Image4,
    email: 'abigal.artist6@email.com',
    location: 'Lagos, Nigeria',
    company: 'Lagos Art Academy',
    position: 'Art Educator & Creative Director',
    skills: ['Art Education', 'Creative Direction', 'Curriculum Design', 'Painting', 'Drawing'],
    projects: [],
    work_experience: [
      {
        company: 'Lagos Art Academy',
        position: 'Art Educator & Creative Director',
        duration: '2016 - Present',
        description: 'Teaching visual arts and directing the creative curriculum.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Education in Fine Arts',
        institution: 'Lagos State University',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Education', 'Art', 'Youth Development', 'Culture'],
    social: { linkedin: '' },
  },
  {
    name: 'Abigal Ojo',
    slug: 'abigal-ojo-artist-7',
    chapter: 'Arts & Design',
    year: 1990,
    short_bio: 'Creative Director & Visual Artist',
    long_bio:
      'A visual artist and creative consultant helping brands find their unique visual voice through strategy and design.',
    photo: Image6,
    email: 'abigal.artist7@email.com',
    location: 'Lagos, Nigeria',
    company: 'Freelance',
    position: 'Creative Consultant',
    skills: ['Consulting', 'Brand Design', 'Visual Arts', 'Strategy', 'Mentorship'],
    projects: [],
    work_experience: [
      {
        company: 'Freelance',
        position: 'Creative Consultant',
        duration: '2020 - Present',
        description: 'Providing creative direction and brand consultancy services.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Arts in Fine Arts',
        institution: 'University of Ibadan',
        year: 1990,
        gpa: '',
      },
    ],
    achievements: [],
    interests: ['Art', 'Strategy', 'Mentorship', 'Design'],
    social: { linkedin: '' },
  },
];

export const events = [
  {
    slug: 'annual-homecoming-weekend-gala',
    title: 'Annual Homecoming Weekend & Grand Gala',
    description:
      'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&q=80',
    location: 'Transcorp Hilton, Abuja',
    attire: 'Formal Attire',
    date: '2026-12-12',
    type: 'upcoming',
    isVirtual: false,
    category: 'Reunion',
    tags: ['reunion', 'gala', 'networking', 'homecoming'],
    featured: true,
    content: `# Annual Homecoming Weekend & Grand Gala

A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.

## Event Details

- **Date**: December 12, 2026
- **Time**: 5:00 PM - 11:00 PM
- **Location**: Transcorp Hilton, Abuja
- **Attire**: Formal Attire
- **Theme**: Celebrating Excellence: Decades of Sisterhood

## What to Expect

- Grand gala dinner and awards ceremony
- Cultural night performances
- Networking sessions across all sets
- Recognition of outstanding alumnae
- Live entertainment and dancing

## Registration

Register early to secure your spot at this landmark event.

## Contact

For more information: events@fggcalumnae.org`,
  },
  {
    slug: 'diaspora-virtual-networking-night',
    title: 'Diaspora Virtual Networking Night',
    description:
      'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=700&q=80',
    location: 'Zoom, Global',
    attire: '',
    date: '2026-12-12',
    type: 'upcoming',
    isVirtual: true,
    category: 'Networking',
    tags: ['diaspora', 'virtual', 'networking', 'global'],
    featured: false,
    content: `# Diaspora Virtual Networking Night

Connect with fellow FGGC alumnae across the globe from the comfort of your home. An evening of meaningful conversations, shared stories, and new connections.

## Event Details

- **Date**: December 12, 2026
- **Time**: 7:00 PM WAT / 2:00 PM EST / 7:00 PM GMT
- **Platform**: Zoom, Global
- **Attire**: Smart Casual (Virtual)

## What to Expect

- Breakout rooms by graduation set and region
- Speed networking sessions
- Guest speaker from the diaspora community
- Open forum and Q&A
- Virtual cultural showcase

## Registration

Register to receive your Zoom link before the event.

## Contact

For more information: diaspora@fggcalumnae.org`,
  },
  {
    slug: 'child-birth-of-one-us',
    title: 'Child Birth Of One Us',
    description:
      'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&q=80',
    location: 'Transcorp Hilton, Abuja',
    attire: 'Formal Attire',
    date: '2028-12-12',
    type: 'upcoming',
    isVirtual: false,
    category: 'Celebration',
    tags: ['celebration', 'community', 'maternal', 'support'],
    featured: false,
    content: `# Child Birth Of One Us

A warm and joyful celebration honouring alumnae who have recently welcomed new life. We come together as sisters to celebrate new beginnings and offer community support.

## Event Details

- **Date**: December 12, 2028
- **Time**: 2:00 PM - 6:00 PM
- **Location**: Transcorp Hilton, Abuja
- **Attire**: Formal Attire

## What to Expect

- Celebratory reception and refreshments
- Gift presentations to new mothers
- Wellness talks for new and expecting mothers
- Community support network introductions
- Photo sessions and keepsakes

## Registration

RSVP to help us plan appropriately for this special occasion.

## Contact

For more information: community@fggcalumnae.org`,
  },
  {
    slug: 'donation-for-project',
    title: 'Donation For Project',
    description:
      'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=700&q=80',
    location: 'Zoom, Global',
    attire: '',
    date: '2026-12-12',
    type: 'upcoming',
    isVirtual: true,
    category: 'Fundraising',
    tags: ['donation', 'fundraising', 'project', 'giveback'],
    featured: false,
    content: `# Donation For Project

A virtual fundraising drive to support ongoing infrastructure and welfare projects at Federal Government Girls College. Every contribution makes a difference.

## Event Details

- **Date**: December 12, 2026
- **Time**: 6:00 PM WAT
- **Platform**: Zoom, Global
- **Attire**: N/A (Virtual)

## What to Expect

- Project presentations and progress updates
- Pledge drive and live donation tracking
- Testimonials from current students
- Recognition of top contributors
- Q&A with the projects committee

## How to Contribute

Donations can be made online before, during, or after the event.

## Contact

For more information: projects@fggcalumnae.org`,
  },
  {
    slug: 'school-opening',
    title: 'School Opening',
    description:
      'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80',
    location: 'Transcorp Hilton, Abuja',
    attire: 'Formal Attire',
    date: '2026-12-12',
    type: 'upcoming',
    isVirtual: false,
    category: 'Education',
    tags: ['education', 'school', 'opening', 'ceremony'],
    featured: false,
    content: `# School Opening

A commemorative event marking the beginning of a new academic session at FGGC. Alumnae are invited to witness and support the next generation of FGGC daughters.

## Event Details

- **Date**: December 12, 2026
- **Time**: 9:00 AM - 1:00 PM
- **Location**: Transcorp Hilton, Abuja
- **Attire**: Formal Attire

## What to Expect

- Opening ceremony and address
- Alumnae mentorship pairings with new students
- School tour and facility showcase
- Scholarship presentations
- Lunch reception

## Registration

Register to confirm your attendance at this prestigious ceremony.

## Contact

For more information: education@fggcalumnae.org`,
  },
  {
    slug: 'night-party',
    title: 'Night Party',
    description:
      'A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&q=80',
    location: 'Zoom, Global',
    attire: '',
    date: '2026-12-12',
    type: 'upcoming',
    isVirtual: true,
    category: 'Social',
    tags: ['party', 'social', 'virtual', 'fun'],
    featured: false,
    content: `# Night Party

Let your hair down and celebrate with sisters from across the world in this fun-filled virtual night party. Music, games, and great company await.

## Event Details

- **Date**: December 12, 2026
- **Time**: 8:00 PM WAT / 3:00 PM EST
- **Platform**: Zoom, Global
- **Attire**: Party Wear (Virtual)

## What to Expect

- Live DJ and music sets
- Virtual party games and contests
- Trivia night with prizes
- Open mic for alumnae
- Photo booth and virtual backgrounds

## Registration

Register to receive your Zoom link and party pack details.

## Contact

For more information: social@fggcalumnae.org`,
  },
  {
    slug: 'annual-alumni-meet-2024',
    title: 'Annual Alumni Meet 2024',
    description:
      'Join us for our most anticipated event of the year! The Annual Alumni Meet brings together graduates from all batches for an evening of networking, celebration, and inspiration.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=80',
    location: 'Main Campus Auditorium, NCIT',
    attire: 'Smart Casual',
    date: '2024-12-15',
    type: 'past',
    isVirtual: false,
    category: 'Reunion',
    tags: ['reunion', 'networking', 'annual', 'alumni'],
    featured: false,
    content: `# Annual Alumni Meet 2024

Join us for our most anticipated event of the year! The Annual Alumni Meet brings together graduates from all batches for an evening of networking, celebration, and inspiration.

## Event Details

- **Date**: December 15, 2024
- **Time**: 6:00 PM - 10:00 PM
- **Location**: Main Campus Auditorium, NCIT
- **Attire**: Smart Casual
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
  },
  {
    slug: 'startup-pitch-competition-2024',
    title: 'Startup Pitch Competition 2024',
    description:
      'Annual startup pitch competition showcasing innovative ideas from our alumni community.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=700&q=80',
    location: 'Innovation Hub, University Campus',
    attire: 'Business Casual',
    date: '2024-04-20',
    type: 'past',
    isVirtual: false,
    category: 'Entrepreneurship',
    tags: ['startup', 'pitch', 'entrepreneurship', 'innovation'],
    featured: false,
    content: `# Startup Pitch Competition 2024

Annual startup pitch competition showcasing innovative ideas from our alumni community. Finalists compete for funding and mentorship opportunities.

## Event Details

- **Date**: April 20, 2024
- **Time**: 10:00 AM - 4:00 PM
- **Location**: Innovation Hub, University Campus
- **Attire**: Business Casual

## What to Expect

- 10 finalist startup pitches
- Judging panel of investors and industry experts
- Networking lunch with entrepreneurs
- Prize presentation and mentorship matching
- Exhibitor showcase

## Registration

[Register Now](https://forms.gle/startup-pitch-2024)

## Contact

For more information: entrepreneurship@fggcalumnae.org`,
  },
  {
    slug: 'tech-career-fair-2024',
    title: 'Tech Career Fair 2024',
    description: 'Annual technology career fair connecting alumni with top tech companies.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80',
    location: 'Convention Center, Downtown',
    attire: 'Business Formal',
    date: '2024-03-15',
    type: 'past',
    isVirtual: false,
    category: 'Career',
    tags: ['career', 'technology', 'jobs', 'networking'],
    featured: false,
    content: `# Tech Career Fair 2024

Annual technology career fair connecting alumni with top tech companies. Explore job opportunities, internships, and career development resources.

## Event Details

- **Date**: March 15, 2024
- **Time**: 9:00 AM - 3:00 PM
- **Location**: Convention Center, Downtown
- **Attire**: Business Formal

## What to Expect

- 30+ top tech companies in attendance
- CV review and interview prep workshops
- Panel discussion: Women in Tech
- On-the-spot interviews
- Career coaching sessions

## Registration

[Register Now](https://forms.gle/tech-career-fair-2024)

## Contact

For more information: careers@fggcalumnae.org`,
  },
  {
    slug: 'scholarship-award-night-2024',
    title: 'Scholarship Award Night 2024',
    description:
      'Celebrating our brightest students with the annual scholarship award ceremony, honouring academic excellence and community service.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&q=80',
    location: 'Grand Ballroom, Eko Hotel, Lagos',
    attire: 'Black Tie',
    date: '2024-02-10',
    type: 'past',
    isVirtual: false,
    category: 'Education',
    tags: ['scholarship', 'awards', 'education', 'excellence'],
    featured: true,
    content: `# Scholarship Award Night 2024

Celebrating our brightest students with the annual scholarship award ceremony, honouring academic excellence and community service.

## Event Details

- **Date**: February 10, 2024
- **Time**: 6:00 PM - 9:00 PM
- **Location**: Grand Ballroom, Eko Hotel, Lagos
- **Attire**: Black Tie

## What to Expect

- Scholarship presentations to 180+ students
- Keynote address by distinguished alumna
- Recognition of top-performing sets
- Gala dinner and entertainment
- Alumnae giving tribute

## Registration

[Register Now](https://forms.gle/scholarship-award-2024)

## Contact

For more information: scholarships@fggcalumnae.org`,
  },
  {
    slug: 'virtual-mentorship-summit-2023',
    title: 'Virtual Mentorship Summit 2023',
    description:
      'A virtual summit connecting senior alumnae mentors with recent graduates to share career guidance and life lessons.',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=700&q=80',
    location: 'Zoom, Global',
    attire: '',
    date: '2023-11-05',
    type: 'past',
    isVirtual: true,
    category: 'Mentorship',
    tags: ['mentorship', 'virtual', 'career', 'guidance'],
    featured: false,
    content: `# Virtual Mentorship Summit 2023

A virtual summit connecting senior alumnae mentors with recent graduates to share career guidance and life lessons.

## Event Details

- **Date**: November 5, 2023
- **Time**: 3:00 PM WAT / 10:00 AM EST
- **Platform**: Zoom, Global
- **Attire**: N/A (Virtual)

## What to Expect

- One-on-one mentor matching sessions
- Panel: Navigating Your Career as a Nigerian Woman
- Workshops on leadership, finance, and wellness
- Open Q&A with senior alumnae
- Mentorship programme sign-up

## Registration

[Register Now](https://forms.gle/mentorship-summit-2023)

## Contact

For more information: mentorship@fggcalumnae.org`,
  },
  {
    slug: 'cultural-day-celebration-2023',
    title: 'Cultural Day Celebration 2023',
    description:
      'A vibrant celebration of Nigerian culture, heritage, and the bonds that unite FGGC alumnae across generations.',
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=700&q=80',
    location: 'National Arts Theatre, Lagos',
    attire: 'Traditional Attire',
    date: '2023-10-01',
    type: 'past',
    isVirtual: false,
    category: 'Networking',
    tags: ['networking', 'celebration', 'alumni', 'annual'],
    featured: true,
    content: `# Cultural Day Celebration 2023

A vibrant celebration of Nigerian culture, heritage, and the bonds that unite FGGC alumnae across generations.

## Event Details

- **Date**: October 1, 2023
- **Time**: 12:00 PM - 8:00 PM
- **Location**: National Arts Theatre, Lagos
- **Attire**: Traditional Attire
- **Theme**: Roots & Wings: Honouring Where We Come From

## What to Expect

- Traditional music and dance performances
- Cultural food festival from all Nigerian regions
- Art and craft exhibition by alumnae
- Storytelling and heritage talks
- Photography and fashion showcase

## Registration

Registration is free for all FGGC alumnae.

## Contact

For more information: events@fggcalumnae.org`,
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

export const businesses = [
  {
    slug: 'ngozis-catering-service',
    name: "Ngozi's Catering Service",
    category: 'Food & Beverages',
    description:
      'Premium catering services for weddings, corporate events, and private parties. Specialising in local and continental dishes.',
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', // jollof rice / food spread
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', // food buffet
    ],
    location: 'Lekki, Lagos',
    phone: '+234 801 123 5678',
    website: 'www.ngozycatering.com',
    owner: 'Ngozi Okafor',
    slug_owner: 'ngozi-okafor',
  },
  {
    slug: 'johnnys-tech-limited',
    name: "Johnny's Tech Limited",
    category: 'Technology',
    description:
      'Leading provider of IT solutions, phone sales, repairs, and software services for businesses and individuals across Lagos.',
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80', // tech laptops
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80', // coding screen
    ],
    location: 'Lekki, Lagos',
    phone: '+234 801 123 5654',
    website: 'www.agottech.com',
    owner: 'Johnny Adaeze',
    slug_owner: 'johnny-adaeze',
  },
  {
    slug: 'obes-phones-limited-1',
    name: "Obe's Phones Limited",
    category: 'Technology',
    description:
      'Your one-stop shop for the latest smartphones, accessories, and expert phone repair services in Lagos.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', // phones
      'https://images.unsplash.com/photo-1574920162043-b872873f19bc?w=600&q=80', // phone store
    ],
    location: 'Lekki, Lagos',
    phone: '+234 801 123 6878',
    website: 'www.obes.com',
    owner: 'Obe Chioma',
    slug_owner: 'obe-chioma',
  },
  {
    slug: 'obes-phones-limited-2',
    name: "Obe's Phones Limited",
    category: 'Technology',
    description:
      'Your one-stop shop for the latest smartphones, accessories, and expert phone repair services in Lagos.',
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80', // samsung phone
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80', // phone accessories
    ],
    location: 'Lekki, Lagos',
    phone: '+234 802 341 5679',
    website: 'www.agottech.com',
    owner: 'Obe Chioma',
    slug_owner: 'obe-chioma-2',
  },
  {
    slug: 'ngozis-consulting-service',
    name: "Ngozi's Consulting Service",
    category: 'Consulting',
    description:
      'Professional business consulting, strategy development, and management advisory services for SMEs and corporates.',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', // business meeting
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80', // woman consulting
    ],
    location: 'Lekki, Lagos',
    phone: '+234 803 234 5679',
    website: 'www.ngozitech.com',
    owner: 'Ngozi Adaeze',
    slug_owner: 'ngozi-adaeze',
  },
  {
    slug: 'johnnys-tech-limited-2',
    name: "Johnny's Tech Limited",
    category: 'Technology',
    description:
      'Leading provider of IT solutions, phone sales, repairs, and software services for businesses and individuals across Lagos.',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80', // laptop work
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', // tech woman
    ],
    location: 'Lekki, Lagos',
    phone: '+234 801 234 5679',
    website: 'www.agottech.com',
    owner: 'Johnny Adaeze',
    slug_owner: 'johnny-adaeze-2',
  },
  {
    slug: 'obes-phones-limited-3',
    name: "Obe's Phones Limited",
    category: 'Technology',
    description:
      'Your one-stop shop for the latest smartphones, accessories, and expert phone repair services in Lagos.',
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80', // phones display
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80', // phone repair
    ],
    location: 'Lekki, Lagos',
    phone: '+234 802 345 6789',
    website: 'www.agottech.com',
    owner: 'Obe Chioma',
    slug_owner: 'obe-chioma-3',
  },
  {
    slug: 'ngozis-consulting-service-2',
    name: "Ngozi's Consulting Service",
    category: 'Consulting',
    description:
      'Professional business consulting, strategy development, and management advisory services for SMEs and corporates.',
    images: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', // board meeting
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80', // office consulting
    ],
    location: 'Lekki, Lagos',
    phone: '+234 803 456 7890',
    website: 'www.ngozitech.com',
    owner: 'Ngozi Adaeze',
    slug_owner: 'ngozi-adaeze-2',
  },
  {
    slug: 'johnnys-tech-limited-3',
    name: "Johnny's Tech Limited",
    category: 'Technology',
    description:
      'Leading provider of IT solutions, phone sales, repairs, and software services for businesses and individuals across Lagos.',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', // coding
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80', // tech setup
    ],
    location: 'Lekki, Lagos',
    phone: '+234 801 567 8901',
    website: 'www.agottech.com',
    owner: 'Johnny Adaeze',
    slug_owner: 'johnny-adaeze-3',
  },
];

export const categories = [
  'Food & Beverages',
  'Technology',
  'Consulting',
  'Fashion & Beauty',
  'Health & Wellness',
  'Education',
  'Real Estate',
  'Events & Entertainment',
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
