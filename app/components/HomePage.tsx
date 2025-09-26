// app/components/Homepage.tsx
import { motion } from 'framer-motion';
import { projects, certificates, contactDetails } from '../data/portfolioData';
import { FiMail, FiGithub, FiLinkedin, FiArrowRight } from 'react-icons/fi';

export default function Homepage() {
  const email = contactDetails.match(/Email: (.*)/)?.[1].trim() || '';

  return (
    <motion.div
      className="min-h-screen w-full bg-black font-sans text-neutral-300"
      initial={{ y: '100%' }}
      animate={{ y: '0%', transition: { duration: 1, ease: [0.83, 0, 0.17, 1] } }}
    >
      <video
        autoPlay loop muted playsInline
        className="fixed top-0 left-0 z-0 h-full w-full object-cover brightness-[0.2]"
        src="/videos/background.mp4"
      />
      <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 p-6 lg:grid-cols-12 lg:p-10">
        
        {/* --- KOLOM KIRI: Sidebar --- */}
        <aside className="lg:col-span-4 lg:sticky lg:top-10 h-fit">
          <h1 className="text-4xl font-bold text-white">Steven Mulya T.</h1>
          <h2 className="mt-2 text-lg text-neutral-400">Software Engineer</h2>
          <p className="mt-6 text-sm leading-relaxed text-neutral-400">
            Saya merancang dan membangun solusi digital yang elegan, mengubah ide kompleks menjadi kenyataan melalui kode yang bersih dan interaksi yang intuitif.
          </p>
          <nav className="mt-8">
            <ul className="space-y-3 text-sm font-medium text-neutral-500">
              <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#certificates" className="hover:text-white transition-colors">Certificates</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </nav>
          <div className="mt-8 flex space-x-4">
            <a href="#" className="text-neutral-500 hover:text-white"><FiGithub /></a>
            <a href="#" className="text-neutral-500 hover:text-white"><FiLinkedin /></a>
          </div>
        </aside>

        {/* --- KOLOM KANAN: Konten Utama --- */}
        <main className="lg:col-span-8">
          <div className="space-y-24">
            
            <section id="projects">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">Selected Works</h3>
              <div className="space-y-8">
                {projects.map(p => (
                  <motion.div 
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="group relative grid grid-cols-1 md:grid-cols-8 gap-4 items-start p-4 rounded-lg transition-all hover:bg-white/5 backdrop-blur-sm"
                  >
                    <p className="text-xs text-neutral-500 md:col-span-2">{p.year}</p>
                    <div className="md:col-span-6">
                      <h4 className="font-bold text-white">{p.title}</h4>
                      <p className="mt-1 text-sm text-neutral-400">{p.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section id="certificates">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">Credentials</h3>
              <div className="space-y-4">
                 {certificates.map(c => (
                     <motion.div 
                        key={c.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="flex justify-between items-start p-4 rounded-lg transition-all hover:bg-white/5 backdrop-blur-sm"
                     >
                       <div><p className="font-medium text-white">{c.name}</p></div>
                       <p className="text-xs text-neutral-500">{c.year}</p>
                     </motion.div>
                 ))}
              </div>
            </section>
            
            <section id="contact">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">Get in Touch</h3>
              <p className="text-neutral-400 max-w-lg">Punya proyek menarik? Saya selalu terbuka untuk diskusi.</p>
              <motion.a 
                href={`mailto:${email}`}
                whileHover={{ scale: 1.02 }}
                className="group mt-6 inline-flex items-center gap-2 font-semibold text-white"
              >
                <span>{email}</span>
                <FiArrowRight className="transition-transform group-hover:translate-x-1"/>
              </motion.a>
            </section>
          </div>
        </main>
      </div>
    </motion.div>
  );
}