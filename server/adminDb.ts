import fs from "fs";
import path from "path";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  date: string;
  coverImage: string;
  status: "draft" | "published";
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  avatarColor: string;
  content: string;
  rating: number;
  outcome: string;
  status: "draft" | "published";
}

export interface Lead {
  id: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
  email: string;
  phone?: string;
  date: string;
  status: "new" | "contacted" | "qualified" | "closed";
  estimatedEffort?: string;
  recommendedStack?: string[];
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  company?: string;
  date: string;
  timeSlot: string;
  timezone: string;
  description?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

const BLOGS_FILE = path.join(DATA_DIR, "blogs.json");
const TESTIMONIALS_FILE = path.join(DATA_DIR, "testimonials.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

// Default Seeds
const SEED_BLOGS: Blog[] = [
  {
    id: "blog-1",
    title: "Decentralized AI Agents in Global Logistics Orchestration",
    slug: "decentralized-ai-agents-logistics",
    category: "AI Engineering",
    excerpt: "An in-depth review of how autonomous multi-agent microservices coordinate complex, real-time spatial conflict resolutions and routing paths.",
    content: `# Decentralized AI Agents in Global Logistics Orchestration

Integrating autonomous multi-agent systems within enterprise logistics is no longer a futuristic concept—it is a production reality. At FENORA, we recently engineered **Synthetix AI**, an agentic system that coordinates container schedules across four continents.

## The Core Challenge
Legacy systems rely on rigid, centralized databases. When a storm delays a container ship or a customs bottleneck forms, manual human re-scheduling takes hours, resulting in millions of dollars of idle-capital waste.

## The Agentic Solution
By distributing decisions to autonomous digital agents using the **@google/genai SDK** and real-time state machines, we achieved:
- **Instantaneous Spatial Resolution**: Agents autonomously renegotiate routing paths within 1.2 seconds of detecting a delay.
- **pgvector Heuristics**: Multi-modal sensory models scan invoice data and warehouse layouts to find cargo matches.
- **Conflict Isolation**: If one agent fails, the remaining network continues to optimize routing patterns.

Read the full Synthetix AI case study on our Work page to inspect the technical details.`,
    author: "Elena Rostova",
    readTime: "5 min read",
    date: "Jul 8, 2026",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
    status: "published",
    createdAt: new Date("2026-07-08").toISOString()
  },
  {
    id: "blog-2",
    title: "How Microsecond Latencies Impact Modern Billing Kernels",
    slug: "microsecond-billing-latencies",
    category: "Fintech SaaS",
    excerpt: "Why standard ORMs fail during global subscription rushes and how dual-journaling on PostgreSQL keeps compliance and auditing at microsecond speeds.",
    content: `# How Microsecond Latencies Impact Modern Billing Kernels

In high-throughput enterprise SaaS environments, even a 100ms database delay can cascade into transaction drops, double-charges, and localized taxation failures.

## The Anatomy of a Ledger Write
During multi-state VAT audits, standard ORMs perform multiple round-trips to compile line items. Under a 10,000 requests/sec peak, this leads to connection-pool exhaustion.

## FENORA's Auditable Dual-Journaling Architecture
We solved this for **Pulse Billing** by implementing:
1. **Append-Only Write Journals**: All database writes are treated as single-trip append-only log insertions.
2. **PostgreSQL Dual-ledger Mirroring**: A replica DB handles asynchronous localized compliance computations, completely decoupling transaction speeds from legal calculations.
3. **Sub-35ms API Responses**: Our Redis pipeline handles auth and rate-limiting concurrently.

By eliminating network hops, Pulse Billing handles over $180M in subscriptions with absolute integrity.`,
    author: "Marc Verhaegen",
    readTime: "4 min read",
    date: "Jun 24, 2026",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800",
    status: "published",
    createdAt: new Date("2026-06-24").toISOString()
  }
];

const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Sarah Jenkins",
    role: "VP of Engineering",
    company: "Synthetix Corp",
    avatar: "S",
    avatarColor: "bg-primary",
    content: "FENORA did not just build our platform; they engineered our entire technical strategy. Their agentic AI workflows decreased routing latencies by 42% in under 6 weeks. They operate with an elite level of discipline, type-safety, and design craft.",
    rating: 5,
    outcome: "Latency reduced by 42%",
    status: "published"
  },
  {
    id: "test-2",
    name: "Michael Chang",
    role: "Chief Executive Officer",
    company: "Pulse Billing",
    avatar: "M",
    avatarColor: "bg-accent",
    content: "We struggled with scaling our billing architectures across multiple European jurisdictions. FENORA designed a multi-tenant isolation database and unified Stripe pipeline that handled over $180M seamlessly. They are our permanent fractional CTO.",
    rating: 5,
    outcome: "Processed $180M+ securely",
    status: "published"
  },
  {
    id: "test-3",
    name: "David Miller",
    role: "Co-Founder",
    company: "AeroSpace Simulation",
    avatar: "D",
    avatarColor: "bg-foreground-muted",
    content: "The team's mastery of declarative infrastructure as code via GCP Terraform is exceptional. They automated our entire dev pipeline, bringing server spin-up times down to minutes with complete security rules. Highly recommended engineering group.",
    rating: 5,
    outcome: "Server provisioning under 5 mins",
    status: "published"
  }
];

