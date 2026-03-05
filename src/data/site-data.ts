
  const alumni = [
    {
      name: "Emma Rodriguez",
      slug: "emma-rodriguez",
      chapter: "Civil Engineering",
      year: 2023,
      short_bio:
        "Civil engineer focused on sustainable infrastructure and green building design",
      long_bio:
        "Emma is a passionate civil engineer dedicated to creating sustainable infrastructure solutions. She specializes in green building design and environmental impact assessment.",
      photo: "/images/avatars/default-avatar.svg",
      email: "emma.rodriguez@email.com",
      location: "Portland, OR",
      company: "GreenBuild Engineering",
      position: "Sustainability Engineer",
      skills: [
        "Structural Design",
        "Sustainability",
        "LEED Certification",
        "AutoCAD",
        "Environmental Assessment",
      ],
      projects: [
        {
          name: "Eco-Friendly Office Complex",
          description:
            "LEED Platinum certified office building with sustainable features",
          url: "https://greenbuild.com/office-complex",
        },
        {
          name: "Green Bridge Design",
          description:
            "Sustainable bridge design incorporating renewable materials",
          url: "https://greenbuild.com/bridge",
        },
      ],
      work_experience: [
        {
          company: "GreenBuild Engineering",
          position: "Sustainability Engineer",
          duration: "2023 - Present",
          description:
            "Leading sustainable design projects and LEED certification",
        },
        {
          company: "City Planning Department",
          position: "Civil Engineer Intern",
          duration: "2022 - 2023",
          description:
            "Assisted in urban planning and infrastructure projects",
        },
      ],
      education: [
        {
          degree: "Bachelor of Engineering in Civil Engineering",
          institution: "University of Technology",
          year: 2023,
          gpa: "3.7/4.0",
        },
      ],
      achievements: [
        "LEED Green Associate Certification",
        "Environmental Engineering Excellence Award",
        "Student Leadership Award",
      ],
      interests: [
        "Sustainability",
        "Green Building",
        "Urban Planning",
        "Environmental Conservation",
      ],
      social: {
        linkedin: "https://linkedin.com/in/emma-rodriguez",
        twitter: "https://twitter.com/emmarodriguez",
        github: "https://github.com/emmarodriguez",
      },
    },
    {
      name: "John Doe",
      slug: "john-doe",
      chapter: "Software Engineering",
      year: 2020,
      short_bio:
        "Senior Software Engineer at TechCorp, specializing in AI and cloud solutions",
      long_bio:
        "John is a passionate software engineer with expertise in full-stack development, machine learning, and cloud technologies. He graduated with honors and has been working on innovative projects that solve real-world problems.",
      photo: "/logo.png",
      email: "john.doe@email.com",
      location: "San Francisco, CA",
      company: "TechCorp",
      position: "Senior Software Engineer",
      skills: [
        "JavaScript",
        "Python",
        "React",
        "Node.js",
        "AWS",
        "Machine Learning",
        "Docker",
        "Kubernetes",
      ],
      projects: [
        {
          name: "AI-Powered Chatbot",
          description:
            "Developed an intelligent chatbot using natural language processing",
          url: "https://github.com/johndoe/ai-chatbot",
        },
        {
          name: "Cloud Migration Tool",
          description:
            "Built a tool to automate cloud infrastructure migration",
          url: "https://github.com/johndoe/cloud-migrator",
        },
      ],
      work_experience: [
        {
          company: "TechCorp",
          position: "Senior Software Engineer",
          duration: "2022 - Present",
          description:
            "Leading development of cloud-native applications and AI solutions",
        },
        {
          company: "StartupXYZ",
          position: "Software Engineer",
          duration: "2020 - 2022",
          description:
            "Full-stack development and DevOps practices implementation",
        },
      ],
      education: [
        {
          degree: "Bachelor of Engineering in Software Engineering",
          institution: "Nepal College of Information Technology",
          year: 2020,
          gpa: "3.9/4.0",
        },
      ],
      achievements: [
        "Graduated with First Class Honors",
        "Best Final Year Project Award",
        "Microsoft Student Partner",
        "Published 3 research papers",
      ],
      interests: ["AI/ML", "Cloud Computing", "Open Source", "Research"],
      social: {
        linkedin: "https://linkedin.com/in/john-doe",
        twitter: "https://twitter.com/johndoe",
        github: "https://github.com/johndoe"
      }
    },
    {
      name: "Michael Chen",
      slug: "michael-chen",
      chapter: "Electronics Engineering",
      year: 2021,
      short_bio: "Electronics engineer specializing in IoT and embedded systems",
      long_bio:
        "Michael is an innovative electronics engineer with deep expertise in IoT devices, embedded systems, and hardware design. He has successfully launched several IoT products in the market.",
      photo: "/images/avatars/default-avatar.svg",
      email: "michael.chen@email.com",
      location: "Austin, TX",
      company: "IoT Solutions Inc.",
      position: "Lead Hardware Engineer",
      skills: ["IoT", "Embedded Systems", "PCB Design", "C/C++", "Python", "Arduino"],
      projects: [
        {
          name: "Smart Home Hub",
          description: "Centralized IoT hub for smart home automation",
          url: "https://github.com/michaelchen/smarthome",
        },
        {
          name: "Environmental Monitor",
          description: "IoT device for monitoring air quality and temperature",
          url: "https://github.com/michaelchen/envmonitor",
        },
      ],
      work_experience: [
        {
          company: "IoT Solutions Inc.",
          position: "Lead Hardware Engineer",
          duration: "2021 - Present",
          description: "Leading hardware design and development for IoT products",
        },
        {
          company: "TechStart",
          position: "Electronics Engineer",
          duration: "2019 - 2021",
          description: "Designed and prototyped various electronic devices",
        },
      ],
      education: [
        {
          degree: "Bachelor of Engineering in Electronics Engineering",
          institution: "University of Technology",
          year: 2021,
          gpa: "3.9/4.0",
        },
      ],
      achievements: [
        "Innovation Award for IoT Product Design",
        "Patent for Smart Sensor Technology",
        "Best Graduate Student Award",
      ],
      interests: ["IoT", "Hardware Hacking", "Electronics", "Innovation"],
      social: {
        portfolio: "https://michaelchen.io",
        linkedin: "https://linkedin.com/in/michael-chen",
        twitter: "https://twitter.com/michaelchen",
        github: "https://github.com/michaelchen",
      },
    },
    {
      name: "Sarah Johnson",
      slug: "sarah-johnson",
      chapter: "Computer Engineering",
      year: 2022,
      short_bio:
        "Full-stack developer passionate about creating user-friendly web applications",
      long_bio:
        "Sarah is a talented full-stack developer with expertise in React, Node.js, and cloud technologies. She loves solving complex problems and mentoring junior developers.",
      photo: "/images/avatars/default-avatar.svg",
      email: "sarah.johnson@email.com",
      location: "San Francisco, CA",
      company: "TechCorp",
      position: "Senior Software Engineer",
      skills: ["React", "Node.js", "AWS", "TypeScript", "MongoDB"],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built a scalable e-commerce solution using React and Node.js",
          url: "https://github.com/sarahjohnson/ecommerce",
        },
        {
          name: "Task Management App",
          description:
            "Collaborative task management application with real-time updates",
          url: "https://github.com/sarahjohnson/taskapp",
        },
      ],
      work_experience: [
        {
          company: "TechCorp",
          position: "Senior Software Engineer",
          duration: "2022 - Present",
          description:
            "Leading development of web applications and mentoring junior developers",
        },
        {
          company: "StartupXYZ",
          position: "Full-stack Developer",
          duration: "2020 - 2022",
          description:
            "Built and maintained multiple web applications using modern technologies",
        },
      ],
      education: [
        {
          degree: "Bachelor of Engineering in Computer Engineering",
          institution: "University of Technology",
          year: 2022,
          gpa: "3.8/4.0",
        },
      ],
      achievements: [
        "Best Final Year Project Award",
        "Dean's List for 3 consecutive years",
        "Hackathon Winner - Tech Innovation Challenge",
      ],
      interests: ["Web Development", "Open Source", "Tech Meetups", "Reading"],
      social: {
        linkedin: "https://linkedin.com/in/sarah-johnson",
        twitter: "https://twitter.com/sarahjohnson",
        github: "https://github.com/sarahjohnson",
      },
    },
  ];

export function getAlumni(){
    return alumni
}