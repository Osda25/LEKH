import prisma from '../src/prisma.js'

const equipmentTypes = [
  {
    name: 'FDM 3D Printer',
    description:
      'Create physical prototypes and enclosures from digital 3D models using filament. This stationary equipment is intended for booked use in the lab.'
  },
  {
    name: 'Digital Oscilloscope',
    description:
      'Display and inspect electrical signals when testing circuits and microcontroller projects. This instrument is intended for use at an electronics workstation in the lab.'
  },
  {
    name: 'Bench Power Supply',
    description:
      'Provide adjustable power for low-voltage electronics experiments and prototypes. This stationary instrument is intended for use in the lab.'
  },
  {
    name: 'Soldering Station',
    description:
      'Assemble and repair electronic circuits using a temperature-controlled soldering iron. This equipment is intended for use at a designated soldering workstation in the lab.'
  },
  {
    name: 'Raspberry Pi 4 Model B Kit',
    description:
      'Explore Linux, programming and connected devices with a single-board computer. The example kit includes a power supply, microSD card and display cable and is intended for take-home loans.'
  },
  {
    name: 'Arduino Uno Starter Kit',
    description:
      'Learn microcontroller programming and build interactive circuits. The example kit includes an Arduino Uno, breadboard, jumper wires, LEDs and resistors and is intended for take-home loans.'
  },
  {
    name: 'ESP32 Development Kit',
    description:
      'Build connected prototypes using a microcontroller with Wi-Fi and Bluetooth. The example kit includes a development board, USB cable and breadboard and is intended for take-home loans.'
  },
  {
    name: 'Environmental Sensor Kit',
    description:
      'Collect measurements for electronics and connected-device projects using temperature, humidity and light sensors. The example kit is intended for take-home loans alongside a compatible microcontroller.'
  },
  {
    name: 'Digital Camera Kit',
    description:
      'Document prototypes, record project demonstrations and capture images for computer vision experiments. The example kit includes a camera, lens, memory card and charger and is intended for take-home loans.'
  },
  {
    name: 'Portable Digital Multimeter',
    description:
      'Measure voltage, resistance and continuity while building and troubleshooting low-voltage circuits. This portable instrument is intended for use in the lab or through a take-home loan.'
  }
]

async function main() {
  const result = await prisma.equipmentType.createMany({
    data: equipmentTypes,
    skipDuplicates: true
  })

  console.log(`Seed complete: ${result.count} equipment types added.`)
}

try {
  await main()
} catch (error) {
  console.error('Equipment seed failed:', error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}