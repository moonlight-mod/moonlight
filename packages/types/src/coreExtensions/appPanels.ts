export type AppPanels = {
  /**
   * Registers a new panel to be displayed around the user/voice controls.
   * @param section A unique name for your section
   * @param element A React component
   */
  addPanel: (section: string, element: React.FC<any>) => void;

  /**
   * @private
   */
  getPanels: (el: React.FC<any>) => React.ReactNode;
};
