# svr-jpcrls.github.io

# Your Name — Data Analytics Portfolio

<!-- TODO: Replace "Your Name" above with your actual name -->

A personal portfolio website showcasing my academic projects, skills, and growth as a BSIT student majoring in Data and Business Analytics.

**Live site:** [https://yourusername.github.io](https://yourusername.github.io)
<!-- TODO: Update this URL with your actual GitHub username -->

---

## Stack

- Plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no libraries
- Deployed on GitHub Pages (free, automatic HTTPS)
- Contact form powered by [Formspree](https://formspree.io)

## Project Structure

```
yourusername.github.io/
├── index.html          # Main portfolio page
├── robots.txt          # Search engine crawler rules
├── sitemap.xml         # Page index for search engines
├── CNAME               # Custom domain config (optional)
├── .gitignore          # Files excluded from version control
├── README.md           # This file
├── assets/
│   ├── css/
│   │   └── style.css   # All styles — written from scratch
│   ├── js/
│   │   └── main.js     # All JavaScript
│   └── images/         # Add your photo and project screenshots here
└── blog/
    └── index.html      # Blog post listing
```

## Deployment

1. Clone the repository
2. Add your content (see `<!-- TODO:` comments throughout the HTML)
3. Connect your Formspree endpoint to the contact form
4. Push to GitHub — Pages builds automatically

```bash
git add .
git commit -m "Update portfolio content"
git push origin main
```

## Security Features

- Content Security Policy via `<meta http-equiv="Content-Security-Policy">`
- All JavaScript in an external file — no inline scripts
- `rel="noopener noreferrer"` on all external links
- No email address in the HTML — contact routes through Formspree only
- `.gitignore` configured to exclude environment and config files

## License

Feel free to fork and adapt for your own portfolio. If you do, a credit in the README would be appreciated but isn't required.
