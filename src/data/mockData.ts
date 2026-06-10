import { Product, Course, Broadcast, OpenPosition } from '../types';

const img = (id: string) => `https://images.unsplash.com/${id}?w=500&auto=format&fit=crop&q=60`;

const imgPool = [
  img('photo-1518770660439-4636190af475'),
  img('photo-1601524909162-be87252be298'),
  img('photo-1555664424-778a1e5e1b48'),
  img('photo-1485827404703-89b55fcc595e'),
  img('photo-1544716278-ca5e3f4abd8c'),
  img('photo-1517059224940-d4af9eec41b7'),
  img('photo-1581091226825-a6a2a5aee158'),
  img('photo-1553408211-466a0d9ab3e0'),
  img('photo-1635070041078-e363dbe005cb'),
  img('photo-1617788138017-80ad40651399'),
  img('photo-1531297484001-80022131f5a1'),
  img('photo-1558494949-ef010cbdcc31'),
  img('photo-1563986768609-322da13575f3'),
  img('photo-1526374965328-7f61d4dc18c5'),
  img('photo-1517077308545-856e55c8e26f'),
  img('photo-1504639725590-34d0984388bd'),
  img('photo-1629654297299-c8506221ca97'),
  img('photo-1611174740421-2c9f0a43f3ec'),
  img('photo-1558618666-fcd25c85f82e'),
  img('photo-1580752300992-559f8e0736b0'),
];

const vendors = [
  'Nexus Embedded Corp', 'Silicon Ventures Ltd', 'Matrix Transducers',
  'OmniDrive Robotics', 'Core Silicon Foundry', 'Embedded Dynamics Ltd',
  'Pinnacle Semiconductor', 'Arcus Wireless', 'VoltCore Power',
  'SensArray Technologies',
];


