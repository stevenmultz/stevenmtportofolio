// @/app/data/portfolioData.ts

// ==================== Type Definitions ====================
// Ini mendefinisikan "bentuk" dari setiap objek data.
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

// ==================== Projects Data ====================
// Semua data proyek portofolio Anda disimpan di sini.
export const projects: Project[] = [
  {
    title: "Gohte Architects",
    type: "Website Development",
    year: "2025",
    status: "Completed",
    webDeveloper: "Steven MT",
    uiUxDesigner: "Jeremy A",
    description: "Gohte Architects adalah studio arsitektur terkemuka yang berfokus pada desain berkelanjutan. Proyek ini melibatkan pembuatan situs web portofolio yang menampilkan karya-karya mereka dengan galeri visual yang interaktif dan modern.",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
    links: [
      { label: "Gohte Website", url: "https://mulaworks.vercel.app/" },
    ],
    images: ["/gohte.png", "/gohte1.png", "/gohte2.png"]
  },
  {
    title: "Dama Studio",
    type: "E-commerce Development",
    year: "2025",
    status: "In Progress",
    webDeveloper: "Steven MT",
    uiUxDesigner: "Septiandy",
    description: "Dama Studio adalah studio seni dan desain. Kami sedang mengembangkan situs web e-commerce untuk menjual produk-produk seni mereka, dengan integrasi keranjang belanja yang mulus dan halaman produk yang elegan.",
    skills: ["Astro Framework", "React", "Node.js", "Express", "Supabase","Vercel"],
    links: [
      { label: "Dama Website", url: "https://www.damastudio.id/" }
    ],
    images: ["/dama.png", "/dama1.png"]
  },
  {
    title: "Hutama Maju Sukses",
    type: "Corporate Website",
    year: "2024",
    status: "Completed",
    webDeveloper: "Steven MT",
    uiUxDesigner: "Airyne",
    description: "Sebuah situs web perusahaan untuk Hutama Maju Sukses, perusahaan manufaktur terkemuka. Fokus proyek ini adalah pada presentasi layanan dan portofolio produk mereka secara profesional dan informatif.",
    skills: ["Laravel", "React", "MySQL", "XAMPP"],
    links: [
      { label: "Live Site", url: "#" }
    ],
    images: ["/programming.png", "/ntt.jpg", "/webresponsive.jpg"]
  },
  {
    title: "Archive Delta",
    type: "Static Site",
    year: "2023",
    status: "Completed",
    webDeveloper: "Bob Williams",
    uiUxDesigner: "Alice Johnson",
    description: "Archive Delta adalah sebuah arsip digital untuk proyek-proyek seni dan sejarah. Situs statis ini dioptimalkan untuk kecepatan dan aksesibilitas, menyajikan koleksi data yang terorganisir dengan baik.",
    skills: ["Astro", "Markdown", "Tailwind CSS", "Vercel"],
    links: [
        { label: "Live Site", url: "#" },
        { label: "GitHub", url: "#" }
    ],
    images: ["/python.png", "/machinelearning.png"]
  },
  {
    title: "EcoTech Solutions",
    type: "Web Application",
    year: "2024",
    status: "Completed",
    webDeveloper: "Alice Johnson",
    uiUxDesigner: "John Smith",
    description: "Sebuah aplikasi web inovatif untuk memonitor data lingkungan. Pengguna dapat melacak konsumsi energi dan emisi karbon mereka melalui dasbor interaktif yang intuitif.",
    skills: ["React", "Node.js", "Express", "MongoDB", "Chart.js"],
    links: [
        { label: "Live Application", url: "#" }
    ],
    images: ["/aws_one.jpg", "/aws_two.jpg", "/ntt.jpg"]
  },
];

// ==================== Certificates Data ====================
// Semua data sertifikat Anda disimpan di sini.
export const certificates: Certificate[] = [
  { name: "Responsive Web Design", institution: "FreeCodeCamp", year: "2025", imageUrl: "/webresponsive.jpg" },
  { name: "Python", institution: "Kaggle", year: "2025", imageUrl: "/python.png" },
  { name: "Machine Learning Explainability", institution: "Kaggle", year: "2025", imageUrl: "/machinelearning.png" },
  { name: "AWS for Begginers", institution: "SimpleLearn", year: "2025", imageUrl: "/aws_one.jpg" },
  { name: "AWS Fundamentals", institution: "SimpleLearn", year: "2025", imageUrl: "/aws_two.jpg" },
  { name: "Intro to Programming", institution: "Kaggle", year: "2025", imageUrl: "/programming.png" },
  { name: "Internship NTT", institution: "NTT Indonesia Technology", year: "2024", imageUrl: "/ntt.jpg" },
];

// ==================== Contact Data ====================
// Informasi kontak Anda.
export const contactDetails = `
  Email: stevenmulya@gmail.com
  Whatsapp: +6287773298907
  Domicile: Tangerang, Indonesia
`;