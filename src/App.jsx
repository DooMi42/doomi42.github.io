import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Download,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import { sendEmail } from "./services/emailService";

/* ═══════════════════════════════════════════════════════
   ANIMATED BACKGROUND
   ═══════════════════════════════════════════════════════ */

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    const PARTICLE_COUNT = 60;
    const ACCENT = [200, 255, 0];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // seed particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.01 + 0.005,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += p.pulseSpeed;

        // wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const flicker = (Math.sin(p.pulse) + 1) / 2;
        const alpha = p.opacity * (0.4 + flicker * 0.6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${alpha})`;
        ctx.fill();
      });

      // draw faint connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Canvas particles + connection lines */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-[120px] animate-orb-1" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[100px] animate-orb-2" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-accent/[0.02] blur-[80px] animate-orb-3" />

      {/* Subtle moving grid overlay */}
      <div className="absolute inset-0 opacity-[0.025] animate-grid-drift"
        style={{
          backgroundImage: 'linear-gradient(rgba(200,255,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.4) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Horizon line glow */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ═══════════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════════ */

/** Scroll-triggered reveal wrapper */
const Reveal = ({ children, className = "", delay = 0 }) => {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/** Padded section shell */
const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`relative py-28 md:py-40 ${className}`}>
    <div className="mx-auto max-w-[1400px] px-6 md:px-12">{children}</div>
  </section>
);

/** Section label / kicker */
const Label = ({ children }) => (
  <div className="mb-5 text-xs font-semibold tracking-[0.35em] uppercase text-accent">
    {children}
  </div>
);

/** Section heading */
const Heading = ({ children, className = "" }) => (
  <h2
    className={`text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1] tracking-tight ${className}`}
  >
    {children}
  </h2>
);

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const PROJECTS = [
  {
    num: "01",
    title: "Unannounced Game",
    org: "Please Be Patient Oy",
    desc: "C#, Unity + MoreMountains TopDown Engine. Custom Enemy AI and tuned combat feel. Prototyping new features.",
    tags: ["Unity", "C#", "AI/Gameplay", "Animations", "Enemy AI"],
    link: "https://discord.gg/xktm4R6myU",
    linkLabel: "Discord",
  },
  {
    num: "02",
    title: "Finnish Army Simulator",
    org: "Please Be Patient Oy",
    desc: "Unity + C#. Prototyping new features for the game. Game testing and bug fixing.",
    tags: ["Unity", "C#", "AI/Gameplay", "Animations", "Prototyping"],
    link: "https://store.steampowered.com/app/1184250/Finnish_Army_Simulator/",
    linkLabel: "Steam",
  },
  {
    num: "03",
    title: "QuizzerApp",
    org: "Teacher Dashboard",
    desc: "Spring Boot + React + PostgreSQL. Role-based auth, quiz authoring, analytics, and Dockerized deployment.",
    tags: ["Spring Boot", "React", "PostgreSQL", "Docker"],
    link: "https://github.com/Qbit-Labs-Ltd/quizzerApp",
    linkLabel: "GitHub",
  },
  {
    num: "04",
    title: "Task & Time Tracker",
    org: "Backend API",
    desc: "Java 21, JWT, Swagger, Flyway. Production-grade PostgreSQL schema and REST API deployed to Render/Heroku.",
    tags: ["Java 21", "Spring Boot 3", "JWT & Swagger", "Flyway"],
    link: "https://github.com/DooMi42/task-and-time-tracking-app",
    linkLabel: "GitHub",
  },
  {
    num: "05",
    title: "SME Chatbots",
    org: "Routing / Sales / Support",
    desc: "Voiceflow + LLMs. Multi-agent architecture (Lead, Support, Sales). Button-first UX, knowledge base design, and cost control.",
    tags: ["Voiceflow", "LLM", "Zapier", "Webhooks"],
    link: "https://mitrox.io/",
    linkLabel: "Mitrox.io",
  },
];

const EXPERIENCE = [
  {
    title: "Mitrox Oy — Co-founder / Tech Lead",
    time: "2025 – Present",
    desc: "AI chatbots for SMEs, CX automation, integration design.",
  },
  {
    title: "Haaga-Helia UAS — BBA (Software Development)",
    time: "2024 – Present",
    desc: "Full stack development, Agile/Scrum, entrepreneurship track.",
  },
  {
    title: "Please Be Patient Oy — Game Developer",
    time: "2025.01 – 2025.06",
    desc: "Unannounced Game. Core gameplay features, prototyping, testing and bug fixing.",
  },
  {
    title: "Please Be Patient Oy — Game Developer Trainee",
    time: "2023.01 – 2023.06",
    desc: "Finnish Army Simulator. Prototyping new features, game testing and bug fixing.",
  },
  {
    title: "Freelance IT — Developer",
    time: "2022 – Present",
    desc: "Websites and integrations for local businesses. AI solutions for businesses.",
  },
  {
    title: "Business College Helsinki (Game Development)",
    time: "2020 – 2023",
    desc: "Game Programming, Game Design, Animations, and much more.",
  },
];

const SKILLS_GROUPS = [
  {
    label: "Languages & Frameworks",
    items: ["Java · Spring Boot", "React · TypeScript", "Unity · C#", "Angular", "PostgreSQL · Flyway"],
  },
  {
    label: "Tools & Platforms",
    items: ["Docker · Render", "GitHub · CI/CD", "Swagger · JWT", "Voiceflow"],
  },
  {
    label: "AI & Data",
    items: ["ML · LLM", "Zapier", "Knowledge Bases"],
  },
  {
    label: "Practices",
    items: ["Agile / Scrum", "Problem Solving", "Entrepreneurship", "Product Thinking"],
  },
];

const MARQUEE_ITEMS = [
  "Unity", "C#", "React", "TypeScript", "Spring Boot", "PostgreSQL",
  "Docker", "AI / LLM", "Voiceflow", "Java", "Tailwind", "Angular",
  "Swagger", "JWT", "Flyway", "CI/CD", "Zapier", "Agile",
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Ventures", href: "#entrepreneurship" },
  { label: "Contact", href: "#contact" },
];

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function JohannesPortfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Contact form state */
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: "",
  });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* Lock scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setFormStatus({ isSubmitting: false, isSuccess: false, isError: true, message: "Please fill in all fields." });
      return;
    }
    setFormStatus({ isSubmitting: true, isSuccess: false, isError: false, message: "" });
    try {
      const result = await sendEmail(formData);
      if (result.success) {
        if (result.action) result.action();
        setFormStatus({ isSubmitting: false, isSuccess: true, isError: false, message: result.message });
        setFormData({ name: "", message: "" });
      } else {
        setFormStatus({ isSubmitting: false, isSuccess: false, isError: true, message: result.message });
      }
    } catch {
      setFormStatus({ isSubmitting: false, isSuccess: false, isError: true, message: "Something went wrong. Please try again or contact me directly." });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-accent selection:text-black">
      <AnimatedBackground />

      {/* ── NAVIGATION ─────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
        role="banner"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 flex h-[140px] items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="relative flex items-center opacity-90 hover:opacity-100 transition-opacity duration-300"
            aria-label="Johannes Hurmerinta – home"
          >
            <img
              src="/portfoliopagelogo.png"
              alt="JH logo"
              className="h-28 w-auto"
              style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(35deg)' }}
            />
          </a>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-[0.2em] uppercase text-white/50"
            aria-label="Primary"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-white transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-5">
            <a
              href="/cv.pdf"
              download="Johannes_Hurmerinta_CV.pdf"
              className="hidden sm:inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors duration-300"
            >
              <Download size={15} /> CV
            </a>
            <button
              className="lg:hidden text-white/70 hover:text-white transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU OVERLAY ────────────────────────── */}
      <div
        className={`fixed inset-0 z-[60] bg-black transition-opacity duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 flex h-[140px] items-center justify-between">
          <img
              src="/portfoliopagelogo.png"
              alt="JH logo"
              className="h-28 w-auto"
              style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(35deg)' }}
            />
          <button
            className="text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>
        <nav className="flex flex-col items-start gap-2 px-6 md:px-12 mt-8">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white/80 hover:text-accent transition-colors duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-10 flex items-center gap-6">
            <a href="https://github.com/DooMi42" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors">
              <Github size={22} />
            </a>
            <a href="https://www.linkedin.com/in/johanneshurmerinta/" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors">
              <Linkedin size={22} />
            </a>
            <a href="mailto:johannes.hurmerinta@mitrox.io" className="text-white/50 hover:text-white transition-colors">
              <Mail size={22} />
            </a>
          </div>
        </nav>
      </div>

      <main>

        {/* ── HERO ──────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden" aria-labelledby="hero-heading">
          <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 w-full pt-28 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Text */}
              <div className="lg:col-span-7 flex flex-col gap-7">
                <Reveal>
                  <div className="text-xs sm:text-sm font-medium tracking-[0.4em] uppercase text-white/35">
                    Software Developer &amp; Entrepreneur
                  </div>
                </Reveal>

                <Reveal delay={100}>
                  <h1
                    id="hero-heading"
                    className="text-[clamp(2.8rem,8vw,8rem)] font-black uppercase leading-[0.92] tracking-tight"
                  >
                    Building{" "}
                    <span className="text-accent">Games</span>,
                    <br />
                    Web Apps
                    <br />
                    &amp;&nbsp;<span className="text-accent">AI</span>
                  </h1>
                </Reveal>

                <Reveal delay={200}>
                  <p className="max-w-xl text-base sm:text-lg text-white/45 leading-relaxed">
                    IT BBA @ Haaga-Helia. Unity&nbsp;+&nbsp;C#, Full Stack Development and
                    AI solutions — with a product mindset.
                  </p>
                </Reveal>

                <Reveal delay={300}>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <a
                      href="#projects"
                      className="group inline-flex items-center gap-3 bg-accent text-black px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-white transition-all duration-300"
                    >
                      Explore Projects
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="https://github.com/DooMi42"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-white/15 px-6 py-4 text-sm font-medium tracking-wider uppercase text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                    >
                      <Github size={16} /> GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/johanneshurmerinta/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-white/15 px-6 py-4 text-sm font-medium tracking-wider uppercase text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                    >
                      <Linkedin size={16} /> LinkedIn
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Portrait */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <Reveal delay={400}>
                  <div className="relative w-72 h-[420px] sm:w-80 sm:h-[480px] lg:w-[360px] lg:h-[520px]">
                    <img
                      src="/portfolioselfie.jpg"
                      alt="Portrait of Johannes Hurmerinta, software developer"
                      loading="eager"
                      width="384"
                      height="520"
                      className="w-full h-full object-cover transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    {/* Accent corner lines */}
                    <div className="absolute top-0 left-0 w-12 h-px bg-accent" />
                    <div className="absolute top-0 left-0 h-12 w-px bg-accent" />
                    <div className="absolute bottom-0 right-0 w-12 h-px bg-accent" />
                    <div className="absolute bottom-0 right-0 h-12 w-px bg-accent" />
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/25">
            <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── MARQUEE ──────────────────────────────────── */}
        <div className="overflow-hidden border-y border-white/[0.07] py-5 bg-black">
          <div className="marquee-track animate-marquee flex whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="mx-6 text-sm sm:text-base font-semibold tracking-[0.15em] uppercase text-white/20">
                {item}
                <span className="ml-6 text-accent/40">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS ────────────────────────────────────── */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-6 bg-white/[0.04]">
              {[
                { value: "3+", label: "Years Experience" },
                { value: "10+", label: "Projects Shipped" },
                { value: "Unity", label: "C# · Gameplay · AI" },
                { value: "React", label: "TS · Tailwind · Angular" },
                { value: "Backend", label: "Spring Boot · PostgreSQL" },
                { value: "AI", label: "Voiceflow · LLM · ML" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="bg-black p-6 lg:p-8 group hover:bg-white/[0.02] transition-colors duration-500">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{s.value}</div>
                    <div className="mt-2 text-xs sm:text-sm font-medium tracking-wide uppercase text-white/30 group-hover:text-white/50 transition-colors">
                      {s.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────── */}
        <Section id="about">
          <Reveal>
            <Label>About</Label>
            <Heading>Beyond the Code</Heading>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 max-w-3xl text-lg sm:text-xl text-white/40 leading-relaxed">
              Beyond writing code — I build products that solve real problems.
              Currently pursuing my BBA at Haaga-Helia while co-founding Mitrox&nbsp;Oy
              to bring AI assistants to small and medium businesses.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-px sm:grid-cols-2 bg-white/[0.06]">
            {[
              {
                icon: "🎓",
                title: "Studies & Growth",
                body: "Currently pursuing my BBA in Software Development at Haaga-Helia UAS, diving deep into full stack development. The entrepreneurship track has taught me to think beyond just writing code to building products that solve real problems.",
              },
              {
                icon: "🚀",
                title: "Entrepreneurship Journey",
                body: "Co-founded Mitrox Oy to help SMEs with AI assistants, and taking leadership roles in school projects. There's something magical about taking an idea from sketch to shipped product.",
              },
              {
                icon: "🐶",
                title: "Life Beyond Code",
                body: "When I'm not debugging or building, you'll find me experimenting in the kitchen, planning my next travel adventure, or spending quality time with Yoda, my loyal coding companion.",
              },
              {
                icon: "🌍",
                title: "Global Perspective",
                body: "Traveling has shaped how I approach development. Every culture has unique ways of solving problems. I bring that global mindset to create solutions that truly work for people.",
              },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-black p-8 sm:p-10 group hover:bg-white/[0.02] transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{card.icon}</span>
                    <span className="text-sm font-bold tracking-widest uppercase text-white/70">
                      {card.title}
                    </span>
                  </div>
                  <p className="text-white/40 leading-relaxed group-hover:text-white/55 transition-colors duration-500">
                    {card.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── PROJECTS ─────────────────────────────────── */}
        <Section id="projects">
          <Reveal>
            <Label>Projects</Label>
            <Heading>Featured Work</Heading>
            <p className="mt-4 max-w-2xl text-white/40 leading-relaxed">
              Games, web apps, and AI chatbots — each with real deliverables.
            </p>
          </Reveal>

          <div className="mt-16 flex flex-col gap-px bg-white/[0.06]">
            {PROJECTS.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group relative bg-black p-8 sm:p-10 lg:p-12 hover:bg-white/[0.02] transition-all duration-500">
                  {/* Accent left bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                  <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-12">
                    {/* Number */}
                    <span className="text-6xl sm:text-7xl font-black text-white/[0.04] leading-none shrink-0 select-none group-hover:text-white/[0.08] transition-colors duration-500">
                      {p.num}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white/90 group-hover:text-white transition-colors">
                          {p.title}
                        </h3>
                        <span className="text-sm font-medium uppercase tracking-wide text-white/30">
                          {p.org}
                        </span>
                      </div>
                      <p className="text-white/40 leading-relaxed mb-5 max-w-2xl group-hover:text-white/55 transition-colors duration-500">
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-[11px] font-semibold tracking-widest uppercase border border-white/[0.08] text-white/35 group-hover:border-white/15 group-hover:text-white/50 transition-all duration-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Link */}
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-white/30 hover:text-accent transition-colors duration-300 self-start lg:self-center"
                    >
                      {p.linkLabel} <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── SKILLS ───────────────────────────────────── */}
        <Section id="skills">
          <Reveal>
            <Label>Stack</Label>
            <Heading>Tech &amp; Tools</Heading>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
            {SKILLS_GROUPS.map((group, gi) => (
              <Reveal key={gi} delay={gi * 100}>
                <div className="bg-black p-8 sm:p-10 h-full">
                  <div className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-6">
                    {group.label}
                  </div>
                  <ul className="space-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-white/45 text-sm sm:text-base hover:text-white/70 transition-colors duration-300 cursor-default"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── EXPERIENCE ───────────────────────────────── */}
        <Section id="experience">
          <Reveal>
            <Label>Journey</Label>
            <Heading>Experience &amp; Education</Heading>
            <p className="mt-4 max-w-2xl text-white/40 leading-relaxed">
              A mix of hands-on development, entrepreneurship, and studies.
            </p>
          </Reveal>

          <div className="mt-16 flex flex-col gap-px bg-white/[0.06]">
            {EXPERIENCE.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="group bg-black p-8 sm:p-10 hover:bg-white/[0.02] transition-all duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-8 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white/85 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/25 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-white/40 leading-relaxed max-w-3xl group-hover:text-white/55 transition-colors duration-500">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── ENTREPRENEURSHIP ─────────────────────────── */}
        <Section id="entrepreneurship">
          <Reveal>
            <Label>Ventures</Label>
            <Heading>Entrepreneurship</Heading>
            <p className="mt-4 max-w-2xl text-white/40 leading-relaxed">
              Projects with real users and business goals.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
            {[
              {
                title: "Mitrox Oy",
                subtitle: "AI Chatbots for SMEs",
                body: "Multi-agent chatbots (Routing, Support, Sales). Button-first UX, knowledge curation, KPI tracking. Pricing tiers with quotas and cost control.",
                link: "https://mitrox.io/",
                linkLabel: "Read More",
              },
              {
                title: "Qbit Labs Ltd",
                subtitle: "Prototypes & Experiments",
                body: "Team lead on school projects. A great way to learn about the software development process and the importance of user feedback. And get more entrepreneurial experience.",
                link: "https://github.com/Qbit-Labs-Ltd",
                linkLabel: "Explore",
              },
            ].map((v, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group bg-black p-8 sm:p-10 lg:p-12 hover:bg-white/[0.02] transition-all duration-500 h-full flex flex-col">
                  <div className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4">
                    {v.subtitle}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white/90 group-hover:text-white transition-colors mb-4">
                    {v.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed mb-8 flex-1 group-hover:text-white/55 transition-colors duration-500">
                    {v.body}
                  </p>
                  <a
                    href={v.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-white/40 hover:text-accent transition-colors duration-300 self-start"
                  >
                    {v.linkLabel} <ArrowRight size={15} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── BIG QUOTE ──────────────────────────────── */}
        <div className="border-y border-white/[0.06] py-24 md:py-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <Reveal>
              <blockquote className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.05] tracking-tight text-white/10">
                "It doesn't matter where you start
                <span className="text-accent/30">,</span>
                <br />
                it's how you progress from there
                <span className="text-accent/30">."</span>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* ── CONTACT ──────────────────────────────────── */}
        <Section id="contact">
          <Reveal>
            <Label>Contact</Label>
            <Heading>Let's Talk</Heading>
            <p className="mt-4 max-w-2xl text-white/40 leading-relaxed">
              Open to freelance, job offers, and collaboration.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
            {/* Form */}
            <Reveal>
              <div className="bg-black p-8 sm:p-10 lg:p-12">
                <div className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-6">
                  Message
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border-b border-white/10 bg-transparent px-0 py-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-accent transition-colors duration-300"
                    placeholder="Your name"
                    required
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full border-b border-white/10 bg-transparent px-0 py-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-accent transition-colors duration-300 resize-none"
                    placeholder="Tell me about your project"
                    required
                  />

                  {formStatus.message && (
                    <div
                      className={`flex items-center gap-2 py-3 text-sm ${
                        formStatus.isSuccess
                          ? "text-accent"
                          : formStatus.isError
                          ? "text-red-400"
                          : "text-white/60"
                      }`}
                    >
                      {formStatus.isSuccess ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      {formStatus.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className={`group inline-flex items-center gap-3 bg-accent text-black px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-white transition-all duration-300 mt-4 ${
                      formStatus.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {formStatus.isSubmitting ? "Sending..." : "Send"}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </Reveal>

            {/* Direct */}
            <Reveal delay={100}>
              <div className="bg-black p-8 sm:p-10 lg:p-12 h-full flex flex-col">
                <div className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-6">
                  Direct
                </div>
                <div className="space-y-5 flex-1">
                  <a
                    className="flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                    href="mailto:johannes.hurmerinta@mitrox.io"
                  >
                    <Mail size={18} className="shrink-0" />
                    johannes.hurmerinta@mitrox.io
                  </a>
                  <a
                    className="flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                    href="https://github.com/DooMi42"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={18} className="shrink-0" />
                    github.com/DooMi42
                  </a>
                  <a
                    className="flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                    href="https://linkedin.com/in/johanneshurmerinta"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin size={18} className="shrink-0" />
                    linkedin.com/in/johanneshurmerinta
                  </a>
                </div>

                <div className="mt-10 pt-8 border-t border-white/[0.06]">
                  <div className="text-xs font-bold tracking-[0.3em] uppercase text-white/25 mb-4">
                    Download
                  </div>
                  <a
                    href="/cv.pdf"
                    download="Johannes_Hurmerinta_CV.pdf"
                    className="inline-flex items-center gap-3 border border-white/15 px-6 py-3 text-sm font-bold tracking-wider uppercase text-white/50 hover:text-white hover:border-white/40 transition-all duration-300"
                  >
                    <Download size={16} /> CV (PDF)
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12" role="contentinfo">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xs tracking-[0.15em] uppercase text-white/25">
            © {new Date().getFullYear()} Johannes Hurmerinta
          </div>
          <div className="flex items-center gap-6 text-xs tracking-[0.15em] uppercase text-white/25">
            <a className="hover:text-white/50 transition-colors" href="/imprint.html">
              Imprint
            </a>
            <a className="hover:text-white/50 transition-colors" href="/privacy.html">
              Privacy
            </a>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://github.com/DooMi42" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white/50 transition-colors">
              <Github size={16} />
            </a>
            <a href="https://www.linkedin.com/in/johanneshurmerinta/" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white/50 transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="mailto:johannes.hurmerinta@mitrox.io" className="text-white/20 hover:text-white/50 transition-colors">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
