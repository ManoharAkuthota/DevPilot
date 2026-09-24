export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const PROMPT_TEMPLATES = [
  {
    id: 'BUG_DETECT',
    title: 'Bug Detection',
    icon: 'Bug',
    description: 'Find race conditions, null safety leaks, and edge case failures.',
    prompt: 'Analyze this code for potential memory leaks, unhandled exceptions, and race conditions.',
  },
  {
    id: 'UNIT_TEST',
    title: 'Unit Tests Generator',
    icon: 'CheckSquare',
    description: 'Generate comprehensive JUnit 5 or Vitest/Jest unit test suites with boundary cases.',
    prompt: 'Generate an exhaustive unit test suite with positive, negative, and edge test cases.',
  },
  {
    id: 'REFACTOR',
    title: 'Code Refactoring',
    icon: 'Zap',
    description: 'Transform legacy loops into clean functional pipelines and records.',
    prompt: 'Refactor this code to follow clean architecture, high cohesion, and low cyclomatic complexity.',
  },
  {
    id: 'CODE_EXPLAIN',
    title: 'Code Explanation',
    icon: 'BookOpen',
    description: 'Deep dive into architecture, time complexity, and data structures.',
    prompt: 'Explain the internal execution model, time/space complexity, and concurrency guarantees of this code.',
  },
  {
    id: 'SQL_HELPER',
    title: 'SQL Query Tuning',
    icon: 'Database',
    description: 'Generate indexed SQL with explain plans and partition keys.',
    prompt: 'Write an optimized, indexed SQL query with proper join algorithms for high throughput.',
  },
  {
    id: 'REGEX_HELPER',
    title: 'Regex Assistant',
    icon: 'Code',
    description: 'Generate safe regex with unit tests and catastrophic backtracking protection.',
    prompt: 'Generate a secure regex pattern with explanations and boundary test vectors.',
  },
  {
    id: 'SPRING_BOOT',
    title: 'Spring Boot 3',
    icon: 'Cpu',
    description: 'Enterprise virtual threads, security chains, and JPA optimization.',
    prompt: 'Provide a production-ready Spring Boot 3 implementation using Java 21 features and reactive or virtual threads.',
  },
  {
    id: 'REACT',
    title: 'React 19 & Hooks',
    icon: 'Layers',
    description: 'Server actions, optimistic updates, and Framer Motion micro-interactions.',
    prompt: 'Build a modern React 19 component using transitions, Tailwind CSS, and Framer Motion.',
  },
];

export const TASK_STATUSES = [
  { id: 'TODO', label: 'To Do', color: 'border-slate-500/30 text-slate-400 bg-slate-500/10' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  { id: 'REVIEW', label: 'In Review', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
  { id: 'DONE', label: 'Done', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
];

export const TASK_PRIORITIES = [
  { id: 'LOW', label: 'Low', badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  { id: 'MEDIUM', label: 'Medium', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'HIGH', label: 'High', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'URGENT', label: 'Urgent', badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20' },
];
