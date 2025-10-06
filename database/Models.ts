export interface Entry {
  id: number;
  date: string;
  text: string | null;
  perks: Perk[];
}

export interface Perk {
  id: number;
  title: string;
  color: string | null;
  icon: string | null;
}