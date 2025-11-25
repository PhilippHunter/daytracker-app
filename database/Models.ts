export interface Entry {
  id: number;
  date: string;
  text: string | null;
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

export type EntryWithRelations = Entry & { 
  perks: Perk[];
  mentions: Person[] | null;
}

export type PersonWithLastMentionDTO = Person & { lastMention: string | null }