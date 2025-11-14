export interface Entry {
  id: number;
  date: string;
  text: string | null;
  perks: Perk[];
  mentions: Person[] | null;
}

export interface Perk {
  id: number;
  title: string;
  color: string;
  icon: string | null;
}

export interface Person {
  id: number,
  name: string,
  description: string | null,
}