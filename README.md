# MTG Converter

A web application for converting Magic: The Gathering card lists from CSV format to Liga Magic format.

## 🎯 Overview

MTG Converter is a React-based tool that helps Magic: The Gathering players and collectors convert their card inventories from CSV files into the specific format required by Liga Magic. The application provides a simple drag-and-drop interface with customizable options for card conditions and editions.

## ✨ Features

- **📁 CSV File Upload**: Drag and drop or click to upload CSV files containing MTG card data
- **🎛️ Customizable Options**:
  - Force card condition (Near Mint, Slightly Played, Moderately Played, Heavily Played, Damaged)
  - Option to ignore edition information
- **📋 One-Click Copy**: Copy the converted output directly to your clipboard
- **🎨 Modern UI**: Built with Ant Design components and Tailwind CSS
- **⚡ Fast Processing**: Client-side CSV parsing with instant results

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/jeager/mtg-converter.git
cd mtg-converter
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

The built files will be available in the `dist` directory.

### Running Tests

The project uses Jest and React Testing Library for testing. To run tests:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

Tests are located in `__tests__` directories alongside the source files they test.

**Note:** There is a known compatibility issue between React 19 and @testing-library/react regarding `React.act`. The tests are properly structured and will work once the testing library is fully updated for React 19 compatibility. In the meantime, you may see deprecation warnings, but the tests should still execute.

## 📖 How to Use

### 1. Prepare Your CSV File

Your CSV file should contain the following columns:

- `Quantidade` - The quantity of cards
- `Card (EN)` - The English name of the card
- `Edicao (Sigla)` - The edition abbreviation (e.g., "M21", "ZNR")
- `Extras` (optional) - Additional card attributes

**Example CSV format:**

```csv
Quantidade,Card (EN),Edicao (Sigla),Extras
4,Lightning Bolt,M21,foil
1,Black Lotus,LEA,
2,Counterspell,7ED,showcase
```

### 2. Upload and Configure

1. **Upload your CSV file** by dragging it into the upload area or clicking to browse
2. **Configure options** (optional):
   - **Force Condition**: Check this to apply a specific condition to all cards
     - Choose from: Near Mint, Slightly Played, Moderately Played, Heavily Played, or Damaged
   - **Ignore Edition**: Check this to exclude edition information from the output

### 3. Copy the Results

- The converted format will appear in the text area below
- Click the **Copy** button to copy the entire output to your clipboard
- A success notification will confirm the copy action

### Output Format

The application converts your CSV data to Liga Magic format:

```text
4 Lightning Bolt [QUALIDADE=nm] [EDICAO=M21] [EXTRAS=foil]
1 Black Lotus [QUALIDADE=nm] [EDICAO=LEA]
2 Counterspell [QUALIDADE=nm] [EDICAO=7ED] [EXTRAS=showcase]
```

**Format explanation:**

- `Quantidade Card Name [QUALIDADE=condition] [EDICAO=edition] [EXTRAS=extras]`
- Quality codes: `nm` (Near Mint), `sp` (Slightly Played), `mp` (Moderately Played), `hp` (Heavily Played), `dm` (Damaged)

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **UI Components**: Ant Design
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **CSV Parsing**: csv-parse
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint

## 📁 Project Structure

```text
mtg-converter/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── index.tsx   # Component exports
│   │   └── Uploader.tsx # File upload component
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── assets/         # Images and other assets
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues and Support

If you encounter any issues or have questions, please [open an issue](https://github.com/jeager/mtg-converter/issues) on GitHub.

## 🚀 Deployment

The application can be deployed to any static hosting service like:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Simply run `pnpm build` and deploy the contents of the `dist` directory.

---

Made with ❤️ for the Magic: The Gathering community