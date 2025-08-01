# ChatGPT Archive Enhancer Tool

The Chat Archive Enhancer Tool enhances your downloaded ChatGPT chat archive with the following features:

## ✨ Features

- **🔍 Advanced Search**: Easily search through your chat history with powerful operators:
  - Use quotes for exact phrases: `"exact phrase"`
  - Use `-` to exclude terms: `javascript -error`
  - Use `/` for OR searches: `python/javascript`
  - Combine all operators: `"machine learning" python -error`
- **🌙 Dark Mode**: Automatic dark mode detection with manual toggle
- **📚 Collapsible Chats**: Organize your chats by collapsing or expanding entries
- **🔗 Direct Links**: Quick access to each chat on chat.openai.com
- **💾 Settings Persistence**: Dark mode preference saved locally
- **📱 Responsive Design**: Works great on mobile and desktop
- **⚡ Performance**: Optimized for large chat archives
- **🎨 Modern UI**: Clean, accessible interface with CSS custom properties

## 🚀 How to Use

### Option 1: Online Tool (Recommended)

1. **Download your Chats from ChatGPT**:
   - Navigate to `Menu → Data Controls → Data Export`
   - Follow the instructions to receive your download link via email
   - Download and unzip the zip file

2. **Open Your Chat Archive**:
   - Visit the [Chat Archive Enhancer Tool](https://simonwaldherr.github.io/chatgpt-archive-viewer/)
   - Click on the `choose file` button and select your `chat.html` file

3. **Save or Open Enhanced Archive**:
   - Click on `Save Edited File` to save the enhanced archive to your device
   - Or click on `Open Edited File` to directly use the enhanced archive

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
npm run dev      # Build and start development server
npm run preview  # Start preview server
npm test         # Run tests
npm run lint     # Lint JavaScript files
npm run format   # Format code with Prettier
```

### Architecture

The tool works by:

1. Reading the original ChatGPT export HTML file
2. Extracting the JSON data containing conversations
3. Injecting enhanced HTML templates with modern JavaScript
4. Creating an improved interface with search and UI enhancements

## 📝 Example

- [Original ChatGPT archive example](https://simonwaldherr.github.io/chatgpt-archive-viewer/example/chat-original.html)
- [Enhanced version by this tool](https://simonwaldherr.github.io/chatgpt-archive-viewer/example/chat-enhanced.html)
