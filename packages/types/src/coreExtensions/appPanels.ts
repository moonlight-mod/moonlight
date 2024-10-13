export type AppPanels = {
  addPanel: (section: string, element: React.FC<any>) => void;
  getPanels: (el: React.FC<any>) => React.ReactNode;
};
