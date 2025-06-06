
export interface PreferenceUser {
  id: number;
  user: number;
  theme: 'light' | 'dark' | 'system';
  couleur: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'pink';
  disposition: 'tabs' | 'sidebar';
}
