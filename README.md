# Open Alumns Portal 🎓

A production-ready, open source alumni portal theme / template designed for colleges and communities for community building, networking and maintaining alumni engagement.

![Open Alumns Portal](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- **🎨 Fully Configurable**: Customize everything via `site.config.yml` without touching code
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🔍 Advanced Search**: Fuzzy search with year-based filtering
- **📊 Content Driven**: YAML and Markdown-backed content for alumni, events, and blog
- **🎯 SEO Optimized**: Built-in SEO features and meta tags
- **⚡ Performance**: Fast Vite dev/build pipeline with optimized output
- **🎭 Theme System**: Easy color customization with CSS variables
- **📚 Documentation**: Comprehensive guides for users and contributors

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/noskofficial/openalumns.git
   cd open-alumns-portal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Configuration

The theme is fully configurable through the `site.config.yml` file. Here's what you can customize:

### Site Information

```yaml
site:
  name: 'Your Alumni Portal'
  description: "Connect with your institution's alumni"
  url: 'https://your-domain.com'
  logo: '/logo.svg'
  favicon: '/favicon.ico'
  hero_image: '/hero-bg.jpg'
```

### Colors

```yaml
colors:
  primary:
    500: '#22c55e' # Main brand color
  secondary:
    500: '#eab308' # Accent color
  accent:
    500: '#737373' # Neutral color
```

### Navigation

```yaml
navigation:
  - label: 'Home'
    url: '/'
    icon: 'home'
  - label: 'Alumni Directory'
    url: '/alumni'
    mega_menu: true
    submenu:
      - label: 'By Year'
        url: '/alumni/years'
      - label: 'By Chapter'
        url: '/alumni/chapters'
```

### Chapters

```yaml
chapters:
  - name: 'Computer Science'
    slug: 'cs'
    description: 'Computer Science graduates'
    icon: 'code'
    color: '#22c55e'
```

## 📁 Project Structure

```
open-alumns-portal/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # React route pages
│   ├── content/            # YAML and Markdown content
│   │   ├── alumni/         # Alumni profiles
│   │   ├── events/         # Event listings
│   │   └── blog/           # Blog posts
│   ├── data/               # Content loading and parsing
│   ├── styles/             # Global styles and CSS
│   └── types/              # Shared TypeScript types
├── public/                 # Static assets
├── site.config.yml         # Main configuration file
├── tailwind.config.mjs     # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

## 🎨 Customization

### Adding New Pages

1. Create a new `.tsx` file in `src/pages/`
2. Import the shared `Layout` component
3. Add your content

```tsx
import { Layout } from '@/components/Layout';

export function NewPage() {
  return (
    <Layout title="Page Title">
      <h1>Your Content Here</h1>
    </Layout>
  );
}
```

### Customizing Styles

- **Global CSS**: Edit `src/styles/global.css`
- **Tailwind Config**: Modify `tailwind.config.mjs`
- **Component Styles**: Use Tailwind classes or custom CSS

### Adding New Content Types

1. Create content files in the appropriate `src/content/*` directory
2. Extend parsing/selectors in `src/data/content.ts`
3. Update components/pages to display new content

## 📚 Content Management

### Alumni Profiles

Create alumni profiles in `src/content/alumni/`:

```yaml
---
name: 'John Doe'
slug: 'john-doe'
chapter: 'Computer Science'
year: 2020
bio: 'Software engineer passionate about...'
short_bio: 'Software Engineer at Tech Corp'
email: 'john@example.com'
linkedin: 'https://linkedin.com/in/johndoe'
current_position: 'Senior Software Engineer'
company: 'Tech Corp'
location: 'San Francisco, CA'
skills: ['JavaScript', 'React', 'Node.js']
featured: true
---
```

### Events

Add events in `src/content/events/`:

```yaml
---
title: 'Annual Alumni Meet'
slug: 'annual-alumni-meet-2024'
description: 'Join us for our annual gathering...'
date: 2024-12-15
location: 'Main Campus'
category: 'Networking'
featured: true
---
```

### Blog Posts

Create blog posts in `src/content/blog/`:

```markdown
---
title: 'Building Strong Alumni Networks'
description: 'Tips for creating meaningful connections...'
author: 'Admin'
publishDate: 2024-01-15
category: 'Community'
tags: ['networking', 'alumni', 'community']
---

Your blog content here...
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to Netlify

### Other Platforms

The theme generates static files, so it works with any static hosting service.

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add TypeScript types where appropriate
- Test your changes locally
- Update documentation if needed
- Ensure responsive design works

### Areas to Contribute

- 🎨 UI/UX improvements
- 🚀 Performance optimizations
- 📱 Mobile experience enhancements
- 🌍 Internationalization support
- 🔧 Additional customization options
- 📚 Documentation improvements
- 🐛 Bug fixes

## 📖 Documentation

### For Users

- [Installation Guide](docs/installation.md)
- [Configuration Reference](docs/configuration.md)
- [Content Management](docs/content.md)
- [Customization Guide](docs/customization.md)
- [Deployment Guide](docs/deployment.md)

### For Developers

- [Architecture Overview](docs/architecture.md)
- [Component API](docs/components.md)
- [Content Collections](docs/collections.md)
- [Styling System](docs/styling.md)
- [Testing Guide](docs/testing.md)

## 🎯 Roadmap

- [ ] Advanced search filters
- [ ] Alumni directory export
- [ ] Event registration system
- [ ] Newsletter integration
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app
- [ ] Analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NOSK (Nepal Open Source Klub)** - Lead organization
- **React + Vite Communities** - Frontend tooling ecosystem
- **Tailwind CSS** - Utility-first CSS framework
- **Community Contributors** - Everyone who helps improve this project

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/noskofficial/openalumns/issues)
- **Discussions**: [Join community discussions](https://github.com/noskofficial/openalumns/discussions)
- **Email**: info@nosk.org.np

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=noskofficial/openalumns&type=Date)](https://star-history.com/#noskofficial/openalumns&Date)

---

Made with ❤️ by [NOSK](https://nosk.org.np) and the open source community.

If this project helps you, please give it a ⭐️!

# alumniApp
