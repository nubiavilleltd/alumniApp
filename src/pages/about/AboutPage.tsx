import { getSiteConfig } from '@/data/content';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import OurStory from '../home/components/OurStory';
import CoreValues from './CoreValues';
import Leadership from '../home/components/Leadership';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';

// const values = [
//   {
//     title: 'Community First',
//     description:
//       'We prioritize the well-being and success of our community members, fostering an environment of mutual support and collaboration.',
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//       />
//     ),
//     iconBg: 'bg-primary-100',
//     iconColor: 'text-primary-600',
//   },
//   {
//     title: 'Excellence',
//     description:
//       'We strive for excellence in everything we do, encouraging our members to pursue their passions and achieve their highest potential.',
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//       />
//     ),
//     iconBg: 'bg-secondary-100',
//     iconColor: 'text-secondary-600',
//   },
//   {
//     title: 'Innovation',
//     description:
//       "We embrace innovation and creativity, supporting our members in developing new ideas and pushing the boundaries of what's possible.",
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M13 10V3L4 14h7v7l9-11h-7z"
//       />
//     ),
//     iconBg: 'bg-accent-100',
//     iconColor: 'text-accent-600',
//   },
//   {
//     title: 'Inclusivity',
//     description:
//       'We celebrate diversity and create an inclusive environment where all members feel welcome, valued, and empowered to contribute.',
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//       />
//     ),
//     iconBg: 'bg-primary-100',
//     iconColor: 'text-primary-600',
//   },
//   {
//     title: 'Lifelong Learning',
//     description:
//       "We believe in the power of continuous learning and personal development, providing opportunities for growth throughout our members' careers.",
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//       />
//     ),
//     iconBg: 'bg-secondary-100',
//     iconColor: 'text-secondary-600',
//   },
//   {
//     title: 'Global Impact',
//     description:
//       'We aim to make a positive impact on the world through the collective efforts and achievements of our global alumni community.',
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
//       />
//     ),
//     iconBg: 'bg-accent-100',
//     iconColor: 'text-accent-600',
//   },
// ];

export function AboutPage() {
  // const config = getSiteConfig();

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'About Us' }];

  return (
    <>
      <SEO
        title="About"
        description="Learn about our alumni network, mission, and the team behind the Open Alumns Portal."
      />
      {/* <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Alumni Network</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
        Building bridges between past, present, and future generations of graduates
        </p>
        </div>
        </section> */}

      <Breadcrumbs items={breadcrumbItems} />

      {/* 
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                The Open Alumns Portal is dedicated to fostering lifelong connections between
                graduates, creating opportunities for collaboration, mentorship, and professional
                growth within our diverse community of alumni.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that the strength of our network lies in the collective wisdom,
                experience, and achievements of our members. By providing a platform for meaningful
                engagement, we empower our alumni to support each other's success and contribute to
                the advancement of their respective fields.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center text-primary-600">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">Professional Networking</span>
                </div>
                <div className="flex items-center text-primary-600">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">Mentorship Programs</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Building Connections</h3>
                  <p className="text-gray-600">
                    Connecting alumni across generations, industries, and geographical boundaries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our community and shape our collective future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div className="card text-center p-8" key={value.title}>
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${value.iconBg}`}
                >
                  <svg
                    className={`w-8 h-8 ${value.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {value.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section className="section bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Involved</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're an alumni member, a developer, or simply passionate about building
            stronger communities, there are many ways to get involved with our project.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Join as Alumni</h3>
              <p className="text-gray-100">
                Connect with fellow graduates and stay updated with community events and
                opportunities.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Contribute Code</h3>
              <p className="text-gray-100">
                Help improve the portal by contributing to our open-source codebase on GitHub.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Spread the Word</h3>
              <p className="text-gray-100">
                Share our project with your network and help us grow our community.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AppLink
              href="https://github.com/noskofficial/open-alumns"
              className="btn btn-secondary btn-lg"
            >
              Contribute on GitHub
            </AppLink>
            <AppLink
              href={`mailto:${config.contact.email}`}
              className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-700"
            >
              Contact Us
            </AppLink>
          </div>
        </div>
      </section> */}

      <OurStory />
      <CoreValues />
      <Leadership />
    </>
  );
}
