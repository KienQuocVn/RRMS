export type BottomTabKey = 'home' | 'inbox' | 'tasks' | 'find-tenants' | 'more';

export interface TabOwnedScreen {
  id: string;
  tab: BottomTabKey;
  section: string;
  label: string;
  route: string;
  source: string;
  notes?: string;
}
