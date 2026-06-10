import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { createHash } from 'crypto';
config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rtnexus';
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 20000,
  connectTimeoutMS: 20000,
});

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function seed() {
  await client.connect();
  const db = client.db('rtnexus');

  // Drop existing collections for clean seed
  const existing = await db.listCollections().toArray();
  for (const col of existing) {
    await db.collection(col.name).drop();
  }

  // ── Users ──
  await db.collection('Users').createIndex({ username: 1 }, { unique: true });
  await db.collection('Users').createIndex({ email: 1 }, { unique: true });
  await db.collection('Users').insertOne({
    username: 'rtnexus',
    email: 'admin@rtnexus.enterprise',
    password: hashPassword('123456'),
    fullName: 'RT Nexus Admin',
    role: 'admin',
    createdAt: new Date(),
  });

  // ── Roles & Permissions ──
  await db.collection('Roles').insertMany([
    { name: 'admin', label: 'Enterprise Administrator' },
    { name: 'customer', label: 'Marketplace Buyer' },
    { name: 'student', label: 'Accredited Student' },
    { name: 'instructor', label: 'Research Instructor' },
    { name: 'vendor', label: 'OEM Foundry Seller' },
    { name: 'advertiser', label: 'Sponsorship Partner' },
  ]);

  await db.collection('Permissions').insertMany([
    { role: 'admin', actions: ['*'] },
    { role: 'customer', actions: ['products:read', 'orders:create', 'orders:read'] },
    { role: 'student', actions: ['courses:read', 'courses:enroll', 'assessments:submit'] },
    { role: 'instructor', actions: ['courses:create', 'courses:edit', 'assessments:grade'] },
    { role: 'vendor', actions: ['products:create', 'products:edit', 'orders:read'] },
    { role: 'advertiser', actions: ['campaigns:create', 'campaigns:read'] },
  ]);

  // ── Categories ──
  await db.collection('Categories').insertMany([
    { name: 'Embedded Systems', slug: 'embedded-systems' },
    { name: 'IoT Devices', slug: 'iot-devices' },
    { name: 'Development Boards', slug: 'development-boards' },
    { name: 'Power Solutions', slug: 'power-solutions' },
    { name: 'Sensors', slug: 'sensors' },
    { name: 'Robotics', slug: 'robotics' },
    { name: 'Microcontroller Boards', slug: 'microcontroller-boards' },
    { name: 'Embedded Wireless Modules', slug: 'embedded-wireless-modules' },
    { name: 'Power Management ICs', slug: 'power-management-ics' },
    { name: 'Sensor Interface Circuits', slug: 'sensor-interface-circuits' },
    { name: 'Motor Driver Circuits', slug: 'motor-driver-circuits' },
    { name: 'Optoelectronic Interfaces', slug: 'optoelectronic-interfaces' },
    { name: 'Communication Bus Drivers', slug: 'communication-bus-drivers' },
    { name: 'Embedded Storage Modules', slug: 'embedded-storage-modules' },
    { name: 'Passive Circuit Networks', slug: 'passive-circuit-networks' },
    { name: 'Programmable Logic Circuits', slug: 'programmable-logic-circuits' },
  ]);

  // ── Vendors ──
  await db.collection('Vendors').insertMany([
    { name: 'Matrix Transducers Inc.', slug: 'matrix-transducers', verified: true, rating: 4.8 },
    { name: 'Embedded Dynamics Ltd.', slug: 'embedded-dynamics', verified: true, rating: 4.6 },
    { name: 'Core Silicon Foundry', slug: 'core-silicon', verified: true, rating: 4.9 },
    { name: 'Nexus Embedded Corp', slug: 'nexus-embedded', verified: true, rating: 4.7 },
    { name: 'Silicon Ventures Ltd', slug: 'silicon-ventures', verified: true, rating: 4.8 },
    { name: 'Pinnacle Semiconductor', slug: 'pinnacle-semi', verified: true, rating: 4.6 },
    { name: 'Arcus Wireless', slug: 'arcus-wireless', verified: true, rating: 4.5 },
    { name: 'VoltCore Power', slug: 'voltcore-power', verified: true, rating: 4.7 },
    { name: 'SensArray Technologies', slug: 'sensarray-tech', verified: true, rating: 4.4 },
  ]);

  // ── Products ──
  await db.collection('Products').createIndex({ vendorId: 1 });
  await db.collection('Products').createIndex({ category: 1 });
  const products = [
    { name: 'IoT Gateway Core Hub X1', category: 'IoT Devices', price: 129.99, rating: 4.8, stock: 150, vendor: 'Matrix Transducers Inc.', description: 'Enterprise IoT gateway with dual-band telemetry and encrypted firmware.', specs: { Connectivity: 'WiFi 6 / BLE 5.3', 'Power Input': '5V DC / PoE', 'Flash Storage': '32GB eMMC' } },
    { name: 'RTTI Calibration Board v4', category: 'Development Boards', price: 89.99, rating: 4.7, stock: 200, vendor: 'Embedded Dynamics Ltd.', description: 'RTTI-certified calibration platform for embedded prototyping.', specs: { MCU: 'ARM Cortex-M7', 'Clock Speed': '600MHz', 'Digital I/O': '24 pins' } },
    { name: 'SCADA Telemetry Scanner', category: 'Embedded Systems', price: 249.99, rating: 4.9, stock: 75, vendor: 'Core Silicon Foundry', description: 'Industrial SCADA scanner for real-time telemetry monitoring.', specs: { 'Scan Rate': '1000 samples/s', Interface: 'RS-485 / Modbus', 'IP Rating': 'IP67' } },
    { name: 'Edge AI Accelerator Module', category: 'Embedded Systems', price: 199.99, rating: 4.6, stock: 120, vendor: 'Matrix Transducers Inc.', description: 'Neural inference accelerator for edge deployments.', specs: { TOPS: '4 TOPS', Memory: '8GB LPDDR4', 'Power Draw': '7.5W' } },
    { name: 'Biometric Sensor Matrix', category: 'Sensors', price: 59.99, rating: 4.5, stock: 300, vendor: 'Embedded Dynamics Ltd.', description: 'Multi-spectral biometric sensor array for secure identity.', specs: { 'Sensor Type': 'Optical / Capacitive', Resolution: '500 DPI', Interface: 'USB-C / SPI' } },
    { name: 'Industrial Power Supply Unit', category: 'Power Solutions', price: 149.99, rating: 4.7, stock: 180, vendor: 'Core Silicon Foundry', description: 'Ruggedized IP67 power supply for field deployments.', specs: { 'Output Voltage': '12V / 24V', 'Current Rating': '10A', 'IP Rating': 'IP67' } },
    { name: 'Autonomous Rover Chassis Kit', category: 'Robotics', price: 349.99, rating: 4.8, stock: 45, vendor: 'Matrix Transducers Inc.', description: 'Four-wheel drive rover with integrated SLAM navigation.', specs: { Motor: '4x DC Encoder', 'Max Payload': '5kg', Battery: '5000mAh LiPo' } },
    { name: 'Mesh Network Node v2', category: 'IoT Devices', price: 79.99, rating: 4.4, stock: 250, vendor: 'Embedded Dynamics Ltd.', description: 'Long-range mesh networking node for distributed sensor grids.', specs: { Range: '2km LOS', Protocol: 'LoRaWAN / Zigbee', 'Battery Life': '18 months' } },
    { name: 'Oscilloscope Shield Pro', category: 'Development Boards', price: 44.99, rating: 4.3, stock: 400, vendor: 'Core Silicon Foundry', description: '2-channel oscilloscope add-on board for RTTI dev kits.', specs: { 'Sample Rate': '50 MS/s', Bandwidth: '20MHz', Input: '±20V' } },
    { name: 'GPS Telemetry Logger', category: 'Sensors', price: 39.99, rating: 4.6, stock: 350, vendor: 'Matrix Transducers Inc.', description: 'High-precision GPS logger with on-board storage.', specs: { Accuracy: '1.5m CEP', 'Log Rate': '10 Hz', Storage: 'MicroSD up to 32GB' } },

    // Microcontroller Boards (10)
    { name: 'Arduino Uno R4', category: 'Microcontroller Boards', price: 34.99, rating: 4.8, stock: 300, vendor: 'Nexus Embedded Corp', description: 'Classic maker board with 32-bit Renesas RA4M1 processor for advanced prototyping.', specs: { MCU: 'Renesas RA4M1 32-bit', 'Digital I/O': '14 pins', Memory: '256KB Flash' } },
    { name: 'Raspberry Pi Pico W', category: 'Microcontroller Boards', price: 12.50, rating: 4.7, stock: 500, vendor: 'Silicon Ventures Ltd', description: 'Low-cost microcontroller board featuring built-in Wi-Fi and RP2040 chip.', specs: { MCU: 'RP2040 Dual-Core Cortex-M0+', RAM: '264KB SRAM', Connectivity: '802.11n Wi-Fi' } },
    { name: 'ESP32-WROOM-32E', category: 'Microcontroller Boards', price: 8.99, rating: 4.6, stock: 800, vendor: 'Arcus Wireless', description: 'Generic Wi-Fi and Bluetooth MCU module for IoT applications.', specs: { MCU: 'ESP32 Dual-Core Xtensa LX6', RAM: '520KB SRAM', Wireless: 'Wi-Fi + BLE 4.2' } },
    { name: 'STM32 Nucleo-64', category: 'Microcontroller Boards', price: 24.99, rating: 4.9, stock: 150, vendor: 'Matrix Transducers Inc.', description: 'ARM Cortex-M development kit for industry-grade applications.', specs: { MCU: 'STM32F446RE Cortex-M4', RAM: '128KB SRAM', 'Form Factor': 'Arduino compatible' } },
    { name: 'Teensy 4.1', category: 'Microcontroller Boards', price: 39.99, rating: 4.9, stock: 90, vendor: 'Embedded Dynamics Ltd.', description: 'ARM Cortex-M7 board at 600MHz for heavy DSP.', specs: { MCU: 'NXP i.MX RT1062 Cortex-M7', RAM: '8MB SRAM', Speed: '600MHz' } },
    { name: 'Adafruit Feather M4 Express', category: 'Microcontroller Boards', price: 29.99, rating: 4.7, stock: 120, vendor: 'Nexus Embedded Corp', description: 'Compact stackable dev ecosystem using ATSAMD51 chip.', specs: { MCU: 'ATSAMD51J19 Cortex-M4F', RAM: '192KB SRAM', Flash: '512KB' } },
    { name: 'MSP430 LaunchPad', category: 'Microcontroller Boards', price: 14.99, rating: 4.5, stock: 220, vendor: 'Silicon Ventures Ltd', description: 'TI ultra-low-power microcontroller development platform.', specs: { MCU: 'MSP430FR5994 16-bit RISC', 'Power': '0.4µA standby' } },
    { name: 'Particle Boron LTE', category: 'Microcontroller Boards', price: 69.99, rating: 4.6, stock: 60, vendor: 'Arcus Wireless', description: 'LTE cellular dev board for projects outside Wi-Fi range.', specs: { MCU: 'nRF52840 Cortex-M4F', Connectivity: 'LTE Cat M1, BLE 5.0' } },
    { name: 'Micro:bit v2', category: 'Microcontroller Boards', price: 19.99, rating: 4.8, stock: 400, vendor: 'Embedded Dynamics Ltd.', description: 'Educational pocket-sized computer with sensors and LED matrix.', specs: { MCU: 'nRF52833 Cortex-M4F', Sensors: 'Accel, Magnetometer, Mic' } },
    { name: 'Seeeduino Xiao', category: 'Microcontroller Boards', price: 9.99, rating: 4.6, stock: 350, vendor: 'Matrix Transducers Inc.', description: 'Ultra-small SAMD21 board for wearables and tiny spaces.', specs: { MCU: 'SAMD21G18 Cortex-M0+', Dimensions: '21x18mm' } },

    // Embedded Wireless Modules (6)
    { name: 'Nordic nRF52840 Module', category: 'Embedded Wireless Modules', price: 14.99, rating: 4.8, stock: 280, vendor: 'Arcus Wireless', description: 'Premium multiprotocol SoC for advanced BLE applications.', specs: { Wireless: 'BLE 5.3, Thread, Zigbee', RAM: '256KB SRAM' } },
    { name: 'XBee3 Zigbee 3.0 Module', category: 'Embedded Wireless Modules', price: 32.99, rating: 4.7, stock: 140, vendor: 'Arcus Wireless', description: 'Modular RF platform for easy wireless mesh connectivity.', specs: { Range: '400m LOS', Interface: 'UART, SPI' } },
    { name: 'LoRaWAN RFM95W', category: 'Embedded Wireless Modules', price: 9.99, rating: 4.6, stock: 500, vendor: 'Arcus Wireless', description: 'Long-range transceiver for sparse IoT nodes.', specs: { Frequency: '868/915 MHz', Range: '15km LOS' } },
    { name: 'HC-05 Bluetooth Module', category: 'Embedded Wireless Modules', price: 4.99, rating: 4.4, stock: 900, vendor: 'Matrix Transducers Inc.', description: 'Legacy serial port protocol module for Bluetooth communication.', specs: { Standard: 'Bluetooth 2.0 + EDR', Range: '10m' } },
    { name: 'Quectel BG96 LTE', category: 'Embedded Wireless Modules', price: 42.99, rating: 4.7, stock: 80, vendor: 'Arcus Wireless', description: 'LTE Cat M1/NB-IoT module with ultra-low power consumption.', specs: { Networks: 'LTE Cat M1, NB-IoT', GNSS: 'GPS, GLONASS' } },
    { name: 'SIM800L GSM/GPRS', category: 'Embedded Wireless Modules', price: 7.99, rating: 4.3, stock: 600, vendor: 'Matrix Transducers Inc.', description: 'Compact cellular breakout for SMS, voice, and data.', specs: { Bands: '850/900/1800/1900MHz', Interface: 'UART' } },

    // Power Management ICs (7)
    { name: 'TI TPS62130 Buck Converter', category: 'Power Management ICs', price: 5.99, rating: 4.8, stock: 450, vendor: 'Pinnacle Semiconductor', description: 'High-efficiency step-down buck converter with 3A output.', specs: { 'Input Voltage': '3-17V', 'Output Current': '3A', Efficiency: '95%' } },
    { name: 'ADI LTC3589 PMIC', category: 'Power Management ICs', price: 12.99, rating: 4.7, stock: 120, vendor: 'Pinnacle Semiconductor', description: 'Integrated PMIC for modern multi-rail processors.', specs: { 'Output Rails': '8 programmable', Interface: 'I2C' } },
    { name: 'MAX17260 Fuel Gauge', category: 'Power Management ICs', price: 8.50, rating: 4.6, stock: 200, vendor: 'VoltCore Power', description: 'Ultra-low power fuel gauge for accurate battery health.', specs: { Chemistry: 'Li-Po, Li-Ion, LiFePO4', 'Quiescent Current': '1.5µA' } },
    { name: 'L7805 Voltage Regulator', category: 'Power Management ICs', price: 0.99, rating: 4.9, stock: 2000, vendor: 'Pinnacle Semiconductor', description: 'Iconic linear regulator delivering fixed 5V output.', specs: { 'Output': '5V ±2%', 'Current': '1.5A' } },
    { name: 'MCP73831 Li-Po Charger', category: 'Power Management ICs', price: 2.99, rating: 4.5, stock: 650, vendor: 'Pinnacle Semiconductor', description: 'Linear charge management for single-cell Li-Po packs.', specs: { 'Charge Current': '500mA', Safety: 'Thermal regulation' } },
    { name: 'MP2307 Step-Down', category: 'Power Management ICs', price: 3.50, rating: 4.6, stock: 380, vendor: 'VoltCore Power', description: 'Monolithic step-down converter with wide input tracking.', specs: { 'Input': '4.75-23V', 'Output': '3A' } },
    { name: 'OPTIGA Trust M Security', category: 'Power Management ICs', price: 6.99, rating: 4.7, stock: 170, vendor: 'Pinnacle Semiconductor', description: 'Hardware security chip with boot authentication schemes.', specs: { Interface: 'I2C', Security: 'Common Criteria EAL6+' } },

    // Sensor Interface Circuits (10)
    { name: 'MPU-6050 6-Axis Motion', category: 'Sensor Interface Circuits', price: 6.99, rating: 4.7, stock: 550, vendor: 'SensArray Technologies', description: '6-axis motion tracking for drone stabilization and robotics.', specs: { 'Gyro Range': '±250/500/1000/2000°/s', 'Accel': '±2/4/8/16g' } },
    { name: 'DHT22 Temp/Humidity', category: 'Sensor Interface Circuits', price: 4.99, rating: 4.5, stock: 700, vendor: 'SensArray Technologies', description: 'Digital capacitive humidity and temperature sensor.', specs: { 'Temp': '-40~80°C ±0.5°C', 'Humidity': '0-100% RH ±2%' } },
    { name: 'Bosch BME280 Environmental', category: 'Sensor Interface Circuits', price: 8.99, rating: 4.8, stock: 320, vendor: 'SensArray Technologies', description: 'Pressure, humidity and temperature environmental sensor.', specs: { Pressure: '±1 hPa', Interface: 'I2C/SPI' } },
    { name: 'VL53L0X Time-of-Flight', category: 'Sensor Interface Circuits', price: 9.99, rating: 4.6, stock: 250, vendor: 'SensArray Technologies', description: 'Laser-ranging sensor for precise distance measurement.', specs: { Range: 'Up to 2m', Resolution: '1mm' } },
    { name: 'HC-SR04 Ultrasonic', category: 'Sensor Interface Circuits', price: 3.99, rating: 4.4, stock: 900, vendor: 'SensArray Technologies', description: 'Affordable acoustic range finder for obstacle mapping.', specs: { Range: '2-400cm', Frequency: '40kHz' } },
    { name: 'ADS1115 16-Bit ADC', category: 'Sensor Interface Circuits', price: 11.99, rating: 4.7, stock: 340, vendor: 'SensArray Technologies', description: 'Precision external ADC for microcontroller inputs.', specs: { Resolution: '16-bit', Channels: '4 diff / 8 SE' } },
    { name: 'MAX30102 Oximeter', category: 'Sensor Interface Circuits', price: 14.99, rating: 4.5, stock: 150, vendor: 'SensArray Technologies', description: 'Pulse oximetry and heart-rate monitor biosensor.', specs: { LEDs: 'Red + IR', 'Sample Rate': '400Hz' } },
    { name: 'TCS34725 Color Sensor', category: 'Sensor Interface Circuits', price: 7.99, rating: 4.4, stock: 190, vendor: 'SensArray Technologies', description: 'RGB light sensor with IR blocking filter.', specs: { Resolution: '16-bit per channel', Interface: 'I2C' } },
    { name: 'MQ-2 Gas Sensor', category: 'Sensor Interface Circuits', price: 4.49, rating: 4.3, stock: 410, vendor: 'SensArray Technologies', description: 'Combustible gas and smoke sensor array.', specs: { Gases: 'LPG, Propane, Hydrogen, Methane', 'Output': 'Analog' } },
    { name: 'MLX90614 IR Thermometer', category: 'Sensor Interface Circuits', price: 12.99, rating: 4.6, stock: 220, vendor: 'SensArray Technologies', description: 'Non-contact thermal sensor for touchless scanning.', specs: { 'Temp Range': '-70~380°C', Accuracy: '±0.5°C' } },

    // Motor Driver Circuits (7)
    { name: 'L298N Dual H-Bridge', category: 'Motor Driver Circuits', price: 8.99, rating: 4.5, stock: 320, vendor: 'Pinnacle Semiconductor', description: 'Heavy-duty motor driver for two DC motors.', specs: { Motors: '2x DC or 1x Stepper', Current: '2A per channel' } },
    { name: 'A4988 Stepper Driver', category: 'Motor Driver Circuits', price: 6.99, rating: 4.6, stock: 450, vendor: 'Pinnacle Semiconductor', description: 'Microstepping driver for 3D printer motion control.', specs: { 'Microsteps': 'Up to 1/16', 'Protection': 'Overcurrent' } },
    { name: 'DRV8833 Dual Driver', category: 'Motor Driver Circuits', price: 5.99, rating: 4.7, stock: 280, vendor: 'Pinnacle Semiconductor', description: 'Low-voltage H-Bridge with overcurrent safety shutoffs.', specs: { Motors: '2x DC', Current: '1.5A per channel' } },
    { name: 'TB6612FNG Driver', category: 'Motor Driver Circuits', price: 7.99, rating: 4.6, stock: 190, vendor: 'Pinnacle Semiconductor', description: 'MOSFET H-Bridge that runs cooler than older chips.', specs: { Current: '1.2A RMS', Voltage: '4.5-13.5V' } },
    { name: 'MAX14870 H-Bridge', category: 'Motor Driver Circuits', price: 4.99, rating: 4.4, stock: 160, vendor: 'Pinnacle Semiconductor', description: 'Ultra-compact driver for space-constrained robots.', specs: { Current: '1.7A', Voltage: '4.5-36V' } },
    { name: 'PCA9685 PWM Driver', category: 'Motor Driver Circuits', price: 11.99, rating: 4.8, stock: 370, vendor: 'Pinnacle Semiconductor', description: 'I2C 16-channel servo driver for robotic arms.', specs: { Channels: '16', Resolution: '12-bit' } },
    { name: 'TMC2209 SilentStepStick', category: 'Motor Driver Circuits', price: 9.99, rating: 4.9, stock: 210, vendor: 'Pinnacle Semiconductor', description: 'Ultra-silent stepper driver with StealthChop2.', specs: { 'Max Current': '2.8A', 'Microsteps': 'Up to 1/256' } },

    // Optoelectronic Interfaces (6)
    { name: '4N35 Optocoupler', category: 'Optoelectronic Interfaces', price: 1.49, rating: 4.5, stock: 1200, vendor: 'Matrix Transducers Inc.', description: 'Optical isolator protecting pins from high-voltage spikes.', specs: { 'Isolation': '3550V RMS', Channels: '1' } },
    { name: '16x2 Character LCD', category: 'Optoelectronic Interfaces', price: 8.99, rating: 4.6, stock: 400, vendor: 'Nexus Embedded Corp', description: 'Standard text display with HD44780 driver.', specs: { Resolution: '16x2', Driver: 'HD44780' } },
    { name: 'SSD1306 0.96" OLED', category: 'Optoelectronic Interfaces', price: 12.99, rating: 4.8, stock: 320, vendor: 'Silicon Ventures Ltd', description: 'High-contrast monochrome graphic display.', specs: { Resolution: '128x64', Interface: 'I2C/SPI' } },
    { name: 'WS2812B NeoPixel', category: 'Optoelectronic Interfaces', price: 0.99, rating: 4.7, stock: 5000, vendor: 'Embedded Dynamics Ltd.', description: 'Addressable RGB LED with integrated driver.', specs: { Protocol: 'Single-wire NRZ', 'Color Depth': '24-bit RGB' } },
    { name: 'MAX7219 LED Matrix', category: 'Optoelectronic Interfaces', price: 6.99, rating: 4.5, stock: 280, vendor: 'Matrix Transducers Inc.', description: 'Serial 8x8 LED matrix driver.', specs: { Interface: 'SPI', 'Daisy-chain': 'Yes' } },
    { name: 'GP2Y0A21YK0F IR Sensor', category: 'Optoelectronic Interfaces', price: 11.99, rating: 4.4, stock: 150, vendor: 'SensArray Technologies', description: 'IR distance measuring sensor with PSD detector.', specs: { Range: '10-80cm', 'Update Rate': '25Hz' } },

    // Communication Bus Drivers (7)
    { name: 'MAX232 RS-232 Driver', category: 'Communication Bus Drivers', price: 3.99, rating: 4.5, stock: 600, vendor: 'Pinnacle Semiconductor', description: 'Dual RS-232 driver/receiver for serial ports.', specs: { 'Drivers': '2x', 'Data Rate': '120kbps' } },
    { name: 'MAX485 RS-485 Transceiver', category: 'Communication Bus Drivers', price: 2.99, rating: 4.6, stock: 550, vendor: 'Pinnacle Semiconductor', description: 'Low-power differential multipoint transceiver.', specs: { Nodes: 'Up to 256', 'Data Rate': '2.5Mbps' } },
    { name: 'MCP2515 CAN Controller', category: 'Communication Bus Drivers', price: 7.99, rating: 4.7, stock: 240, vendor: 'Pinnacle Semiconductor', description: 'SPI CAN 2.0B controller for automotive networks.', specs: { Standard: 'CAN 2.0B', Speed: '1Mbps' } },
    { name: 'CH340G USB-to-UART', category: 'Communication Bus Drivers', price: 2.49, rating: 4.4, stock: 800, vendor: 'Matrix Transducers Inc.', description: 'USB bridge chip for microcontroller connectivity.', specs: { Interface: 'USB 2.0', 'Data Rate': '2Mbps' } },
    { name: 'FT232RL USB-Serial', category: 'Communication Bus Drivers', price: 9.99, rating: 4.7, stock: 300, vendor: 'Pinnacle Semiconductor', description: 'Premium USB-to-Serial UART with clock generator.', specs: { 'Data Rate': '3Mbps', Features: 'Bit-bang mode' } },
    { name: 'PCA9548A I2C Mux', category: 'Communication Bus Drivers', price: 5.99, rating: 4.5, stock: 170, vendor: 'Pinnacle Semiconductor', description: '8-channel I2C multiplexer for address conflicts.', specs: { Channels: '8', Interface: 'I2C' } },
    { name: 'ISO7741 Digital Isolator', category: 'Communication Bus Drivers', price: 4.99, rating: 4.6, stock: 210, vendor: 'Pinnacle Semiconductor', description: 'Quad-channel digital isolator for galvanic isolation.', specs: { Isolation: '5kVRMS', 'Data Rate': '100Mbps' } },

    // Embedded Storage Modules (6)
    { name: 'W25Q128 Flash IC', category: 'Embedded Storage Modules', price: 3.99, rating: 4.7, stock: 650, vendor: 'Pinnacle Semiconductor', description: '128Mb SPI flash for embedded data storage.', specs: { Capacity: '128Mbit', Interface: 'SPI 104MHz' } },
    { name: 'MicroSD Card Breakout', category: 'Embedded Storage Modules', price: 5.99, rating: 4.5, stock: 400, vendor: 'Nexus Embedded Corp', description: 'SPI MicroSD slot with level shifting.', specs: { Media: 'Up to 32GB', Interface: 'SPI' } },
    { name: 'AT24C256 EEPROM', category: 'Embedded Storage Modules', price: 1.99, rating: 4.4, stock: 900, vendor: 'Pinnacle Semiconductor', description: '256K I2C EEPROM for configuration storage.', specs: { Interface: 'I2C', 'Write Cycles': '1,000,000' } },
    { name: 'DS3231 RTC', category: 'Embedded Storage Modules', price: 10.99, rating: 4.9, stock: 280, vendor: 'Nexus Embedded Corp', description: 'Temperature-compensated RTC with battery backup.', specs: { Accuracy: '±2ppm', Interface: 'I2C' } },
    { name: 'FM24C16 FRAM', category: 'Embedded Storage Modules', price: 3.99, rating: 4.6, stock: 150, vendor: 'Pinnacle Semiconductor', description: 'Ferroelectric RAM with infinite write endurance.', specs: { Capacity: '16Kbit', Endurance: '10^13 cycles' } },
    { name: 'MT48LC16M16A2 SDRAM', category: 'Embedded Storage Modules', price: 7.99, rating: 4.5, stock: 120, vendor: 'Pinnacle Semiconductor', description: '256Mb SDRAM for embedded processor buffers.', specs: { Capacity: '256Mbit', Speed: '166MHz' } },

    // Passive Circuit Networks (10)
    { name: 'Resistor Array Kit', category: 'Passive Circuit Networks', price: 0.99, rating: 4.4, stock: 2000, vendor: 'Matrix Transducers Inc.', description: 'Multi-resistor network in SMD footprint.', specs: { Tolerance: '±5%', 'Package': 'SOP-16' } },
    { name: 'MLCC Capacitor Kit 100pc', category: 'Passive Circuit Networks', price: 12.99, rating: 4.8, stock: 350, vendor: 'Matrix Transducers Inc.', description: 'Assorted decoupling capacitors for noise filtering.', specs: { Range: '10pF-10µF', Voltage: '50V' } },
    { name: 'Electrolytic Cap Kit', category: 'Passive Circuit Networks', price: 14.99, rating: 4.6, stock: 200, vendor: 'Matrix Transducers Inc.', description: 'Bulk storage capacitors for power stabilization.', specs: { Range: '1µF-1000µF', Voltage: '16-63V' } },
    { name: 'Ferrite Bead Core 10pc', category: 'Passive Circuit Networks', price: 3.99, rating: 4.3, stock: 500, vendor: 'Matrix Transducers Inc.', description: 'EMI noise suppression beads for copper traces.', specs: { Impedance: '600Ω at 100MHz', Current: '3A' } },
    { name: 'Trimpot Potentiometer', category: 'Passive Circuit Networks', price: 1.49, rating: 4.4, stock: 750, vendor: 'Matrix Transducers Inc.', description: 'Screw-adjustable resistor for calibration.', specs: { Range: '100Ω-1MΩ', 'Package': '3296W' } },
    { name: 'Toroidal Power Inductor', category: 'Passive Circuit Networks', price: 2.99, rating: 4.5, stock: 280, vendor: 'VoltCore Power', description: 'Magnetic core coil for switching filters.', specs: { Inductance: '100µH', 'Current': '2.5A' } },
    { name: 'Varistor Surge Protector 10pc', category: 'Passive Circuit Networks', price: 4.99, rating: 4.6, stock: 320, vendor: 'Matrix Transducers Inc.', description: 'Overvoltage transient absorption components.', specs: { 'Voltage': '275V RMS', 'Energy': '10J' } },
    { name: '16MHz Crystal Oscillator', category: 'Passive Circuit Networks', price: 0.79, rating: 4.5, stock: 1200, vendor: 'Matrix Transducers Inc.', description: 'Precision clock resonator for digital systems.', specs: { Frequency: '16MHz ±20ppm', 'Package': 'HC-49US' } },
    { name: 'RC Low-Pass Filter', category: 'Passive Circuit Networks', price: 0.99, rating: 4.3, stock: 400, vendor: 'Matrix Transducers Inc.', description: 'Resistor-capacitor network for analog smoothing.', specs: { 'Cutoff': '1.6kHz', 'Package': 'SIP-4' } },
    { name: 'Zener Diode Kit 50pc', category: 'Passive Circuit Networks', price: 6.99, rating: 4.5, stock: 600, vendor: 'Matrix Transducers Inc.', description: 'Voltage clamping diodes for surge protection.', specs: { Range: '3.3V-24V', Power: '500mW' } },

    // Programmable Logic Circuits (7)
    { name: 'Xilinx Artix-7 FPGA', category: 'Programmable Logic Circuits', price: 149.99, rating: 4.8, stock: 30, vendor: 'Core Silicon Foundry', description: 'High-density FPGA matrix for custom logic.', specs: { 'Logic Cells': '100K', 'DSP Slices': '240' } },
    { name: 'Altera Cyclone IV FPGA', category: 'Programmable Logic Circuits', price: 89.99, rating: 4.6, stock: 45, vendor: 'Core Silicon Foundry', description: 'Low-cost FPGA for video decoding.', specs: { 'Logic Elements': '22,320', RAM: '594Kbit' } },
    { name: 'Intel MAX 10 FPGA', category: 'Programmable Logic Circuits', price: 59.99, rating: 4.7, stock: 55, vendor: 'Core Silicon Foundry', description: 'Non-volatile FPGA with dual boot flash.', specs: { 'Logic Elements': '16,000', Config: 'Dual boot' } },
    { name: 'Lattice iCE40 UltraPlus', category: 'Programmable Logic Circuits', price: 34.99, rating: 4.5, stock: 80, vendor: 'Core Silicon Foundry', description: 'Ultra-low power FPGA for edge AI.', specs: { 'Logic Cells': '5,280', Power: '<1mW standby' } },
    { name: 'Xilinx CoolRunner-II CPLD', category: 'Programmable Logic Circuits', price: 19.99, rating: 4.4, stock: 120, vendor: 'Core Silicon Foundry', description: 'Instant-on CPLD with no config chip needed.', specs: { Macrocells: '256', tPD: '5ns' } },
    { name: 'SmartFusion2 SoC FPGA', category: 'Programmable Logic Circuits', price: 129.99, rating: 4.7, stock: 25, vendor: 'Pinnacle Semiconductor', description: 'FPGA + ARM Cortex-M3 on-chip.', specs: { 'FPGA': '12K logic elements', MCU: 'ARM Cortex-M3' } },
    { name: 'Lattice MachXO3 FPGA', category: 'Programmable Logic Circuits', price: 24.99, rating: 4.5, stock: 95, vendor: 'Core Silicon Foundry', description: 'Instant-on bridging FPGA for I/O expansion.', specs: { 'Logic Cells': '6,400', 'I/O': '206' } },
  ];
  await db.collection('Products').insertMany(products);

  // ── Courses ──
  await db.collection('Courses').createIndex({ category: 1 });
  const courses = [
    { title: 'Embedded Firmware Engineering', category: 'Embedded Engineering', instructor: 'Dr. Marcus Vance', duration: '12 weeks', price: 499.99, rating: 4.8, certified: true, level: 'Advanced', studentsCount: 340, description: 'Master embedded firmware development with ARM Cortex-M microcontrollers.', syllabus: ['Introduction to Embedded Systems', 'ARM Cortex-M Architecture', 'Interrupts and DMA', 'RTOS Fundamentals', 'Peripheral Drivers', 'Power Management', 'Debugging and Profiling', 'Final Capstone Project'] },
    { title: 'Advanced SCADA & Telemetry', category: 'Telemetry Networks', instructor: 'Prof. Clara Dupont', duration: '8 weeks', price: 349.99, rating: 4.7, certified: true, level: 'Advanced', studentsCount: 210, description: 'Deep dive into industrial SCADA systems and telemetry data pipelines.', syllabus: ['SCADA Architecture Overview', 'Modbus and DNP3 Protocols', 'Telemetry Data Acquisition', 'Real-time Monitoring Dashboards', 'Security Hardening', 'Incident Response Drills'] },
    { title: 'Edge AI & Neural Networks', category: 'Edge AI / Neural Nets', instructor: 'Dr. Marcus Vance', duration: '10 weeks', price: 599.99, rating: 4.9, certified: true, level: 'Advanced', studentsCount: 180, description: 'Deploy neural network models on resource-constrained edge devices.', syllabus: ['Neural Network Fundamentals', 'Model Quantization', 'TensorFlow Lite for Microcontrollers', 'Edge TPU Optimization', 'Real-world Deployments', 'Performance Benchmarking'] },
    { title: 'IoT Security & Cryptography', category: 'Cybersecurity / SCADA', instructor: 'Prof. Clara Dupont', duration: '6 weeks', price: 299.99, rating: 4.6, certified: true, level: 'Intermediate', studentsCount: 420, description: 'Secure IoT deployments with modern cryptographic primitives.', syllabus: ['Threat Modeling for IoT', 'Symmetric Encryption', 'Public Key Infrastructure', 'Secure Boot and OTA Updates', 'Penetration Testing Lab'] },
    { title: 'Software Development for Engineers', category: 'Advanced Software', instructor: 'Dr. Marcus Vance', duration: '8 weeks', price: 399.99, rating: 4.5, certified: true, level: 'Intermediate', studentsCount: 290, description: 'Modern C++ and Rust for embedded and systems programming.', syllabus: ['C++ for Embedded Systems', 'Rust Memory Safety', 'Concurrency Patterns', 'Testing and CI/CD', 'Cross-compilation Toolchains'] },
  ];
  await db.collection('Courses').insertMany(courses);

  // ── Lessons (sample per course) ──
  const courseDocs = await db.collection('Courses').find().toArray();
  const lessons: Record<string, any>[] = [];
  for (const course of courseDocs) {
    const syllabus = course.syllabus as string[] | undefined;
    if (syllabus) {
      syllabus.forEach((topic, i) => {
        lessons.push({
          courseId: course._id,
          title: topic,
          order: i + 1,
          duration: `${40 + Math.floor(Math.random() * 60)} min`,
          content: `Lesson content for "${topic}" in course "${course.title}".`,
          resources: [],
        });
      });
    }
  }
  if (lessons.length) {
    await db.collection('Lessons').insertMany(lessons);
  }

  // ── Assessments ──
  await db.collection('Assessments').insertMany([
    { title: 'Embedded Systems Final Exam', type: 'exam', totalMarks: 100, passingMarks: 60, duration: '3 hours' },
    { title: 'SCADA Protocol Quiz', type: 'quiz', totalMarks: 20, passingMarks: 12, duration: '30 min' },
    { title: 'Neural Network Practical Lab', type: 'lab', totalMarks: 50, passingMarks: 30, duration: '2 hours' },
  ]);

  // ── Certificates ──
  await db.collection('Certificates').createIndex({ userId: 1 });
  await db.collection('Certificates').createIndex({ courseId: 1 });

  // ── Subscriptions ──
  await db.collection('Subscriptions').insertMany([
    { name: 'Starter Plan', price: 0, features: ['Browse products', 'View courses'] },
    { name: 'Professional Plan', price: 29.99, features: ['Unlimited purchases', 'Course enrollment', 'Priority support'] },
    { name: 'Enterprise Plan', price: 99.99, features: ['API access', 'Bulk discounts', 'Dedicated account manager', 'Custom integrations'] },
  ]);

  // ── Orders, Payments, Invoices ──
  await db.collection('Orders').createIndex({ userId: 1 });
  await db.collection('Payments').createIndex({ orderId: 1 });
  await db.collection('Invoices').createIndex({ orderId: 1 });

  // ── Warehouses ──
  await db.collection('Warehouses').insertMany([
    { name: 'Kigali Distribution Hub', location: 'Kigali, Rwanda', capacity: 5000 },
    { name: 'Nairobi Fulfillment Center', location: 'Nairobi, Kenya', capacity: 8000 },
    { name: 'Cape Town Logistics Depot', location: 'Cape Town, South Africa', capacity: 6000 },
  ]);

  // ── Meetings, MeetingRecordings, BreakoutRooms ──
  await db.collection('Meetings').createIndex({ hostId: 1 });
  await db.collection('MeetingRecordings').createIndex({ meetingId: 1 });
  await db.collection('BreakoutRooms').createIndex({ meetingId: 1 });

  // ── ChatMessages ──
  await db.collection('ChatMessages').createIndex({ roomId: 1 });
  await db.collection('ChatMessages').createIndex({ senderId: 1 });

  // ── Notifications ──
  await db.collection('Notifications').createIndex({ userId: 1 });

  // ── Advertisements ──
  await db.collection('Advertisements').insertMany([
    { title: 'Core Silicon Banner', type: 'banner', placement: 'homepage', budget: 5000, status: 'active' },
    { title: 'Matrix Transducers Video Roll', type: 'video', placement: 'mttv_video_roll', budget: 12000, status: 'active' },
  ]);

  // ── Campaigns ──
  await db.collection('Campaigns').insertMany([
    { name: 'Q3 Hardware Launch', advertiser: 'Core Silicon Foundry', budget: 25000, impressions: 150000, status: 'live' },
    { name: 'RTTI Certification Drive', advertiser: 'Matrix Transducers Inc.', budget: 18000, impressions: 85000, status: 'scheduled' },
  ]);

  // ── Articles, Videos, Podcasts ──
  await db.collection('Articles').insertMany([
    { title: 'The Rise of Edge AI in Industrial Automation', author: 'Dr. Marcus Vance', publishedAt: new Date(), readTime: '8 min' },
    { title: 'Securing IoT Networks with Zero Trust Architecture', author: 'Prof. Clara Dupont', publishedAt: new Date(), readTime: '6 min' },
  ]);

  await db.collection('Videos').insertMany([
    { title: 'SCADA System Walkthrough', host: 'Prof. Clara Dupont', duration: '34:20', views: 1200 },
    { title: 'Building Your First IoT Gateway', host: 'Dr. Marcus Vance', duration: '45:10', views: 2300 },
  ]);

  await db.collection('Podcasts').insertMany([
    { title: 'Embedded Futures Ep. 42 — AI at the Edge', host: 'RT Nexus Media', duration: '52:15', publishedAt: new Date() },
    { title: 'Embedded Futures Ep. 43 — Supply Chain Resilience', host: 'RT Nexus Media', duration: '48:30', publishedAt: new Date() },
  ]);

  // ── Analytics ──
  await db.collection('Analytics').createIndex({ event: 1 });
  await db.collection('Analytics').createIndex({ timestamp: -1 });

  // ── AuditLogs ──
  await db.collection('AuditLogs').createIndex({ userId: 1 });
  await db.collection('AuditLogs').createIndex({ timestamp: -1 });

  // ── Reports ──
  await db.collection('Reports').insertMany([
    { name: 'Monthly Sales Summary', type: 'sales', generatedAt: null },
    { name: 'Course Completion Rates', type: 'education', generatedAt: null },
    { name: 'Ad Performance Q3', type: 'advertising', generatedAt: null },
  ]);

  // ── SupportTickets ──
  await db.collection('SupportTickets').createIndex({ userId: 1 });
  await db.collection('SupportTickets').createIndex({ status: 1 });

  console.log('Seed complete — all collections created with sample data.');
  console.log('Admin user: username=rtnexus, password=123456');
  await client.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
