
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
export { Student, Subject, Grade, Transaction } from '../components/notes/types';
export type { FilterOptions as NotesFilterOptions } from '../components/notes/types';

// Bulletins types
export * from '../components/bulletins/types';

// Bibliotheque types
export * from '../components/bibliotheque/types';
