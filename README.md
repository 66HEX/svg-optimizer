# SVG Optimizer

Desktop application for optimizing SVG files, built with Electron and SVGO.

## Features

### File Operations
- Select multiple SVG files
- Select output directory
- Batch processing

### Optimization Options
- Remove comments, XML, styles and attributes
- Remove metadata and editor data
- Remove empty attributes and containers
- Merge and optimize paths

### UI Features
- Dark theme with gradient cards
- Real-time optimization stats
- File size reduction display
- Success/error indicators

## Prerequisites

- Node.js (v16+)
- npm

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/66HEX/svg-optimizer.git
   cd png-to-webp
   ```

2. Install dependencies
   ```bash
   npm install
   ```

## Usage

1. Start the application
   ```bash
   npm start
   ```

2. Click "Select SVG Files" to choose files
3. Select optimization options:
   * Remove comments - removes XML tags, styles and attributes
   * Remove metadata - removes editor data and other metadata
   * Remove empty attributes - cleans up empty attributes and containers
   * Merge paths - optimizes and merges SVG paths
4. Click "Optimize SVG" and select output directory
5. View optimization results in status panel

## Build

Create portable Windows executables:
```bash
npm run build
```

Builds will be in the `dist/` directory.

## Technologies

- Electron
- SVGO
- HTML/CSS/JavaScript

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Create pull request
