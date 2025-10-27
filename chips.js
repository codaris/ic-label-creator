/*
 * Chip library
*
 * Create overlines with a leading slash "/"
 * Example: "/EN"
 *
 * Always use "74LS" as default/placeholder. You can override the series and 
 * silicon type in the drawChip() function
 *
 * Also supported are unicode overlays: https://fsymbols.com/generators/overline/
 * TODO: convert older pinouts from unicode to slash prefix
 *
 * (C) Klemens Ullmann-Marx / www.ull.at and contributors
 * License: GPLv3
 */


// ============================================================================
// PIN SPECIFICATION HELPERS
// ============================================================================
// These functions provide compact syntax for defining pin metadata
// Format: [label, direction, type]

/**
 * Input pin
 * @param {string} label - Pin label
 * @param {PinType} [type='other'] - Pin type
 * @returns {PinSpec}
 */
function i(label, type = 'other') {
    return [label, 'input', type];
}

/**
 * Output pin
 * @param {string} label - Pin label
 * @param {PinType} [type='other'] - Pin type
 * @returns {PinSpec}
 */
function o(label, type = 'other') {
    return [label, 'output', type];
}

/**
 * Bidirectional pin
 * @param {string} label - Pin label
 * @param {PinType} [type='other'] - Pin type
 * @returns {PinSpec}
 */
function io(label, type = 'other') {
    return [label, 'bidirectional', type];
}

/**
 * Power pin
 * @param {string} [label='⊕'] - Pin label
 * @returns {PinSpec}
 */
function pwr(label = '⊕') {
    return [label, 'input', 'power'];
}

/**
 * Ground pin
 * @param {string} [label='⏚'] - Pin label
 * @returns {PinSpec}
 */
function gnd(label = '⏚') {
    return [label, 'input', 'ground'];
}


// ============================================================================
// PACKAGE DEFINITIONS
// ============================================================================

// Standard DIP package definitions
var packages = {
    // Typical dimensions (approximate) in millimeters for common DIP packages
    // pins: total pin count
    // pinPitch: distance between adjacent pins on a side (2.54mm typical)
    // rowSpacing: distance between pin rows (aka package width across pins)
    // bodyLength: approximate plastic body length
    // bodyWidth: approximate plastic body width (use rowSpacing for visual purposes)
    DIP8: { pins: 8, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 10.16, bodyWidth: 7.62 },
    DIP10: { pins: 10, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 12.70, bodyWidth: 7.62 },
    DIP12: { pins: 12, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 15.24, bodyWidth: 7.62 },
    DIP14: { pins: 14, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 19.30, bodyWidth: 7.62 },
    DIP16: { pins: 16, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 19.30, bodyWidth: 7.62 },
    DIP18: { pins: 18, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 22.86, bodyWidth: 7.62 },
    DIP20: { pins: 20, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 25.40, bodyWidth: 7.62 },
    DIP22: { pins: 22, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 27.94, bodyWidth: 7.62 },
    DIP24: { pins: 24, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 30.48, bodyWidth: 7.62 },
    DIP28: { pins: 28, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 35.56, bodyWidth: 7.62 },
    DIP32: { pins: 32, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 40.64, bodyWidth: 7.62 },
    DIP36: { pins: 36, pinPitch: 2.54, rowSpacing: 7.62, bodyLength: 45.72, bodyWidth: 7.62 },
    DIP40: { pins: 40, pinPitch: 2.54, rowSpacing: 15.24, bodyLength: 50.80, bodyWidth: 15.24 },
    DIP48: { pins: 48, pinPitch: 2.54, rowSpacing: 15.24, bodyLength: 58.42, bodyWidth: 15.24 }
};


// ============================================================================
// CHIP DEFINITIONS
// ============================================================================

