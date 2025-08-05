# PrivNote - Self-Destructing Secure Notes

![PrivNote Logo](/public/shield.svg)

PrivNote is a secure, self-destructing note sharing application built with React, TypeScript, and Vite. It allows users to create encrypted notes that automatically self-destruct after being read once.

## Features

- **Self-Destructing Notes**: Notes automatically disappear after being read once
- **End-to-End Encryption**: Military-grade AES 256-bit encryption for unbreakable data protection
- **Password Protection**: Optional custom passwords for an extra layer of security
- **Zero-Knowledge Architecture**: All encryption happens in your browser - we never see your unencrypted content
- **Secure Link Generation**: Unique, shareable URLs for each note
- **Modern UI**: Clean, responsive interface built with TailwindCSS and Shadcn UI components

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7
- **Routing**: React Router v7
- **State Management**: React Query (TanStack Query)
- **Styling**: TailwindCSS 4
- **UI Components**: Shadcn UI (Radix UI)
- **Encryption**: CryptoJS (AES-256)
- **Notifications**: Sonner Toast

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/privnote-front.git
   cd privnote-front
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## How It Works

1. **Create a Note**: Enter your confidential message and optionally set a custom password
2. **Share the Link**: A unique URL is generated that you can share with the recipient
3. **One-Time Access**: When the recipient opens the link, the note is decrypted in their browser and immediately deleted from the server
4. **Self-Destruction**: The note is permanently destroyed after being read once

## Security

- All encryption and decryption happens client-side using AES-256
- The server never receives or stores unencrypted note content
- Notes are stored encrypted and are permanently deleted after being read
- Password hashes are never sent to the server

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [CryptoJS](https://github.com/brix/crypto-js) for encryption
- [Shadcn UI](https://ui.shadcn.com/) for UI components
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build system
