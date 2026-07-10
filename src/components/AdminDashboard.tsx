import React, { useEffect, useState } from "react";
import { 
  Plus, Edit2, Trash2, Search, Filter, Sparkles, CheckCircle2, Eye, EyeOff, 
  ArrowUp, ArrowDown, Upload, Trash, Database, Globe, Key, RefreshCw, 
  ArrowLeft, Terminal, Check, Info, FileText
} from "lucide-react";
import { Project } from "../types";

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [projects, setProjects] = useState<Project[]>(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Authentication Passcode State
  const [passcode, setPasscode] = useState(() => localStorage.getItem("fenora_admin_passcode") || "fenora2026");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Filter/Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "published" | "draft">("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Storage Diagnostics Mode (From Backend API)
  const [dbMode, setDbMode] = useState<string>("local-filesystem");

  // Form Fields State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("AI Platforms");
  const [description, setDescription] = useState("");
  const [businessProblem, setBusinessProblem] = useState("");
  const [technicalSolution, setTechnicalSolution] = useState("");
  const [businessOutcome, setBusinessOutcome] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([
    { label: "", value: "" }
  ]);
  const [coverImage, setCoverImage] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [order, setOrder] = useState(1);
  const [color, setColor] = useState("from-primary to-accent");
  const [imageAccent, setImageAccent] = useState("rgba(0, 102, 255, 0.2)");

  // Asset Uploading state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Verify Passcode / Check Health on mount
  useEffect(() => {
    checkHealth();
  }, [passcode]);

  async function checkHealth() {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setDbMode(data.mode);
      
      // Attempt to load projects with the configured passcode
      await fetchProjects();
      setIsUnlocked(true);
      setPasscodeError(null);
    } catch (err: any) {
      if (err.status === 401) {
        setIsUnlocked(false);
        setPasscodeError("Invalid admin access passcode. Please input correct passcode.");
      } else {
        // Simple fallback
        setIsUnlocked(true);
      }
    }
  }

  async function fetchProjects() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/projects?includeDrafts=true");
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to load portfolio database.");
      }
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        setIsUnlocked(false);
      } else {
        setError(err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle Passcode Submission
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    localStorage.setItem("fenora_admin_passcode", passcode);
    checkHealth();
  };

  // Helper: auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProject) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  };

  // Form Multi-metric Row Helpers
  const addMetricRow = () => {
    setMetrics(prev => [...prev, { label: "", value: "" }]);
  };

  const removeMetricRow = (idx: number) => {
    setMetrics(prev => prev.filter((_, i) => i !== idx));
  };

  const updateMetricRow = (idx: number, field: "label" | "value", val: string) => {
    setMetrics(prev => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };

  // Populate form for editing or opening new
  const openForm = (proj: Project | null = null) => {
    if (proj) {
      setEditingProject(proj);
      setTitle(proj.title);
      setSlug(proj.slug);
      setCategory(proj.category);
      setDescription(proj.description);
      setBusinessProblem(proj.businessProblem);
      setTechnicalSolution(proj.technicalSolution);
      setBusinessOutcome(proj.businessOutcome);
      setTechStackInput(proj.techStack.join(", "));
      setMetrics(proj.metrics && proj.metrics.length > 0 ? proj.metrics : [{ label: "", value: "" }]);
      setCoverImage(proj.coverImage || "");
      setProjectUrl(proj.projectUrl || "");
      setGithubUrl(proj.githubUrl || "");
      setClientName(proj.clientName || "");
      setIndustry(proj.industry || "");
      setStartDate(proj.startDate || "");
      setCompletionDate(proj.completionDate || "");
      setFeatured(proj.featured);
      setStatus(proj.status);
      setOrder(proj.order);
      setColor(proj.color || "from-primary to-accent");
      setImageAccent(proj.imageAccent || "rgba(0, 102, 255, 0.2)");
    } else {
      setEditingProject(null);
      setTitle("");
      setSlug("");
      setCategory("AI Platforms");
      setDescription("");
      setBusinessProblem("");
      setTechnicalSolution("");
      setBusinessOutcome("");
      setTechStackInput("");
      setMetrics([{ label: "", value: "" }]);
      setCoverImage("");
      setProjectUrl("");
      setGithubUrl("");
      setClientName("");
      setIndustry("");
      setStartDate("");
      setCompletionDate("");
      setFeatured(false);
      setStatus("draft");
      setOrder((projects?.length || 0) + 1);
      setColor("from-primary to-accent");
      setImageAccent("rgba(0, 102, 255, 0.2)");
    }
    setUploadError(null);
    setIsFormOpen(true);
  };

  // Image Upload File Handlers
  const handleImageFile = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);
      
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-passcode": passcode
        },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "File upload failed.");
      }

      const data = await res.json();
      setCoverImage(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to process image upload.");
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Save (Create or Update) Project Handler
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;

    const payload = {
      title,
      slug,
      category,
      description,
      businessProblem,
      technicalSolution,
      businessOutcome,
      techStack: techStackInput.split(",").map(t => t.trim()).filter(Boolean),
      metrics: metrics.filter(m => m.label && m.value),
      coverImage,
      projectUrl,
      githubUrl,
      clientName,
      industry,
      startDate,
      completionDate,
      featured,
      status,
      order: Number(order) || 1,
      color,
      imageAccent
    };

    try {
      const url = editingProject 
        ? `/api/projects/${editingProject.id}` 
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save project.");
      }

      setIsFormOpen(false);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "An error occurred while saving.");
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the case study "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-passcode": passcode
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete project");
      }

      fetchProjects();
    } catch (err: any) {
      alert(err.message || "An error occurred during deletion.");
    }
  };

  // Project Order Swap / Bubble Helpers
  const adjustOrder = async (proj: Project, direction: "up" | "down") => {
    const sorted = [...projects].sort((a, b) => a.order - b.order);
    const currIndex = sorted.findIndex(p => p.id === proj.id);
    if (currIndex === -1) return;

    let targetIndex = direction === "up" ? currIndex - 1 : currIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return; // boundary out

    const targetProj = sorted[targetIndex];

    // Swap ordering numbers
    const tempOrder = proj.order;
    
    try {
      // Perform batch update on backend
      await fetch(`/api/projects/${proj.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode
        },
        body: JSON.stringify({ order: targetProj.order })
      });

      await fetch(`/api/projects/${targetProj.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode
        },
        body: JSON.stringify({ order: tempOrder })
      });

      fetchProjects();
    } catch (err) {
      console.error("Order modification error:", err);
    }
  };

  // Filtering Logic on display
  const filteredList = projects ? projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }) : [];

  // Categories list built dynamically plus defaults
  const categoriesList = projects 
    ? ["All", ...Array.from(new Set(projects.map(p => p.category)))]
    : ["All", "AI Platforms", "Fintech SaaS", "Enterprise Cloud"];

  // Locked Login View
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-sans">
        <div className="absolute inset-0 bg-radial-glow opacity-25 pointer-events-none" />
        
        <div className="w-full max-w-md glass-panel border border-border p-8 rounded-3xl relative z-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Admin Console</h2>
            <p className="text-xs text-foreground-secondary font-mono tracking-wider">FENORA TECHNOLOGIES PORTFOLIO</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-foreground-muted block uppercase">
                Access Authorization Key
              </label>
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-elevated/40 border border-border text-foreground font-mono text-sm focus:outline-none focus:border-accent text-center"
              />
            </div>

            {passcodeError && (
              <p className="text-xs text-destructive text-center font-semibold bg-destructive/10 border border-destructive/20 py-2 rounded-lg">
                {passcodeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/20"
            >
              Verify & Authorize
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate("/")}
              className="text-xs font-mono text-foreground-muted hover:text-foreground transition-colors flex items-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-28 pb-24 relative" id="admin-dashboard-container">
      {/* Glow Backdrops */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-border pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate("/")}
                className="p-2 rounded-lg bg-surface border border-border hover:bg-surface-elevated transition-colors text-foreground-muted hover:text-foreground cursor-pointer"
                title="Return to Main Website"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
                FENORA PORTFOLIO SYSTEM
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Case Study Manager
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={checkHealth}
              className="p-3.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated transition-all flex items-center gap-2 text-xs font-mono font-semibold text-foreground-secondary cursor-pointer"
              title="Refresh DB connection"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Synchronize
            </button>
            <button
              onClick={() => openForm(null)}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Case Study
            </button>
          </div>
        </div>

        {/* Diagnostic Status Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Status Panel (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold font-display flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" /> System Connection Diagnostics
                </h4>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  FENORA utilizes a dual adaptive database configuration. Changes sync immediately to client modules.
                </p>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                dbMode === "supabase" 
                  ? "bg-success/10 border-success/20 text-success" 
                  : "bg-primary/10 border-primary/20 text-primary"
              }`}>
                <Database className="w-3 h-3" /> {dbMode === "supabase" ? "SUPABASE ACTIVE" : "LOCAL SQLITE/JSON"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 text-xs space-y-1 font-mono">
                <span className="text-foreground-muted block text-[10px]">DATABASE ENGINE</span>
                <span className="text-foreground font-bold">{dbMode === "supabase" ? "PostgreSQL (Cloud)" : "FS Database (Write)"}</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 text-xs space-y-1 font-mono">
                <span className="text-foreground-muted block text-[10px]">ASSET STORAGE CONTAINER</span>
                <span className="text-foreground font-bold">{dbMode === "supabase" ? "Supabase Object Bucket" : "/data/uploads (Server)"}</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 text-xs space-y-1 font-mono">
                <span className="text-foreground-muted block text-[10px]">SITEMAP ROUTE</span>
                <span className="text-foreground font-bold flex items-center gap-1 text-success">
                  <Check className="w-3 h-3" /> /sitemap.xml (Online)
                </span>
              </div>
            </div>
          </div>

          {/* Quick instructions (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-surface border border-border space-y-4 text-xs">
            <h4 className="font-mono font-bold tracking-wider text-foreground-secondary uppercase flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary" /> Schema Setup Help
            </h4>
            <p className="text-foreground-secondary leading-relaxed font-sans">
              Moving portfolio database records to high-availability Supabase is fully supported. View the schema definitions inside the repository:
            </p>
            <div className="flex gap-2 font-mono">
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                className="flex items-center gap-1 text-accent hover:underline font-bold"
              >
                <Globe className="w-3.5 h-3.5" /> Live Sitemap
              </a>
              <span className="text-border">|</span>
              <span className="text-foreground-muted font-bold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> supabase-schema.sql
              </span>
            </div>
          </div>

        </div>

        {/* Database table filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-surface border border-border rounded-2xl mb-8">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search case studies by title, stacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated/20 border border-border text-xs focus:outline-none focus:border-accent text-foreground"
            />
          </div>

          {/* Direct filter controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-foreground-muted">
              <Filter className="w-3.5 h-3.5" /> Filter Status:
            </div>

            <div className="flex bg-surface-elevated/50 p-1 border border-border rounded-xl">
              {(["All", "published", "draft"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-foreground text-background"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-foreground-secondary focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categoriesList.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Portfolio Table Catalog */}
        {loading ? (
          <div className="text-center py-24 space-y-4">
            <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto" />
            <p className="text-xs font-mono text-foreground-muted uppercase tracking-widest">Loading Projects Registry...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl space-y-4">
            <Database className="w-10 h-10 text-foreground-muted mx-auto" />
            <h3 className="text-lg font-display font-bold">No Case Studies Found</h3>
            <p className="text-xs text-foreground-secondary max-w-sm mx-auto leading-relaxed">
              No portfolio projects match your active search terms or filter constraints. Create a new project to get started!
            </p>
            <button
              onClick={() => openForm(null)}
              className="px-4 py-2 rounded-lg bg-surface border border-border text-foreground hover:bg-surface-elevated text-xs font-mono font-bold cursor-pointer"
            >
              Add New Project
            </button>
          </div>
        ) : (
          <div className="glass-panel border border-border rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px] text-xs font-mono">
                <thead>
                  <tr className="bg-surface border-b border-border/80 text-foreground-muted uppercase text-[10px] tracking-wider font-bold">
                    <th className="p-4 w-12 text-center">Seq</th>
                    <th className="p-4">Project Summary</th>
                    <th className="p-4">Industry / Client</th>
                    <th className="p-4">Key Metrics</th>
                    <th className="p-4 w-28 text-center">Status</th>
                    <th className="p-4 w-28 text-center">Featured</th>
                    <th className="p-4 w-40 text-center">Modify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredList.map((proj, idx) => (
                    <tr key={proj.id} className="hover:bg-surface-elevated/15 transition-colors group">
                      {/* Seq Reordering column */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => adjustOrder(proj, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded text-foreground-muted hover:text-accent hover:bg-surface-elevated disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <span className="text-foreground font-semibold text-xs leading-none">
                            {proj.order}
                          </span>
                          <button
                            onClick={() => adjustOrder(proj, "down")}
                            disabled={idx === filteredList.length - 1}
                            className="p-1 rounded text-foreground-muted hover:text-accent hover:bg-surface-elevated disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Project info summary */}
                      <td className="p-4 space-y-1.5">
                        <div className="flex items-center gap-2">
                          {proj.coverImage && (
                            <img
                              src={proj.coverImage}
                              alt=""
                              className="w-10 h-7 rounded object-cover border border-border"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <span className="text-foreground font-bold text-sm block group-hover:text-accent transition-colors">
                              {proj.title}
                            </span>
                            <span className="text-[10px] text-foreground-secondary bg-surface-elevated border border-border px-2 py-0.5 rounded">
                              {proj.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-foreground-muted line-clamp-1 block max-w-sm">
                          {proj.description}
                        </span>
                      </td>

                      {/* Client / industry */}
                      <td className="p-4 text-xs space-y-1">
                        <div className="text-foreground font-bold">{proj.clientName || "—"}</div>
                        <div className="text-foreground-secondary">{proj.industry || "—"}</div>
                      </td>

                      {/* Metrics checklist */}
                      <td className="p-4 text-[10px] space-y-1">
                        {proj.metrics && proj.metrics.slice(0, 2).map((m, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="text-accent font-bold">{m.value}</span>
                            <span className="text-foreground-muted">{m.label}</span>
                          </div>
                        ))}
                        {proj.metrics && proj.metrics.length > 2 && (
                          <span className="text-[9px] text-foreground-muted block">+ {proj.metrics.length - 2} more</span>
                        )}
                      </td>

                      {/* Status toggle tag */}
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${
                          proj.status === "published"
                            ? "bg-success/10 border-success/20 text-success"
                            : "bg-warning/10 border-warning/20 text-warning"
                        }`}>
                          {proj.status}
                        </span>
                      </td>

                      {/* Featured toggle display */}
                      <td className="p-4 text-center">
                        {proj.featured ? (
                          <CheckCircle2 className="w-5 h-5 text-accent mx-auto" />
                        ) : (
                          <span className="text-foreground-muted">—</span>
                        )}
                      </td>

                      {/* CRUD Modifiers */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onNavigate(`/projects/${proj.slug}`)}
                            className="p-2 rounded-lg bg-surface border border-border text-foreground-secondary hover:text-foreground hover:border-border-subtle transition-colors cursor-pointer"
                            title="Preview Case Study"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openForm(proj)}
                            className="p-2 rounded-lg bg-surface border border-border text-foreground-secondary hover:text-accent hover:border-accent/30 transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            className="p-2 rounded-lg bg-surface border border-border text-foreground-secondary hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* FORM DIALOG POPUP MODAL (Fullscreen Overlay) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 overflow-y-auto p-4 md:p-8 font-sans flex justify-center items-start">
          <div className="w-full max-w-4xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden my-4 relative">
            
            {/* Modal header */}
            <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-surface-elevated/30">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block">
                  {editingProject ? `02 // EDIT CASE RECORD #${editingProject.id}` : "01 // CONSTRUCT NEW PORTFOLIO RECORD"}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                  {editingProject ? "Update Case Study Parameters" : "Draft New Case Study"}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated transition-colors text-foreground cursor-pointer"
              >
                ✕ Close Panel
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleSaveProject} className="p-6 md:p-8 space-y-8 text-xs font-sans">
              
              {/* Row 1: Title, Slug, Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Synthetix AI"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-sans font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    URL Slug (Unique / Auto-gen) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., synthetix-ai"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground font-mono focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Project Domain Type *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-sans"
                  >
                    <option value="AI Platforms">AI Platforms</option>
                    <option value="Fintech SaaS">Fintech SaaS</option>
                    <option value="Enterprise Cloud">Enterprise Cloud</option>
                    <option value="Custom Software">Custom Software</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Short Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                  Short Description (Meta Outline) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="A brief high-level punchy sentence describing the core outcome..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-sans"
                />
              </div>

              {/* Row 3: Narrative Triad (Problem, Solution, Business Outcome) */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase font-bold text-accent tracking-widest border-b border-border/60 pb-1">
                  CASE STUDY ANALYSIS BLOCKS
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                      01 // Business Problem (Challenge) *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="What legacy issue or system bottleneck did the client encounter? What metrics were slipping?..."
                      value={businessProblem}
                      onChange={(e) => setBusinessProblem(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs leading-relaxed font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                      02 // Technical Solution (Designed Solution) *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="What tech architecture was deployed? Detail SDK, latency caching layers, containerized pipelines..."
                      value={technicalSolution}
                      onChange={(e) => setTechnicalSolution(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs leading-relaxed font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                      03 // Strategic Business Outcomes (Business Impact) *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How did the design resolve the challenge? List percentages, revenue growth, or team efficiency boosts..."
                      value={businessOutcome}
                      onChange={(e) => setBusinessOutcome(e.target.value)}
                      className="w-full p-4 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Client and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Client Legal Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Synthetix Logistics Corp"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Target Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Logistics & Supply Chain"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Initiation Date (YYYY-MM)
                  </label>
                  <input
                    type="month"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Completion Date (YYYY-MM)
                  </label>
                  <input
                    type="month"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-mono"
                  />
                </div>
              </div>

              {/* Row 5: Technologies & External URLs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Technologies Used (Comma Separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Gemini API, React, Express, Docker"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Live Project Application URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://client-product.com"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    GitHub Repository Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/org/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-mono"
                  />
                </div>
              </div>

              {/* Row 6: Image Uploader Drag & Drop */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                  Project Cover Image Ingestion *
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* File Upload Zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`md:col-span-8 p-6 border-2 border-dashed rounded-2xl text-center space-y-3 transition-colors ${
                      dragActive ? "border-accent bg-accent/5" : "border-border hover:border-border-subtle"
                    } relative`}
                  >
                    <Upload className="w-8 h-8 text-foreground-secondary mx-auto animate-pulse" />
                    <div>
                      <p className="font-semibold text-xs text-foreground">
                        Drag and drop your cover image here, or
                      </p>
                      <label className="text-accent underline font-bold cursor-pointer text-xs mt-1 block">
                        browse system files
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[9px] text-foreground-muted">
                      Supports PNG, JPEG, WEBP or SVG up to 10MB. Automatically mirrored.
                    </p>

                    {uploading && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-2 rounded-2xl">
                        <RefreshCw className="w-6 h-6 text-accent animate-spin" />
                        <span className="text-[10px] font-mono text-foreground font-bold">Uploading to {dbMode}...</span>
                      </div>
                    )}
                  </div>

                  {/* Manual URL entry fallback */}
                  <div className="md:col-span-4 space-y-4 bg-surface-elevated/35 p-4 rounded-2xl border border-border">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono uppercase text-foreground-secondary block font-bold">
                        Manual Cover URL
                      </label>
                      <input
                        type="text"
                        placeholder="Or paste Unsplash/web link"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface-elevated/40 border border-border text-[10px] font-mono text-foreground focus:outline-none"
                      />
                    </div>

                    {coverImage && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase text-foreground-muted block font-bold">Preview Asset</span>
                        <img 
                          src={coverImage} 
                          alt="" 
                          className="w-full h-16 rounded object-cover border border-border"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                </div>

                {uploadError && (
                  <p className="text-[10px] text-destructive font-semibold font-mono bg-destructive/10 border border-destructive/20 p-2.5 rounded-xl">
                    {uploadError}
                  </p>
                )}
              </div>

              {/* Row 7: Measurable Performance Metrics */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border/60 pb-1">
                  <h4 className="text-[10px] font-mono uppercase font-bold text-accent tracking-widest">
                    MEASURED PERFORMANCE METRICS ROWSET *
                  </h4>
                  <button
                    type="button"
                    onClick={addMetricRow}
                    className="px-3 py-1 bg-surface border border-border rounded-lg text-[9px] font-mono font-bold hover:bg-surface-elevated flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Insert Row
                  </button>
                </div>

                <div className="space-y-3">
                  {metrics.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Label (e.g., Routing Latency)"
                          value={m.label}
                          onChange={(e) => updateMetricRow(idx, "label", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated/30 border border-border text-foreground text-xs font-sans"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Value (e.g., -42% or $2.4M/yr)"
                          value={m.value}
                          onChange={(e) => updateMetricRow(idx, "value", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-elevated/30 border border-border text-foreground text-xs font-sans"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={metrics.length === 1}
                        onClick={() => removeMetricRow(idx)}
                        className="p-3.5 rounded-xl bg-surface border border-border text-foreground-secondary hover:text-destructive hover:border-destructive/20 disabled:opacity-25 cursor-pointer"
                        title="Remove metric row"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 8: Sequence Ordering and Appearance Styles */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-border/40">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Ranking Position Sequence Weight
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Text Gradient Styling Map
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-mono"
                  >
                    <option value="from-primary to-accent">Cobalt to Neon Cyan</option>
                    <option value="from-accent to-foreground">Neon Cyan to Pure White</option>
                    <option value="from-foreground to-foreground-muted">Slate to Matte Silver</option>
                    <option value="from-primary to-foreground">Cobalt to Pure White</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Accent Radial Backlight Glow
                  </label>
                  <input
                    type="text"
                    required
                    value={imageAccent}
                    onChange={(e) => setImageAccent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground font-mono focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-foreground-muted font-bold block">
                    Draft / Publish Catalog Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-elevated/30 border border-border text-foreground focus:outline-none focus:border-accent text-xs font-mono"
                  >
                    <option value="draft">📁 Draft (Hidden from Site)</option>
                    <option value="published">🚀 Published (Live on Site)</option>
                  </select>
                </div>
              </div>

              {/* Row 9: Featured Toggle checkbox */}
              <div className="flex items-center gap-2 p-4 bg-surface-elevated/30 border border-border rounded-xl">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-accent border-border rounded"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-sans text-foreground-secondary font-semibold cursor-pointer select-none">
                  Highlight this case study as a Featured Product in main catalog sections.
                </label>
              </div>

              {/* Save CTAs */}
              <div className="border-t border-border pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-foreground font-semibold text-xs uppercase cursor-pointer"
                >
                  Cancel changes
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/25"
                >
                  Save Record Parameters
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
