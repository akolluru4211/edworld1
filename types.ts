
export enum View {
  DASHBOARD = 'DASHBOARD',
  LAB_ROBOTICS = 'LAB_ROBOTICS',
  LAB_SCIENCE = 'LAB_SCIENCE',
  CODING_COMPILER = 'CODING_COMPILER',
  AI_TUTOR = 'AI_TUTOR',
  PROFILE = 'PROFILE',
  LEARNING_MODULE = 'LEARNING_MODULE',
  COMMUNITY = 'COMMUNITY',
  PRICING = 'PRICING',
  PARENT_DASHBOARD = 'PARENT_DASHBOARD',
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
  LIVE_CLASS = 'LIVE_CLASS',
  CAREER_CENTER = 'CAREER_CENTER',
  MENTORSHIP = 'MENTORSHIP'
}

export enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  CPP = 'cpp',
  C = 'c',
  HTML = 'html',
  JAVA = 'java',
  CSHARP = 'csharp',
  KOTLIN = 'kotlin'
}

export type Stream = 'Science' | 'Commerce' | 'Arts' | 'Vocational';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  suggestions?: string[];
}

export interface RobotConfig {
  head: string;
  body: string;
  legs: string;
  color: string;
}

export interface LabExperiment {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Certificate {
  id: string;
  title: string;
  issue_date: string;
  badge_icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent';
  level: number;
  xp: number;
  streak: number;
  coins: number;
  goals: string[];
  stream?: Stream;
  certificates?: Certificate[];
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isAiVerified?: boolean;
  timestamp: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Freelance';
  tags: string[];
  posted: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  expertise: string[];
  rating: number;
  available: boolean;
}