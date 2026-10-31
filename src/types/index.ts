// Defining my types

// The app is consist of 3 arrays connected by ids
// Priorities for priority badge
export type Priority = "high" | "medium" | "low";

// Project type
export type Project = {
  id: string;
  name: string;
  createdAt: string;
  description: string;
};

// List type
export type List = {
  id: string;
  projectId: string;
  title: string;
  order: number;
};

// Card type
export type Card = {
  id: string;
  listId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  order: number;
  completed: boolean;
};
