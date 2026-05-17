export type TaskCategory =
  | "health"
  | "deep-work"
  | "digital-detox"
  | "night-routine"
  | "college";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: TaskCategory;
}