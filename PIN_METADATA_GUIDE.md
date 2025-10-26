# Pin Metadata System Guide

## Overview

The IC Label Creator now supports comprehensive pin metadata specification, allowing you to define:
- **Pin Direction**: input, output, or bidirectional
- **Pin Type**: semantic function (power, ground, data, address, clock, etc.)

This metadata drives visual rendering:
- Pin direction controls the indicator rectangle (unfilled=input, filled=output, half-filled=bidirectional)
- Pin type controls the color of both the label and indicator

## Quick Start

### Helper Functions

Use these compact helper functions in `chips.js`:

```javascript
i(label, type)    // Input pin
o(label, type)    // Output pin  
io(label, type)   // Bidirectional pin
pwr(label)        // Power pin (defaults to '⊕')
gnd(label)        // Ground pin (defaults to '⏚')
```

### Example

```javascript
'74LS00': {
    description: '4xNAND',
    type: 'gate',
    package: 'DIP14',
    pins: {
        1: i('A1'),           // Input pin A1, type=other (default)
        2: i('B1'),           // Input pin B1
        3: o('Y1'),           // Output pin Y1
        7: gnd(),             // Ground pin
        14: pwr(),            // Power pin
    },
},
```

## Pin Types

The following pin types are available (with associated colors):

| Type          | Color          | Usage |
|---------------|----------------|-------|
| `power`       | Red (#d32f2f)  | VCC, VDD power supply pins |
| `ground`      | Black          | GND, VSS ground pins |
| `address`     | Green (#2e7d32)| Address bus pins (A0-A15, etc.) |
| `data`        | Blue (#1565c0) | Data bus pins (D0-D7, etc.) |
| `clock`       | Orange (#ef6c00)| Clock signals (PHI2, CLK, etc.) |
| `chip-select` | Purple (#6a1b9a)| Chip select pins (CS, CE, etc.) |
| `reset`       | Crimson (#c2185b)| Reset signals (RES, RST, etc.) |
| `enable`      | Teal (#00796b) | Enable signals (OE, WE, EN, etc.) |
| `interrupt`   | Magenta (#d81b60)| Interrupt signals (IRQ, NMI, etc.) |
| `nc`          | Gray (#757575) | No-connect pins |
| `other`       | Black          | Default/unspecified pins |

### Customizing Colors

Edit the `PIN_TYPE_COLOR_PALETTE` array at the top of `ic-labels.js`:

```javascript
const PIN_TYPE_COLOR_PALETTE = [
    { type: 'power', color: '#d32f2f' },
    { type: 'ground', color: '#000000' },
    // ... add or modify as needed
];
```

## Pin Directions

### Input Pins
```javascript
i('CLK')           // Input, type=other (black)
i('A0', 'address') // Input address pin (green)
i('CS', 'chip-select') // Input chip select (purple)
```

**Visual**: White rectangle with colored stroke

### Output Pins
```javascript
o('Y1')            // Output, type=other (black)
o('A0', 'address') // Output address pin (green)
o('IRQ', 'interrupt') // Output interrupt (magenta)
```

**Visual**: Filled rectangle (colored)

### Bidirectional Pins
```javascript
io('D0', 'data')   // Bidirectional data pin (blue)
io('PA0')          // Bidirectional I/O, type=other (black)
```

**Visual**: Half-filled rectangle (left half filled, right half white)

## Complete Examples

### 74LS00 NAND Gate
```javascript
'74LS00': {
    description: '4xNAND',
    type: 'gate',
    package: 'DIP14',
    pins: {
        1: i('A1'),    // Input A1
        2: i('B1'),    // Input B1
        3: o('Y1'),    // Output Y1
        4: i('A2'),    // Input A2
        5: i('B2'),    // Input B2
        6: o('Y2'),    // Output Y2
        7: gnd(),      // Ground
        8: o('Y3'),    // Output Y3
        9: i('A3'),    // Input A3
        10: i('B3'),   // Input B3
        11: o('Y4'),   // Output Y4
        12: i('A4'),   // Input A4
        13: i('B4'),   // Input B4
        14: pwr(),     // Power
    },
},
```

### W65C02 CPU
```javascript
'W65C02': {
    description: 'CPU',
    type: 'cpu',
    package: 'DIP40',
    pins: {
        1: o('/VP'),                    // Output
        2: i('RDY'),                    // Input
        3: o('PHI1O', 'clock'),         // Output clock (orange)
        4: i('/IRQ', 'interrupt'),      // Input interrupt (magenta)
        8: pwr(),                       // Power (red)
        9: o('A0', 'address'),          // Output address (green)
        21: gnd(),                      // Ground (black)
        26: io('D7', 'data'),           // Bidirectional data (blue)
        37: i('PHI2', 'clock'),         // Input clock (orange)
        40: i('/RES', 'reset'),         // Input reset (crimson)
    },
},
```

### 28C256 EEPROM
```javascript
'28C256': {
    description: '32Kx8 EEPROM',
    type: 'eeprom',
    package: 'DIP28',
    pins: {
        1: i('A14', 'address'),         // Input address (green)
        10: i('A0', 'address'),         // Input address (green)
        11: io('I/O0', 'data'),         // Bidirectional data (blue)
        14: gnd(),                      // Ground
        20: i('C̅E̅', 'chip-select'),    // Input chip select (purple)
        22: i('O̅E̅', 'enable'),          // Input output enable (teal)
        27: i('W̅E̅', 'enable'),          // Input write enable (teal)
        28: pwr(),                      // Power (red)
    },
},
```

## TypeScript Support

Full TypeScript type definitions are in `types/global.d.ts`:

```typescript
type PinDirection = 'input' | 'output' | 'bidirectional';
type PinType = 'power' | 'ground' | 'address' | 'data' | 'clock' | 
               'chip-select' | 'reset' | 'enable' | 'interrupt' | 'nc' | 'other';
type PinSpec = [string, PinDirection, PinType];

interface ChipDefinition {
    description: string;
    type: ChipType;
    package?: string;
    pins: Record<number, string | PinSpec>; // Backward compatible
}
```

## Backward Compatibility

Old string-based pin definitions still work:

```javascript
// Old format (still works, defaults to input/other/black)
pins: {
    1: 'A1',
    2: 'B1',
    7: '⏚',
    14: '⊕',
}

// New format (recommended)
pins: {
    1: i('A1'),
    2: i('B1'),
    7: gnd(),
    14: pwr(),
}
```

## Migration Tips

1. **Start with power/ground**: Convert `'⊕'` → `pwr()` and `'⏚'` → `gnd()`
2. **Identify I/O direction**: Look at datasheets to determine input vs. output
3. **Assign semantic types**: Use `address`, `data`, `clock` for bus signals
4. **Use descriptive types**: Control signals benefit from `chip-select`, `enable`, `interrupt`, `reset`

## Chips Converted So Far

✅ **Logic Gates**: 74LS00, 74LS02, 74LS04, 74LS07, 74LS08, 74LS14, 74LS32  
✅ **CPUs**: W65C02  
✅ **Peripherals**: W65C22 (VIA), W65C51 (ACIA)  
✅ **Memory**: 28C256 (EEPROM)

Check `chips.js` for complete examples of each category.
