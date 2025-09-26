// app/components/Overlay.tsx
'use client';
import { projects, certificates, contactDetails } from '../data/portfolioData';
import { motion } from 'framer-motion';

const Section = ({ children, ...props }: any) => {
    return <motion.section 
        className="h-screen w-screen p-8 flex flex-col justify-center items-start"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        viewport={{ amount: 0.5 }}
        {...props}
    >{children}</motion.section>
}

export function Overlay() {
  return (
    // Lebar total container ini (w-[500vw]) harus sama dengan `pages={5}` di `page.tsx`
    <div className="w-[500vw] h-screen flex">
      
      {/* Halaman 1: Hero */}
      <Section className="w-screen">
        <h1 className="text-6xl md:text-9xl font-display text-white">Steven Mulya T.</h1>
        <p className="mt-4 text-xl md:text-2xl font-sans text-cyan-400">Software Engineer & Creative Developer</p>
      </Section>

      {/* Halaman 2, 3, 4: Projects */}
      {projects.slice(0, 3).map((project, index) => (
         <Section key={index} className="w-screen">
            <div className="max-w-3xl bg-black/50 p-8 rounded-lg backdrop-blur-md">
                <p className="font-display text-cyan-400">{project.type}</p>
                <h2 className="text-5xl md:text-7xl font-bold text-white mt-2">{project.title}</h2>
                <p className="text-neutral-300 mt-4">{project.description}</p>
                 <div className="mt-4 flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                        <span key={skill} className="text-xs rounded-full bg-cyan-900/50 px-3 py-1 text-cyan-300">{skill}</span>
                    ))}
                </div>
            </div>
         </Section>
      ))}

      {/* Halaman 5: Contact & Certificates */}
      <Section className="w-screen">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-5xl md:text-7xl font-display text-white">Let's Connect</h2>
                <p className="mt-4 text-neutral-300">Saya selalu terbuka untuk kolaborasi dan proyek baru.</p>
                <a href={`mailto:${contactDetails.match(/Email: (.*)/)?.[1].trim()}`} className="mt-6 inline-block font-bold text-cyan-400 text-lg">
                   {contactDetails.match(/Email: (.*)/)?.[1].trim()}
                </a>
            </div>
             <div>
                <h3 className="font-display text-2xl text-white mb-4">Credentials</h3>
                 <div className="space-y-3">
                     {certificates.map(cert => (
                         <div key={cert.name} className="p-3 rounded bg-black/50 backdrop-blur-md">
                            <p className="font-sans font-semibold text-white">{cert.name}</p>
                            <p className="text-sm text-neutral-400">{cert.institution}</p>
                         </div>
                     ))}
                 </div>
            </div>
         </div>
      </Section>
    </div>
  );
}