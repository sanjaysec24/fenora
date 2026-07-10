import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  businessProblem: string;
  technicalSolution: string;
  businessOutcome: string;
  category: string;
  techStack: string[];
  metrics: ProjectMetric[];
  coverImage?: string;
  galleryImages?: string[];
  projectUrl?: string;
  githubUrl?: string;
  clientName?: string;
  industry?: string;
  startDate?: string;
  completionDate?: string;
  featured: boolean;
  status: "draft" | "published";
  order: number;
  color: string;
  imageAccent: string;
  createdAt?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

// Default initial seed projects matching FENORA's current high-quality case studies
const SEED_PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Synthetix AI",
    slug: "synthetix-ai",
    category: "AI Platforms",
    description: "An intelligent autonomous multi-agent system coordinating real-time global logistics and automated task scheduling across four continents.",
    metrics: [
      { label: "Routing Latency", value: "-42%" },
      { label: "Operational Savings", value: "$2.4M/yr" },
      { label: "Agent Response", value: "< 1.2s" }
    ],
    techStack: ["Gemini API", "Python", "React", "pgvector", "Docker", "FastAPI"],
    businessProblem: "Legacy logistics scheduling took hours of manual, error-prone human intervention, leading to systemic container transport delays, severe route conflict bottlenecks, and over $5M in annual idle-capital waste.",
    technicalSolution: "Engineered a custom multi-agent orchestration architecture leveraging the @google/genai SDK, real-time spatial heuristics, pgvector semantic search, and robust Redis event state queues to autonomously resolve conflicts instantly.",
    businessOutcome: "Fully automated 80% of container routing workflows with zero human touchpoints. Tripled total weekly processing capacity with zero operational staff expansion.",
    color: "from-primary to-accent",
    imageAccent: "rgba(0, 102, 255, 0.2)",
    featured: true,
    status: "published",
    order: 1,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    galleryImages: [],
    clientName: "Synthetix Logistics Corp",
    industry: "Logistics & Supply Chain",
    startDate: "2025-01",
    completionDate: "2025-06"
  },
  {
    id: "project-2",
    title: "Pulse Billing",
    slug: "pulse-billing",
    category: "Fintech SaaS",
    description: "A hardened, multi-tenant billing core processing enterprise subscriptions with real-time multi-region compliance audits.",
    metrics: [
      { label: "Transaction Volume", value: "$180M+" },
      { label: "API Latency Core", value: "< 35ms" },
      { label: "Tax Compliance", value: "100.0%" }
    ],
    techStack: ["Next.js", "Express", "PostgreSQL", "Redis", "Stripe API", "AWS Lambda"],
    businessProblem: "The client suffered from severe transaction drop-offs (8.4%) during multi-region traffic spikes. Inflexible ledger structures also delayed multi-state VAT taxation reporting by up to three business weeks.",
    technicalSolution: "Architected a dual-write transaction journal on PostgreSQL with high-throughput Redis caching layers, microsecond-latency serverless taxation workers, and automated asynchronous audit verification pipelines.",
    businessOutcome: "Reduced payment processing failures to exactly 0.02%. Boosted localized VAT compliance auditing velocity by 1,400%, letting leadership close financial periods same-day.",
    color: "from-accent to-foreground",
    imageAccent: "rgba(0, 229, 255, 0.15)",
    featured: true,
    status: "published",
    order: 2,
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
    galleryImages: [],
    clientName: "Pulse Payments Inc",
    industry: "Fintech & Payments",
    startDate: "2025-03",
    completionDate: "2025-08"
  },
  {
    id: "project-3",
    title: "AeroSpace Engine",
    slug: "aerospace-engine",
    category: "Enterprise Cloud",
    description: "Ultra-secure container orchestration platform and visual command dashboard designed for distributed flight-dynamics simulation models.",
    metrics: [
      { label: "System Uptime", value: "99.999%" },
      { label: "Cluster Boot-up", value: "4.2 Min" },
      { label: "Security Incidents", value: "0" }
    ],
    techStack: ["Google Cloud Platform", "Terraform", "Kubernetes", "TypeScript", "gRPC"],
    businessProblem: "Defense-grade simulator engineers experienced extreme infrastructure queue blockages, waiting over 1.5 hours to provision test server nodes, severely throttling active flight validation cycles.",
    technicalSolution: "Designed secure, declarative, immutable Terraform cloud blueprints running inside Kubernetes clusters, using gRPC message brokers to stream telemetry metrics at sub-millisecond speeds.",
    businessOutcome: "Enabled flight engineers to spin up sandboxed simulations on-demand in under five minutes. Cut total cloud resource expenditures by 38% via custom scale-to-zero configurations.",
    color: "from-foreground to-foreground-muted",
    imageAccent: "rgba(255, 255, 255, 0.1)",
    featured: true,
    status: "published",
    order: 3,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    galleryImages: [],
    clientName: "AeroDynamics Aerospace LLC",
    industry: "Defense & Simulation",
    startDate: "2025-05",
    completionDate: "2025-11"
  }
];

