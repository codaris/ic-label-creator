# IC Label Creator
Javascript/SVG Label Creator for IC Chip Pinouts

<img src="assets/readme-example-labels.png" />

## About This Fork

This project is a fork of the original [ic-label-creator](https://github.com/klemens-u/ic-label-creator) created by Klemens Ullmann-Marx. It has been significantly refactored and extended with new features and improved usability. 

### Key Features
- **No build step required**: Easy configuration in pure HTML and run locally in your browser.
- **Custom chip definitions**: Define chips directly in markup or extend existing ones
- **Comprehensive pin metadata**: Specify direction, type, and color for each pin
- **SVG-based rendering**: High-quality printable labels for ICs
- **Flexible printing**: Print directly from your browser 
- **Extensible chip database**: Easily add new chips or contribute improvements

## Usage

### Quick Start
1. Copy `ben-eater-8bit-computer.html` or `index.html` to a new file (e.g., `your-set.html`)
2. Add `<ic-chip>` elements for each chip you want to print
3. If a chip is missing from `chips.js`, define it in markup or add it to the database
4. Open your HTML file in a browser and print to paper


### Basic Example

```html
<ic-labels paper="Letter" margins="10 10 10 10">
</ic-labels>
```

### `<ic-labels>` Configuration Options

You can customize the output using the following attributes on the `<ic-labels>` tag:

| Attribute                | Type    | Default   | Description |
|--------------------------|---------|-----------|-------------|
| `paper`                  | string  | `Letter`  | Paper size for output. Use `Letter` or `A4`. |
| `margins`                | string  | `10 10 10 10` | Margins in mm: `top right bottom left`. |
| `pinDistance`            | number  | `2.54`    | Pin pitch in mm (distance between pins). |
| `heightSizeAdjust`       | number  | `0`       | Adjusts chip height in mm. |
| `svgStrokeWidth`         | number  | `0.1`     | Stroke width for SVG outlines in mm. |
| `svgStrokeOffset`        | number  | `0.1`     | Stroke offset for SVG outlines in mm. |
| `defaultChipLogicFamily` | string  | `LS`      | Default logic family for chips. |
| `defaultChipSeries`      | string  | `74`      | Default chip series. |
| `gimmeColor`             | boolean | `true`    | Enables color coding for pins and chips. Set to `false` to disable. |
| `pinFontFamily`          | string  | *(unset)* | Font family for pin labels. |

All attributes are optional. If omitted, defaults are used. Example:

```html
<ic-labels paper="A4" margins="12 12 12 12" pinDistance="2.54" gimmeColor="false">
  <!-- chip definitions -->
</ic-labels>
```

See `index.html` for more usage examples.
</ic-labels>
```

#### Custom Chip Definitions
You can define chips directly in HTML:

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

#### Extending Existing Chips
Override pins or properties of a chip from the database:

```html
<ic-chip extends="74LS08" description="custom">
	<pin num="5">A0</pin>
</ic-chip>
```

See [`CUSTOM_CHIPS_GUIDE.md`](CUSTOM_CHIPS_GUIDE.md) for full details.

## Pin Metadata System

Define pin direction and type for color-coded, visually distinct labels. See [`PIN_METADATA_GUIDE.md`](PIN_METADATA_GUIDE.md) for all options and helper functions.

## Printing

Open your HTML file in Firefox or Chrome and use the browser's Print dialog.

## Contributing

Pull requests are welcome for new chips, features, or documentation improvements. Please see the guides in this repo for details.

## Acknowledgements

* [Klemens Ullmann-Marx](https://github.com/klemens-u) for the original version.
* Ben Eater for his [wonderful video series](https://www.youtube.com/c/BenEater) on YouTube.