export const FEATURED_PRODUCTS: Product[] = [
  // ── Existing 6 ──
  { id: 'prod-001', name: 'Nexus IoT Gateway Hub X1', category: 'IoT Devices', price: 349.99, rating: 4.8, image: imgPool[0], description: 'Industrial-grade multi-protocol gateway providing Edge intelligence, automated broker architecture, and absolute end-to-end telemetry synchronization.', specs: { Processor: 'Quad-Core 1.8GHz Cortex A72', Memory: '4GB LPDDR4', Protocols: 'MQTT, CoAP, ZigBee, LoRaWAN, BLE 5.2' }, vendorName: 'Nexus Embedded Corp', stock: 42 },
  { id: 'prod-002', name: 'RT-SOC Core Evolution Board', category: 'Development Boards', price: 189.50, rating: 4.9, image: imgPool[1], description: 'High performance SOC development board configured for advanced neural networks training and real-time visual streams inference.', specs: { 'FPGA Fabric': '150K Logic Cells with DSP blocks', RAM: '8GB LPDDR4 Core Spec', Interface: 'PCIe Gen3 x4, Dual Gigabit Ethernet' }, vendorName: 'Silicon Ventures Ltd', stock: 28 },
  { id: 'prod-003', name: 'Precision Biosensing Matrix Module', category: 'Sensors', price: 79.00, rating: 4.7, image: imgPool[2], description: 'Integrated biometric sensing assembly equipped with optical filters and galvanic response indicators for clinical or advanced interactive prototypes.', specs: { 'Sensor Channels': 'SpO2, Pulse Waveform, Galvanic Skin Response', 'Accuracy Offset': '±0.02% calibrated bias', Communication: 'I2C Interface, SPI Bus up to 10MHz' }, vendorName: 'Matrix Transducers', stock: 124 },
  { id: 'prod-004', name: 'Autonomous Mecanum Drive-Train Pod', category: 'Robotics', price: 520.00, rating: 4.6, image: imgPool[3], description: 'Four-wheel omnibus drivetrain base complete with high-torque magnetic encoder brushless motors, designed for high precision navigation research.', specs: { 'Payload Limit': '25 Kilograms maximum operational stress', 'Driver Control': 'CAN-Bus Controller Interface', 'Telemetry Rate': '200Hz closed-loop correction output' }, vendorName: 'OmniDrive Robotics', stock: 15 },
  { id: 'prod-005', name: 'Smart Grid Din-Rail Power Core', category: 'Power Solutions', price: 210.00, rating: 4.7, image: imgPool[4], description: 'Intelligent power distribution unit monitoring peak loads, tracking thermal profiles, and executing protective safe cutoffs over modbus interface.', specs: { 'Output Channels': '6 Individually Switchable Regulated Outlets', 'Total Current': '24A peak continuous load', 'Efficiency': '94.5% efficiency curve indicator' }, vendorName: 'Nexus Embedded Corp', stock: 50 },
  { id: 'prod-006', name: 'Sub-Giga Range Telemetry Shield', category: 'Electronics Components', price: 45.00, rating: 4.5, image: imgPool[5], description: 'High-frequency transceiver shield designed for long-range environmental mesh networks deployment on standard RT boards.', specs: { 'Frequency band': '868MHz / 915MHz dynamic tuning firmware', 'Max Power Output': '+22dBm adjustable RF level', 'Receiver Gain': '-148dBm state sensitivity' }, vendorName: 'Matrix Transducers', stock: 200 },

  // ── 1. Microcontroller Boards (10) ──
  { id: 'prod-007', name: 'Arduino Uno R4', category: 'Microcontroller Boards', price: 34.99, rating: 4.8, image: imgPool[16], description: 'Classic maker board upgraded with a 32-bit Renesas RA4M1 processor for advanced prototyping.', specs: { MCU: 'Renesas RA4M1 32-bit', 'Digital I/O': '14 pins', Memory: '256KB Flash, 32KB SRAM' }, vendorName: vendors[0], stock: 300 },
  { id: 'prod-008', name: 'Raspberry Pi Pico W', category: 'Microcontroller Boards', price: 12.50, rating: 4.7, image: imgPool[17], description: 'Flexible, low-cost microcontroller board featuring built-in Wi-Fi and the RP2040 chip.', specs: { MCU: 'RP2040 Dual-Core Cortex-M0+', RAM: '264KB SRAM', Connectivity: '802.11n Wi-Fi' }, vendorName: vendors[1], stock: 500 },
  { id: 'prod-009', name: 'ESP32-WROOM-32E Module', category: 'Microcontroller Boards', price: 8.99, rating: 4.6, image: imgPool[8], description: 'Powerful generic Wi-Fi and Bluetooth MCU module targeting a wide variety of IoT applications.', specs: { MCU: 'ESP32 Dual-Core Xtensa LX6', RAM: '520KB SRAM', Wireless: 'Wi-Fi + BLE 4.2' }, vendorName: vendors[7], stock: 800 },
  { id: 'prod-010', name: 'STM32 Nucleo-64', category: 'Microcontroller Boards', price: 24.99, rating: 4.9, image: imgPool[9], description: 'Affordable and flexible development board from STMicroelectronics for rapid prototyping.', specs: { MCU: 'STM32F446RE Cortex-M4', RAM: '128KB SRAM', 'Form Factor': 'Arduino Uno compatible' }, vendorName: vendors[2], stock: 150 },
  { id: 'prod-011', name: 'Teensy 4.1', category: 'Microcontroller Boards', price: 39.99, rating: 4.9, image: imgPool[1], description: 'ARM Cortex-M7 board boasting an impressive clock speed of 600 MHz for heavy calculative computing.', specs: { MCU: 'NXP i.MX RT1062 Cortex-M7', RAM: '8MB SRAM', Speed: '600MHz' }, vendorName: vendors[5], stock: 90 },
  { id: 'prod-012', name: 'Adafruit Feather M4 Express', category: 'Microcontroller Boards', price: 29.99, rating: 4.7, image: imgPool[19], description: 'Compact, stackable development ecosystem using the speedy ATSAMD51 chip.', specs: { MCU: 'ATSAMD51J19 Cortex-M4F', RAM: '192KB SRAM', 'Flash': '512KB' }, vendorName: vendors[0], stock: 120 },
  { id: 'prod-013', name: 'MSP430 LaunchPad', category: 'Microcontroller Boards', price: 14.99, rating: 4.5, image: imgPool[7], description: 'Texas Instruments ultra-low-power microcontroller development platform.', specs: { MCU: 'MSP430FR5994 16-bit RISC', RAM: '8KB SRAM', 'Power': 'Ultra-low 0.4µA standby' }, vendorName: vendors[1], stock: 220 },
  { id: 'prod-014', name: 'Particle Boron LTE', category: 'Microcontroller Boards', price: 69.99, rating: 4.6, image: imgPool[9], description: 'LTE cellular development board perfect for connecting embedded projects outside Wi-Fi range.', specs: { MCU: 'nRF52840 Cortex-M4F', Connectivity: 'LTE Cat M1, BLE 5.0', 'Flash': '1MB' }, vendorName: vendors[7], stock: 60 },
  { id: 'prod-015', name: 'Micro:bit v2', category: 'Microcontroller Boards', price: 19.99, rating: 4.8, image: imgPool[18], description: 'Educational pocket-sized computer with built-in sensors, LED matrix, and speaker.', specs: { MCU: 'nRF52833 Cortex-M4F', Sensors: 'Accelerometer, Magnetometer, Microphone', Display: '5x5 LED Matrix' }, vendorName: vendors[5], stock: 400 },
  { id: 'prod-016', name: 'Seeeduino Xiao', category: 'Microcontroller Boards', price: 9.99, rating: 4.6, image: imgPool[16], description: 'Ultra-small SAMD21-based development board designed for wearables and tiny spaces.', specs: { MCU: 'SAMD21G18 Cortex-M0+', 'Dimensions': '21x18mm', 'Flash': '256KB' }, vendorName: vendors[2], stock: 350 },

  // ── 2. Embedded Wireless Modules (6) ──
  { id: 'prod-017', name: 'Nordic nRF52840 Module', category: 'Embedded Wireless Modules', price: 14.99, rating: 4.8, image: imgPool[8], description: 'Premium multiprotocol SoC optimized for advanced Bluetooth Low Energy applications.', specs: { MCU: 'nRF52840 Cortex-M4F', Wireless: 'BLE 5.3, Thread, Zigbee', RAM: '256KB SRAM' }, vendorName: vendors[7], stock: 280 },
  { id: 'prod-018', name: 'XBee3 Zigbee 3.0 Module', category: 'Embedded Wireless Modules', price: 32.99, rating: 4.7, image: imgPool[19], description: 'Modular RF platform offering easy-to-integrate wireless mesh connectivity.', specs: { Protocol: 'Zigbee 3.0, Thread', Range: '400m LOS', Interface: 'UART, SPI' }, vendorName: vendors[7], stock: 140 },
  { id: 'prod-019', name: 'LoRaWAN RFM95W Transceiver', category: 'Embedded Wireless Modules', price: 9.99, rating: 4.6, image: imgPool[5], description: 'Long-range transceiver module operating at ultra-high frequencies for sparse IoT nodes.', specs: { Frequency: '868/915 MHz', Range: '15km LOS', Interface: 'SPI' }, vendorName: vendors[7], stock: 500 },
  { id: 'prod-020', name: 'HC-05 Bluetooth Module', category: 'Embedded Wireless Modules', price: 4.99, rating: 4.4, image: imgPool[18], description: 'Traditional serial port protocol module used for legacy Bluetooth communication.', specs: { Standard: 'Bluetooth 2.0 + EDR', Range: '10m', Interface: 'UART' }, vendorName: vendors[2], stock: 900 },
  { id: 'prod-021', name: 'Quectel BG96 LTE Module', category: 'Embedded Wireless Modules', price: 42.99, rating: 4.7, image: imgPool[9], description: 'Integrated LTE Cat M1/NB-IoT wireless module featuring ultra-low power consumption profiles.', specs: { Networks: 'LTE Cat M1, NB-IoT, EGPRS', 'Power': 'Ultra-low 0.2mA sleep', GNSS: 'GPS, GLONASS' }, vendorName: vendors[7], stock: 80 },
  { id: 'prod-022', name: 'SIM800L GSM/GPRS Module', category: 'Embedded Wireless Modules', price: 7.99, rating: 4.3, image: imgPool[0], description: 'Compact cellular breakout module that enables raw SMS, voice, and data tasks.', specs: { Bands: '850/900/1800/1900MHz', Protocol: 'GSM/GPRS', Interface: 'UART, AT Commands' }, vendorName: vendors[2], stock: 600 },

  // ── 3. Power Management ICs (7) ──
  { id: 'prod-023', name: 'TI TPS62130 Buck Converter', category: 'Power Management ICs', price: 5.99, rating: 4.8, image: imgPool[14], description: 'High-efficiency step-down buck converter managing up to 3A output with excellent power density.', specs: { 'Input Voltage': '3-17V', 'Output Current': '3A', Efficiency: '95% peak' }, vendorName: vendors[6], stock: 450 },
  { id: 'prod-024', name: 'ADI LTC3589 PMIC', category: 'Power Management ICs', price: 12.99, rating: 4.7, image: imgPool[4], description: 'Highly integrated power management solution tailored for modern multi-rail processors.', specs: { 'Output Rails': '8 programmable', Interface: 'I2C', 'Input Range': '2.7-5.5V' }, vendorName: vendors[6], stock: 120 },
  { id: 'prod-025', name: 'MAX17260 Fuel Gauge IC', category: 'Power Management ICs', price: 8.50, rating: 4.6, image: imgPool[14], description: 'Ultra-low power fuel gauge IC offering accurate battery health estimations.', specs: { 'Chemistry': 'Li-Po, Li-Ion, LiFePO4', Interface: 'I2C', 'Quiescent Current': '1.5µA' }, vendorName: vendors[3], stock: 200 },
  { id: 'prod-026', name: 'L7805 Linear Voltage Regulator', category: 'Power Management ICs', price: 0.99, rating: 4.9, image: imgPool[13], description: 'Iconic linear voltage regulator delivering a rock-solid fixed 5V output.', specs: { 'Output Voltage': '5V ±2%', 'Output Current': '1.5A', 'Dropout Voltage': '2V' }, vendorName: vendors[6], stock: 2000 },
  { id: 'prod-027', name: 'MCP73831 Li-Po Charger', category: 'Power Management ICs', price: 2.99, rating: 4.5, image: imgPool[13], description: 'Fully integrated linear charge management controller for single-cell Li-Po/Li-Ion packs.', specs: { 'Charge Current': '500mA programmable', 'Cell Count': '1-cell Li-Po', 'Safety': 'Thermal regulation' }, vendorName: vendors[6], stock: 650 },
  { id: 'prod-028', name: 'MP2307 Step-Down Converter', category: 'Power Management ICs', price: 3.50, rating: 4.6, image: imgPool[14], description: 'Monolithic step-down switch-mode converter capable of wide input voltage tracking.', specs: { 'Input Voltage': '4.75-23V', 'Output Current': '3A', 'Switching Frequency': '340kHz' }, vendorName: vendors[6], stock: 380 },
  { id: 'prod-029', name: 'Infineon OPTIGA Trust M', category: 'Power Management ICs', price: 6.99, rating: 4.7, image: imgPool[0], description: 'Dedicated hardware security chip that also regulates boot authentication schemes.', specs: { Interface: 'I2C', Security: 'Common Criteria EAL6+', 'Key Storage': 'Up to 10 keys' }, vendorName: vendors[6], stock: 170 },

  // ── 4. Sensor Interface Circuits (10) ──
  { id: 'prod-030', name: 'MPU-6050 6-Axis Motion Sensor', category: 'Sensor Interface Circuits', price: 6.99, rating: 4.7, image: imgPool[7], description: 'Popular 6-axis motion tracking sensor used widely in drone stabilization and robotics.', specs: { 'Gyro Range': '±250/500/1000/2000°/s', 'Accel Range': '±2/4/8/16g', Interface: 'I2C' }, vendorName: vendors[9], stock: 550 },
  { id: 'prod-031', name: 'DHT22 Temperature/Humidity', category: 'Sensor Interface Circuits', price: 4.99, rating: 4.5, image: imgPool[7], description: 'Digital sensor using a capacitive humidity element to read ambient air conditions.', specs: { 'Temp Range': '-40~80°C ±0.5°C', 'Humidity Range': '0-100% RH ±2%', Interface: '1-Wire' }, vendorName: vendors[9], stock: 700 },
  { id: 'prod-032', name: 'Bosch BME280 Environmental', category: 'Sensor Interface Circuits', price: 8.99, rating: 4.8, image: imgPool[7], description: 'Environmental sensor tracking precise barometric pressure, humidity, and real-time temperature.', specs: { Pressure: '±1 hPa accuracy', 'Humidity': '±3% RH', Interface: 'I2C/SPI' }, vendorName: vendors[9], stock: 320 },
  { id: 'prod-033', name: 'VL53L0X Time-of-Flight Sensor', category: 'Sensor Interface Circuits', price: 9.99, rating: 4.6, image: imgPool[7], description: 'Laser-ranging sensor module delivering precise distance measurements regardless of target reflectance.', specs: { Range: 'Up to 2m', Resolution: '1mm', Interface: 'I2C' }, vendorName: vendors[9], stock: 250 },
  { id: 'prod-034', name: 'HC-SR04 Ultrasonic Sensor', category: 'Sensor Interface Circuits', price: 3.99, rating: 4.4, image: imgPool[7], description: 'Affordable acoustic range finder emitting high-frequency pulses to safely map obstacles.', specs: { Range: '2-400cm', Resolution: '3mm', 'Frequency': '40kHz' }, vendorName: vendors[9], stock: 900 },
  { id: 'prod-035', name: 'ADS1115 16-Bit ADC', category: 'Sensor Interface Circuits', price: 11.99, rating: 4.7, image: imgPool[7], description: 'External analog-to-digital converter adding highly accurate precision inputs to microcontrollers.', specs: { Resolution: '16-bit', Channels: '4 differential / 8 single-ended', Interface: 'I2C' }, vendorName: vendors[9], stock: 340 },
  { id: 'prod-036', name: 'MAX30102 Oximeter Sensor', category: 'Sensor Interface Circuits', price: 14.99, rating: 4.5, image: imgPool[7], description: 'Integrated pulse oximetry and heart-rate monitor biosensor module.', specs: { 'LEDs': 'Red + IR', 'Sample Rate': '400Hz', Interface: 'I2C' }, vendorName: vendors[9], stock: 150 },
  { id: 'prod-037', name: 'TCS34725 Color Sensor', category: 'Sensor Interface Circuits', price: 7.99, rating: 4.4, image: imgPool[7], description: 'RGB light sensor array with an integrated IR blocking filter for precise color decoding.', specs: { 'Filter': 'IR blocking', Resolution: '16-bit per channel', Interface: 'I2C' }, vendorName: vendors[9], stock: 190 },
  { id: 'prod-038', name: 'MQ-2 Gas Sensor', category: 'Sensor Interface Circuits', price: 4.49, rating: 4.3, image: imgPool[7], description: 'Combustible gas and smoke sensor utilizing a heating-element metal oxide array.', specs: { 'Gases': 'LPG, Propane, Hydrogen, Methane', 'Heater Voltage': '5V DC', 'Output': 'Analog voltage' }, vendorName: vendors[9], stock: 410 },
  { id: 'prod-039', name: 'MLX90614 IR Thermometer', category: 'Sensor Interface Circuits', price: 12.99, rating: 4.6, image: imgPool[7], description: 'Non-contact thermal sensor module designed for touchless temperature scanning.', specs: { 'Temp Range': '-70~380°C', Accuracy: '±0.5°C', Interface: 'I2C' }, vendorName: vendors[9], stock: 220 },

  // ── 5. Motor Driver Circuits (7) ──
  { id: 'prod-040', name: 'L298N Dual H-Bridge Driver', category: 'Motor Driver Circuits', price: 8.99, rating: 4.5, image: imgPool[5], description: 'Heavy-duty legacy motor driver module controlling direction and speed for two DC motors.', specs: { 'Motors': '2x DC or 1x Stepper', 'Current': '2A per channel', 'Logic Voltage': '5V' }, vendorName: vendors[6], stock: 320 },
  { id: 'prod-041', name: 'A4988 Stepper Driver', category: 'Motor Driver Circuits', price: 6.99, rating: 4.6, image: imgPool[5], description: 'Microstepping driver with an integrated translator tailored for 3D printer steps.', specs: { 'Max Current': '2A', 'Microsteps': 'Up to 1/16', 'Protection': 'Overcurrent, thermal' }, vendorName: vendors[6], stock: 450 },
  { id: 'prod-042', name: 'DRV8833 Dual Motor Driver', category: 'Motor Driver Circuits', price: 5.99, rating: 4.7, image: imgPool[5], description: 'Modern low-voltage H-Bridge option featuring thermal and overcurrent safety shutoffs.', specs: { 'Motors': '2x DC or 1x Stepper', 'Current': '1.5A per channel', 'Voltage': '2.7-10.8V' }, vendorName: vendors[6], stock: 280 },
  { id: 'prod-043', name: 'TB6612FNG Motor Driver', category: 'Motor Driver Circuits', price: 7.99, rating: 4.6, image: imgPool[5], description: 'Highly efficient MOSFET-based H-Bridge alternative that runs much cooler than older chips.', specs: { 'Motors': '2x DC', 'Current': '1.2A RMS per channel', 'Voltage': '4.5-13.5V' }, vendorName: vendors[6], stock: 190 },
  { id: 'prod-044', name: 'MAX14870 Single H-Bridge', category: 'Motor Driver Circuits', price: 4.99, rating: 4.4, image: imgPool[5], description: 'Ultra-compact H-bridge driver ideal for space-constrained robotic builds.', specs: { 'Current': '1.7A', 'Voltage': '4.5-36V', 'Package': 'TDFN-EP' }, vendorName: vendors[6], stock: 160 },
  { id: 'prod-045', name: 'PCA9685 PWM Servo Driver', category: 'Motor Driver Circuits', price: 11.99, rating: 4.8, image: imgPool[5], description: 'I2C-controlled 16-channel PWM driver board widely used for multi-servo robotic arms.', specs: { Channels: '16', Resolution: '12-bit', Interface: 'I2C' }, vendorName: vendors[6], stock: 370 },
  { id: 'prod-046', name: 'TMC2209 Stepper Driver', category: 'Motor Driver Circuits', price: 9.99, rating: 4.9, image: imgPool[5], description: 'Ultra-silent stepper driver preventing vibration noise via unique stealth technology.', specs: { 'Max Current': '2.8A', 'Microsteps': 'Up to 1/256', 'Technology': 'StealthChop2, SpreadCycle' }, vendorName: vendors[6], stock: 210 },

  // ── 6. Optoelectronic Interfaces (6) ──
  { id: 'prod-047', name: '4N35 Optocoupler IC', category: 'Optoelectronic Interfaces', price: 1.49, rating: 4.5, image: imgPool[13], description: 'Optical isolator chip protecting sensitive controller pins from high-voltage spikes.', specs: { 'Isolation Voltage': '3550V RMS', Channels: '1', 'Package': 'DIP-6' }, vendorName: vendors[2], stock: 1200 },
  { id: 'prod-048', name: '16x2 Character LCD Display', category: 'Optoelectronic Interfaces', price: 8.99, rating: 4.6, image: imgPool[10], description: 'Standard text display running on the HD44780 parallel driver interface protocol.', specs: { Resolution: '16x2 characters', 'Driver': 'HD44780', 'Backlight': 'Green LED' }, vendorName: vendors[0], stock: 400 },
  { id: 'prod-049', name: 'SSD1306 0.96" OLED Display', category: 'Optoelectronic Interfaces', price: 12.99, rating: 4.8, image: imgPool[10], description: 'Crisp, high-contrast monochrome graphic display relying on an I2C or SPI interface bus.', specs: { Resolution: '128x64 pixels', Interface: 'I2C/SPI', 'Color': 'White/Blue' }, vendorName: vendors[1], stock: 320 },
  { id: 'prod-050', name: 'WS2812B NeoPixel RGB LED', category: 'Optoelectronic Interfaces', price: 0.99, rating: 4.7, image: imgPool[11], description: 'Addressable RGB LED containing a tightly integrated smart control driver inside the housing.', specs: { 'Voltage': '5V DC', 'Protocol': 'Single-wire NRZ', 'Color Depth': '24-bit RGB' }, vendorName: vendors[5], stock: 5000 },
  { id: 'prod-051', name: 'MAX7219 LED Matrix Driver', category: 'Optoelectronic Interfaces', price: 6.99, rating: 4.5, image: imgPool[10], description: 'Integrated serial input/output common-cathode display driver operating an 8x8 dot matrix.', specs: { 'Display': '8x8 LED matrix', Interface: 'SPI', 'Daisy-chain': 'Multiple modules' }, vendorName: vendors[2], stock: 280 },
  { id: 'prod-052', name: 'GP2Y0A21YK0F IR Sensor', category: 'Optoelectronic Interfaces', price: 11.99, rating: 4.4, image: imgPool[7], description: 'Infrared distance measuring sensor utilizing an integrated PSD optical detector array.', specs: { Range: '10-80cm', 'Output': 'Analog voltage', 'Update Rate': '25Hz' }, vendorName: vendors[9], stock: 150 },

  // ── 7. Communication Bus Drivers (7) ──
  { id: 'prod-053', name: 'MAX232 RS-232 Driver', category: 'Communication Bus Drivers', price: 3.99, rating: 4.5, image: imgPool[13], description: 'Dual driver/receiver transforming legacy TTY serial signals into standard PC serial ports.', specs: { 'Drivers': '2x', 'Receivers': '2x', 'Data Rate': '120kbps' }, vendorName: vendors[6], stock: 600 },
  { id: 'prod-054', name: 'MAX485 RS-485 Transceiver', category: 'Communication Bus Drivers', price: 2.99, rating: 4.6, image: imgPool[13], description: 'Low-power transceiver designed for industrial-grade differential multipoint networks.', specs: { Standard: 'RS-485/RS-422', 'Nodes': 'Up to 256', 'Data Rate': '2.5Mbps' }, vendorName: vendors[6], stock: 550 },
  { id: 'prod-055', name: 'MCP2515 CAN Bus Controller', category: 'Communication Bus Drivers', price: 7.99, rating: 4.7, image: imgPool[13], description: 'Standalone controller providing SPI access to complex automotive vehicle networks.', specs: { Standard: 'CAN 2.0B', Interface: 'SPI', 'Speed': '1Mbps' }, vendorName: vendors[6], stock: 240 },
  { id: 'prod-056', name: 'CH340G USB-to-UART Bridge', category: 'Communication Bus Drivers', price: 2.49, rating: 4.4, image: imgPool[13], description: 'Ubiquitously deployed bridge chip pairing microcontrollers directly with USB host systems.', specs: { Interface: 'USB 2.0 Full Speed', 'Data Rate': '2Mbps', 'Package': 'SSOP-16' }, vendorName: vendors[2], stock: 800 },
  { id: 'prod-057', name: 'FT232RL USB-to-Serial', category: 'Communication Bus Drivers', price: 9.99, rating: 4.7, image: imgPool[13], description: 'Premium USB-to-Serial UART interface featuring optional onboard clock generator functions.', specs: { Interface: 'USB 2.0 Full Speed', 'Data Rate': '3Mbps', 'Features': 'Bit-bang mode, CBUS' }, vendorName: vendors[6], stock: 300 },
  { id: 'prod-058', name: 'PCA9548A I2C Multiplexer', category: 'Communication Bus Drivers', price: 5.99, rating: 4.5, image: imgPool[13], description: '8-channel octal bidirectional switch resolving complex address conflicts on shared data buses.', specs: { Channels: '8', Interface: 'I2C', 'Addressing': '3-bit selectable' }, vendorName: vendors[6], stock: 170 },
  { id: 'prod-059', name: 'ISO7741 Digital Isolator', category: 'Communication Bus Drivers', price: 4.99, rating: 4.6, image: imgPool[13], description: 'High-performance quadruple-channel digital isolator filtering galvanic interference loops.', specs: { Channels: '4', Isolation: '5kVRMS', 'Data Rate': '100Mbps' }, vendorName: vendors[6], stock: 210 },

  // ── 8. Embedded Storage Modules (6) ──
  { id: 'prod-060', name: 'W25Q128 Flash Memory IC', category: 'Embedded Storage Modules', price: 3.99, rating: 4.7, image: imgPool[13], description: '128-Megabit external SPI flash memory module optimized for heavy asset data storage.', specs: { Capacity: '128Mbit (16MB)', Interface: 'SPI', 'Speed': '104MHz' }, vendorName: vendors[6], stock: 650 },
  { id: 'prod-061', name: 'MicroSD Card Breakout', category: 'Embedded Storage Modules', price: 5.99, rating: 4.5, image: imgPool[13], description: 'Simple SPI-level shifter card enabling microcontrollers to write filesystem tables.', specs: { 'Media': 'MicroSD up to 32GB', Interface: 'SPI', 'Level Shifting': '3.3V/5V' }, vendorName: vendors[0], stock: 400 },
  { id: 'prod-062', name: 'AT24C256 EEPROM IC', category: 'Embedded Storage Modules', price: 1.99, rating: 4.4, image: imgPool[13], description: 'Non-volatile 256K configuration storage chip running on standard I2C buses.', specs: { Capacity: '256Kbit (32KB)', Interface: 'I2C', 'Write Cycles': '1,000,000' }, vendorName: vendors[6], stock: 900 },
  { id: 'prod-063', name: 'DS3231 Real-Time Clock', category: 'Embedded Storage Modules', price: 10.99, rating: 4.9, image: imgPool[13], description: 'Highly accurate timekeeper chip featuring a temperature-compensated crystal oscillator and backup battery.', specs: { Accuracy: '±2ppm (±0.17s/day)', Interface: 'I2C', 'Backup': 'Coin cell CR2032' }, vendorName: vendors[0], stock: 280 },
  { id: 'prod-064', name: 'FM24C16 FRAM Memory', category: 'Embedded Storage Modules', price: 3.99, rating: 4.6, image: imgPool[13], description: 'Ferroelectric RAM chip enabling lightning-fast writes with infinite endurance compared to EEPROMs.', specs: { Capacity: '16Kbit (2KB)', Interface: 'I2C', 'Endurance': '10^13 write cycles' }, vendorName: vendors[6], stock: 150 },
  { id: 'prod-065', name: 'SDRAM MT48LC16M16A2', category: 'Embedded Storage Modules', price: 7.99, rating: 4.5, image: imgPool[13], description: 'Advanced dynamic synchronous RAM used to expand buffers on powerful embedded processors.', specs: { Capacity: '256Mbit (32MB)', Type: 'SDRAM', 'Speed': '166MHz' }, vendorName: vendors[6], stock: 120 },

  // ── 9. Passive Circuit Networks (10) ──
  { id: 'prod-066', name: 'Thick Film Resistor Array', category: 'Passive Circuit Networks', price: 0.99, rating: 4.4, image: imgPool[13], description: 'Multi-resistor network packed neatly into an SMD footprint to save board space.', specs: { Configuration: '8-resistor isolated', Tolerance: '±5%', 'Package': 'SOP-16' }, vendorName: vendors[2], stock: 2000 },
  { id: 'prod-067', name: 'MLCC Capacitor Kit (100pcs)', category: 'Passive Circuit Networks', price: 12.99, rating: 4.8, image: imgPool[13], description: 'Compact decoupling capacitors filtering high-frequency noise near IC pins.', specs: { Range: '10pF - 10µF', 'Voltage': '50V', 'Dielectric': 'X7R, NP0/C0G' }, vendorName: vendors[2], stock: 350 },
  { id: 'prod-068', name: 'Aluminum Electrolytic Cap Kit', category: 'Passive Circuit Networks', price: 14.99, rating: 4.6, image: imgPool[13], description: 'Large polarized bulk storage components stabilizing input power drops.', specs: { Range: '1µF - 1000µF', 'Voltage': '16-63V', 'Quantity': '50pcs' }, vendorName: vendors[2], stock: 200 },
  { id: 'prod-069', name: 'Ferrite Bead Core (10pcs)', category: 'Passive Circuit Networks', price: 3.99, rating: 4.3, image: imgPool[13], description: 'Passive inductor choking high-frequency electromagnetic noise along copper traces.', specs: { Impedance: '600Ω at 100MHz', 'Current Rating': '3A', 'Package': '0805 SMD' }, vendorName: vendors[2], stock: 500 },
  { id: 'prod-070', name: 'Bourns Trimpot Potentiometer', category: 'Passive Circuit Networks', price: 1.49, rating: 4.4, image: imgPool[13], description: 'Tiny screw-adjustable variable resistor used for fine calibration tuning.', specs: { Range: '100Ω - 1MΩ', 'Adjustment': 'Top rotary', 'Package': '3296W' }, vendorName: vendors[2], stock: 750 },
  { id: 'prod-071', name: 'Toroidal Power Inductor', category: 'Passive Circuit Networks', price: 2.99, rating: 4.5, image: imgPool[13], description: 'High-efficiency magnetic core coil tailored for switch-mode filtering circuits.', specs: { Inductance: '100µH', 'Current Rating': '2.5A', 'Core': 'Iron powder' }, vendorName: vendors[8], stock: 280 },
  { id: 'prod-072', name: 'Varistor Surge Protector (10pcs)', category: 'Passive Circuit Networks', price: 4.99, rating: 4.6, image: imgPool[13], description: 'Voltage-dependent passive components absorbing hazardous overvoltage transients safely.', specs: { 'Varistor Voltage': '275V RMS', 'Energy Rating': '10J', 'Package': 'DISC 10mm' }, vendorName: vendors[2], stock: 320 },
  { id: 'prod-073', name: '16MHz Crystal Oscillator', category: 'Passive Circuit Networks', price: 0.79, rating: 4.5, image: imgPool[13], description: 'Precise mechanical resonator supplying stable clock pulses to digital systems.', specs: { Frequency: '16MHz ±20ppm', 'Load Capacitance': '20pF', 'Package': 'HC-49US' }, vendorName: vendors[2], stock: 1200 },
  { id: 'prod-074', name: 'RC Low-Pass Filter Network', category: 'Passive Circuit Networks', price: 0.99, rating: 4.3, image: imgPool[13], description: 'Paired resistor-capacitor line smoothing messy, jagged analog data paths.', specs: { 'Cutoff Freq': '1.6kHz', 'Configuration': '1-stage RC', 'Package': 'SIP-4' }, vendorName: vendors[2], stock: 400 },
  { id: 'prod-075', name: 'Zener Diode Kit (50pcs)', category: 'Passive Circuit Networks', price: 6.99, rating: 4.5, image: imgPool[13], description: 'Silicon diodes clipping dangerous voltage surges past a set clamping breakdown threshold.', specs: { Range: '3.3V - 24V', 'Power': '500mW', 'Package': 'DO-35' }, vendorName: vendors[2], stock: 600 },

  // ── 10. Programmable Logic Circuits (7) ──
  { id: 'prod-076', name: 'Xilinx Artix-7 FPGA Board', category: 'Programmable Logic Circuits', price: 149.99, rating: 4.8, image: imgPool[0], description: 'High-density programmable matrix configured via hardware description languages for custom logic.', specs: { 'Logic Cells': '100K', 'LUTs': '63,400', 'DSP Slices': '240' }, vendorName: vendors[4], stock: 30 },
  { id: 'prod-077', name: 'Altera Cyclone IV FPGA', category: 'Programmable Logic Circuits', price: 89.99, rating: 4.6, image: imgPool[0], description: 'Low-cost, power-optimized FPGA fabric widely deployed in video stream decoders.', specs: { 'Logic Elements': '22,320', 'Embedded RAM': '594Kbit', 'I/O': '153' }, vendorName: vendors[4], stock: 45 },
  { id: 'prod-078', name: 'Intel MAX 10 FPGA', category: 'Programmable Logic Circuits', price: 59.99, rating: 4.7, image: imgPool[0], description: 'Non-volatile architecture integrating dual-configuration flash blocks directly on-chip.', specs: { 'Logic Elements': '16,000', 'RAM': '549Kbit', 'Config': 'Dual boot flash' }, vendorName: vendors[4], stock: 55 },
  { id: 'prod-079', name: 'Lattice iCE40 UltraPlus', category: 'Programmable Logic Circuits', price: 34.99, rating: 4.5, image: imgPool[0], description: 'Ultra-low power, tiny footprint FPGA designed for edge-AI processing.', specs: { 'Logic Cells': '5,280', 'RAM': '120Kbit', 'Power': '<1mW standby' }, vendorName: vendors[4], stock: 80 },
  { id: 'prod-080', name: 'Xilinx CoolRunner-II CPLD', category: 'Programmable Logic Circuits', price: 19.99, rating: 4.4, image: imgPool[13], description: 'Complex programmable logic device running instantly without external configuration chips.', specs: { 'Macrocells': '256', 'tPD': '5ns', 'I/O': '160' }, vendorName: vendors[4], stock: 120 },
  { id: 'prod-081', name: 'Microchip SmartFusion2 SoC', category: 'Programmable Logic Circuits', price: 129.99, rating: 4.7, image: imgPool[0], description: 'Unique SoC FPGA combining flash programmable logic with an ARM Cortex-M3 processor core.', specs: { 'FPGA Fabric': '12K logic elements', 'MCU': 'ARM Cortex-M3', 'RAM': '256KB' }, vendorName: vendors[6], stock: 25 },
  { id: 'prod-082', name: 'Lattice MachXO3 FPGA', category: 'Programmable Logic Circuits', price: 24.99, rating: 4.5, image: imgPool[0], description: 'Instant-on bridging FPGA targeting complex I/O system expansions in data routing.', specs: { 'Logic Cells': '6,400', 'RAM': '256Kbit', 'I/O': '206' }, vendorName: vendors[4], stock: 95 },
];

