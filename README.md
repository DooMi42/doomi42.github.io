# Johannes Hurmerinta - Portfolio

A modern, neon-themed portfolio website showcasing software development skills, entrepreneurship, and projects. Built with React, Tailwind CSS, and featuring a stunning dark theme with glassmorphism effects.

*Warning: This portfolio may cause excessive scrolling, sudden urges to hire me, and mild addiction to gradient backgrounds. Side effects include improved job prospects and increased LinkedIn notifications.*

## Features

- **Modern Dark Theme**: Neon/glass aesthetic with gradient backgrounds and particle effects (because who needs sleep when you have glowing borders?)
- **Interactive Skill Showcase**: Floating skill chips with hover animations (they're like digital confetti, but more professional)
- **Functional Contact Form**: Working contact form with email integration (no more "contact me" buttons that lead to nowhere)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices (because your phone deserves nice things too)
- **Download Functionality**: Working CV download buttons (finally, a CV that doesn't get lost in the email void)
- **GDPR Compliance**: Complete Imprint and Privacy Policy pages (we take your data privacy seriously, unlike that one website that still uses HTTP)
- **Modern Tech Stack**: React 18, Vite, Tailwind CSS, Lucide React icons (all the cool kids are using it)

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)
- **Email Service**: EmailJS integration (with fallback)
- **Build Tool**: Vite
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (version 16 or higher) - because we're not living in the stone age
- npm or yarn - your choice, we don't judge (much)

### Installation

1. Clone the repository or download the project files (git clone, not copy-paste, please)
2. Install dependencies:
   ```bash
   npm install
   ```
   *This may take a moment. Perfect time to grab a coffee ☕*

### Development

Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`

*If it doesn't open automatically, don't panic. Your browser might be shy. Just copy the URL and paste it manually.*

### Building for Production

Create a production build:
```bash
npm run build
```
*This creates a `dist` folder with all the optimized files. It's like packing a suitcase, but for websites.*

Preview the production build:
```bash
npm run preview
```
*See how your website will look when it grows up and gets deployed to the real world.*

## Project Structure

```
├── public/                 # Static assets
│   ├── cv.pdf             # CV/Resume file for download
│   ├── imprint.html       # Legal imprint page
│   └── privacy.html       # Privacy policy page
├── src/
│   ├── App.jsx            # Main portfolio component
│   ├── main.jsx           # React entry point
│   ├── index.css          # Global styles and Tailwind imports
│   └── services/
│       └── emailService.js # Email service with EmailJS integration
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## Customization

### Content Updates

Edit `src/App.jsx` to update:
- Personal information and bio
- Project details and links
- Skills and experience timeline
- Contact information
- Skill chip positions in `fixedChipPositions`

### Styling

The design uses a modern dark theme with:
- **Background**: Dark (#0B0B10)
- **Accent Colors**: Indigo, Purple, Fuchsia gradients
- **Glass Effects**: Backdrop blur and transparency
- **Neon Effects**: Glowing borders and shadows

Modify `tailwind.config.js` to customize the design system.

### Contact Form Setup

The contact form uses EmailJS for email sending (because we're fancy like that):
1. Set up EmailJS account at https://www.emailjs.com/ (it's free, no catch!)
2. Update credentials in `src/services/emailService.js` (don't worry, we've made it easy)
3. Uncomment EmailJS integration code (just remove the `/*` and `*/`)
4. Fallback opens user's email client (because sometimes the old ways are the best ways)

*Pro tip: The fallback actually works great and doesn't require any setup. Your users' email clients will thank you.*

### Adding New Sections

The component uses reusable helper components:
- `Container`: Responsive container with max-width
- `Card`: Glassmorphism card component
- `Button`: Button variants (primary, ghost, outline)
- `Badge`: Small label component
- `SectionTitle`: Section headers with kicker and subtitle

## Key Features

### Interactive Skill Showcase
- Floating skill chips with hover animations
- Responsive positioning for mobile and desktop
- Customizable chip positions in `fixedChipPositions`

### Contact System
- Working contact form with validation
- EmailJS integration for direct email sending
- Fallback to user's email client
- Success/error feedback with visual indicators

### Download Functionality
- CV download buttons in header and contact section
- PDF file served from `/public/cv.pdf`
- Proper download attributes for file naming

### Legal Compliance
- GDPR-compliant Imprint page (`/public/imprint.html`)
- Comprehensive Privacy Policy (`/public/privacy.html`)
- Professional legal documentation

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized skill chip layout for small screens
- Consistent experience across all devices

## Deployment

This project can be deployed to any static hosting service (because we're not picky):

- **Vercel**: Connect your GitHub repository (one-click deployment, because we're lazy)
- **Netlify**: Drag and drop the `dist` folder (drag, drop, done. It's that simple)
- **GitHub Pages**: Use GitHub Actions to build and deploy (free hosting, because free is good)
- **Render**: Connect repository for automatic deployments (set it and forget it)

*All of these services offer free tiers, so you can deploy without spending a single penny. Your wallet will thank you.*

## License

This project is open source and available under the [MIT License](LICENSE).

*Translation: Use it, modify it, make it your own. Just don't blame us if your boss asks why you're spending so much time making your portfolio look amazing instead of working on that bug report.* 😄

---

*Made with ❤️, ☕, and way too much time spent on gradient colors.*
