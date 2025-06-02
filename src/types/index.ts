// Academic types
export * from './academic';

// Stocks types
export * from './stocks';

// Infrastructure types
export * from './infrastructure';

// Users types
export * from './users';

// Frais types
export * from './frais';

// Re-export specific types to avoid conflicts
export type { Student, Subject, Grade, Transaction } from '../components/notes/types';
export type { FilterOptions as NotesFilterOptions } from '../components/notes/types';

// Bulletins types - explicit exports to avoid conflicts
export type { Eleve as BulletinEleve, Matiere, UniteEnseignement, Note as BulletinNote, FilterOptions as BulletinFilterOptions } from '../components/bulletins/types';

// Bibliotheque types - explicit exports to avoid conflicts  
export type { Livre, Emprunt, DemandeEmprunt } from '../components/bibliotheque/types';
