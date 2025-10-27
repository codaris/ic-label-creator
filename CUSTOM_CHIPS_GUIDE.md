# Custom Chip Definitions Guide

This guide explains how to define custom chips directly in your HTML markup without modifying `chips.js`.

## Quick Start

There are two ways to define custom chips:

1. **Create a new chip from scratch** - Define all pins for a custom chip
2. **Extend an existing chip** - Override specific pins of an existing chip

## Creating a New Custom Chip

Define a completely new chip by specifying the package type and pin definitions:

```html
<ic-chip package="DIP14" label="PLA" description="custom" type="pla">
  <pin type="power"></pin>
  <pin type="address">A0</pin>
  <pin direction="output">O0</pin>
  <pin num="4" dir="output">O1</pin>
  <pin dir="input" type="address">A1</pin>
  <pin dir="input" type="address">A2</pin>
  <pin type="ground"></pin>
  <pin dir="output">O2</pin>
  <pin dir="output">O3</pin>
  <pin dir="input" type="address">A3</pin>
  <pin dir="input" type="address">A4</pin>
  <pin dir="input" type="chip-select">/CS</pin>
  <pin dir="input" type="enable">/EN</pin>
  <pin dir="output">O4</pin>
</ic-chip>
```

### Required Attributes

- **`package`**: The package type (e.g., `DIP8`, `DIP14`, `DIP16`, `DIP20`, `DIP24`, `DIP28`, `DIP40`)
- **`label`**: The chip label that will be displayed on the rendered chip

### Optional Attributes

- **`description`**: Description text (defaults to "custom")
- **`type`**: Chip type for color coding (e.g., "gate", "cpu", "ram", "pla", etc.)

### Pin Numbering

Pins can be numbered in two ways:

1. **Sequential (automatic)**: Omit the `num` attribute, and pins are numbered 1, 2, 3, etc.
2. **Explicit**: Use the `num` attribute to specify exact pin numbers

You can mix both approaches - if you specify `num="4"`, the next pin without a `num` will be pin 5.

## Extending an Existing Chip

Create a custom version of an existing chip with modified pins:

```html
<ic-chip extends="74LS08" description="custom">
  <pin num="5">A0</pin>
  <pin num="6">A1</pin>
</ic-chip>
```

### Attributes

- **`extends`**: The base chip name to extend (must exist in `chips.js`)
- **`description`**: Optional override description

All pins not specified in `<pin>` elements will use the original chip's pin definitions. Only the pins you specify will be overridden.

## Pin Element Reference

The `<pin>` element supports the following attributes:

### Pin Number

- **`num`**: Pin number (optional - omit for sequential numbering)

### Pin Direction

Use **`direction`** or **`dir`** (both work the same):

- `"input"` or `"in"` - Input pin (arrow points into chip)
- `"output"` or `"out"` - Output pin (arrow points out of chip)
- `"bidirectional"`, `"io"`, or `"inout"` - Bidirectional pin (both arrows)

### Pin Type

Use **`type`** to specify the pin's function:

- `"power"` - Power supply pin (⊕ symbol)
- `"ground"` - Ground pin (⏚ symbol)
- `"address"` - Address line
- `"data"` - Data line
- `"clock"` - Clock signal
- `"chip-select"` - Chip select
- `"reset"` - Reset signal
- `"enable"` - Enable signal
- `"interrupt"` - Interrupt signal
- `"nc"` - Not connected
- `"other"` - Generic pin (default)

### Pin Label

The text content of the `<pin>` element is used as the pin label:

```html
<pin dir="output">Q0</pin>
<pin dir="input" type="clock">CLK</pin>
<pin dir="input" type="chip-select">/CS</pin>
```

For power and ground pins, you can omit the text to use default symbols:

```html
<pin type="power"></pin>     <!-- Uses ⊕ symbol -->
<pin type="ground"></pin>     <!-- Uses ⏚ symbol -->
```

Or provide custom labels:

```html
<pin type="power">VCC</pin>   <!-- Custom label "VCC" -->
<pin type="ground">GND</pin>   <!-- Custom label "GND" -->
```

## Examples

### Example 1: Simple 8-Pin Custom Chip

```html
<ic-chip package="DIP8" label="CTRL" description="controller" type="gate">
  <pin type="power"></pin>
  <pin dir="in">IN1</pin>
  <pin dir="in">IN2</pin>
  <pin dir="out">OUT</pin>
  <pin type="ground"></pin>
  <pin dir="in">EN</pin>
  <pin dir="io" type="data">D0</pin>
  <pin dir="io" type="data">D1</pin>
</ic-chip>
```

### Example 2: Custom Chip with Specific Pin Numbers

