export interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  image: string;
}

export interface DonatePayload {
  amount: number;
  name: string;
  email: string;
}