const SEED_LEADS: Lead[] = [
  {
    id: "FEN-849204",
    service: "AI Engineering & Agent Integration",
    budget: "$60,000 - $120,000",
    timeline: "2 - 4 Months",
    description: "Build an autonomous sales routing agent cluster that reads support emails, searches our internal knowledge vector base, and drafts customized responses.",
    email: "cto@enterpriseflow.io",
    phone: "+1 (555) 392-8104",
    date: "Jul 9, 2026",
    status: "new",
    estimatedEffort: "Advanced AI Engineering & Fine-tuning sprint",
    recommendedStack: ["Google Gemini API", "Python / FastAPI", "LangChain", "Vector DB", "React"]
  },
  {
    id: "FEN-329481",
    service: "Full-Stack Product Development",
    budget: "$30,000 - $60,000",
    timeline: "Under 6 Weeks",
    description: "Migrate our legacy multi-page Angular corporate app to a responsive, high-fidelity Next.js application integrated with a Stripe sub engine.",
    email: "founder@launchdeck.co",
    date: "Jul 5, 2026",
    status: "contacted",
    estimatedEffort: "Multi-phase modular SaaS architecture",
    recommendedStack: ["Next.js", "Node.js (Express)", "PostgreSQL", "Redis", "Docker", "Stripe API"]
  }
];

const SEED_BOOKINGS: Booking[] = [
  {
    id: "B-9204",
    name: "Thomas Vance",
    email: "t.vance@vancetech.com",
    company: "Vance Tech Industries",
    date: "2026-07-14",
    timeSlot: "10:30 AM",
    timezone: "America/New_York",
    description: "Discussion regarding custom vector search integration on top of SQL databases.",
    status: "scheduled",
    createdAt: new Date().toISOString()
  },
  {
    id: "B-1049",
    name: "Clara Oswald",
    email: "clara@spacehop.org",
    company: "SpaceHop Flights",
    date: "2026-07-11",
    timeSlot: "02:00 PM",
    timezone: "Europe/London",
    description: "Initial discovery call for infrastructure automation and scale-to-zero configurations.",
    status: "scheduled",
    createdAt: new Date().toISOString()
  }
];

// Verify or create directories
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ensureFile = (filePath: string, seed: any) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), "utf8");
  }
};

ensureFile(BLOGS_FILE, SEED_BLOGS);
ensureFile(TESTIMONIALS_FILE, SEED_TESTIMONIALS);
ensureFile(LEADS_FILE, SEED_LEADS);
ensureFile(BOOKINGS_FILE, SEED_BOOKINGS);

export class AdminDb {
  // === BLOGS ===
  static getAllBlogs(): Blog[] {
    try {
      return JSON.parse(fs.readFileSync(BLOGS_FILE, "utf8"));
    } catch {
      return SEED_BLOGS;
    }
  }

  static getBlogBySlug(slug: string): Blog | null {
    const list = this.getAllBlogs();
    return list.find((b) => b.slug === slug) || null;
  }

