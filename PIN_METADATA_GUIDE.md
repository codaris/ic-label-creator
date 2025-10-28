# Pin Metadata System Guide

## Overview

The IC Label Creator now supports comprehensive pin metadata specification, allowing you to define:
- **Pin Direction**: input, output, or bidirectional
- **Pin Type**: semantic function (power, ground, data, address, clock, etc.)

This metadata drives visual rendering:
- Pin direction controls the indicator rectangle:
  -  *Unfilled* = input
  -  *filled* = output
  -  *half-filled* = bidirectional
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
        7: gnd(),             // Ground pin
        14: pwr(),            // Power pin
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
    description: 'NAND',
    type: 'gate',
    package: 'DIP14',
    pins: {
        1: i('A1'),
        2: i('B1'),
        3: o('Y1'),
        4: i('A2'),
        5: i('B2'),
        6: o('Y2'),
        7: gnd(),
        8: o('Y3'),
        9: i('A3'),
        10: i('B3'),
        11: o('Y4'),
        12: i('A4'),
        13: i('B4'),
        14: pwr(),
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
        1: o('/VP'),
        2: i('RDY'),
        3: o('PHI1O', 'clock'),
        4: i('/IRQ', 'interrupt'),
        5: o('/ML'),
        6: i('/NMI', 'interrupt'),
        7: o('SYNC'),
        8: pwr(),
        9: o('A0', 'address'),
        10: o('A1', 'address'),
        11: o('A2', 'address'),
        12: o('A3', 'address'),
        13: o('A4', 'address'),
        14: o('A5', 'address'),
        15: o('A6', 'address'),
        16: o('A7', 'address'),
        17: o('A8', 'address'),
        18: o('A9', 'address'),
        19: o('A10', 'address'),
        20: o('A11', 'address'),
        21: gnd(),
        22: o('A12', 'address'),
        23: o('A13', 'address'),
        24: o('A14', 'address'),
        25: o('A15', 'address'),
        26: io('D7', 'data'),
        27: io('D6', 'data'),
        28: io('D5', 'data'),
        29: io('D4', 'data'),
        30: io('D3', 'data'),
        31: io('D2', 'data'),
        32: io('D1', 'data'),
        33: io('D0', 'data'),
        34: o('R/W'),
        35: o('PHI2', 'clock'),
        36: o('SO'),
        37: i('PHI2', 'clock'),
        38: i('/SET_OVERFLOW'),
        39: i('/ABORT'),
        40: i('/RES', 'reset'),
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
        1: i('A14', 'address'),
        2: i('A12', 'address'),
        3: i('A7', 'address'),
        4: i('A6', 'address'),
        5: i('A5', 'address'),
        6: i('A4', 'address'),
        7: i('A3', 'address'),
        8: i('A2', 'address'),
        9: i('A1', 'address'),
        10: i('A0', 'address'),
        11: io('IO0', 'data'),
        12: io('IO1', 'data'),
        13: io('IO2', 'data'),
        14: gnd(),
        15: io('IO3', 'data'),
        16: io('IO4', 'data'),
        17: io('IO5', 'data'),
        18: io('IO6', 'data'),
        19: io('IO7', 'data'),
        20: i('/CE', 'chip-select'),
        21: i('A10', 'address'),
        22: i('/OE', 'enable'),
        23: i('A11', 'address'),
        24: i('A9', 'address'),
        25: i('A8', 'address'),
        26: i('A13', 'address'),
        27: i('/WE', 'enable'),
        28: pwr(),
    },
},
```



