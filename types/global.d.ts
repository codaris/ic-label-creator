export {};

declare global {
  interface Window {
    drawChip: (chipName: string, series?: string, type?: string) => void;
    globals: {
      gimmeColor: boolean;
      pageWidth: number;
      pageHeight: number;
      pinDistance: number;
      chipHeightBase: number;
      chipPositionX: number;
      chipPositionY: number;
      svgStrokeWidth: number;
      svgStrokeOffset: number;
      defaultChipLogicFamily: string;
      defaultChipSeries: string;
      pinFontFamily?: string;
    };
  }

  const chips: Record<string, any>;
}
