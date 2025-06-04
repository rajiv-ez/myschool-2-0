// src/types/index.ts

// Academic types
export * from './academic';

// Accounting types
export * from './accounting';

// DMS types
export * from './dms';

// HR types
export * from './hr';

// Infrastructure types
export * from './infrastructure';

// Library types
export * from './library';

// Stocks types
export * from './stocks';

// Teaching types
export * from './teaching';

// Users types
export * from './users';

// Réexportations explicites pour éviter les conflits de nom
export type { Student, Subject, Grade, Transaction } from '../components/notes/types';
export type { FilterOptions as NotesFilterOptions } from '../components/notes/types';

export type {
  Eleve as BulletinEleve,
  Matiere,
  UniteEnseignement,
  Note as BulletinNote,
  FilterOptions as BulletinFilterOptions,
} from '../components/bulletins/types';

export type {
  Livre as BibliothequeLivre,
  Emprunt as BibliothequeEmprunt,
  DemandeEmprunt as BibliothequeDemandeEmprunt,
} from '../components/bibliotheque/types';