export const COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Advanced Embedded Systems Architecture',
    category: 'Embedded Systems',
    instructor: 'Dr. Evelyn Sterling, RTTI',
    duration: '40 Hours',
    rating: 4.9,
    studentsCount: 3410,
    price: 499.00,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
    level: 'Advanced',
    syllabus: [
      'RTOS Kernel Mechanics & Scheduler Design',
      'Direct Memory Access (DMA) and Bus Arbiters',
      'Hardware-Software Co-Design Architectures',
      'Deep Power Profiles Simulation and Dynamic Scaling',
      'Industrial Fault-Tolerant Signal Pipelines'
    ],
    certified: true
  },
  {
    id: 'course-002',
    title: 'Enterprise IoT Infrastructure Deployment',
    category: 'Networking',
    instructor: 'Marcus Vance, Principle IoT Architect',
    duration: '24 Hours',
    rating: 4.7,
    studentsCount: 2150,
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60',
    level: 'Intermediate',
    syllabus: [
      'MQTT/CoAP Enterprise Broker Topologies',
      'IoT Fleet Management and Dynamic Provisioning',
      'OTA Firmware Update Security Frameworks',
      'Time-Series Databases and Real-Time Analytics',
      'Edge Computing Integration with Cloud Core'
    ],
    certified: true
  },
  {
    id: 'course-003',
    title: 'Applied AI for Embedded Vision Systems',
    category: 'AI',
    instructor: 'Prof. Kenzo Tanaka, MTTV Tech Director',
    duration: '35 Hours',
    rating: 4.8,
    studentsCount: 1890,
    price: 389.00,
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=500&auto=format&fit=crop&q=60',
    level: 'Advanced',
    syllabus: [
      'Neural Mesh Quantization & Model Pruning',
      'ONNX Runtime and Edge Inference Tuning',
      'TensorFlow Lite with Microcontrollers (TFLM)',
      'Real-Time Convolutional Pipelines and Pipelines',
      'FPGA Acceleration of Deep Learning Operations'
    ],
    certified: true
  },
  {
    id: 'course-004',
    title: 'Cybersecurity Protocols for Industrial SCADA',
    category: 'Cybersecurity',
    instructor: 'Sarah Jenkins, Threat Intelligence lead',
    duration: '30 Hours',
    rating: 4.9,
    studentsCount: 1250,
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60',
    level: 'Advanced',
    syllabus: [
      'Securing Modbus, DNP3, and Profinet networks',
      'Intrusion Detection on Operational Technology (OT)',
      'Hardware HSM and Crytographic Key Lifecycle',
      'Defense-in-Depth SCADA Security Auditing Frameworks',
      'Responding to Enterprise Threat Vectors and Mitigation'
    ],
    certified: true
  }
];