```html
<ic-chip package="DIP16" label="DECODE" description="decoder" type="demux">
  <pin num="1" type="power"></pin>
  <pin num="2" dir="in" type="address">A0</pin>
  <pin num="3" dir="in" type="address">A1</pin>
  <pin num="4" dir="in" type="address">A2</pin>
  <pin num="5" dir="out">Y0</pin>
  <pin num="6" dir="out">Y1</pin>
  <pin num="7" dir="out">Y2</pin>
  <pin num="8" type="ground"></pin>
  <!-- Pins 9-16 continue on the other side -->
  <pin num="9" dir="out">Y3</pin>
  <pin num="10" dir="out">Y4</pin>
  <pin num="11" dir="out">Y5</pin>
  <pin num="12" dir="out">Y6</pin>
  <pin num="13" dir="out">Y7</pin>
  <pin num="14" dir="in" type="enable">/EN</pin>
  <pin num="15" dir="in" type="address">A3</pin>
  <pin num="16" type="power">VCC</pin>
</ic-chip>
```

### Example 3: Extending with Multiple Pin Overrides

```html
<ic-chip extends="74LS245" description="custom bus">
  <pin num="1" type="bidirectional">DATA_A0</pin>
  <pin num="2" type="bidirectional">DATA_A1</pin>
  <pin num="3" type="bidirectional">DATA_A2</pin>
</ic-chip>
```

## Tips

1. **Pin numbering follows standard DIP convention**: Pin 1 is at the top-left (marked with a notch or dot), pins count counterclockwise
2. **Use active-low notation**: Prefix with `/` for active-low signals (e.g., `/CS`, `/EN`, `/RD`)
3. **Mix sequential and explicit numbering**: You can specify critical pins explicitly and let others auto-number
4. **Validate in browser**: Open your HTML file in a browser to see the rendered chips before printing
5. **Package sizes available**: DIP8, DIP10, DIP12, DIP14, DIP16, DIP18, DIP20, DIP22, DIP24, DIP28, DIP32, DIP36, DIP40, DIP48

## Common Patterns

### Power and Ground Pins

```html
<!-- Use default symbols -->
<pin type="power"></pin>
<pin type="ground"></pin>

<!-- Or custom labels -->
<pin type="power">VCC</pin>
<pin type="power">+5V</pin>
<pin type="ground">GND</pin>
```

### Address and Data Buses

```html
<!-- Address bus -->
<pin dir="in" type="address">A0</pin>
<pin dir="in" type="address">A1</pin>
<pin dir="in" type="address">A2</pin>

<!-- Data bus (bidirectional) -->
<pin dir="io" type="data">D0</pin>
<pin dir="io" type="data">D1</pin>
<pin dir="io" type="data">D2</pin>
```

### Control Signals

```html
<!-- Active-low control signals -->
<pin dir="in" type="chip-select">/CS</pin>
<pin dir="in" type="enable">/EN</pin>
<pin dir="in" type="reset">/RST</pin>
<pin dir="in" type="clock">CLK</pin>
```

## Full Working Example

Here's a complete HTML file demonstrating custom chips:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Custom IC Labels</title>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="chips.js"></script>
    <script src="ic-labels.js"></script>
  </head>
  <body>
    <ic-labels paper="Letter" margins="10 10 10 10">
      <!-- Standard chip -->
      <ic-chip>74LS04</ic-chip>
      
      <!-- Custom chip from scratch -->
      <ic-chip package="DIP14" label="PLA" description="custom" type="other">
        <pin type="power"></pin>
        <pin dir="in" type="address">A0</pin>
        <pin dir="in" type="address">A1</pin>
        <pin dir="out">O0</pin>
        <pin dir="out">O1</pin>
        <pin dir="out">O2</pin>
        <pin type="ground"></pin>
        <pin dir="out">O3</pin>
        <pin dir="in" type="address">A2</pin>
        <pin dir="in" type="address">A3</pin>
        <pin dir="in" type="chip-select">/CS</pin>
        <pin dir="in" type="enable">/EN</pin>
        <pin dir="out">O4</pin>
        <pin type="power">VCC</pin>
      </ic-chip>
      
      <!-- Extend existing chip -->
      <ic-chip extends="74LS08" description="modified">
        <pin num="3">CUSTOM_OUT</pin>
      </ic-chip>
    </ic-labels>
  </body>
</html>
```

## Troubleshooting

**Problem**: Chip doesn't render
- Check that `package` and `label` attributes are both present for new chips
- Verify the package name exists (e.g., `DIP14`, not `dip14`)
- Check browser console for error messages

**Problem**: Pin numbering is wrong
- Remember that without `num` attribute, pins number sequentially from 1
- If you specify `num="4"`, the next pin will be 5 (unless you specify otherwise)

**Problem**: Extended chip doesn't show changes
- Verify the base chip name in `extends` exists in `chips.js`
- Make sure you're using the correct pin numbers for overrides

**Problem**: Symbols don't display correctly
- Ensure your HTML file is saved with UTF-8 encoding
- Check that your browser supports Unicode characters
