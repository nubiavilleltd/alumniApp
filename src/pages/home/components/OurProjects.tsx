import React from 'react';

import Project1 from "../../../../public/project-1.png"
import Project2 from "../../../../public/project-2.png"
import Project3 from "../../../../public/project-3.png"

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Computer Donation 2025',
    description: '87/88 Set donated computer sets to support digital learning',
    budget: '₦897,908.00',
    image: Project1,
  },
  {
    id: 2,
    title: 'Whiteboards & Markers',
    description: 'Complete classroom whiteboard installation for better learning',
    budget: '₦993,200.00',
    image: Project2,
  },
  {
    id: 3,
    title: 'School Perimeter Fencing',
    description: 'Enhanced security through comprehensive perimeter fencing project',
    budget: '₦698,090.00',
    image: Project3,
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-44 overflow-hidden bg-gray-100">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <a href="#" className="text-primary-500 font-semibold text-sm hover:underline">
          {project.title}
        </a>
        <p className="text-gray-500 text-xs mt-1 mb-3">{project.description}</p>
        <span className="inline-block bg-primary-500 text-white text-xs px-3 py-1 rounded-full">
          {project.budget}
        </span>
      </div>
    </div>
  );
}

export default function OurProjects() {
  return (
    // <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-20">
    <section className="section">
      {/* <div className="max-w-5xl mx-auto"> */}
      <div className="container-custom">
        <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-primary-500" />
          Our Projects
        </p>
        <p className="text-gray-600 text-sm mb-8">
          Through the generosity of our alumni, we continue to support and improve our beloved
          school
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-6 text-right">
          <a
            href="#"
            className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            See More <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
