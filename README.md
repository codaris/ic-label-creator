# ic-label-creator
Javascript/SVG Label Creator for IC Chip Pinouts

<img src="/assets/readme-example-labels.png" />



## About

This project was inspired by Ben Eater's 8-Bit breadboard computer. Multiple wiring errors while building the SAP-1 breadboard computer lead to the desire to label all chips with the actual pinouts.

## Participation

I'd be happy to accept pull request for other projects  additions to the "chip database" and general ideas and improvements.
You're also welcome to adapt the script for your own project. If you spot errors, please report them as issue or pull request too.

## Usage

How to create your own set of chips:

- Copy "ben-eater-8bit-computer.html" to a new file e.g. "your-set.html"
- Add the chips you'd like to print to the section "Draw chips"
- If you miss a chip's definitions in "chips.js" please add them and perform a pull request to contribute.
- Open your-set.html file in a web browser and print on self-sticking print labels. I used Firefox.
- If you create a set for public project please contribute it with a pull request

## New: Web Components (no build step)

You can now declare pages using custom elements in pure HTML with no build tools. See `index2.html` for a minimal example. The page configuration looks like this:

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
	<!-- count attribute repeats a chip -->
	<!-- paper: A4 or Letter; margins in mm as 1-4 CSS-like values -->
	<!-- Rendering still uses the legacy drawChip() from ic-label-creator.js -->
	<!-- Note: currently supports a single <ic-labels> per page due to legacy #page target. -->
	<!-- To print, use your browser's Print dialog. -->
	<!-- Works when opened as a local file. -->
</ic-labels>
```

Type checking in editors: the new component module (`ic-web-components.js`) enables `//@ts-check` and ships `types/global.d.ts` so VS Code can catch type errors without a build step. No transpilation required.

## Background and Acknowledgements

I used this as an opportunity to learn a bit of SVG and wrote a HTML/Javascript/SVG creator for computer IC chips.

Big thanks to Ben Eater for the wonderful videos on YouTube. I learned so much from it and finally understood how exactly a cpu/computer works.

