import React, { useEffect, useState } from "react";
import { 
  Plus, Edit2, Trash2, Search, Filter, Sparkles, CheckCircle2, Eye, EyeOff, 
  ArrowUp, ArrowDown, Upload, Trash, Database, Globe, Key, RefreshCw, 
  ArrowLeft, Terminal, Check, Info, FileText, LayoutDashboard, BookOpen, 
  MessageSquare, Calendar, Users, Star, ClipboardList, ShieldCheck, Clock
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  businessProblem: string;
  technicalSolution: string;
  businessOutcome: string;
  techStack: string[];
  metrics: { label: string; value: string }[];
  coverImage: string;
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
}

interface Blog {
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
}

interface Testimonial {
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

interface Lead {
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

interface Booking {
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

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<"analytics" | "projects" | "blogs" | "testimonials" | "leads" | "bookings">("analytics");

  // Authentication Passcode State
  const [passcode, setPasscode] = useState(() => localStorage.getItem("fenora_admin_passcode") || "fenora2026");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Lists & fetching states
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbMode, setDbMode] = useState<string>("local-filesystem");

  // Filtering / Search (Unified)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "published" | "draft">("All");

  // Form Modals states
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);

  // Editing items trackers
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // --- Form Fields State (Projects) ---
  const [projTitle, setProjTitle] = useState("");
  const [projSlug, setProjSlug] = useState("");
  const [projCategory, setProjCategory] = useState("AI Platforms");
  const [projDescription, setProjDescription] = useState("");
  const [projProblem, setProjProblem] = useState("");
  const [projSolution, setProjSolution] = useState("");
  const [projOutcome, setProjOutcome] = useState("");
  const [projTechStack, setProjTechStack] = useState("");
  const [projMetrics, setProjMetrics] = useState<{ label: string; value: string }[]>([{ label: "", value: "" }]);
  const [projCoverImage, setProjCoverImage] = useState("");
  const [projUrl, setProjUrl] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projClient, setProjClient] = useState("");
  const [projIndustry, setProjIndustry] = useState("");
  const [projStart, setProjStart] = useState("");
  const [projCompletion, setProjCompletion] = useState("");
  const [projFeatured, setProjFeatured] = useState(false);
  const [projStatus, setProjStatus] = useState<"draft" | "published">("draft");
  const [projOrder, setProjOrder] = useState(1);
  const [projColor, setProjColor] = useState("from-primary to-accent");
  const [projImageAccent, setProjImageAccent] = useState("rgba(0, 102, 255, 0.2)");

  // --- Form Fields State (Blogs) ---
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogCategory, setBlogCategory] = useState("AI Engineering");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("Principal Engineer");
  const [blogReadTime, setBlogReadTime] = useState("4 min read");
  const [blogCover, setBlogCover] = useState("https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800");
  const [blogStatus, setBlogStatus] = useState<"draft" | "published">("draft");

  // --- Form Fields State (Testimonials) ---
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testCompany, setTestCompany] = useState("");
  const [testContent, setTestContent] = useState("");
  const [testRating, setTestRating] = useState(5);
  const [testOutcome, setTestOutcome] = useState("");
  const [testStatus, setTestStatus] = useState<"draft" | "published">("draft");

  // File Upload state (Projects Cover & Blogs Cover)
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    checkHealthAndUnlock();
  }, [passcode]);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-admin-passcode": passcode
  });

  async function checkHealthAndUnlock() {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setDbMode(data.mode);
      
      // Load all lists
      await Promise.all([
        fetchProjects(),
        fetchBlogs(),
        fetchTestimonials(),
        fetchLeads(),
        fetchBookings()
      ]);

      setIsUnlocked(true);
      setPasscodeError(null);
    } catch (err: any) {
      if (err.status === 401 || err.message === "Unauthorized") {
        setIsUnlocked(false);
        setPasscodeError("Invalid administration access passcode. Input correct passcode.");
      } else {
        // Dev offline/error bypass
        setIsUnlocked(true);
      }
    }
  }

  // --- Fetch Operations ---
  const fetchProjects = async () => {
    const res = await fetch("/api/projects?includeDrafts=true", { headers: getHeaders() });
    if (res.status === 401) throw new Error("Unauthorized");
    const data = await res.json();
    setProjects(data);
  };

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs?includeDrafts=true", { headers: getHeaders() });
    if (res.status === 401) throw new Error("Unauthorized");
    const data = await res.json();
    setBlogs(data);
  };

  const fetchTestimonials = async () => {
    const res = await fetch("/api/testimonials?includeDrafts=true", { headers: getHeaders() });
    if (res.status === 401) throw new Error("Unauthorized");
    const data = await res.json();
    setTestimonials(data);
  };

  const fetchLeads = async () => {
    const res = await fetch("/api/leads", { headers: getHeaders() });
    if (res.status === 401) throw new Error("Unauthorized");
    const data = await res.json();
    setLeads(data);
  };

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings", { headers: getHeaders() });
    if (res.status === 401) throw new Error("Unauthorized");
    const data = await res.json();
    setBookings(data);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    localStorage.setItem("fenora_admin_passcode", passcode);
    checkHealthAndUnlock();
  };

  // --- Project Form Helpers ---
  const handleProjTitleChange = (val: string) => {
    setProjTitle(val);
    if (!editingProject) {
      setProjSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"));
    }
  };

  const openProjectForm = (proj: Project | null) => {
    if (proj) {
      setEditingProject(proj);
      setProjTitle(proj.title);
      setProjSlug(proj.slug);
      setProjCategory(proj.category);
      setProjDescription(proj.description);
      setProjProblem(proj.businessProblem || "");
      setProjSolution(proj.technicalSolution || "");
      setProjOutcome(proj.businessOutcome || "");
      setProjTechStack(proj.techStack ? proj.techStack.join(", ") : "");
      setProjMetrics(proj.metrics && proj.metrics.length > 0 ? proj.metrics : [{ label: "", value: "" }]);
      setProjCoverImage(proj.coverImage);
      setProjUrl(proj.projectUrl || "");
      setProjGithub(proj.githubUrl || "");
      setProjClient(proj.clientName || "");
      setProjIndustry(proj.industry || "");
      setProjStart(proj.startDate || "");
      setProjCompletion(proj.completionDate || "");
      setProjFeatured(proj.featured || false);
      setProjStatus(proj.status);
      setProjOrder(proj.order || 1);
      setProjColor(proj.color || "from-primary to-accent");
      setProjImageAccent(proj.imageAccent || "rgba(0, 102, 255, 0.2)");
    } else {
      setEditingProject(null);
      setProjTitle("");
      setProjSlug("");
      setProjCategory("AI Platforms");
      setProjDescription("");
      setProjProblem("");
      setProjSolution("");
      setProjOutcome("");
      setProjTechStack("");
      setProjMetrics([{ label: "", value: "" }]);
      setProjCoverImage("");
      setProjUrl("");
      setProjGithub("");
      setProjClient("");
      setProjIndustry("");
      setProjStart("");
      setProjCompletion("");
      setProjFeatured(false);
      setProjStatus("draft");
      setProjOrder(projects.length + 1);
      setProjColor("from-primary to-accent");
      setProjImageAccent("rgba(0, 102, 255, 0.2)");
    }
    setIsProjectFormOpen(true);
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: projTitle,
      slug: projSlug,
      category: projCategory,
      description: projDescription,
      businessProblem: projProblem,
      technicalSolution: projSolution,
      businessOutcome: projOutcome,
      techStack: projTechStack.split(",").map(s => s.trim()).filter(Boolean),
      metrics: projMetrics.filter(m => m.label && m.value),
      coverImage: projCoverImage,
      projectUrl: projUrl,
      githubUrl: projGithub,
      clientName: projClient,
      industry: projIndustry,
      startDate: projStart,
      completionDate: projCompletion,
      featured: projFeatured,
      status: projStatus,
      order: Number(projOrder) || 1,
      color: projColor,
      imageAccent: projImageAccent
    };

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Could not save project parameters");
      await fetchProjects();
      setIsProjectFormOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project/case study record?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete project");
      await fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Blog Form Helpers ---
  const handleBlogTitleChange = (val: string) => {
    setBlogTitle(val);
    if (!editingBlog) {
      setBlogSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"));
    }
  };

  const openBlogForm = (blog: Blog | null) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogTitle(blog.title);
      setBlogSlug(blog.slug);
      setBlogCategory(blog.category);
      setBlogExcerpt(blog.excerpt);
      setBlogContent(blog.content);
      setBlogAuthor(blog.author);
      setBlogReadTime(blog.readTime);
      setBlogCover(blog.coverImage);
      setBlogStatus(blog.status);
    } else {
      setEditingBlog(null);
      setBlogTitle("");
      setBlogSlug("");
      setBlogCategory("AI Engineering");
      setBlogExcerpt("");
      setBlogContent("");
      setBlogAuthor("Principal Architect");
      setBlogReadTime("5 min read");
      setBlogCover("https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800");
      setBlogStatus("draft");
    }
    setIsBlogFormOpen(true);
  };

  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: blogTitle,
      slug: blogSlug,
      category: blogCategory,
      excerpt: blogExcerpt,
      content: blogContent,
      author: blogAuthor,
      readTime: blogReadTime,
      coverImage: blogCover,
      status: blogStatus
    };

    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Could not save blog parameters");
      await fetchBlogs();
      setIsBlogFormOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      await fetchBlogs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Testimonial Form Helpers ---
  const openTestimonialForm = (test: Testimonial | null) => {
    if (test) {
      setEditingTestimonial(test);
      setTestName(test.name);
      setTestRole(test.role);
      setTestCompany(test.company);
      setTestContent(test.content);
      setTestRating(test.rating);
      setTestOutcome(test.outcome);
      setTestStatus(test.status);
    } else {
      setEditingTestimonial(null);
      setTestName("");
      setTestRole("");
      setTestCompany("");
      setTestContent("");
      setTestRating(5);
      setTestOutcome("");
      setTestStatus("draft");
    }
    setIsTestimonialFormOpen(true);
  };

  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: testName,
      role: testRole,
      company: testCompany,
      content: testContent,
      rating: Number(testRating),
      outcome: testOutcome,
      status: testStatus
    };

    try {
      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial.id}` : "/api/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Could not save testimonial parameters");
      await fetchTestimonials();
      setIsTestimonialFormOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this client testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete testimonial");
      await fetchTestimonials();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Lead Status Modification ---
  const changeLeadStatus = async (id: string, currentStatus: string) => {
    const statuses: ("new" | "contacted" | "qualified" | "closed")[] = ["new", "contacted", "qualified", "closed"];
    const nextIdx = (statuses.indexOf(currentStatus as any) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchLeads();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this client lead tracking record?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete lead");
      await fetchLeads();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Booking Status Modification ---
  const changeBookingStatus = async (id: string, currentStatus: string) => {
    const statuses: ("scheduled" | "completed" | "cancelled")[] = ["scheduled", "completed", "cancelled"];
    const nextIdx = (statuses.indexOf(currentStatus as any) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchBookings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this discovery session request?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      await fetchBookings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Unified Image Upload Helper (Drag and Drop supported) ---
  const uploadImage = async (file: File, type: "project" | "blog") => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-passcode": passcode },
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed.");
      const data = await res.json();
      if (type === "project") setProjCoverImage(data.url);
      else if (type === "blog") setBlogCover(data.url);
    } catch (err: any) {
      alert(err.message || "Could not upload image. Local fallback saved.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, type: "project" | "blog") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadImage(e.dataTransfer.files[0], type);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>, type: "project" | "blog") => {
    if (e.target.files && e.target.files[0]) {
      await uploadImage(e.target.files[0], type);
    }
  };

  // --- Metrics Form Helpers ---
  const updateMetric = (idx: number, key: "label" | "value", val: string) => {
    const copy = [...projMetrics];
    copy[idx][key] = val;
    setProjMetrics(copy);
  };

  // --- Filtering & Calculations ---
  const filteredProjects = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" ? true : p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredBlogs = blogs.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" ? true : b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredTestimonials = testimonials.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        t.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "All" ? true : t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredLeads = leads.filter(l => 
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => 
    b.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Gate: Locked Screen ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
        {/* Background ambient loops */}
        <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md p-8 rounded-3xl glass-panel relative border border-border/80 flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-full bg-accent/15 text-accent border border-accent/20">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-accent uppercase font-bold block">
              SECURE OPERATIONAL CONSOLE
            </span>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Authorize Credentials
            </h2>
            <p className="text-xs text-foreground-secondary leading-relaxed font-sans max-w-xs mx-auto">
              This terminal is reserved exclusively for FENORA Technologies staff. Authorization passcode verified in headers.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="w-full space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-mono text-foreground-muted uppercase tracking-wider block">
                ADMIN ACCESS PASSCODE
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none text-xs transition-all font-mono"
              />
            </div>

            {passcodeError && (
              <p className="text-[10px] font-mono text-error/90 flex items-center gap-1 bg-error/10 border border-error/20 p-2.5 rounded-lg text-left">
                <Info className="w-3.5 h-3.5 shrink-0" />
                {passcodeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:brightness-110 active:scale-[0.98] text-white font-semibold flex items-center justify-center gap-2 transition-all text-xs tracking-wider uppercase cursor-pointer"
            >
              Verify Operations Token
            </button>
          </form>

          <button
            onClick={() => onNavigate("/")}
            className="text-[10px] font-mono text-foreground-muted hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to public homepage
          </button>
        </div>
      </div>
    );
  }

  // --- Main Render: Unlocked Screen ---
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row relative z-10 font-sans">
      
      {/* SIDEBAR NAVIGATION CONTROLS */}
      <aside className="w-full lg:w-72 bg-surface-elevated/20 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between shrink-0 font-sans">
        
        {/* Core items */}
        <div className="p-6 space-y-8">
          
          {/* Brand block */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg font-mono">
              F
            </div>
            <div>
              <span className="text-[10px] font-mono text-accent font-bold tracking-widest block uppercase">
                FENORA OPS
              </span>
              <span className="text-xs font-display font-semibold text-foreground-muted block">
                Internal Studio Console
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            <span className="text-[9px] font-mono text-foreground-muted font-bold block uppercase px-3 mb-2.5">
              General Operations
            </span>
            {[
              { id: "analytics", label: "Analytics & Status", icon: LayoutDashboard },
              { id: "projects", label: "Project Case Studies", icon: FileText },
              { id: "blogs", label: "Blog Insights", icon: BookOpen },
              { id: "testimonials", label: "Client Reviews", icon: MessageSquare },
              { id: "leads", label: "Inbound Leads", icon: ClipboardList, count: leads.length },
              { id: "bookings", label: "Discovery Bookings", icon: Calendar, count: bookings.filter(b => b.status === "scheduled").length }
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    active 
                      ? "bg-primary/10 border border-primary/20 text-foreground" 
                      : "text-foreground-secondary hover:text-foreground hover:bg-surface-elevated/40 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4.5 h-4.5 ${active ? "text-accent" : "text-foreground-muted"}`} />
                    {item.label}
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile/System footer */}
        <div className="p-6 border-t border-border flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-xs text-foreground-secondary">
              P
            </div>
            <div>
              <span className="text-xs font-bold block">Principal Architect</span>
              <span className="text-[10px] font-mono text-success block">Active Session</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("/")}
            className="w-full py-2.5 rounded-lg bg-surface border border-border hover:bg-surface-elevated transition-colors text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer text-foreground-muted hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Site
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER PANEL */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto max-w-7xl mx-auto font-sans">
        
        {/* TOP COMPONENT: Global Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/80 pb-8 mb-10">
          <div>
            <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight">
              {activeTab === "analytics" && "Control Dashboard"}
              {activeTab === "projects" && "Case Study Manager"}
              {activeTab === "blogs" && "Insights Publisher"}
              {activeTab === "testimonials" && "Testimonials Ledger"}
              {activeTab === "leads" && "Lead Tracking Room"}
              {activeTab === "bookings" && "Discovery Bookings"}
            </h2>
            <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed font-sans max-w-xl">
              {activeTab === "analytics" && "Enterprise-grade pipeline diagnostics, system configurations, and dynamic metrics summary."}
              {activeTab === "projects" && "Create, edit, sort, and draft dynamic engineering case studies displayed live on the home portal."}
              {activeTab === "blogs" && "Draft, publish, and structure technical reports and articles to share expertise."}
              {activeTab === "testimonials" && "Manage verified partner quotes and ratings displayed on the main website index."}
              {activeTab === "leads" && "Review scoping variables submitted dynamically via the interactive project scoper module."}
              {activeTab === "bookings" && "Oversee requested discovery calls and scheduling sessions submitted by potential clients."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={checkHealthAndUnlock}
              className="p-3.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated transition-all flex items-center gap-1.5 text-[10px] font-mono font-bold text-foreground-secondary cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync Live
            </button>
            {activeTab === "projects" && (
              <button
                onClick={() => openProjectForm(null)}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Case Study
              </button>
            )}
            {activeTab === "blogs" && (
              <button
                onClick={() => openBlogForm(null)}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Write Blog Post
              </button>
            )}
            {activeTab === "testimonials" && (
              <button
                onClick={() => openTestimonialForm(null)}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Testimonial
              </button>
            )}
          </div>
        </div>

        {/* ==========================================
            TAB 1: ANALYTICS & SYSTEM CONFIGS
            ========================================== */}
        {activeTab === "analytics" && (
          <div className="space-y-10">
            
            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "TOTAL LEADS LOGGED", val: leads.length, color: "text-primary", desc: "Form submissions" },
                { label: "DUE BOOKED CALLS", val: bookings.filter(b => b.status === "scheduled").length, color: "text-accent", desc: "Calls scheduled" },
                { label: "CASE STUDIES LIVE", val: projects.filter(p => p.status === "published").length, color: "text-success", desc: "Dynamic items" },
                { label: "BLOG INSIGHTS", val: blogs.filter(b => b.status === "published").length, color: "text-foreground-secondary", desc: "Articles published" }
              ].map((card, i) => (
                <div key={i} className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-3 font-mono">
                  <span className="text-[10px] text-foreground-muted font-bold tracking-wider">{card.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-extrabold tracking-tight ${card.color}`}>{card.val}</span>
                    <span className="text-[10px] text-foreground-muted">{card.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* DIAGNOSTICS & SYSTEM CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold font-display flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-accent" /> System Connection Diagnostics
                    </h4>
                    <p className="text-xs text-foreground-secondary leading-relaxed max-w-lg">
                      FENORA operates an advanced dual adaptive database configuration. Changes made here apply instantly across all visitor client portals.
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                    dbMode === "supabase" ? "bg-success/10 border-success/20 text-success" : "bg-primary/10 border-primary/20 text-primary"
                  }`}>
                    <Database className="w-3 h-3" /> {dbMode === "supabase" ? "SUPABASE BACKEND ACTIVE" : "LOCAL RELIABLE STORAGE"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 text-xs space-y-1 font-mono">
                    <span className="text-foreground-muted block text-[10px]">DATABASE ENGINE</span>
                    <span className="text-foreground font-bold">{dbMode === "supabase" ? "PostgreSQL Cluster" : "FS Database (Write-through)"}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 text-xs space-y-1 font-mono">
                    <span className="text-foreground-muted block text-[10px]">ASSET CONTAINER</span>
                    <span className="text-foreground font-bold">{dbMode === "supabase" ? "Supabase Bucket" : "/data/uploads"}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 text-xs space-y-1 font-mono">
                    <span className="text-foreground-muted block text-[10px]">ROUTING SYSTEM</span>
                    <span className="text-foreground font-bold flex items-center gap-1 text-success">
                      <Check className="w-3 h-3" /> /sitemap.xml (Online)
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 rounded-2xl bg-surface border border-border space-y-4 text-xs">
                <h4 className="font-mono font-bold tracking-wider text-foreground-secondary uppercase flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-accent" /> Operations Guide
                </h4>
                <p className="text-foreground-secondary leading-relaxed font-sans">
                  The Admin panel operates as an internal sovereign operations center. Public visitors have no visual references or indicators to find this screen.
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-[11px] text-foreground-muted">
                  <li>Keep drafts hidden before publishing.</li>
                  <li>Upload cover images to prevent fallback colors.</li>
                  <li>Verify sitemaps periodically after project changes.</li>
                </ul>
              </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold font-display">Fast Navigation Operations</h4>
                <p className="text-xs text-foreground-secondary leading-relaxed font-sans max-w-md">
                  Jump directly to specific operational units or configure project lists.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button onClick={() => setActiveTab("projects")} className="px-4 py-2.5 rounded-lg bg-surface-elevated hover:bg-surface text-xs font-semibold border border-border cursor-pointer">
                  Manage Case Studies
                </button>
                <button onClick={() => setActiveTab("blogs")} className="px-4 py-2.5 rounded-lg bg-surface-elevated hover:bg-surface text-xs font-semibold border border-border cursor-pointer">
                  Write Technical Blog
                </button>
                <button onClick={() => setActiveTab("leads")} className="px-4 py-2.5 rounded-lg bg-surface-elevated hover:bg-surface text-xs font-semibold border border-border cursor-pointer">
                  Track Leads ({leads.length})
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            TAB 2: PROJECT CASE STUDIES
            ========================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-2xl border border-border">
              <div className="flex-1 relative flex items-center">
                <Search className="w-4 h-4 text-foreground-muted absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search case studies by title or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 pl-10 pr-4 text-xs placeholder-foreground-muted text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-foreground-muted" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-background border border-border/80 rounded-xl px-4 py-2.5 text-xs text-foreground outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="p-16 border border-dashed border-border rounded-2xl text-center space-y-3">
                <span className="text-xs font-mono text-foreground-muted block">NO MATCHES FOUND</span>
                <p className="text-xs text-foreground-secondary font-sans">Modify filters or click Create Case Study above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((p) => (
                  <div key={p.id} className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-6 relative overflow-hidden group">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider">{p.category}</span>
                          <h4 className="text-base font-semibold font-display text-foreground group-hover:text-accent transition-colors mt-1">{p.title}</h4>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          p.status === "published" ? "bg-success/15 border-success/30 text-success" : "bg-primary/10 border-primary/20 text-primary"
                        }`}>
                          {p.status === "published" ? "Live" : "Draft"}
                        </span>
                      </div>

                      <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed">{p.description}</p>

                      {p.techStack && p.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.techStack.map((tech, i) => (
                            <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 bg-surface-elevated border border-border/60 text-foreground-secondary rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                      <span className="text-[10px] font-mono text-foreground-muted">Sequence: {p.order}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openProjectForm(p)}
                          className="p-2 bg-surface hover:bg-surface-elevated text-foreground-secondary hover:text-accent border border-border rounded-lg transition-all cursor-pointer"
                          title="Edit Parameters"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="p-2 bg-surface hover:bg-error/15 text-foreground-secondary hover:text-error border border-border hover:border-error/20 rounded-lg transition-all cursor-pointer"
                          title="Permanently Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            TAB 3: BLOGS MANAGEMENT
            ========================================== */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-2xl border border-border">
              <div className="flex-1 relative flex items-center">
                <Search className="w-4 h-4 text-foreground-muted absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search technical blogs by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 pl-10 pr-4 text-xs placeholder-foreground-muted text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
            </div>

            {/* Blogs Table/List */}
            {filteredBlogs.length === 0 ? (
              <div className="p-16 border border-dashed border-border rounded-2xl text-center space-y-3">
                <span className="text-xs font-mono text-foreground-muted block">NO INSIGHTS PUBLISHED</span>
                <p className="text-xs text-foreground-secondary font-sans">Write your first technical piece or change filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredBlogs.map((b) => (
                  <div key={b.id} className="p-5 rounded-2xl bg-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-border-subtle transition-all">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider">{b.category}</span>
                        <span className="text-foreground-muted">•</span>
                        <span className="text-[10px] font-mono text-foreground-muted">{b.date}</span>
                      </div>
                      <h4 className="text-base font-semibold text-foreground">{b.title}</h4>
                      <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed">{b.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`text-[9px] font-mono px-2.5 py-1 rounded-full border ${
                        b.status === "published" ? "bg-success/15 border-success/30 text-success" : "bg-primary/10 border-primary/20 text-primary"
                      }`}>
                        {b.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openBlogForm(b)}
                          className="p-2.5 bg-surface hover:bg-surface-elevated text-foreground-secondary hover:text-accent border border-border rounded-xl transition-all cursor-pointer"
                          title="Edit Blog"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBlog(b.id)}
                          className="p-2.5 bg-surface hover:bg-error/15 text-foreground-secondary hover:text-error border border-border hover:border-error/20 rounded-xl transition-all cursor-pointer"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            TAB 4: TESTIMONIALS LEDGER
            ========================================== */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            
            {/* Testimonials List */}
            {filteredTestimonials.length === 0 ? (
              <div className="p-16 border border-dashed border-border rounded-2xl text-center space-y-3">
                <span className="text-xs font-mono text-foreground-muted block">NO REVIEWS LOADED</span>
                <p className="text-xs text-foreground-secondary font-sans">Add reviews from the top right button.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredTestimonials.map((t) => (
                  <div key={t.id} className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${t.avatarColor || 'bg-primary'} text-white flex items-center justify-center font-bold font-mono`}>
                          {t.avatar || t.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                          <p className="text-[10px] text-foreground-muted font-sans mt-0.5">{t.role} • {t.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          t.status === "published" ? "bg-success/15 border-success/30 text-success" : "bg-primary/10 border-primary/20 text-primary"
                        }`}>
                          {t.status}
                        </span>
                        <button
                          onClick={() => openTestimonialForm(t)}
                          className="p-2 bg-surface hover:bg-surface-elevated text-foreground-secondary border border-border rounded-lg cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteTestimonial(t.id)}
                          className="p-2 bg-surface hover:bg-error/15 text-foreground-secondary hover:text-error border border-border rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-accent">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                      ))}
                    </div>

                    <p className="text-xs text-foreground-secondary italic font-sans leading-relaxed">
                      "{t.content}"
                    </p>

                    {t.outcome && (
                      <div className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg w-max">
                        OUTCOME: {t.outcome}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            TAB 5: LEADS TRACKING ROOM
            ========================================== */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            
            {/* Search leads */}
            <div className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-2xl border border-border">
              <div className="flex-1 relative flex items-center">
                <Search className="w-4 h-4 text-foreground-muted absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search client leads by service or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-xl py-2.5 pl-10 pr-4 text-xs placeholder-foreground-muted text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
            </div>

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
              <div className="p-16 border border-dashed border-border rounded-2xl text-center space-y-3">
                <span className="text-xs font-mono text-foreground-muted block">NO INBOUND LEADS LOGGED</span>
                <p className="text-xs text-foreground-secondary font-sans">Leads will populate automatically here when visitors complete project scoping requests.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredLeads.map((l) => (
                  <div key={l.id} className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-start justify-between border-b border-border/50 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{l.id}</span>
                          <span className="text-[10px] font-mono text-foreground-muted">{l.date}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-accent font-mono mt-1">{l.service}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changeLeadStatus(l.id, l.status)}
                          className={`text-[10px] font-mono px-3 py-1.5 rounded-full border cursor-pointer font-bold transition-all ${
                            l.status === "new" ? "bg-accent/15 border-accent/20 text-accent hover:bg-accent/25" :
                            l.status === "contacted" ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" :
                            l.status === "qualified" ? "bg-success/15 border-success/20 text-success hover:bg-success/25" :
                            "bg-foreground-muted/15 border-border text-foreground-secondary hover:bg-foreground-muted/25"
                          }`}
                          title="Click to toggle status"
                        >
                          STATUS: {l.status.toUpperCase()}
                        </button>
                        <button
                          onClick={() => deleteLead(l.id)}
                          className="p-2 bg-surface hover:bg-error/15 border border-border hover:border-error/20 rounded-lg text-foreground-muted hover:text-error cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="space-y-0.5">
                        <span className="text-foreground-muted text-[10px]">VISITOR CONTACT</span>
                        <span className="text-foreground font-bold block">{l.email}</span>
                        {l.phone && <span className="text-foreground-secondary block">{l.phone}</span>}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-foreground-muted text-[10px]">PROJECT BUDGET</span>
                        <span className="text-foreground font-bold block">{l.budget}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-foreground-muted text-[10px]">REQUESTED TIMELINE</span>
                        <span className="text-foreground font-bold block">{l.timeline}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/80 text-xs text-foreground-secondary space-y-1">
                      <span className="text-foreground-muted font-mono text-[9px] block">PROJECT DESCRIPTION</span>
                      <p className="font-sans leading-relaxed">"{l.description}"</p>
                    </div>

                    {l.recommendedStack && l.recommendedStack.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-foreground-muted font-mono text-[9px] block">DYNAMIC GENERATED ARCHITECTURE RECOMMENDATIONS</span>
                        <div className="flex flex-wrap gap-1.5">
                          {l.recommendedStack.map((tech, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-surface-elevated border border-border/80 text-accent rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            TAB 6: DISCOVERY BOOKINGS
            ========================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            
            {/* List Bookings */}
            {filteredBookings.length === 0 ? (
              <div className="p-16 border border-dashed border-border rounded-2xl text-center space-y-3">
                <span className="text-xs font-mono text-foreground-muted block">NO CALLS BOOKED</span>
                <p className="text-xs text-foreground-secondary font-sans">Calls requested via the global CTA segment appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="p-6 rounded-2xl bg-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-border-subtle transition-all">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-accent">{b.id}</span>
                        <span className="text-foreground-muted">•</span>
                        <span className="text-xs font-semibold text-foreground">{b.name}</span>
                        {b.company && (
                          <>
                            <span className="text-foreground-muted">•</span>
                            <span className="text-xs text-foreground-secondary font-sans">{b.company}</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-foreground-secondary">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" /> {b.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-accent" /> {b.timeSlot} ({b.timezone})
                        </span>
                        <span className="text-foreground-muted">Email: {b.email}</span>
                      </div>

                      {b.description && (
                        <p className="text-xs text-foreground-muted font-sans border-l border-border pl-3 italic">
                          "{b.description}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <button
                        onClick={() => changeBookingStatus(b.id, b.status)}
                        className={`text-[10px] font-mono px-3 py-1.5 rounded-full border cursor-pointer font-bold transition-all ${
                          b.status === "scheduled" ? "bg-accent/15 border-accent/20 text-accent hover:bg-accent/25" :
                          b.status === "completed" ? "bg-success/15 border-success/20 text-success hover:bg-success/25" :
                          "bg-foreground-muted/15 border-border text-foreground-secondary hover:bg-foreground-muted/25"
                        }`}
                        title="Click to toggle status"
                      >
                        {b.status.toUpperCase()}
                      </button>
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="p-2.5 bg-surface hover:bg-error/15 border border-border hover:border-error/20 rounded-xl text-foreground-muted hover:text-error transition-all cursor-pointer"
                        title="Delete Session Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* ==========================================
          MODAL 1: CREATE/EDIT PROJECT CASE STUDY
          ========================================== */}
      {isProjectFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto font-sans">
          <div className="w-full max-w-4xl bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-8 relative">
            
            <header className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-elevated/40 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-wider block">
                  {editingProject ? "UPDATE CASE RECORD" : "ESTABLISH NEW CASE RECORD"}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {editingProject ? "Modify Case Study Parameters" : "Launch New Case Study Module"}
                </h3>
              </div>
              <button onClick={() => setIsProjectFormOpen(false)} className="p-2 rounded-lg hover:bg-surface border border-border text-foreground-secondary hover:text-foreground cursor-pointer">
                ×
              </button>
            </header>

            <form onSubmit={saveProject} className="p-6 overflow-y-auto space-y-6">
              
              {/* Core fields info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">PROJECT TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Autonomous Routing Agentic Workflow"
                    value={projTitle}
                    onChange={(e) => handleProjTitleChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted text-xs focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">URL SLUG ROUTE PATH</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., autonomous-routing-agent"
                    value={projSlug}
                    onChange={(e) => setProjSlug(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">SERVICE CATEGORY</label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none cursor-pointer"
                  >
                    <option value="AI Platforms">AI Platforms</option>
                    <option value="AI Engineering">AI Engineering</option>
                    <option value="Full-Stack Engineering">Full-Stack Engineering</option>
                    <option value="SaaS Architecture">SaaS Architecture</option>
                    <option value="Fintech SaaS">Fintech SaaS</option>
                    <option value="DevOps & Kubernetes">DevOps & Kubernetes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">CLIENT PARTNER NAME</label>
                  <input
                    type="text"
                    placeholder="e.g., Synthetix Inc."
                    value={projClient}
                    onChange={(e) => setProjClient(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">INDUSTRY SECTOR</label>
                  <input
                    type="text"
                    placeholder="e.g., Supply Chain & Logistics"
                    value={projIndustry}
                    onChange={(e) => setProjIndustry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                </div>
              </div>

              {/* Short description */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">EXCERPT SHORT DESCRIPTION</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize the project outcome in 1-2 powerful sentences..."
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted text-xs focus:border-accent outline-none resize-none font-sans"
                />
              </div>

              {/* Deep Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">1. BUSINESS PROBLEM CHASM</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the operational complexity, performance bottlenecks, or business challenge that was present before FENORA."
                    value={projProblem}
                    onChange={(e) => setProjProblem(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted text-xs focus:border-accent outline-none font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">2. FENORA TECHNICAL SOLUTION</label>
                  <textarea
                    rows={4}
                    placeholder="Detail the technical architecture, custom algorithms, APIs, database strategies, or agent orchestration models built by FENORA."
                    value={projSolution}
                    onChange={(e) => setProjSolution(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted text-xs focus:border-accent outline-none font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">3. QUANTIFIABLE OUTCOME</label>
                  <textarea
                    rows={4}
                    placeholder="Enumerate the measurable impact: server speed metrics, security benchmarks, dollars saved, or operational efficiencies achieved."
                    value={projOutcome}
                    onChange={(e) => setProjOutcome(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted text-xs focus:border-accent outline-none font-sans"
                  />
                </div>
              </div>

              {/* Cover Image Upload (With Drag and Drop) */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">COVER HERO LANDING IMAGE URL</label>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={projCoverImage}
                    onChange={(e) => setProjCoverImage(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={(e) => handleDrop(e, "project")}
                    className={`px-5 py-3 border border-dashed rounded-xl flex items-center justify-center gap-2 text-xs font-semibold select-none cursor-pointer relative transition-all min-w-[200px] ${
                      dragActive ? "border-accent bg-accent/10" : "border-border hover:border-border-subtle"
                    }`}
                  >
                    <Upload className="w-4 h-4 text-foreground-muted" />
                    <span>{uploading ? "Uploading..." : "Drag Cover File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileInput(e, "project")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Tech Stack string */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">TECH STACK INTEGRATIONS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Express, Google Gemini, pgvector, Docker, GCP"
                  value={projTechStack}
                  onChange={(e) => setProjTechStack(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                />
              </div>

              {/* Dynamic metrics block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-1">
                  <span className="text-[10px] font-mono uppercase text-foreground-muted font-bold">KEY QUANTIFIABLE METRICS</span>
                  <button
                    type="button"
                    onClick={() => setProjMetrics([...projMetrics, { label: "", value: "" }])}
                    className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    + Add Metric
                  </button>
                </div>
                <div className="space-y-2">
                  {projMetrics.map((met, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <input
                        type="text"
                        placeholder="Label (e.g. Latency Decrease)"
                        value={met.label}
                        onChange={(e) => updateMetric(idx, "label", e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 42%)"
                        value={met.value}
                        onChange={(e) => updateMetric(idx, "value", e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setProjMetrics(projMetrics.filter((_, i) => i !== idx))}
                        className="p-3 hover:bg-error/15 border border-border rounded-xl text-foreground-muted hover:text-error transition-all cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sequencing and extra details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-border/40 font-mono">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-foreground-muted font-bold block">Sequence Weight</label>
                  <input
                    type="number"
                    min={1}
                    value={projOrder}
                    onChange={(e) => setProjOrder(Number(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-foreground-muted font-bold block">Grad styling map</label>
                  <select
                    value={projColor}
                    onChange={(e) => setProjColor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs"
                  >
                    <option value="from-primary to-accent">Cobalt to Cyan</option>
                    <option value="from-accent to-foreground">Cyan to White</option>
                    <option value="from-foreground to-foreground-muted">Slate to Matte Silver</option>
                    <option value="from-primary to-foreground">Cobalt to White</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-foreground-muted font-bold block">Status Option</label>
                  <select
                    value={projStatus}
                    onChange={(e) => setProjStatus(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs"
                  >
                    <option value="draft">📁 Draft (Hidden)</option>
                    <option value="published">🚀 Published (Live)</option>
                  </select>
                </div>
                <div className="space-y-2 flex items-center justify-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs">
                    <input
                      type="checkbox"
                      checked={projFeatured}
                      onChange={(e) => setProjFeatured(e.target.checked)}
                      className="w-4 h-4 text-accent border-border rounded"
                    />
                    <span>Featured Hero Case</span>
                  </label>
                </div>
              </div>

              {/* Submit panel */}
              <div className="border-t border-border pt-6 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProjectFormOpen(false)}
                  className="px-6 py-3.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-foreground font-semibold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/25"
                >
                  Save Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: CREATE/EDIT BLOG POST
          ========================================== */}
      {isBlogFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto font-sans">
          <div className="w-full max-w-4xl bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-8 relative">
            
            <header className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-elevated/40 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-wider block">
                  {editingBlog ? "UPDATE BLOG" : "WRITE NEW BLOG"}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {editingBlog ? "Edit Technical Insight" : "Publish Technical Insight Article"}
                </h3>
              </div>
              <button onClick={() => setIsBlogFormOpen(false)} className="p-2 rounded-lg hover:bg-surface border border-border text-foreground-secondary hover:text-foreground cursor-pointer">
                ×
              </button>
            </header>

            <form onSubmit={saveBlog} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">BLOG TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scaling Kubernetes To Zero With Knative"
                    value={blogTitle}
                    onChange={(e) => handleBlogTitleChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted text-xs focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">URL SLUG ROUTE PATH</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. scaling-kubernetes-to-zero"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">CATEGORY</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Engineering"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">AUTHOR</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal Architect"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">READ TIME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 min read"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">EXCERPT SUMMARY</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Give a short 1-sentence hook summarizing this article..."
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none resize-none font-sans"
                />
              </div>

              {/* Cover Image Upload (With Drag and Drop) */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">BLOG HERO IMAGE URL</label>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={blogCover}
                    onChange={(e) => setBlogCover(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={(e) => handleDrop(e, "blog")}
                    className={`px-5 py-3 border border-dashed rounded-xl flex items-center justify-center gap-2 text-xs font-semibold select-none cursor-pointer relative transition-all min-w-[200px] ${
                      dragActive ? "border-accent bg-accent/10" : "border-border hover:border-border-subtle"
                    }`}
                  >
                    <Upload className="w-4 h-4 text-foreground-muted" />
                    <span>{uploading ? "Uploading..." : "Drag File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileInput(e, "blog")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">CONTENT BODY (MARKDOWN SUPPORTED)</label>
                <textarea
                  rows={10}
                  required
                  placeholder="# Enter your markdown content here..."
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted text-xs focus:border-accent outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40 font-mono">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-foreground-muted font-bold block">Catalog Status</label>
                  <select
                    value={blogStatus}
                    onChange={(e) => setBlogStatus(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs"
                  >
                    <option value="draft">📁 Draft (Hidden)</option>
                    <option value="published">🚀 Published (Live)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-border pt-6 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsBlogFormOpen(false)}
                  className="px-6 py-3.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-foreground font-semibold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/25"
                >
                  Save Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: CREATE/EDIT TESTIMONIAL
          ========================================== */}
      {isTestimonialFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto font-sans">
          <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-8 relative">
            
            <header className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-elevated/40 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-wider block">
                  {editingTestimonial ? "UPDATE TESTIMONIAL" : "ADD VERIFIED TESTIMONIAL"}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {editingTestimonial ? "Edit Review Details" : "Record Verified Partner Review"}
                </h3>
              </div>
              <button onClick={() => setIsTestimonialFormOpen(false)} className="p-2 rounded-lg hover:bg-surface border border-border text-foreground-secondary hover:text-foreground cursor-pointer">
                ×
              </button>
            </header>

            <form onSubmit={saveTestimonial} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted text-xs focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">ROLE / POSITION</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VP of Engineering"
                    value={testRole}
                    onChange={(e) => setTestRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">COMPANY NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Synthetix Corp"
                    value={testCompany}
                    onChange={(e) => setTestCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">RATING STARS</label>
                  <select
                    value={testRating}
                    onChange={(e) => setTestRating(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none cursor-pointer"
                  >
                    <option value={5}>⭐️⭐️⭐️⭐️⭐️ (5/5)</option>
                    <option value={4}>⭐️⭐️⭐️⭐️ (4/5)</option>
                    <option value={3}>⭐️⭐️⭐️ (3/5)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">TESTIMONIAL VERBATIM CONTENT</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Insert verified client quote here..."
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">QUANTIFIABLE OUTCOME HOOK</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Latency reduced by 42%"
                  value={testOutcome}
                  onChange={(e) => setTestOutcome(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40 font-mono">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-foreground-muted font-bold block">Catalog Status</label>
                  <select
                    value={testStatus}
                    onChange={(e) => setTestStatus(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-xs"
                  >
                    <option value="draft">📁 Draft (Hidden)</option>
                    <option value="published">🚀 Published (Live)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-border pt-6 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTestimonialFormOpen(false)}
                  className="px-6 py-3.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-foreground font-semibold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/25"
                >
                  Save Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
