import React, { useState } from "react";
import { ArrowRight, Github, Linkedin, Mail, Download, ExternalLink, Cpu, Gamepad2, Rocket, Terminal, X, CheckCircle, AlertCircle } from "lucide-react";
import { sendEmail } from "./services/emailService";

/**
 * Eemeli Portfolio — Neo v2 (Enhanced) with Visual Showcase
 * - Replaces the Blog & Notes section with a visual gallery showcase
 * - Cursor-style neon/glass + subtle particles
 */

const cx = (...c) => c.filter(Boolean).join(" ");

const Container = ({ children, className = "" }) => (
  <div className={cx("mx-auto w-full max-w-7xl px-5 md:px-8", className)}>{children}</div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/80 backdrop-blur-sm">{children}</span>
);

const Button = ({ children, href, onClick, variant = "primary", className = "", type, newTab = false }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-[0.98]";
  const styles = {
    primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_36px_rgba(168,85,247,0.6)]",
    ghost: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
    outline: "border border-white/20 text-white hover:bg-white/5",
  };
  const cls = cx(base, styles[variant], className);
  if (href) return (
    (() => {
      const isExternal = /^https?:\/\//i.test(href);
      const target = (isExternal || newTab) ? "_blank" : undefined;
      const rel = (isExternal || newTab) ? "noreferrer" : undefined;
      return <a className={cls} href={href} target={target} rel={rel}>{children}</a>;
    })()
  );
  return (
    <button className={cls} onClick={onClick} type={type}>{children}</button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={cx(
    "group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all",
    "hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_-20px_rgba(79,70,229,0.55)]",
    className
  )}>
    <div className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-70" style={{
      background:
        "conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.25), rgba(236,72,153,0.25), rgba(20,184,166,0.25), rgba(99,102,241,0.25))",
    }} />
    {children}
  </div>
);

const SectionTitle = ({ kicker, title, subtitle }) => (
  <div className="mb-10 flex flex-col items-start gap-4">
    {kicker && <Badge>{kicker}</Badge>}
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">{title}</h2>
    {subtitle && <p className="max-w-3xl text-white/70 leading-relaxed">{subtitle}</p>}
  </div>
);

const NeoBackground = () => (
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.18),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.18),transparent_40%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
    <div className="absolute inset-0 [mask-image:radial-gradient(white,transparent_70%)]">
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-white/50 animate-pulse"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${3 + Math.random() * 5}s` }}
        />
      ))}
    </div>
  </div>
);

// --- Stats Bar ---
const StatsBar = () => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    {[
      { label: "3+ years", value: "freelance experience" },
      { label: "10+", value: "projects shipped" },
      { label: "Unity", value: "C#, Gameplay, AI" },
      { label: "Backend", value: "Spring Boot, PostgreSQL, JWT" },
      { label: "Frontend", value: "React, TypeScript, Tailwind, Angular" },
      { label: "AI", value: "Voiceflow, LLM, Zapier, ML" }
    ].map((stat, idx) => (
      <div key={idx} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="text-2xl font-bold text-white">{stat.label}</div>
        <div className="text-sm text-white/70 mt-1">{stat.value}</div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-cyan-400/10 opacity-0 hover:opacity-100 transition-opacity" />
      </div>
    ))}
  </div>
);

// Fixed positions per label (percentages). Edit these to move chips.
const fixedChipPositions = {
  "Unity AI": { top: 20, left: 15 },
  "JWT": { top: 40, left: 25 },
  "LLM Bots": { top: 25, left: 60 },
  "CI/CD": { top: 65, left: 20 },
  "REST APIs": { top: 50, left: 70 },
  "Docker": { top: 70, left: 55 },
  "PostgreSQL": { top: 35, left: 80 },
  "TypeScript": { top: 15, left: 75 },
  "Clean Architecture": { top: 75, left: 30 },
  "Swagger": { top: 55, left: 85 },
  "Flyway": { top: 25, left: 40 },
  "GitHub Actions": { top: 80, left: 75 },
};

