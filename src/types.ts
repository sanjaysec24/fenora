export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  gradient: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  businessProblem: string;
  technicalSolution: string;
  businessOutcome: string;
  techStack: string[];
  metrics: {
    label: string;
    value: string;
  }[];
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

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface ProcessStep {
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
  iconName: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