export const BROADCASTS: Broadcast[] = [
  {
    id: 'vid-001',
    title: 'Global Semiconductor Alliance 2026 Keynote',
    type: 'live',
    host: 'Alistair Vance & Panelists',
    scheduledTime: 'LIVE NOW',
    views: 14500,
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&auto=format&fit=crop&q=60',
    description: 'Major global keynotes from market leaders outlining silicon lithography targets, RISC-V adoption, and multi-tenant supply-chain redundancy plans for 2026-2027.',
    category: 'Live Events'
  },
  {
    id: 'vid-002',
    title: 'Edge AI Integration Webinar: Real-world Case Studies',
    type: 'webinar',
    host: 'Prof. Kenzo Tanaka',
    scheduledTime: 'Today, 18:00 UTC',
    views: 4210,
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=60',
    description: 'Learn how Global 100 industrial groups deploy decentralized sensory models to preempt thermal and mechanical failures on automated assembly systems.',
    category: 'Webinars'
  },
  {
    id: 'vid-003',
    title: 'Tech Nexus Podcast Ep.53 - The Future of Industrial Automation',
    type: 'podcast',
    host: 'Sarah Jenkins & Clara Dupont',
    duration: '42 Min',
    views: 9280,
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=60',
    description: 'Exploring the transition of robotics from strictly pre-programmed execution tracks to real-time spatial visual feedback loops and localized reinforcement models.',
    category: 'Podcasts'
  },
  {
    id: 'vid-010',
    title: 'Tutorial: Zero-Trust OTA Embedded Implementations',
    type: 'tutorial',
    host: 'Marcus Vance',
    duration: '18 Min',
    views: 33400,
    thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&auto=format&fit=crop&q=60',
    description: 'A deep-dive walkthrough compiling secured dual-loader storage layouts and validating asymmetric RSA signatures before writing boot banks.',
    category: 'Tutorials'
  }
];

