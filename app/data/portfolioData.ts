export interface Project {
  title: string;
  type: string;
  year: string;
  status: string;
  webDeveloper: string;
  uiUxDesigner: string;
  description: string;
  skills: string[];
  links: { label: string; url: string }[];
  images: string[];
}

export interface Certificate {
  name: string;
  institution: string;
  year: string;
  imageUrl: string;
}

export const projects: Project[] = [
  {
    title: "Gohte Architects",
    type: "Website Development",
    year: "2025",
    status: "Completed",
    webDeveloper: "Steven MT",
    uiUxDesigner: "Jeremy A",
    description: "Gohte Architects is a leading architecture studio focusing on sustainable design. This project involved creating a portfolio website to showcase their work with an interactive and modern visual gallery.",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
    links: [{ label: "Gohte Website", url: "https://www.andrewgohte.com/" }],
    images: ["/gohte.png", "/gohte1.png", "/gohte2.png"]
  },
  {
    title: "Dama Studio",
    type: "E-commerce Development",
    year: "2025",
    status: "In Progress",
    webDeveloper: "Steven MT",
    uiUxDesigner: "Septiandy",
    description: "Dama Studio is an art and design studio. We are developing an e-commerce website to sell their art products, with seamless shopping cart integration and elegant product pages.",
    skills: ["Astro Framework", "React", "Node.js", "Express", "Supabase", "Vercel"],
    links: [{ label: "Dama Website", url: "https://www.damastudio.id/" }],
    images: ["/dama.png", "/dama1.png"]
  },
  {
    title: "Hutama Maju Sukses",
    type: "Corporate Website",
    year: "2024",
    status: "Completed",
    webDeveloper: "Steven MT",
    uiUxDesigner: "Airyne",
    description: "A corporate website for Hutama Maju Sukses, a leading manufacturing company. The project focus was on presenting their services and product portfolio professionally and informatively.",
    skills: ["Laravel", "React", "MySQL", "XAMPP"],
    links: [{ label: "Live Site", url: "#" }],
    images: ["/hms.png", "/hms1.png"]
  },
];

export const certificates: Certificate[] = [
  { name: "Responsive Web Design", institution: "FreeCodeCamp", year: "2025", imageUrl: "/webresponsive.jpg" },
  { name: "Python", institution: "Kaggle", year: "2025", imageUrl: "/python.png" },
  { name: "Machine Learning Explainability", institution: "Kaggle", year: "2025", imageUrl: "/machinelearning.png" },
  { name: "AWS for Beginners", institution: "SimpleLearn", year: "2025", imageUrl: "/aws_one.jpg" },
  { name: "AWS Fundamentals", institution: "SimpleLearn", year: "2025", imageUrl: "/aws_two.jpg" },
  { name: "Intro to Programming", institution: "Kaggle", year: "2025", imageUrl: "/programming.png" },
  { name: "Internship NTT", institution: "NTT Indonesia Technology", year: "2024", imageUrl: "/ntt.jpg" },
];

export const contactDetails = `
  Email: stevenmulya@gmail.com
  Whatsapp: +6287773298907
  Domicile: Tangerang, Indonesia
`;