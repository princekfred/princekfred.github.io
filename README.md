# Prince Frederick Kwao — academic website

A six-page, static academic portfolio for GitHub Pages. The site uses plain HTML, CSS, and JavaScript; no build step or dependencies are required.

## Pages and files

| File | Content |
| --- | --- |
| `index.html` | Centered profile, portrait, research summary, and professional links |
| `research.html` | Strongly correlated systems, heavy-metal complexes, and excited-state quantum algorithms |
| `publications.html` | Publications and preprints |
| `awards-presentations.html` | Awards and research presentations |
| `teaching.html` | Teaching, mentoring, and volunteer service |
| `gallery.html` | Conference and award photographs |
| `styles.css` | Shared responsive design and themes |
| `script.js` | Theme switch, copyright year, and gallery lightbox |

All links between pages and assets use relative paths, so the site works at a GitHub Pages account root or project path.

## Edit the content

Change text directly in the relevant HTML page. The awards and presentations are listed in `awards-presentations.html`; the gallery contains photographs and captions separately. Add an item by copying a complete `<li>` in the appropriate list and updating its title, source, and date.

The homepage portrait is `assets/prince.png`. To change it, add your new image under `assets/` and update the portrait `<img>` in `index.html`. Gallery images are in `assets/gallery/`; when replacing one, update its filename, alternative text, and caption in `gallery.html`.

Check names, dates, publication details, and links before publishing.

## Publish on GitHub Pages

Upload the contents of this directory to the root of a GitHub repository. In the repository's **Settings → Pages**, choose **Deploy from a branch**, select the default branch and **/(root)**, then save. GitHub Pages serves `index.html` and the linked pages directly. The `.nojekyll` file keeps the files from being processed as a Jekyll site.