export const OPEN_POSITIONS: OpenPosition[] = [
  {
    id: 'job-001',
    title: 'Senior Hardware Embedded Security Architect',
    department: 'Engineering',
    location: 'Munich, Germany / Hybrid',
    type: 'Full-time',
    experience: '8+ Years',
    description: 'Formulate, design, and validate next-generation security modules for the RT IoT product family. Work closely with hardware engineering to ensure zero-trust physical layers.',
    responsibilities: [
      'Lead design reviews of physical hardware security IC integration.',
      'Formulate embedded cryptographic secure-element firmware guidelines.',
      'Conduct hardware-level side-channel leakage tests and reverse engineering audits.',
      'Represent RT Nexus within international industrial safety standard committees.'
    ],
    requirements: [
      'M.Sc or PhD in Computer Engineering, Electrical Engineering, or Cryptography.',
      'Profound experience with ARM TrustZone, TPM modules, and secure key storage systems.',
      'Fluency in C, C++, and Assembly optimization for resource-constrained systems.',
      'Strong grasp of high-frequency differential signal safety requirements.'
    ]
  },
  {
    id: 'job-002',
    title: 'Lead Curriculum Architect - Applied AI & Ot Automation',
    department: 'Learning Paths',
    location: 'Boston, MA / Remote friendly',
    type: 'Full-time',
    experience: '5+ Years',
    description: 'Pioneer the expansion of RTTIs curriculum. Create advanced engineering learning paths matching actual enterprise silicon requirements and robotics advances.',
    responsibilities: [
      'Translate cutting-edge edge AI hardware specs into interactive labs and certified materials.',
      'Coordinate with global corporate vendors to capture training constraints and validate certifications.',
      'Instruct advanced masterclass series on MTTV and during scheduled LIVE events.'
    ],
    requirements: [
      'M.Sc in Robotics, Artificial Intelligence, or STEM Education.',
      'Deep architectural knowledge of PyTorch, TensorRT, and TinyML pipelines.',
      'Demonstrated teaching background with highly positive developer satisfaction logs.'
    ]
  },
  {
    id: 'job-003',
    title: 'Streaming Broadcast engineer - MTTV Operations',
    department: 'Media',
    location: 'New York, NY / Studio presence',
    type: 'Contract',
    experience: '4+ Years',
    description: 'Manage live and automated broadcasting servers, orchestrate hybrid multi-point webinars, and validate broadcast visual feeds.',
    responsibilities: [
      'Operate low-latency RTMP/WebRTC ingress endpoints and proxy distribution systems.',
      'Pre-engineer overlay visuals, live graphic inserts, and automated captions grids.',
      'Provide rapid stream correction and fallback support during critical live corporate webinars.'
    ],
    requirements: [
      'Proficiency with OBS Studio, Blackmagic Hardware, VisiOn Systems, and ffmpeg configurations.',
      'Deep knowledge of multi-CDN video routing protocols (HLS, DASH, SRT).',
      'Flawless execution during critical high-stress, live broadcast schedules.'
    ]
  }
];

