
export interface Student {
  id: string;
  name: string;
  classe: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  coefficient: number;
}

export interface Grade {
  studentId: string;
  subjectId: string;
  value: number;
  comment: string;
  date: string;
}

export interface FilterOptions {
  classe: string;
  subject: string;
  period: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}
