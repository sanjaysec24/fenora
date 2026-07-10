import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { ProjectsDb } from "./server/projectsDb";
import { AdminDb } from "./server/adminDb";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON and urlencoded data
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Create local folders for uploads and data
  const uploadsDir = path.join(process.cwd(), "data", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploads statically so local image links render instantly
  app.use("/uploads", express.static(uploadsDir));

  // Configure Multer for local storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `file-${uniqueSuffix}${ext}`);
    }
  });
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file limit
  });

  // Admin secret passcode validation helper
  const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "fenora2026";
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const code = req.headers["x-admin-passcode"];
    if (code !== ADMIN_PASSCODE) {
      return res.status(401).json({ error: "Unauthorized. Invalid admin passcode." });
    }
    next();
  };

  // ==========================================
  // API ENDPOINTS
  // ==========================================

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: ProjectsDb.isUsingSupabase() ? "supabase" : "local-filesystem" });
  });

  // GET ALL Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const includeDrafts = req.query.includeDrafts === "true";
      const category = req.query.category as string;
      const featuredOnly = req.query.featured === "true";
      const search = req.query.search as string;

      const list = await ProjectsDb.getAll({
        includeDrafts,
        category,
        featuredOnly,
        search
      });

      res.json(list);
    } catch (err: any) {
      console.error("API get projects error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch projects" });
    }
  });

  // GET Single Project by Slug
  app.get("/api/projects/by-slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const includeDrafts = req.query.includeDrafts === "true";
      
      const project = await ProjectsDb.getBySlug(slug, includeDrafts);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (err: any) {
      console.error("API get project by slug error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch project" });
    }
  });

  // POST Create Project (Admin Only)
  app.post("/api/projects", requireAdmin, async (req, res) => {
    try {
      const project = await ProjectsDb.create(req.body);
      res.status(201).json(project);
    } catch (err: any) {
      console.error("API create project error:", err);
      res.status(500).json({ error: err.message || "Failed to create project" });
    }
  });

  // PUT Update Project (Admin Only)
  app.put("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await ProjectsDb.update(id, req.body);
      res.json(project);
    } catch (err: any) {
      console.error("API update project error:", err);
      res.status(500).json({ error: err.message || "Failed to update project" });
    }
  });

  // DELETE Project (Admin Only)
  app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await ProjectsDb.delete(id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true, message: "Project deleted successfully" });
    } catch (err: any) {
      console.error("API delete project error:", err);
      res.status(500).json({ error: err.message || "Failed to delete project" });
    }
  });

  // POST Upload Image (Admin Only)
  app.post("/api/upload", requireAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      // Default local serving URL
      const localUrl = `/uploads/${req.file.filename}`;

      // Check if Supabase storage uploading can be used
      if (ProjectsDb.isUsingSupabase()) {
        try {
          const supabaseUrl = process.env.SUPABASE_URL!;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
          const { createClient } = await import("@supabase/supabase-js");
          const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
          
          const fileContent = fs.readFileSync(req.file.path);
          const { error } = await supabaseClient.storage
            .from("project-images")
            .upload(`uploads/${req.file.filename}`, fileContent, {
              contentType: req.file.mimetype,
              cacheControl: "3600",
              upsert: false
            });

          if (error) throw error;

          const { data: publicUrlData } = supabaseClient.storage
            .from("project-images")
            .getPublicUrl(`uploads/${req.file.filename}`);

          // Unlink local temp file
          fs.unlinkSync(req.file.path);

          return res.json({ url: publicUrlData.publicUrl });
        } catch (storageErr) {
          console.error("Supabase storage upload failed, keeping local copy:", storageErr);
        }
      }

      res.json({ url: localUrl });
    } catch (err: any) {
      console.error("API upload image error:", err);
      res.status(500).json({ error: err.message || "Image upload failed" });
    }
  });

  // ==========================================
  // BLOGS API
  // ==========================================
  app.get("/api/blogs", (req, res) => {
    try {
      const includeDrafts = req.query.includeDrafts === "true";
      const list = AdminDb.getAllBlogs();
      if (includeDrafts) {
        // Authenticated check
        const code = req.headers["x-admin-passcode"];
        if (code === ADMIN_PASSCODE) {
          return res.json(list);
        }
      }
      res.json(list.filter((b) => b.status === "published"));
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/by-slug/:slug", (req, res) => {
    try {
      const blog = AdminDb.getBlogBySlug(req.params.slug);
      if (!blog) return res.status(404).json({ error: "Blog post not found" });
      res.json(blog);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch blog post" });
    }
  });

  app.post("/api/blogs", requireAdmin, (req, res) => {
    try {
      const blog = AdminDb.createBlog(req.body);
      res.status(201).json(blog);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to create blog" });
    }
  });

  app.put("/api/blogs/:id", requireAdmin, (req, res) => {
    try {
      const blog = AdminDb.updateBlog(req.params.id, req.body);
      if (!blog) return res.status(404).json({ error: "Blog not found" });
      res.json(blog);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update blog" });
    }
  });

  app.delete("/api/blogs/:id", requireAdmin, (req, res) => {
    try {
      const success = AdminDb.deleteBlog(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete blog" });
    }
  });

  // ==========================================
  // TESTIMONIALS API
  // ==========================================
  app.get("/api/testimonials", (req, res) => {
    try {
      const includeDrafts = req.query.includeDrafts === "true";
      const list = AdminDb.getAllTestimonials();
      if (includeDrafts) {
        const code = req.headers["x-admin-passcode"];
        if (code === ADMIN_PASSCODE) {
          return res.json(list);
        }
      }
      res.json(list.filter((t) => t.status === "published"));
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", requireAdmin, (req, res) => {
    try {
      const test = AdminDb.createTestimonial(req.body);
      res.status(201).json(test);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to create testimonial" });
    }
  });

  app.put("/api/testimonials/:id", requireAdmin, (req, res) => {
    try {
      const test = AdminDb.updateTestimonial(req.params.id, req.body);
      if (!test) return res.status(404).json({ error: "Testimonial not found" });
      res.json(test);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", requireAdmin, (req, res) => {
    try {
      const success = AdminDb.deleteTestimonial(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete testimonial" });
    }
  });

  // ==========================================
  // LEADS API
  // ==========================================
  app.get("/api/leads", requireAdmin, (req, res) => {
    try {
      res.json(AdminDb.getAllLeads());
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch leads" });
    }
  });

  app.post("/api/leads", (req, res) => {
    try {
      const lead = AdminDb.createLead(req.body);
      res.status(201).json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to submit lead" });
    }
  });

  app.put("/api/leads/:id/status", requireAdmin, (req, res) => {
    try {
      const lead = AdminDb.updateLeadStatus(req.params.id, req.body.status);
      if (!lead) return res.status(404).json({ error: "Lead not found" });
      res.json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update lead status" });
    }
  });

  app.delete("/api/leads/:id", requireAdmin, (req, res) => {
    try {
      const success = AdminDb.deleteLead(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete lead" });
    }
  });

  // ==========================================
  // BOOKINGS API
  // ==========================================
  app.get("/api/bookings", requireAdmin, (req, res) => {
    try {
      res.json(AdminDb.getAllBookings());
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", (req, res) => {
    try {
      const booking = AdminDb.createBooking(req.body);
      res.status(201).json(booking);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to submit booking" });
    }
  });

  app.put("/api/bookings/:id/status", requireAdmin, (req, res) => {
    try {
      const booking = AdminDb.updateBookingStatus(req.params.id, req.body.status);
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      res.json(booking);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update booking status" });
    }
  });

  app.delete("/api/bookings/:id", requireAdmin, (req, res) => {
    try {
      const success = AdminDb.deleteBooking(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete booking" });
    }
  });

  // DYNAMIC SITEMAP GENERATOR
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const list = await ProjectsDb.getAll({ includeDrafts: false });
      const host = req.headers.host || "fenoratechnologies.com";
      const protocol = req.secure ? "https" : "http";
      const baseUrl = `${protocol}://${host}`;

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/admin</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

      list.forEach((proj) => {
        xml += `
  <url>
    <loc>${baseUrl}/projects/${proj.slug}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      xml += "\n</urlset>";

      res.header("Content-Type", "application/xml");
      res.status(200).send(xml);
    } catch (err) {
      console.error("Sitemap generation error:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // ==========================================
  // SEO MIDDLEWARE FOR /projects/[slug]
  // ==========================================
  const renderProjectWithSeoMeta = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { slug } = req.params;
    try {
      const project = await ProjectsDb.getBySlug(slug, true);
      if (!project) {
        return next(); // Delegate to React SPA router (which will render standard 404 page)
      }

      const isProd = process.env.NODE_ENV === "production";
      const indexPath = isProd 
        ? path.join(process.cwd(), "dist", "index.html")
        : path.join(process.cwd(), "index.html");

      if (!fs.existsSync(indexPath)) {
        return next();
      }

      let html = fs.readFileSync(indexPath, "utf8");

      // Setup dynamic high-contrast SEO meta headers
      const pageTitle = `${project.title} | FENORA Case Study`;
      const pageDesc = project.description;
      const pageImage = project.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800";
      const pageUrl = `https://${req.headers.host || "fenoratechnologies.com"}/projects/${project.slug}`;

      // Dynamically replace simple <title> tags
      html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);

      // Inject standard and social Open Graph tags
      const seoTags = `
  <meta name="description" content="${pageDesc}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDesc}">
  <meta property="og:image" content="${pageImage}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${pageDesc}">
  <meta name="twitter:image" content="${pageImage}">
      `;

      html = html.replace("</head>", `${seoTags}\n</head>`);

      res.setHeader("Content-Type", "text/html");
      return res.send(html);
    } catch (err) {
      console.error("SEO server-side injection error:", err);
      return next();
    }
  };

  // Serve custom SEO tags on active case studies directly
  app.get("/projects/:slug", renderProjectWithSeoMeta);

  // ==========================================
  // VITE DEVELOPMENT MIDDLEWARE / PRODUCTION ROUTING
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Handle SPA fallback for client-side custom routes
  app.use((req, res, next) => {
    const isProd = process.env.NODE_ENV === "production";
    const indexPath = isProd 
      ? path.join(process.cwd(), "dist", "index.html")
      : path.join(process.cwd(), "index.html");
    res.sendFile(indexPath);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FENORA FULL-STACK SERVER] Running on http://localhost:${PORT}`);
  });
}

startServer();
