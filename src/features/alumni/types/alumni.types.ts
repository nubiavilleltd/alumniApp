type Project = {
  name: string;
  description: string;
  url: string;
};

type WorkExperience = {
  company: string;
  position: string;
  duration: string;
  description: string;
};

type Education = {
  degree: string;
  institution: string;
  year: number;
  gpa: string;
};

type SocialLinks = {
  linkedin?: string;
  twitter?: string;
  github?: string;
};

export type Alumni = {
  name: string;
  slug: string;
  chapter: string;
  year: number;
  short_bio: string;
  long_bio: string;
  photo: string;
  email: string;
  location: string;
  company: string;
  position: string;
  skills: string[];
  projects: Project[];
  work_experience: WorkExperience[];
  education: Education[];
  achievements: string[];
  interests: string[];
  social?: SocialLinks;
};
