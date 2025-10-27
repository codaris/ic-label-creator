# IC Label Creator
Javascript/SVG Label Creator for IC Chip Pinouts

<img src="assets/readme-example-labels.png" />

## About This Fork

This project is a fork of the original [ic-label-creator](https://github.com/klemens-u/ic-label-creator) created by Klemens Ullmann-Marx. It has been significantly refactored and extended with new features and improved usability. 

The original project was inspired by Ben Eater's 8-Bit breadboard computer.

### Key Features
- **No build step required**: Use modern Web Components for easy configuration in pure HTML
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
4. Open your HTML file in a browser and print on self-adhesive labels
5. Contribute new sets or chips via pull request

### Basic Example

```html
<ic-labels paper="Letter" margins="10 10 10 10">
	<ic-chip>555</ic-chip>
	<ic-chip count="2">555</ic-chip>
	<ic-chip>74LS04</ic-chip>
	<ic-chip>74LS08</ic-chip>
	<ic-chip>74LS32</ic-chip>
	<ic-chip>74LS00</ic-chip>
	<ic-chip>W65C02</ic-chip>
	<ic-chip>W65C22</ic-chip>
	<ic-chip>28C256</ic-chip>
	<ic-chip>62256</ic-chip>
	<ic-chip>W65C51</ic-chip>
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

See `CUSTOM_CHIPS_GUIDE.md` for full details.

## Pin Metadata System

Define pin direction and type for color-coded, visually distinct labels. See `PIN_METADATA_GUIDE.md` for all options and helper functions.

## Printing

Open your HTML file in Firefox or Chrome and use the browser's Print dialog. Labels are optimized for self-adhesive sheets.

## Contributing

Pull requests are welcome for new chips, features, or documentation improvements. Please see the guides in this repo for details.

## Background and Acknowledgements

I used this as an opportunity to learn a bit of SVG and wrote a HTML/Javascript/SVG creator for computer IC chips.

Big thanks to Ben Eater for the wonderful videos on YouTube. I learned so much from it and finally understood how exactly a cpu/computer works.