export const VENDORS = [
  { name: 'Nexus Embedded Corp', logo: 'N', productsCount: 22, rating: 4.8 },
  { name: 'Silicon Ventures Ltd', logo: 'S', productsCount: 14, rating: 4.9 },
  { name: 'Matrix Transducers', logo: 'M', productsCount: 31, rating: 4.6 },
  { name: 'OmniDrive Robotics', logo: 'O', productsCount: 9, rating: 4.7 }
];

export const TEAM_MEMBERS = [
  { name: 'Dr. Evelyn Sterling', role: 'Chief Technology Director & RTTI Dean', bio: 'Former senior semiconductor investigator specializing in industrial microarchitectures and fault safety.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
  { name: 'Prof. Kenzo Tanaka', role: 'Head of Media & Interactive Broadcasting (MTTV)', bio: 'Media pioneer with 15+ years engineering sub-second video delivery fabrics and real-time visual streams.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { name: 'Sarah Jenkins', role: 'Director of Threat Intelligence & Cyber Defense', bio: 'Pioneered critical defenses for European smart grid setups. Ex-governmental SCADA validation assessor.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
  { name: 'Arthur Pendleton', role: 'President of Global B2B Commerce', bio: 'Spearheads RT Shop developer relations, partner onboarding protocols, and cross-border distribution routing.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' }
];

export const SOLUTIONS_DATA = {
  businesses: {
    title: 'Enterprise Integration and Industrial Operations',
    tagline: 'Empowering manufacturing leaders, logistics networks, and product developers with unified telemetry and deployment platforms.',
    highlights: [
      'Scalable device fleets monitoring with sub-millisecond edge failover safeguards.',
      'Customized enterprise licenses combining RT Shop components bulk pricing with tailored MTTV secure broadcasts.',
      'Proprietary cyber-audited systems ensuring sovereign data controls on physical infrastructure.'
    ],
    graphic: '🏢'
  },
  educational: {
    title: 'University Partnerships and Technical Licenses',
    tagline: 'Bridging institutional theories with proven industrial practices through certified hardware-software master curricula.',
    highlights: [
      'Academic course integration linking virtual lectures with exact physical RTTI development boards.',
      'Multi-seat visual sandbox accounts with automated certification registers.',
      'Direct pipeline placing top student performers within vetted corporate partner networks.'
    ],
    graphic: '🎓'
  },
  vendors: {
    title: 'Marketplace Sellers and Hardware Foundries',
    tagline: 'Dramatically accelerating product monetization, from single batch prototypes to complex mass production items.',
    highlights: [
      'Instant access to a hyper-targeted audience of 250,000+ active development teams and students.',
      'Comprehensive inventory validation, automated logistics matching, and secure checkout escrow.',
      'Customizable product banners, technical datasheet uploads, and real-time analytics.'
    ],
    graphic: '🏭'
  },
  students: {
    title: 'Individual Engineers and Career Progressors',
    tagline: 'Learn real industrial protocols, construct certified physical systems, and claim true industry respect.',
    highlights: [
      'Access to state-of-the-art interactive live webinars, hands-on virtual whiteboard projects, and custom certifications.',
      'Discounted student access to RT Shop hardware developers matrices.',
      'Verified engineering credentials shared instantly with professional lead evaluators.'
    ],
    graphic: '🧑‍💻'
  },
  creators: {
    title: 'Technical Broadcasters and Instructional Authors',
    tagline: 'Broadcast tutorials, sponsor key live events, and monetize high-impact expertise through MTTV.',
    highlights: [
      'State-of-the-art RTMP recording studios with real-time AI live capturing systems.',
      'Lucrative direct rev-share sponsorship pipelines from enterprise industrial buyers.',
      'Dedicated marketing vectors targeting active research cells and engineering nodes.'
    ],
    graphic: '🎙️'
  }
};
