# A-Class Barber Website 💈

A modern, high-performance website for A-Class Barber in Waterford, Ireland. Built with Astro and TailwindCSS, featuring a responsive design, dynamic reviews, and seamless animations.

## ✨ Key Features

- 🚀 Lightning-fast performance with Astro's static site generation
- 💅 Responsive design with Tailwind CSS
- 🖼️ Optimized image loading with Sharp
- 📱 Mobile-friendly navigation with smooth animations
- ⭐ Google Places API integration for live reviews
- 🎯 SEO optimized with meta tags and structured data
- 📢 Dynamic announcement banner
- 🗺️ Google Maps integration
- 📸 Interactive image gallery
- 🕒 Real-time opening hours
- 🔗 Social media integration

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build)
- **Styling:** [TailwindCSS](https://tailwindcss.com)
- **Icons:** [Astro Icon](https://github.com/natemoo-re/astro-icon)
- **Image Optimization:** [Sharp](https://sharp.pixelplumbing.com)
- **Deployment:** [Netlify](https://netlify.com)
- **Reviews:** Google Places API
- **Date Formatting:** [TimeAgo.js](https://timeago.org)

## 📁 Project Structure

```
/
├── public/
├── src/
│   ├── assets/          # Images and static assets
│   ├── components/      # Reusable Astro components
│   ├── data/           # Static data files
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── scripts/        # Client-side JavaScript
│   └── styles/         # CSS styles
└── package.json
```

## 🚀 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/a-class-barber.git
cd a-class-barber
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:

```env
GOOGLE_PLACES_API_KEY=your_api_key
GOOGLE_PLACES_ID=your_place_id
```

4. **Start development server:**

```bash
npm run dev
```

## 🔧 Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm run dev`     | Start development server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview production build locally             |

## 📦 Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🚀 Deployment

This site is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Configure environment variables in Netlify dashboard
3. Deploy with `main` branch

## ⚙️ Environment Variables

Required environment variables:

- `GOOGLE_PLACES_API_KEY`: Your Google Places API key
- `GOOGLE_PLACES_ID`: Your business's Google Place ID

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
