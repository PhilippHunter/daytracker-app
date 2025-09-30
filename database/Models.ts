export interface Entry {
  id: number;
  date: string;
  text: string;
  perks: Perk[];
}

export interface Perk {
  id: number;
  title: string;
  color: string;
  icon: string;
}