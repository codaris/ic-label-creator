### Spring 2020

- Initial release

### 2021-05-02

- Merged contribution by gatesphere: added Ben Eater 6502 set, typos

### 2021-11-13 

- Merged contribution by lowercasename: support active low overlines by leading "/"

### 2021-11-13 

- Support for series (74, 54) and logic family (LS, HC, ...)
- Added chips
- Updated jQuery

### 2024-07-01

- Added pinout for W65C51N Asynchronous Communications Interface Adapter (ACIA)

### 2024-07-03

- Merged pull request #5

### 2025-10-21

- Internal development changes preparing for Web Components

### 2025-10-25

- Introduced Web Components: `<ic-labels>` container and `<ic-chip>` elements
- Consolidated legacy logic and removed global variables
- Working version of the new component-based renderer

### 2025-10-26

- Pin metadata system: directions (input/output/bidirectional) and semantic types (power, ground, address, data, clock, etc.)
- Colorized pins based on type; added bidirectional pin rendering
- Custom chip definitions in markup; ability to extend existing chips
- Improved font rendering and positioning for labels; pin boxes/squares
- Adopted DIP package definitions; improved spacing and chip sizing
- Additional robustness: error checks and cleanup