// Standard chip definitions
var chips = {

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

    '74LS02': {
        description: 'NOR',
        type: 'gate',
        package: 'DIP14',
        pins: {
            1: o('Y1'),
            2: i('A1'),
            3: i('B1'),
            4: o('Y2'),
            5: i('A2'),
            6: i('B2'),
            7: gnd(),

            8: i('A3'),
            9: i('B3'),
            10: o('Y3'),
            11: i('A4'),
            12: i('B4'),
            13: o('Y4'),
            14: pwr(),
        },
    },

    '74LS04': {
        description: 'NOT',
        type: 'gate',
        package: 'DIP14',
        pins: {
            1: i('A1'),
            2: o('Y1'),
            3: i('A2'),
            4: o('Y2'),
            5: i('A3'),
            6: o('Y3'),
            7: gnd(),

            8: o('Y4'),
            9: i('A4'),
            10: o('Y5'),
            11: i('A5'),
            12: o('Y6'),
            13: i('A6'),
            14: pwr(),
        },
    },

    '74LS07': {
        description: 'Buffer',
        type: 'gate',
        package: 'DIP14',
        pins: {
            1: i('A1'),
            2: o('Y1'),
            3: i('A2'),
            4: o('Y2'),
            5: i('A3'),
            6: o('Y3'),
            7: gnd(),

            8: o('Y4'),
            9: i('A4'),
            10: o('Y5'),
            11: i('A5'),
            12: o('Y6'),
            13: i('A6'),
            14: pwr(),
        },
    },

    '74LS08': {
        description: 'AND',
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

    '74LS14': {
        description: 'NOT',
        type: 'gate',
        package: 'DIP14',
        pins: {
            1: i('A1'),
            2: o('Y1'),
            3: i('A2'),
            4: o('Y2'),
            5: i('A3'),
            6: o('Y3'),
            7: gnd(),

            8: o('Y4'),
            9: i('A4'),
            10: o('Y5'),
            11: i('A5'),
            12: o('Y6'),
            13: i('A6'),
            14: pwr(),
        },
    },

    '74LS32': {
        description: 'OR',
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

    '74LS86': {
        description: 'XOR',
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

    '74LS107': {
        description: 'JK-FF',
        type: 'flipflop',
        package: 'DIP14',
        pins: {
            1: i('1J'),
            2: o('1Q̅'),
            3: o('1Q'),
            4: i('1K'),
            5: o('2Q'),
            6: o('2Q̅'),
            7: gnd(),

            8: i('2J'),
            9: i('2CLK', 'clock'),
            10: i('/2CLR', 'reset'),
            11: i('2K'),
            12: i('1CLK', 'clock'),
            13: i('/1CLR', 'reset'),
            14: pwr(),
        },
    },

    '74LS138': {
        description: '3to8 Demux',
        type: 'demux',
        package: 'DIP16',
        pins: {
            1: i('A', 'address'),
            2: i('B', 'address'),
            3: i('C', 'address'),
            4: i('/EN1', 'enable'),
            5: i('/EN2', 'enable'),
            6: i('EN3', 'enable'),
            7: o('/O7'),
            8: gnd(),

            9: o('/O6'),
            10: o('/O5'),
            11: o('/O4'),
            12: o('/O3'),
            13: o('/O2'),
            14: o('/O1'),
            15: o('/O0'),
            16: pwr(),
        },
    },

    '74LS139': {
        description: '2x2to4 Demux',
        type: 'demux',
        package: 'DIP16',
        pins: {
            1: i('A', 'address'),
            2: i('B', 'address'),
            3: i('C', 'address'),
            4: i('G2A', 'enable'),
            5: i('G2B', 'enable'),
            6: i('G1', 'enable'),
            7: o('Y7'),
            8: gnd(),

            9: o('Y6'),
            10: o('Y5'),
            11: o('Y4'),
            12: o('Y3'),
            13: o('Y2'),
            14: o('Y1'),
            15: o('Y0'),
            16: pwr(),
        },
    },


    '74LS153': {
        description: '2x4to1 MUX',
        type: 'mux',
        package: 'DIP16',
        pins: {
            1: i('/EnA', 'enable'),
            2: i('S0'),
            3: i('A3'),
            4: i('A2'),
            5: i('A1'),
            6: i('A0'),
            7: o('YA'),
            8: gnd(),

            9: o('YB'),
            10: i('B0'),
            11: i('B1'),
            12: i('B2'),
            13: i('B3'),
            14: i('S1'),
            15: i('/EnB', 'enable'),
            16: pwr(),
        },
    },

    '74LS157': {
        description: '4x2to1 MUX',
        type: 'mux',
        package: 'DIP16',
        pins: {
            1: i('S'),
            2: i('A1'),
            3: i('B1'),
            4: o('Y1'),
            5: i('A2'),
            6: i('B2'),
            7: o('Y2'),
            8: gnd(),

            9: o('Y3'),
            10: i('B3'),
            11: i('A3'),
            12: o('Y4'),
            13: i('B4'),
            14: i('A4'),
            15: i('/EN', 'enable'),
            16: pwr(),
        },
    },

    '74LS161': {
        description: '4bit Counter',
        type: 'counter',
        package: 'DIP16',
        pins: {
            1: i('/CLR', 'reset'),
            2: i('CLK', 'clock'),
            3: i('A'),
            4: i('B'),
            5: i('C'),
            6: i('D'),
            7: i('/ENP', 'enable'),
            8: gnd(),

            9: i('/LD'),
            10: i('/ENT', 'enable'),
            11: o('QD'),
            12: o('QC'),
            13: o('QB'),
            14: o('QA'),
            15: o('CAR'),
            16: pwr(),
        },
    },

    '74LS169': {
        description: '4bit Counter ↑/↓',
        type: 'counter',
        package: 'DIP16',
        pins: {
            1: i('U/D̅'),
            2: i('CLK', 'clock'),
            3: i('A'),
            4: i('B'),
            5: i('C'),
            6: i('D'),
            7: i('/ENP', 'enable'),
            8: gnd(),

            9: i('/LD'),
            10: i('/ENT', 'enable'),
            11: o('QD'),
            12: o('QC'),
            13: o('QB'),
            14: o('QA'),
            15: o('CAR'),
            16: pwr(),
        },
    },

    '74LS173': {
        description: '4bit Register',
        datasheet: 'http://www.ti.com/lit/ds/symlink/sn54173.pdf',
        type: 'register',
        package: 'DIP16',
        pins: {
            1: i('OE1', 'enable'),
            2: i('OE2', 'enable'),
            3: o('1Q'),
            4: o('2Q'),
            5: o('3Q'),
            6: o('4Q'),
            7: i('CLK', 'clock'),
            8: gnd(),

            9: i('/IE1', 'enable'),
            10: i('/IE2', 'enable'),
            11: i('1D'),
            12: i('1C'),
            13: i('1B'),
            14: i('1A'),
            15: i('CLR', 'reset'),
            16: pwr(),
        },
    },

    '74189': {
        description: '64bit RAM',
        type: 'ram',
        package: 'DIP16',
        pins: {
            1: i('A0', 'address'),
            2: i('ME', 'enable'),
            3: i('WE', 'enable'),
            4: i('D1', 'data'),
            5: o('S1', 'data'),
            6: i('D2', 'data'),
            7: o('S2', 'data'),
            8: gnd(),

            9: o('S3', 'data'),
            10: i('D3', 'data'),
            11: o('S4', 'data'),
            12: i('D4', 'data'),
            13: i('A3', 'address'),
            14: i('A2', 'address'),
            15: i('A1', 'address'),
            16: pwr(),
        },
    },

    '74LS193': {
        description: '4bit Counter ↑/↓',
        type: 'counter',
        package: 'DIP16',
        pins: {
            1: i('B'),
            2: o('QB'),
            3: o('QA'),
            4: i('DN', 'clock'),
            5: i('UP', 'clock'),
            6: o('QC'),
            7: o('QD'),
            8: gnd(),

            9: i('D'),
            10: i('C'),
            11: i('/LD'),
            12: o('/CAR'),
            13: o('/BOR'),
            14: i('CLR', 'reset'),
            15: i('A'),
            16: pwr(),
        },
    },


    '74LS244': {
        description: '8bit Buffer',
        type: 'buffer',
        package: 'DIP20',
        pins: {
            1: i('/1EN', 'enable'),
            2: i('1A1'),
            3: o('2Y4'),
            4: i('1A2'),
            5: o('2Y3'),
            6: i('1A3'),
            7: o('2Y2'),
            8: i('1A4'),
            9: o('2Y1'),
            10: gnd(),

            11: i('2A1'),
            12: o('1Y4'),
            13: i('2A2'),
            14: o('1Y3'),
            15: i('2A3'),
            16: o('1Y2'),
            17: i('2A4'),
            18: o('1Y1'),
            19: i('/2EN', 'enable'),
            20: pwr(),
        },
    },

    '74LS245': {
        description: '8bit Bus Transceiver',
        type: 'bus-transceiver',
        package: 'DIP20',
        pins: {
            1: i('DIR'),
            2: io('A1', 'data'),
            3: io('A2', 'data'),
            4: io('A3', 'data'),
            5: io('A4', 'data'),
            6: io('A5', 'data'),
            7: io('A6', 'data'),
            8: io('A7', 'data'),
            9: io('A8', 'data'),
            10: gnd(),

            11: io('B8', 'data'),
            12: io('B7', 'data'),
            13: io('B6', 'data'),
            14: io('B5', 'data'),
            15: io('B4', 'data'),
            16: io('B3', 'data'),
            17: io('B2', 'data'),
            18: io('B1', 'data'),
            19: i('/OE', 'enable'),
            20: pwr(),
        },
    },

    '74LS273': {
        description: '8bit Register',
        type: 'register',
        package: 'DIP20',
        pins: {
            1: i('/CLR', 'reset'),
            2: o('Q0'),
            3: i('D0'),
            4: i('D1'),
            5: o('Q1'),
            6: o('Q2'),
            7: i('D2'),
            8: i('D3'),
            9: o('Q3'),
            10: gnd(),

            11: i('CLK', 'clock'),
            12: o('Q4'),
            13: i('D4'),
            14: i('D5'),
            15: o('Q5'),
            16: o('Q6'),
            17: i('D6'),
            18: i('D7'),
            19: o('Q7'),
            20: pwr(),
        },
    },

    '74LS283': {
        description: '4bit Adder',
        type: 'adder',
        package: 'DIP16',
        pins: {
            1: o('∑2'),
            2: i('B2'),
            3: i('A2'),
            4: o('∑1'),
            5: i('A1'),
            6: i('B1'),
            7: i('CRI'),
            8: gnd(),
            9: o('CRO'),
            10: o('∑4'),
            11: i('B4'),
            12: i('A4'),
            13: o('∑3'),
            14: i('A3'),
            15: i('B3'),
            16: pwr(),
        },
    },


    '7130LA': {
        description: '1Kx8 SRAM (1KB)',
        type: 'ram',
        package: 'DIP48',       
        pins: {
            1: i('/CE', 'chip-select'),
            2: i('R/W̅'),
            3: o('/BSY'),
            4: o('/INT', 'interrupt'),
            5: i('/OE', 'enable'),
            6: i('A0', 'address'),
            7: i('A1', 'address'),
            8: i('A2', 'address'),
            9: i('A3', 'address'),
            10: i('A4', 'address'),
            11: i('A5', 'address'),
            12: i('A6', 'address'),
            13: i('A7', 'address'),
            14: i('A8', 'address'),
            15: i('A9', 'address'),
            16: io('IO0', 'data'),
            17: io('IO1', 'data'),
            18: io('IO2', 'data'),
            19: io('IO3', 'data'),
            20: io('IO4', 'data'),
            21: io('IO5', 'data'),
            22: io('IO6', 'data'),
            23: io('IO7', 'data'),
            24: gnd(),

            25: io('IO0', 'data'),
            26: io('IO1', 'data'),
            27: io('IO2', 'data'),
            28: io('IO3', 'data'),
            29: io('IO4', 'data'),
            30: io('IO5', 'data'),
            31: io('IO6', 'data'),
            32: io('IO7', 'data'),
            33: i('A9', 'address'),
            34: i('A8', 'address'),
            35: i('A7', 'address'),
            36: i('A6', 'address'),
            37: i('A5', 'address'),
            38: i('A4', 'address'),
            39: i('A3', 'address'),
            40: i('A2', 'address'),
            41: i('A1', 'address'),
            42: i('A0', 'address'),
            43: i('/OE', 'enable'),
            44: o('/INT', 'interrupt'),
            45: o('/BSY'),
            46: i('R/W̅'),
            47: i('/CE', 'chip-select'),
            48: pwr(),
        },
    },


    '28C16': {
        description: '2Kx8 EEPROM (2KB)',
        type: 'eeprom',
        package: 'DIP24',
        pins: {
            1: i('A7', 'address'),
            2: i('A6', 'address'),
            3: i('A5', 'address'),
            4: i('A4', 'address'),
            5: i('A3', 'address'),
            6: i('A2', 'address'),
            7: i('A1', 'address'),
            8: i('A0', 'address'),
            9: io('IO0', 'data'),
            10: io('IO1', 'data'),
            11: io('IO2', 'data'),
            12: gnd(),

            13: io('IO3', 'data'),
            14: io('IO4', 'data'),
            15: io('IO5', 'data'),
            16: io('IO6', 'data'),
            17: io('IO7', 'data'),
            18: i('/CE', 'chip-select'),
            19: i('A10', 'address'),
            20: i('/OE', 'enable'),
            21: i('/WE', 'enable'),
            22: i('A9', 'address'),
            23: i('A8', 'address'),
            24: pwr(),
        },
    },

    '28C64': {
        description: '8Kx8 EEPROM (8KB)',
        type: 'eeprom',
        package: 'DIP28',
        pins: {
            1: i('--', 'nc'),
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
            26: i('--', 'nc'),
            27: i('/WE', 'enable'),
            28: pwr(),
        },
    },

    '74LS595': {
        description: '8b Shift Reg',
        type: 'flipflop',
        package: 'DIP16',       
        pins: {
            1: o('QB'),
            2: o('QC'),
            3: o('QD'),
            4: o('QE'),
            5: o('QF'),
            6: o('QG'),
            7: o('QH'),
            8: gnd(),

            9: o("QH'"),
            10: i('/SCLR', 'reset'),
            11: i('SCLK', 'clock'),
            12: i('RCLK', 'clock'),
            13: i('/OE', 'enable'),
            14: i('SER'),
            15: o('QA'),
            16: pwr(),
        },
    },

    '555': {
        description: '',
        type: 'analog',
        package: 'DIP8',
        pins: {
            1: gnd(),
            2: i('/TRI'),
            3: o('OUT'),
            4: i('/RST', 'reset'),
            5: i('CTV'),
            6: i('THR'),
            7: io('DCH'),
            8: pwr(),
        },
    },

    'C555': {
        description: '',
        type: 'analog',
        package: 'DIP8',
        pins: {
            1: gnd(),
            2: i('/TRI'),
            3: o('OUT'),
            4: i('/RST', 'reset'),
            5: i('CTV'),
            6: i('THR'),
            7: io('DCH'),
            8: pwr(),
        },
    },

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
            34: o('R/W̅'),
            35: i('NC', 'nc'),
            36: i('BE', 'enable'),
            37: i('PHI2', 'clock'),
            38: i('/SO'),
            39: o('PHI2O', 'clock'),
            40: i('/RES', 'reset'),
        },
    },

    'W65C22': {
        description: 'VIA',
        type: 'via',
        package: 'DIP40',
        pins: {
            1: gnd(),
            2: io('PA0'),
            3: io('PA1'),
            4: io('PA2'),
            5: io('PA3'),
            6: io('PA4'),
            7: io('PA5'),
            8: io('PA6'),
            9: io('PA7'),
            10: io('PB0'),
            11: io('PB1'),
            12: io('PB2'),
            13: io('PB3'),
            14: io('PB4'),
            15: io('PB5'),
            16: io('PB6'),
            17: io('PB7'),
            18: io('CB1'),
            19: io('CB2'),
            20: pwr(),

            21: o('/IRQ', 'interrupt'),
            22: i('R/W̅'),
            23: i('/CS2', 'chip-select'),
            24: i('CS1', 'chip-select'),
            25: i('PHI2', 'clock'),
            26: io('D7', 'data'),
            27: io('D6', 'data'),
            28: io('D5', 'data'),
            29: io('D4', 'data'),
            30: io('D3', 'data'),
            31: io('D2', 'data'),
            32: io('D1', 'data'),
            33: io('D0', 'data'),
            34: i('/RES', 'reset'),
            35: i('RS3', 'address'),
            36: i('RS2', 'address'),
            37: i('RS1', 'address'),
            38: i('RS0', 'address'),
            39: io('CA2'),
            40: io('CA1'),
        },
    },

    'W65C51': {
        description: 'ACIA',
        type: 'acia',
        package: 'DIP28',
        pins: {
            1: pwr(),
            2: i('CS0', 'chip-select'),
            3: i('/CS1', 'chip-select'),
            4: i('/RES', 'reset'),
            5: i('RxC', 'clock'),
            6: i('XTLI', 'clock'),
            7: o('XLT0', 'clock'),
            8: o('/RTS'),
            9: i('/CTS'),
            10: o('TxD'),
            11: o('/DTR'),
            12: i('RxD'),
            13: i('RS0', 'address'),
            14: i('RS1', 'address'),

            15: gnd(),
            16: i('/DCD'),
            17: i('/DSR'),
            18: io('D0', 'data'),
            19: io('D1', 'data'),
            20: io('D2', 'data'),
            21: io('D3', 'data'),
            22: io('D4', 'data'),
            23: io('D5', 'data'),
            24: io('D6', 'data'),
            25: io('D7', 'data'),
            26: o('IRQB', 'interrupt'),
            27: i('PHI2', 'clock'),
            28: i('R/W̅'),
        },
    },

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

    '62256': {
        description: '32Kx8 SRAM (256K)',
        type: 'sram',
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

    '7C128A': {
        description: '2Kx8 SRAM (16K)',
        type: '',
        package: 'DIP24',
        pins: {
            1: i('A7', 'address'),
            2: i('A6', 'address'),
            3: i('A5', 'address'),
            4: i('A4', 'address'),
            5: i('A3', 'address'),
            6: i('A2', 'address'),
            7: i('A1', 'address'),
            8: i('A0', 'address'),
            9: io('IO0', 'data'),
            10: io('IO1', 'data'),
            11: io('IO2', 'data'),
            12: gnd(),

            13: io('IO3', 'data'),
            14: io('IO4', 'data'),
            15: io('IO5', 'data'),
            16: io('IO6', 'data'),
            17: io('IO7', 'data'),
            18: i('/CE', 'chip-select'),
            19: i('A10', 'address'),
            20: i('/OE', 'enable'),
            21: i('/WE', 'enable'),
            22: i('A9', 'address'),
            23: i('A8', 'address'),
            24: pwr(),
        },
    },

    // empty template
    ' ': {
        description: '',
        type: '',
        package: 'DIP24',
        pins: {
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: '',
            8: '',
            9: '',
            10: '',
            11: '',
            12: '',
            13: '',
            14: '',
            15: '',
            16: '',
            17: '',
            18: '',
            19: '',
            20: '',
            21: '',
            22: '',
            23: '',
            24: '',
        },
    },

};  // end of var "chips"
