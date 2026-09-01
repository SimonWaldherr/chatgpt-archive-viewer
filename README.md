# ChatGPT Archive Viewer

Turn a ChatGPT data export into a private, searchable, portable HTML archive. All processing happens locally in the browser; no conversation data is uploaded.

## ✨ Features

- **Current export support**: Open `conversations.json` as well as legacy `chat.html` exports
- **🔍 Advanced Search**: Search titles and messages with useful operators:
  - Use quotes for exact phrases: `"exact phrase"`
  - Use `-` to exclude terms: `javascript -error`
  - Use `/` for OR searches: `python/javascript`
  - Or use the readable form: `python OR javascript`
  - Limit by title or author: `title:project from:user`
  - Filter models and content: `model:gpt-4o has:code`
  - Filter status and size: `is:archived messages:>50`
  - Filter activity dates: `after:2025-01-01 before:2026-01-01`
  - Filter creation or update periods: `created:2025 updated:2026-01`
  - Combine all operators: `"machine learning" python -error`
  - Search ignores case and diacritics, so `cafe` also finds `Café`
- **Search reference**: See [docs/search.md](docs/search.md) for every operator, date semantics, and examples
- **↕️ Flexible sorting**: Sort independently by creation date, last change, title, or message count
- **🌙 Dark Mode**: Automatic dark mode detection with manual toggle
- **📚 Fast browsing**: Conversations are sorted, collapsed, and rendered lazily for large archives
- **🔗 Direct Links**: Quick access to each conversation on chatgpt.com
- **💾 Settings Persistence**: Dark mode preference saved locally
- **📱 Responsive Design**: Works great on mobile and desktop
- **⚡ Performance**: Optimized for large chat archives
- **⌨️ Accessible controls**: Responsive layout, keyboard search (`/`) and reduced-motion support
- **🧳 Portable output**: The generated viewer is one self-contained file with no external dependencies

## 🚀 How to Use

### Option 1: Online Tool (Recommended)

1. **Download your Chats from ChatGPT**:
   - Navigate to `Menu → Data Controls → Data Export`
   - Follow the instructions to receive your download link via email
   - Download and unzip the zip file

2. **Open Your Chat Archive**:
   - Visit the [Chat Archive Enhancer Tool](https://simonwaldherr.github.io/chatgpt-archive-viewer/)
   - Choose `conversations.json` (recommended) or a legacy `chat.html` file

3. **Save or Open Enhanced Archive**:
   - Click `Save viewer` to download the enhanced archive
   - Or click `Preview` to inspect it directly in the browser

### Option 2: Local Development

1. **Clone the repository**:

   ```bash
   git clone https://github.com/SimonWaldherr/chatgpt-archive-viewer.git
   cd chatgpt-archive-viewer
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

4. **Start local server**:

   ```bash
   npm run preview
   ```

## 🛠️ Development

### Build System

The project uses a modern build system that automatically generates the embedded templates:

- **Templates**: Located in `templates/` directory
  - `pre.html`: HTML header and styles
  - `post.html`: JavaScript functionality
- **Build Script**: `build.js` automatically encodes templates and updates `index.html`
- **Testing**: `test.js` validates the build process

### Available Scripts

```bash
npm run build    # Build the project
npm run build:example # Build the project and regenerate example/chat-enhanced.html
npm run dev      # Build and start development server
npm run preview  # Start preview server
npm test         # Run tests
npm run lint     # Lint JavaScript files
npm run format   # Format code with Prettier
```

### Architecture

The tool works by:

1. Reading `conversations.json` or extracting conversation data from a legacy HTML export
2. Validating and normalizing the conversation data locally
3. Injecting enhanced HTML templates with modern JavaScript
4. Creating an improved interface with search and UI enhancements

## 📝 Example

- [Original ChatGPT archive example](https://simonwaldherr.github.io/chatgpt-archive-viewer/example/chat-original.html)
- [Enhanced version by this tool](https://simonwaldherr.github.io/chatgpt-archive-viewer/example/chat-enhanced.html)
