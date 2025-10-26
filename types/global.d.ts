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

  // Pin direction (input/output/bidirectional)
  type PinDirection = 'input' | 'output' | 'bidirectional';
  
  // Pin type (semantic function)
  type PinType = 'power' | 'ground' | 'address' | 'data' | 'clock' | 'chip-select' | 
                 'reset' | 'enable' | 'interrupt' | 'nc' | 'other';
  
  // Pin metadata
  interface PinMeta {
    label: string;
    direction: PinDirection;
    type: PinType;
  }
  
  // Compact pin specification: [label, direction, type]
  type PinSpec = [string, PinDirection, PinType];
  
  // Helper functions for compact pin definition
  function i(label: string, type?: PinType): PinSpec; // input
  function o(label: string, type?: PinType): PinSpec; // output
  function io(label: string, type?: PinType): PinSpec; // bidirectional
  function pwr(label?: string): PinSpec; // power pin
  function gnd(label?: string): PinSpec; // ground pin
  
  // Chip definition with pin metadata
  interface ChipDefinition {
    description: string;
    type: 'gate' | 'flipflop' | 'demux' | 'mux' | 'counter' | 'register' | 'ram' | 'sram' | 'eeprom' | 'buffer' | 'bus-transceiver' | 'cpu' | 'via' | 'acia' | 'analog' | 'adder';
    package?: string;
    pins: Record<number, string | PinSpec>; // supports old string format or new PinSpec
  }
  
  const chips: Record<string, ChipDefinition>;
  const packages: Record<string, { pins: number; pinPitch: number; rowSpacing?: number; bodyLength?: number; bodyWidth?: number; }>;
}
