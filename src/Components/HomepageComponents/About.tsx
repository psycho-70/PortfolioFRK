'use client';

import { motion } from 'framer-motion';

interface ExperienceItem {
  title: string;
  role: string;
  details: string[];
}

const About = () => {
  const experience: ExperienceItem[] = [
    {
      title: "Precise Tech - Canada (08/2024 - Present)",
      role: "Web Developer (Remote)",
      details: [
        "Work remotely as a web developer, focusing on enterprise resource planning (ERP) solutions, utilizing technologies like Jira, Typescript, and TFS (Team Foundation Server).",
        "Contributed to the creation of specialized websites such as Nature Calm and Sowa Tooling, tailoring each site to the unique needs of the client.",
        "Collaborate with cross-functional teams to design and implement features, troubleshoot issues, and optimize web applications for scalability.",
        "Participate in code reviews and agile development processes, ensuring the delivery of high-quality solutions within project timelines.",
      ],
    },
    {
      title: "Uzair Technology - Kohat (06/2023 - 12/2023)",
      role: "Intern (React.js and Web Development)",
      details: [
        "Completed a comprehensive internship focused on learning and applying React.js, JavaScript, HTML, CSS, and Tailwind CSS.",
        "Worked on building several web applications, including a Weather App, Profile App, To-Do List App, and the FCP App.",
        "Gained hands-on experience in creating responsive and interactive user interfaces using React and Tailwind CSS.",
      ],
    },
    {
      title: "Khushal Institute - Karak (01/2024 - 06/2024)",
      role: "Web Development Instructor & Computer Education Teacher",
      details: [
        "Instruct and mentor students in web development, covering topics such as HTML, CSS, JavaScript, and modern web frameworks.",
        "Teach courses on office automation, networking, and basic computer skills, helping students gain foundational knowledge and hands-on experience.",
        "Develop and update educational materials, including course outlines, textbooks, and assignments, to ensure a dynamic and effective learning experience.",
      ],
    },
  ];

  return (
    <>
      <h1 className="text-3xl text-center py-5 font-bold">About Me</h1>
      <div className="h-[2px] w-full bg-blue-500 mb-5"></div>

      <motion.div
        className="bg-slate-800 mx-auto px-5 py-8 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg text-center text-white mb-5">
          I am a passionate Front-End Developer with over 1.5 years of hands-on experience in web development using modern technologies like React.js, Next.js, Node.js, and Tailwind CSS. I am currently working remotely with Precise Tech (Canada) as a Web Developer, contributing to large-scale web applications, including ERP systems and e-commerce platforms. Previously, I taught web development and computer fundamentals, equipping students with practical skills.
        </p>

        <h2 className="text-2xl text-center text-blue-400 font-semibold mb-5">Work Experience</h2>

        <ul className="space-y-8">
          {experience.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-950 p-5 rounded-lg shadow-md text-white"
            >
              <h3 className="text-xl font-bold text-blue-300">{item.title}</h3>
              <p className="text-lg font-semibold">{item.role}</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                {item.details.map((detail, idx) => (
                  <li key={idx} className="text-sm">{detail}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <div className="h-[2px] w-full bg-blue-500 mt-5"></div>
    </>
  );
};

export default About;