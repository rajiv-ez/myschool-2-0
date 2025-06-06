export interface PreferenceUser {
  id: number;
  user: number;
  theme: 'light' | 'dark' | 'system';
  couleur: 'violet' | 'bleu' | 'vert' | 'orange' | 'rouge' | 'rose';
  disposition: 'tabs' | 'sidebar';
}