// Initialize database storage directory
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_PROJECTS, null, 2), "utf8");
}

// Check for Supabase Credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const isSupabaseConfigured = !!(supabaseUrl && supabaseServiceKey);

let supabaseClient: any = null;
if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseServiceKey!);
    console.log("Supabase client initialized successfully for Projects DB.");
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

// Core Database Methods
export class ProjectsDb {
  
  static isUsingSupabase(): boolean {
    return isSupabaseConfigured && supabaseClient !== null;
  }

  // Get all projects with filtering options
  static async getAll(options: { 
    includeDrafts?: boolean; 
    category?: string; 
    featuredOnly?: boolean; 
    search?: string;
  } = {}): Promise<Project[]> {
    if (this.isUsingSupabase()) {
      try {
        let query = supabaseClient.from("projects").select("*");
        
        if (!options.includeDrafts) {
          query = query.eq("status", "published");
        }
        if (options.category && options.category !== "All") {
          query = query.eq("category", options.category);
        }
        if (options.featuredOnly) {
          query = query.eq("featured", true);
        }
        if (options.search) {
          query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
        }
        
        const { data, error } = await query.order("order", { ascending: true });
        if (error) throw error;

        // Map database fields back to camelCase
        return (data || []).map((p: any) => this.mapFromDb(p));
      } catch (err) {
        console.error("Supabase getAll error, falling back to local database:", err);
      }
    }

    // Local JSON Fallback
    try {
      const fileData = fs.readFileSync(DATA_FILE, "utf8");
      let list: Project[] = JSON.parse(fileData);

      if (!options.includeDrafts) {
        list = list.filter((p) => p.status === "published");
      }
      if (options.category && options.category !== "All") {
        list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
      }
      if (options.featuredOnly) {
        list = list.filter((p) => p.featured);
      }
      if (options.search) {
        const term = options.search.toLowerCase();
        list = list.filter(
          (p) => 
            p.title.toLowerCase().includes(term) || 
            p.description.toLowerCase().includes(term) || 
            p.techStack.some(t => t.toLowerCase().includes(term))
        );
      }

      return list.sort((a, b) => a.order - b.order);
    } catch (err) {
      console.error("Local database read error:", err);
      return [];
    }
  }

  // Find single project by slug
  static async getBySlug(slug: string, includeDrafts: boolean = false): Promise<Project | null> {
    if (this.isUsingSupabase()) {
      try {
        let query = supabaseClient.from("projects").select("*").eq("slug", slug);
        if (!includeDrafts) {
          query = query.eq("status", "published");
        }
        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        if (data) return this.mapFromDb(data);
      } catch (err) {
        console.error("Supabase getBySlug error, falling back to local database:", err);
      }
    }

    // Local JSON Fallback
    try {
      const fileData = fs.readFileSync(DATA_FILE, "utf8");
      const list: Project[] = JSON.parse(fileData);
      const proj = list.find((p) => p.slug === slug);
      if (!proj) return null;
      if (!includeDrafts && proj.status !== "published") return null;
      return proj;
    } catch (err) {
      console.error("Local database getBySlug error:", err);
      return null;
    }
  }

