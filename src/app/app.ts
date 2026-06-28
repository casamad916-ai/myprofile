import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
interface SkillGroup { label: string; tags: string[]; }
interface Project    { name: string; desc: string; bullets: string[]; stack: string[]; }
interface Education  { degree: string; school: string; year: string; cgpa: string; }
interface Contact    { label: string; value: string; href: string; external: boolean; icon: string; }
interface NavLink    { label: string; href: string; id: string; }

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('typewriterEl')   typewriterRef!: ElementRef<HTMLSpanElement>;

  isScrolled     = false;
  activeSection  = 'about';
  private animId = 0;
  private particles: Particle[] = [];

  // ── NAV ──────────────────────────────────────────────────
  navLinks: NavLink[] = [
    { label: 'About',     href: '#about',     id: 'about'     },
    { label: 'Skills',    href: '#skills',     id: 'skills'    },
    { label: 'Project',   href: '#project',   id: 'project'   },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Contact',   href: '#contact',   id: 'contact'   },
  ];

  // ── SKILLS ───────────────────────────────────────────────
  skillGroups: SkillGroup[] = [
    { label: 'Languages',  tags: ['Java', 'Python', 'PHP', 'C++'] },
    { label: 'Frameworks', tags: ['Spring', 'JSP', 'Angular'] },
    { label: 'Databases',  tags: ['MySQL', 'PostgreSQL'] },
    { label: 'ML / Data',  tags: ['Scikit-learn', 'Pandas', 'Matplotlib'] },
    { label: 'Core',       tags: ['OOP', 'SDLC', 'Backend', 'Web Dev', 'DB Management'] },
    { label: 'Soft Skills',tags: ['Problem Solving', 'Communication', 'Analytical'] },
  ];

  // ── PROJECT ──────────────────────────────────────────────
  project: Project = {
    name: 'Software Defect Prediction Using an Intelligent Ensemble Model',
    desc: 'A machine learning system for predicting software defects using NASA/PROMISE datasets, combining multiple ensemble techniques to achieve reliable and accurate results.',
    bullets: [
      'Built ML model using Random Forest, AdaBoost, and Gradient Boosting',
      'Ensured balanced and high-quality datasets for reliable model performance',
      'Improved prediction accuracy by reducing overfitting',
      'Evaluated performance using accuracy, precision, recall, F1-score, and ROC-AUC metrics',
    ],
    stack: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib', 'Random Forest', 'AdaBoost', 'Gradient Boosting'],
  };

  // ── EDUCATION ────────────────────────────────────────────
  education: Education[] = [
    { degree: 'Master of Computer Applications (MCA)', school: 'Cochin University College of Engineering, Kuttanadu', year: '2025', cgpa: '7.2' },
    { degree: 'Bachelor of Computer Applications (BCA)', school: 'PPTM Arts & Science College, Cherur', year: '2022', cgpa: '6.4' },
  ];

  // ── CONTACTS ─────────────────────────────────────────────
  contacts: Contact[] = [
    {
      label: 'Email', value: 'Casamad916@gmail.com', href: 'mailto:Casamad916@gmail.com', external: false,
      icon: `<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>`,
    },
    {
      label: 'Phone', value: '+91 730 611 7916', href: 'tel:+917306117916', external: false,
      icon: `<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>`,
    },
    {
      label: 'LinkedIn', value: 'abdul-samad916', href: 'https://www.linkedin.com/in/abdul-samad916', external: true,
      icon: `<svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    },
    {
      label: 'Location', value: 'Kuzhippuram, Kerala', href: '#', external: false,
      icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    },
  ];

  ngOnInit(): void {}

  // ── LIFECYCLE ─────────────────────────────────────────────
  ngAfterViewInit(): void {
    this.initParticles();
    this.initScrollReveal();
    this.startTypewriter();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  // ── SCROLL LISTENER ───────────────────────────────────────
  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 40;
    this.updateActiveSection();
  }

  private updateActiveSection(): void {
    const ids = ['about', 'skills', 'project', 'education', 'achievements', 'contact'];
    for (const id of [...ids].reverse()) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) {
        this.activeSection = id;
        break;
      }
    }
  }

  // ── PARTICLE CANVAS ───────────────────────────────────────
  private initParticles(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(221, 0, 49, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(221, 0, 49, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      this.animId = requestAnimationFrame(draw);
    };

    draw();
  }

  // ── SCROLL REVEAL ─────────────────────────────────────────
  private initScrollReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  // ── TYPEWRITER ────────────────────────────────────────────
  private startTypewriter(): void {
    const el = this.typewriterRef?.nativeElement;
    if (!el) return;

    const phrases = [
      'software_developer.java',
      'ml_engineer.python',
      'backend_developer.php',
      'full_stack.angular',
    ];

    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    const speed   = { type: 80, delete: 40, pause: 1800 };

    const tick = () => {
      const current = phrases[phraseIdx];

      if (!deleting) {
        el.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(tick, speed.pause);
          return;
        }
      } else {
        el.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting  = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }

      setTimeout(tick, deleting ? speed.delete : speed.type);
    };

    // Small delay so hero is visible first
    setTimeout(tick, 800);
  }
}