  static createBlog(blog: Partial<Blog>): Blog {
    const list = this.getAllBlogs();
    const newBlog: Blog = {
      id: "blog-" + Date.now(),
      title: blog.title || "Untitled Blog",
      slug: blog.slug || "untitled-blog-" + Date.now(),
      category: blog.category || "General",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      author: blog.author || "FENORA Team",
      readTime: blog.readTime || "3 min read",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      coverImage: blog.coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
      status: blog.status || "draft",
      createdAt: new Date().toISOString()
    };
    list.unshift(newBlog);
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(list, null, 2), "utf8");
    return newBlog;
  }

  static updateBlog(id: string, updates: Partial<Blog>): Blog | null {
    const list = this.getAllBlogs();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(list, null, 2), "utf8");
    return list[idx];
  }

  static deleteBlog(id: string): boolean {
    const list = this.getAllBlogs();
    const filtered = list.filter((b) => b.id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  }

  // === TESTIMONIALS ===
  static getAllTestimonials(): Testimonial[] {
    try {
      return JSON.parse(fs.readFileSync(TESTIMONIALS_FILE, "utf8"));
    } catch {
      return SEED_TESTIMONIALS;
    }
  }

  static createTestimonial(test: Partial<Testimonial>): Testimonial {
    const list = this.getAllTestimonials();
    const newTest: Testimonial = {
      id: "test-" + Date.now(),
      name: test.name || "Anonymous",
      role: test.role || "Professional",
      company: test.company || "Enterprise",
      avatar: (test.name || "A").charAt(0).toUpperCase(),
      avatarColor: test.avatarColor || "bg-primary",
      content: test.content || "",
      rating: Number(test.rating) || 5,
      outcome: test.outcome || "Successful Integration",
      status: test.status || "draft"
    };
    list.push(newTest);
    fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(list, null, 2), "utf8");
    return newTest;
  }

  static updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const list = this.getAllTestimonials();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(list, null, 2), "utf8");
    return list[idx];
  }

  static deleteTestimonial(id: string): boolean {
    const list = this.getAllTestimonials();
    const filtered = list.filter((t) => t.id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  }

  // === LEADS ===
  static getAllLeads(): Lead[] {
    try {
      return JSON.parse(fs.readFileSync(LEADS_FILE, "utf8"));
    } catch {
      return SEED_LEADS;
    }
  }

  static createLead(lead: Partial<Lead>): Lead {
    const list = this.getAllLeads();
    const newLead: Lead = {
      id: "FEN-" + Math.floor(Math.random() * 900000 + 100000),
      service: lead.service || "General Engineering",
      budget: lead.budget || "$30,000 - $60,000",
      timeline: lead.timeline || "2 - 4 Months",
      description: lead.description || "",
      email: lead.email || "client@company.com",
      phone: lead.phone || "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "new",
      estimatedEffort: lead.estimatedEffort || "Medium sprint release",
      recommendedStack: lead.recommendedStack || ["React", "TypeScript"]
    };
    list.unshift(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(list, null, 2), "utf8");
    return newLead;
  }

  static updateLeadStatus(id: string, status: "new" | "contacted" | "qualified" | "closed"): Lead | null {
    const list = this.getAllLeads();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    fs.writeFileSync(LEADS_FILE, JSON.stringify(list, null, 2), "utf8");
    return list[idx];
  }

  static deleteLead(id: string): boolean {
    const list = this.getAllLeads();
    const filtered = list.filter((l) => l.id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  }

  // === BOOKINGS ===
  static getAllBookings(): Booking[] {
    try {
      return JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf8"));
    } catch {
      return SEED_BOOKINGS;
    }
  }

  static createBooking(booking: Partial<Booking>): Booking {
    const list = this.getAllBookings();
    const newBooking: Booking = {
      id: "B-" + Math.floor(Math.random() * 9000 + 1000),
      name: booking.name || "Client",
      email: booking.email || "client@company.com",
      company: booking.company || "",
      date: booking.date || new Date().toISOString().split("T")[0],
      timeSlot: booking.timeSlot || "11:00 AM",
      timezone: booking.timezone || "UTC",
      description: booking.description || "",
      status: "scheduled",
      createdAt: new Date().toISOString()
    };
    list.unshift(newBooking);
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(list, null, 2), "utf8");
    return newBooking;
  }

  static updateBookingStatus(id: string, status: "scheduled" | "completed" | "cancelled"): Booking | null {
    const list = this.getAllBookings();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(list, null, 2), "utf8");
    return list[idx];
  }

  static deleteBooking(id: string): boolean {
    const list = this.getAllBookings();
    const filtered = list.filter((b) => b.id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  }
}
