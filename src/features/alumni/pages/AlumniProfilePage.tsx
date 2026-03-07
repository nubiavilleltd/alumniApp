import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';

import { getAlumnusBySlug } from '@/data/site-data';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';

export function AlumniProfilePage() {
  const { slug = '' } = useParams();
  const alumnus = getAlumnusBySlug(slug);

  if (!alumnus) {
    return (
      <Layout title="Profile Not Found">
        <section className="section">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold mb-4">Alumni profile not found</h1>
            <AppLink href="/alumni/profiles" className="btn btn-primary">
              Browse Directory
            </AppLink>
          </div>
        </section>
      </Layout>
    );
  }

  const alum = { ...alumnus };
  const socials = alum.social ?? {};

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni/profiles' },
    { label: alum.name },
  ];

  return (
    <Layout title={alum.name} description={alum.short_bio}>
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 text-center">
              <img
                src={alum.photo || '/logo.svg'}
                alt={alum.name}
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold">{alum.name}</h1>
              <p className="text-primary-600 mt-1">Class of {alum.year}</p>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                {alum.position && (
                  <p>
                    <strong>Position:</strong> {alum.position}
                  </p>
                )}
                {alum.company && (
                  <p>
                    <strong>Company:</strong> {alum.company}
                  </p>
                )}
                {alum.location && (
                  <p>
                    <strong>Location:</strong> {alum.location}
                  </p>
                )}
                {alum.email && (
                  <p>
                    <strong>Email:</strong>{' '}
                    <AppLink
                      href={`mailto:${alum.email}`}
                      className="text-primary-600 hover:underline ml-1"
                    >
                      {alum.email}
                    </AppLink>
                  </p>
                )}
              </div>

              {(socials.linkedin || socials.github || socials.twitter || socials.portfolio) && (
                <div className="mt-6 flex justify-center gap-5 text-gray-600">
                  {socials.linkedin && (
                    <AppLink
                      href={socials.linkedin}
                      target="_blank"
                      className="hover:text-primary-600"
                    >
                      <Icon icon="mdi:linkedin" className="w-6 h-6" />
                    </AppLink>
                  )}
                  {socials.github && (
                    <AppLink
                      href={socials.github}
                      target="_blank"
                      className="hover:text-primary-600"
                    >
                      <Icon icon="mdi:github" className="w-6 h-6" />
                    </AppLink>
                  )}
                  {socials.twitter && (
                    <AppLink
                      href={socials.twitter}
                      target="_blank"
                      className="hover:text-primary-600"
                    >
                      <Icon icon="mdi:twitter" className="w-6 h-6" />
                    </AppLink>
                  )}
                  {socials.portfolio && (
                    <AppLink
                      href={socials.portfolio}
                      target="_blank"
                      className="hover:text-primary-600"
                    >
                      <Icon icon="mdi:web" className="w-6 h-6" />
                    </AppLink>
                  )}
                </div>
              )}
            </aside>

            <main className="lg:col-span-2 space-y-8">
              <section className="bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-700">{alum.long_bio}</p>
              </section>

              {alum.skills && alum.skills.length > 0 && (
                <section className="bg-white shadow-md rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {alum.skills.map((skill) => (
                      <span className="badge badge-primary" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {alum.projects && alum.projects.length > 0 && (
                <section className="bg-white shadow-md rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-3">Projects</h2>
                  <div className="space-y-4">
                    {alum.projects.map((project) => (
                      <div key={project.name}>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-gray-700 text-sm">{project.description}</p>
                        {project.url && (
                          <AppLink
                            href={project.url}
                            target="_blank"
                            className="text-primary-600 text-sm hover:underline"
                          >
                            View Project
                          </AppLink>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {alum.work_experience && alum.work_experience.length > 0 && (
                <section className="bg-white shadow-md rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-3">Work Experience</h2>
                  <div className="space-y-4">
                    {alum.work_experience.map((experience) => (
                      <div key={`${experience.company}-${experience.position}`}>
                        <h3 className="font-semibold">
                          {experience.position} - {experience.company}
                        </h3>
                        <p className="text-gray-500 text-sm">{experience.duration}</p>
                        <p className="text-gray-700 text-sm">{experience.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {alum.education && alum.education.length > 0 && (
                <section className="bg-white shadow-md rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-3">Education</h2>
                  <div className="space-y-4">
                    {alum.education.map((education) => (
                      <div key={`${education.degree}-${education.year}`}>
                        <h3 className="font-semibold">{education.degree}</h3>
                        <p className="text-gray-700 text-sm">
                          {education.institution} ({education.year})
                        </p>
                        {education.gpa && (
                          <p className="text-gray-500 text-sm">GPA: {education.gpa}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {alum.achievements && alum.achievements.length > 0 && (
                <section className="bg-white shadow-md rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-3">Achievements</h2>
                  <ul className="list-disc list-inside text-gray-700">
                    {alum.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </section>
              )}

              {alum.interests && alum.interests.length > 0 && (
                <section className="bg-white shadow-md rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-3">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {alum.interests.map((interest) => (
                      <span className="badge badge-secondary" key={interest}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
}