// Deterministic position generator using fixed map with graceful grid fallback
const generateChipPositions = (labels) => {
  const positions = [];
  const missing = [];
  labels.forEach((label, idx) => {
    const p = fixedChipPositions[label];
    if (p) {
      positions[idx] = p;
    } else {
      missing.push(idx);
    }
  });
  if (missing.length) {
    const count = missing.length;
    const cols = Math.min(6, Math.max(3, Math.ceil(Math.sqrt(count))));
    const rows = Math.max(2, Math.ceil(count / cols));
    const cellW = 100 / cols;
    const cellH = 100 / rows;
    missing.forEach((slot, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const left = Math.min(94, Math.max(6, c * cellW + cellW * 0.5));
      const top = Math.min(92, Math.max(8, r * cellH + cellH * 0.5));
      positions[slot] = { top, left };
    });
  }
  return positions;
};

export default function JohannesPortfolio() {
  const chipLabels = [
    "Unity AI",
    "JWT",
    "LLM Bots",
    "CI/CD",
    "REST APIs",
    "Docker",
    "PostgreSQL",
    "TypeScript",
    "Clean Architecture",
    "Swagger",
    "Flyway",
    "GitHub Actions",
  ];
  const [chipPositions] = useState(() => generateChipPositions(chipLabels));
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: ''
  });

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.message.trim()) {
      setFormStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please fill in all fields.'
      });
      return;
    }

    setFormStatus({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      message: ''
    });

    try {
      // Use the email service
      const result = await sendEmail(formData);
      
      if (result.success) {
        // Execute the action (e.g., open email client)
        if (result.action) {
          result.action();
        }
        
        setFormStatus({
          isSubmitting: false,
          isSuccess: true,
          isError: false,
          message: result.message
        });

        // Reset form
        setFormData({ name: '', message: '' });
      } else {
        setFormStatus({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          message: result.message
        });
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Something went wrong. Please try again or contact me directly.'
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0B10] text-white font-sans">
      <NeoBackground />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B10]/70 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <a href="#" className="group inline-flex items-center gap-2">
            <div className="relative">
              <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-40 blur" />
              <div className="relative rounded-lg bg-black px-2 py-1 text-sm font-semibold tracking-widest">JH</div>
            </div>
            <span className="text-sm text-white/70 group-hover:text-white transition">Johannes Hurmerinta</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#projects" className="hover:text-white transition">Projects</a>
            <a href="#skills" className="hover:text-white transition">Skills</a>
            <a href="#experience" className="hover:text-white transition">Experience</a>
            <a href="#entrepreneurship" className="hover:text-white transition">Entrepreneurship</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" href="/cv.pdf" download="Johannes_Hurmerinta_CV.pdf"><Download size={16}/> CV</Button>
            <Button href="mailto:johannes.hurmerinta@mitrox.io"><Mail size={16}/> Contact</Button>
          </div>
        </Container>
      </header>

      {/* HERO */}
      <section className="relative border-b border-white/10">
        <Container className="relative py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              <Badge><Cpu size={14}/> Software Developer & Entrepreneur</Badge>
              <h1 className="text-4xl/tight md:text-6xl/tight font-semibold tracking-tight">Building <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">games</span>,<br className="hidden md:block" /> web apps & AI solutions</h1>
              <p className="max-w-2xl text-white/70 text-base md:text-lg leading-relaxed">IT BBA @ Haaga-Helia. Unity + C#, Full Stack Development and AI solutions — with a product mindset.</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button href="#projects">Explore Projects <ArrowRight size={16}/></Button>
                <Button variant="ghost" href="https://github.com/DooMi42"><Github size={16}/> GitHub</Button>
                <Button variant="ghost" href="https://www.linkedin.com/in/johanneshurmerinta/"><Linkedin size={16}/> LinkedIn</Button>
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-3 md:w-auto md:grid-cols-4">
                {[
                  { k: "Unity + C#", v: "Enemy AI + Game logics" },
                  { k: "Spring Boot", v: "APIs, Auth + JWT" },
                  { k: "PostgreSQL", v: "Docker + Render" },
                  { k: "Voiceflow", v: "AI Assistants + Sales Support" },
                ].map((s) => (
                  <div key={s.k} className="relative rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                    <div className="font-medium">{s.k}</div>
                    <div className="text-white/60">{s.v}</div>
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative h-64 w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/10 to-cyan-400/20 blur-2xl" />
                <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.25),transparent_30%)]" />
                <div className="absolute inset-0">
                  {chipLabels.map((label, i) => (
                    <span
                      key={label}
                      className="absolute rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-xs text-white/80 backdrop-blur transition-transform duration-300 hover:scale-105 md:px-3 md:py-1 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0"
                      style={{ 
                        top: `${chipPositions[i].top}%`, 
                        left: `${chipPositions[i].left}%`
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* STATS BAR */}
      <section className="relative border-b border-white/10">
        <Container className="py-8">
          <StatsBar />
        </Container>
      </section>

      {/* ABOUT ME */}
      <section id="about" className="relative border-b border-white/10">
        <Container className="py-16 md:py-24">
          <SectionTitle kicker="STORY" title="About me" subtitle="Beyond the code — a glimpse into who I am." />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <div className="mb-4 flex items-center gap-2 text-white/80">
                <span className="text-2xl">🎓</span>
                <span className="font-medium">Studies & Growth</span>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">
                Currently pursuing my BBA in Software Development at Haaga-Helia UAS, where I'm diving deep into full stack development. The entrepreneurship track has been a game-changer, teaching me to think 
                beyond just writing code to building products that solve real problems.
              </p>
            </Card>
            <Card>
              <div className="mb-4 flex items-center gap-2 text-white/80">
                <span className="text-2xl">🚀</span>
                <span className="font-medium">Entrepreneurship Journey</span>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">
                Co-founded Mitrox Oy to help SMEs with AI assistants, and taking leadership roles in school projects. 
                There's something magical about taking an idea from sketch to shipped product. Each project teaches me 
                something new about user needs, market fit, and the art of iteration.
              </p>
            </Card>
            <Card>
              <div className="mb-4 flex items-center gap-2 text-white/80">
                <span className="text-2xl">🐶</span>
                <span className="font-medium">Life Beyond Code</span>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">
                When I'm not debugging or building, you'll find me experimenting in the kitchen (cooking is just another 
                form of problem-solving), planning my next travel adventure, or spending quality time with Yoda, my loyal 
                coding companion. Balance is key. Great ideas often come when you step away from the screen.
              </p>
            </Card>
            <Card>
              <div className="mb-4 flex items-center gap-2 text-white/80">
                <span className="text-2xl">🌍</span>
                <span className="font-medium">Global Perspective</span>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">
                Traveling has shaped how I approach development. Every culture has unique ways of solving problems. 
                Whether it's a local business needing a simple website or a complex AI system, I bring that 
                global mindset to create solutions that truly work for people, not just technically impressive demos.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative border-b border-white/10">
        <Container className="py-16 md:py-24">
          <SectionTitle kicker={<><Terminal size={14}/> SHOWCASE</>} title="Featured projects" subtitle="Games, web apps, and AI chatbots with real deliverables." />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80"><Gamepad2 size={18}/> Unannounced Game - Please Be Patient Oy</div>
                <a className="text-xs inline-flex items-center gap-1 text-white/60 hover:text-white" href="https://discord.gg/xktm4R6myU" target="_blank" rel="noreferrer">Discord <ExternalLink size={14}/></a>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">C#, Unity + MoreMountains TopDown Engine. Custom Enemy AI and tuned combat feel. Prototyping new features.</p>
              <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <Badge>Unity</Badge><Badge>C#</Badge><Badge>AI/Gameplay</Badge><Badge>Animations</Badge><Badge>Enemy AI</Badge>
              </div>
            </Card>
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80"><Gamepad2 size={18}/> Finnish Army Simulator - Please Be Patient Oy</div>
                <a className="text-xs inline-flex items-center gap-1 text-white/60 hover:text-white" href="https://store.steampowered.com/app/1184250/Finnish_Army_Simulator/" target="_blank" rel="noreferrer">Steam <ExternalLink size={14}/></a>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">Unity + C#. Prototyping new features for the game. Game testing and bug fixing.</p>
              <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <Badge>Unity</Badge><Badge>C#</Badge><Badge>AI/Gameplay</Badge><Badge>Animations</Badge><Badge>Prototyping</Badge>
              </div>
            </Card>
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80"><Cpu size={18}/> QuizzerApp — Teacher Dashboard</div>
                <a className="text-xs inline-flex items-center gap-1 text-white/60 hover:text-white" href="https://github.com/Qbit-Labs-Ltd/quizzerApp" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14}/></a>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">Spring Boot + React + PostgreSQL. Role-based auth, quiz authoring, analytics, and Dockerized deployment.</p>
              <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <Badge>Spring Boot</Badge><Badge>React</Badge><Badge>PostgreSQL</Badge><Badge>Docker</Badge>
              </div>
            </Card>
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80"><Terminal size={18}/> Task & Time Tracker — Backend</div>
                <a className="text-xs inline-flex items-center gap-1 text-white/60 hover:text-white" href="https://github.com/DooMi42/task-and-time-tracking-app" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14}/></a>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">Java 21, JWT, Swagger, Flyway. Production-grade PostgreSQL schema and REST API deployed to Render/Heroku.</p>
              <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <Badge>Java 21</Badge><Badge>Spring Boot 3</Badge><Badge>JWT & Swagger</Badge><Badge>Flyway</Badge>
              </div>
            </Card>
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80"><Rocket size={18}/> SME Chatbots — Routing / Sales / Support</div>
                <a className="text-xs inline-flex items-center gap-1 text-white/60 hover:text-white" href="https://mitrox.io/" target="_blank" rel="noreferrer">Mitrox.io <ExternalLink size={14}/></a>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">Voiceflow + LLMs. Multi-agent architecture (Ohjaaja, Tuki, Myynti). Button-first UX, knowledge base design, and cost control.</p>
              <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <Badge>Voiceflow</Badge><Badge>LLM</Badge><Badge>Zapier</Badge><Badge>Webhooks</Badge>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* SKILLS */}
      <section id="skills" className="relative border-b border-white/10">
        <Container className="py-16 md:py-24">
          <SectionTitle kicker="STACK" title="Tech & tools" subtitle="The languages, frameworks, and platforms I reach for." />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Java · Spring Boot","React · TypeScript","Unity · C#","PostgreSQL · Flyway","Docker · Render","GitHub · CI/CD","Swagger · JWT", "ML · LLM","Voiceflow","Problem solving","Agile/Scrum","Entrepreneurship"].map((s) => (
              <Card key={s} className="py-5"><div className="text-center text-white/80">{s}</div><div className="mt-3 h-1.5 w-1/2 mx-auto rounded-full bg-white/10"><div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-300 w-[85%]" /></div></Card>
            ))}
          </div>
        </Container>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="relative border-b border-white/10">
        <Container className="py-16 md:py-24">
          <SectionTitle kicker="TRACK" title="Experience & education" subtitle="A mix of hands-on development, entrepreneurship, and studies." />
          <div className="space-y-4">
            {(() => {
              const items = [
                { title: "Mitrox Oy — Co-founder / Tech Lead", time: "2025.08 – present", desc: "AI chatbots for SMEs, CX automation, integration design." },
                { title: "Haaga-Helia UAS — BBA (Software Development)", time: "2024.01 – present", desc: "Full stack development, Agile/Scrum, entrepreneurship track." },
                { title: "Please Be Patient Oy / Game Developer", time: "2025.01 - 2025.06", desc: "Unannounced Game. Worked on core gameplay features. Prototyping new features, testing and bug fixing." },
                { title: "Please Be Patient Oy / Game Developer Trainee", time: "2023.01 - 2023.06", desc: "Finnish Army Simulator. Worked on prototyping new features for the game. Game testing and bug fixing." },
                { title: "Freelance IT — Developer", time: "2022 – present", desc: "Websites and integrations for local businesses. AI solutions for businesses." },
                { title: "Business College Helsinki (Game Development)", time: "2020 – 2023", desc: "Game Programming, Game Design, Animations, and much more." },
              ];
              const getStartYear = (t) => {
                const m = t.match(/\d{4}/);
                return m ? parseInt(m[0], 10) : 0;
              };
              items.sort((a, b) => {
                const aPresent = /present/i.test(a.time) ? 1 : 0;
                const bPresent = /present/i.test(b.time) ? 1 : 0;
                if (aPresent !== bPresent) return bPresent - aPresent;
                return getStartYear(b.time) - getStartYear(a.time);
              });
              return items.map((item) => (
                <Card key={item.title}><div className="flex flex-col gap-1"><div className="text-white/90 font-medium">{item.title}</div><div className="text-white/50 text-sm">{item.time}</div><p className="text-white/70 mt-2">{item.desc}</p></div></Card>
              ));
            })()}
          </div>
        </Container>
      </section>

      {/* ENTREPRENEURSHIP */}
      <section id="entrepreneurship" className="relative border-b border-white/10">
        <Container className="py-16 md:py-24">
          <SectionTitle kicker="VENTURES" title="Entrepreneurship" subtitle="Projects with real users and business goals." />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card><div className="mb-3 text-white/90 font-medium">Mitrox Oy — AI Chatbots for SMEs</div><p className="text-white/70 mb-4">Multi-agent chatbots (Routing, Support, Sales). Button-first UX, knowledge curation, KPI tracking. Pricing tiers with quotas and cost control.</p><Button variant="ghost" href="https://mitrox.io/">Read more <ArrowRight size={16} /></Button></Card>
            <Card><div className="mb-3 text-white/90 font-medium">Qbit Labs Ltd — Prototypes & Experiments</div><p className="text-white/70 mb-4">Team lead on school projects. For me it was a great way to learn about the software development process and the importance of user feedback. And get more entrepreneurial experience.</p><Button variant="ghost" href="https://github.com/Qbit-Labs-Ltd">Explore <ArrowRight size={16} /></Button></Card>
          </div>
        </Container>
      </section>


      {/* CONTACT */}
      <section id="contact" className="relative">
        <Container className="py-16 md:py-24">
          <SectionTitle kicker="LET'S TALK" title="Contact" subtitle="Open to freelance, job offers, and collaboration." />
          <Card>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-2 text-white/90 font-medium">Message</div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30" 
                    placeholder="Your name" 
                    required
                  />
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5} 
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30" 
                    placeholder="Tell me about your project" 
                    required
                  />
                  
                  {/* Status Messages */}
                  {formStatus.message && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                      formStatus.isSuccess 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : formStatus.isError 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {formStatus.isSuccess ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      {formStatus.message}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={formStatus.isSubmitting}
                    className={formStatus.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {formStatus.isSubmitting ? 'Sending...' : 'Send'} 
                    <ArrowRight size={16} />
                  </Button>
                </form>
              </div>
              <div>
                <div className="mb-2 text-white/90 font-medium">Direct</div>
                <div className="space-y-2 text-white/80">
                  <a className="flex items-center gap-2 hover:text-white" href="mailto:johannes.hurmerinta@mitrox.io"><Mail size={16} /> johannes.hurmerinta@mitrox.io</a>
                  <a className="flex items-center gap-2 hover:text-white" href="https://github.com/DooMi42"><Github size={16} /> github.com/DooMi42</a>
                  <a className="flex items-center gap-2 hover:text-white" href="https://linkedin.com/johanneshurmerinta"><Linkedin size={16} /> linkedin.com/in/yourprofile</a>
                </div>
                <div className="mt-6">
                  <div className="text-white/90 font-medium mb-2">Download</div>
                  <Button variant="outline" href="/cv.pdf" download="Johannes_Hurmerinta_CV.pdf"><Download size={16} /> CV (PDF)</Button>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <footer className="border-t border-white/10 py-10">
        <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-white/60">© {new Date().getFullYear()} Johannes Hurmerinta</div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <a className="hover:text-white" href="/imprint.html">Imprint</a>
            <span className="opacity-40">•</span>
            <a className="hover:text-white" href="/privacy.html">Privacy</a>
          </div>
        </Container>
      </footer>
    </div>
  );
}