  // Create a new project
  static async create(projectData: Omit<Project, "id" | "createdAt">): Promise<Project> {
    const newId = "proj-" + Math.random().toString(36).substring(2, 9);
    const newProject: Project = {
      ...projectData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    if (this.isUsingSupabase()) {
      try {
        const dbData = this.mapToDb(newProject);
        const { data, error } = await supabaseClient
          .from("projects")
          .insert([dbData])
          .select()
          .single();
        
        if (error) throw error;
        return this.mapFromDb(data);
      } catch (err) {
        console.error("Supabase create error, falling back to saving locally:", err);
      }
    }

    // Local JSON Fallback
    try {
      const fileData = fs.readFileSync(DATA_FILE, "utf8");
      const list: Project[] = JSON.parse(fileData);
      list.push(newProject);
      fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
      return newProject;
    } catch (err) {
      console.error("Local database create error:", err);
      throw err;
    }
  }

  // Update a project
  static async update(id: string, updateData: Partial<Project>): Promise<Project> {
    if (this.isUsingSupabase()) {
      try {
        const dbUpdate = this.mapToDb(updateData);
        const { data, error } = await supabaseClient
          .from("projects")
          .update(dbUpdate)
          .eq("id", id)
          .select()
          .single();
        
        if (error) throw error;
        return this.mapFromDb(data);
      } catch (err) {
        console.error("Supabase update error, falling back to saving locally:", err);
      }
    }

    // Local JSON Fallback
    try {
      const fileData = fs.readFileSync(DATA_FILE, "utf8");
      const list: Project[] = JSON.parse(fileData);
      const index = list.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error(`Project with ID ${id} not found`);
      }

      const updatedProject = {
        ...list[index],
        ...updateData,
        id // Prevent changing ID
      };

      list[index] = updatedProject;
      fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
      return updatedProject;
    } catch (err) {
      console.error("Local database update error:", err);
      throw err;
    }
  }

  // Delete a project
  static async delete(id: string): Promise<boolean> {
    if (this.isUsingSupabase()) {
      try {
        const { error } = await supabaseClient
          .from("projects")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Supabase delete error, falling back to local database:", err);
      }
    }

    // Local JSON Fallback
    try {
      const fileData = fs.readFileSync(DATA_FILE, "utf8");
      let list: Project[] = JSON.parse(fileData);
      const initialLength = list.length;
      list = list.filter((p) => p.id !== id);
      
      if (list.length === initialLength) {
        return false;
      }

      fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
      return true;
    } catch (err) {
      console.error("Local database delete error:", err);
      return false;
    }
  }

  // Helpers for Supabase mapping (camelCase <=> snake_case)
  private static mapToDb(p: Partial<Project>): any {
    const dbObj: any = {};
    if (p.id !== undefined) dbObj.id = p.id;
    if (p.title !== undefined) dbObj.title = p.title;
    if (p.slug !== undefined) dbObj.slug = p.slug;
    if (p.description !== undefined) dbObj.description = p.description;
    if (p.businessProblem !== undefined) dbObj.business_problem = p.businessProblem;
    if (p.technicalSolution !== undefined) dbObj.technical_solution = p.technicalSolution;
    if (p.businessOutcome !== undefined) dbObj.business_outcome = p.businessOutcome;
    if (p.category !== undefined) dbObj.category = p.category;
    if (p.techStack !== undefined) dbObj.tech_stack = p.techStack;
    if (p.metrics !== undefined) dbObj.metrics = p.metrics;
    if (p.coverImage !== undefined) dbObj.cover_image = p.coverImage;
    if (p.galleryImages !== undefined) dbObj.gallery_images = p.galleryImages;
    if (p.projectUrl !== undefined) dbObj.project_url = p.projectUrl;
    if (p.githubUrl !== undefined) dbObj.github_url = p.githubUrl;
    if (p.clientName !== undefined) dbObj.client_name = p.clientName;
    if (p.industry !== undefined) dbObj.industry = p.industry;
    if (p.startDate !== undefined) dbObj.start_date = p.startDate;
    if (p.completionDate !== undefined) dbObj.completion_date = p.completionDate;
    if (p.featured !== undefined) dbObj.featured = p.featured;
    if (p.status !== undefined) dbObj.status = p.status;
    if (p.order !== undefined) dbObj.order = p.order;
    if (p.color !== undefined) dbObj.color = p.color;
    if (p.imageAccent !== undefined) dbObj.image_accent = p.imageAccent;
    if (p.createdAt !== undefined) dbObj.created_at = p.createdAt;
    return dbObj;
  }

  private static mapFromDb(p: any): Project {
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      businessProblem: p.business_problem || "",
      technicalSolution: p.technical_solution || "",
      businessOutcome: p.business_outcome || "",
      category: p.category || "Uncategorized",
      techStack: p.tech_stack || [],
      metrics: p.metrics || [],
      coverImage: p.cover_image || "",
      galleryImages: p.gallery_images || [],
      projectUrl: p.project_url || "",
      githubUrl: p.github_url || "",
      clientName: p.client_name || "",
      industry: p.industry || "",
      startDate: p.start_date || "",
      completionDate: p.completion_date || "",
      featured: p.featured || false,
      status: p.status || "draft",
      order: p.order || 0,
      color: p.color || "from-primary to-accent",
      imageAccent: p.image_accent || "rgba(0, 102, 255, 0.2)",
      createdAt: p.created_at
    };
  }
}
