
export type Language = 'tr' | 'en' | 'ar';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  status: 'published' | 'draft';
}

export interface Course {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  status: 'active' | 'inactive';
}

export interface TranslationSchema {
  nav: {
    about: string;
    projects: string;
    academics: string;
    contact: string;
    blog: string;
    game: string;
    courses: string;
    posts: string;
  };
  hero: {
    greeting: string;
    description: string;
    viewProjects: string;
    contactMe: string;
  };
  about: {
    title: string;
    subtitle: string;
    summary: string;
    technicalSkills: string;
    webTech: string;
    programmingLanguages: string;
    languages: string;
    cvDownload: string;
    lang_arabic: string;
    lang_turkish: string;
    lang_english: string;
    biographyGreeting: string;
    biographyParagraphs: string[];
    biographyTitle: string;
  };
  projects: {
    title: string;
    viewAll: string;
    github: string;
    demo: string;
    filterAll: string;
    filterWeb: string;
    filterMobile: string;
    filterBackend: string;
  };
  courses: {
    title: string;
    price: string;
    duration: string;
    enroll: string;
  };
  blog: {
    title: string;
    readMore: string;
    latestPosts: string;
  };
  academics: {
    title: string;
    education: string;
    degree: string;
    uni: string;
    year: string;
    certificates: string;
    courses: string;
  };
  contact: {
    title: string;
    infoTitle: string;
    location: string;
    nationality: string;
    formTitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
    success: string;
    emailLabel: string;
    locationLabel: string;
    connectTitle: string;
  };
  game: {
    title: string;
    start: string;
    score: string;
    timeLeft: string;
    gameOver: string;
    restart: string;
    description: string;
    highScore: string;
    backToPortfolio: string;
    selectGame: string;
    debugRush: string;
    energyFlow: string;
    energyDesc: string;
    win: string;
    level: string;
  };
  posts: {
    title: string;
    search: string;
    all: string;
    comments: string;
    reactions: string;
  };
  footer: {
    rights: string;
    subtitle: string;
  };
}

export interface CertificateItem {
  id: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  iconName?: string;
}

export interface SiteProfile {
  name: string;
  avatar: string;
  title: string;
  signature: string;
  cvUrl: string;
  heroGreeting: Record<Language, string>;
  heroDescription: Record<Language, string>;
  bioGreeting: Record<Language, string>;
  bioParagraphs: Record<Language, string[]>;
}

export interface AcademicsInfo {
  degree: Record<Language, string>;
  uni: Record<Language, string>;
  year: Record<Language, string>;
}

export interface SkillsData {
  web: string[];
  programming: string[];
}

export interface ContactInfo {
  email: string;
  location: Record<Language, string>;
  nationality: Record<Language, string>;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
}

export interface Project {
  id: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  tags: string[];
  category: 'web' | 'mobile' | 'backend';
  github: string;
  demo?: string;
  image: string;
}

export interface BlogPost {
  id: number;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  date: string;
  category: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
}

export type SocialPostType =
  | 'image'
  | 'video'
  | 'text'
  | 'linkedin'
  | 'job'
  | 'event'
  | 'project'
  | 'poll'
  | 'pdf'
  | 'gallery'
  | 'quote'
  | 'announcement'
  | 'link';

export interface Comment {
  id: string;
  userName: string;
  userEmail?: string;
  avatar?: string;
  text: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

export interface SocialPost {
  id: string;
  type: SocialPostType;
  title: Record<Language, string>;
  content: Record<Language, string>;
  date: string;
  time?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  hashtags: string[];
  location?: string;
  isPinned?: boolean;
  views: number;
  likes: number;
  reactions: {
    like: number;
    celebrate: number;
    support: number;
    love: number;
    insightful: number;
    funny: number;
  };
  comments: Comment[];
  isDraft?: boolean;
  isArchived?: boolean;
  scheduledDate?: string;
  
  images?: string[];
  videoUrl?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  
  jobDetails?: {
    company: string;
    position: string;
    location: string;
    type: string;
    deadline: string;
    applyLink: string;
    requirements: string[];
    salary?: string;
  };

  eventDetails?: {
    title: string;
    date: string;
    location: string;
    organizer: string;
    regLink: string;
  };

  projectDetails?: {
    name: string;
    tech: string[];
    github?: string;
    website?: string;
    status: string;
  };

  pollDetails?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedOptionId?: string;
  };

  quoteDetails?: {
    text: string;
    author: string;
    bgStyle: string;
  };

  linkDetails?: {
    url: string;
    title: string;
    description: string;
    image?: string;
  };
}
