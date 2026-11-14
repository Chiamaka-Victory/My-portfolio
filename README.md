# Victory Okpala Chiamaka | Student Portfolio and Academic Management Website

A minimalist, responsive, multi-page student portfolio and academic task management site built with semantic HTML5, one external CSS stylesheet, and vanilla JavaScript.

Created for **COS 106: Introduction to Web Technologies** at **MIVA Open University**.

## File Structure

- `index.html`: Homepage with sticky navbar, dynamic greeting, typing role effect, biography, local portrait photo upload preview, animated counters, capabilities cards, and call to action.
- `about.html`: Personal story, educational background table, vertical career timeline, aspirations, animated skill bars, hobbies, and real voice audio introduction.
- `projects.html`: Two full data analysis case studies (Family Retail Sales Insights in Excel and Power BI; Customer Segmentation and Repeat Purchase Analysis in Python), with reading progress bar, anchor links, data tables, and clickable lightbox visuals.
- `planner.html`: Academic Planner with priority selection, categories, due dates, animated task enter and delete transitions, completion progress bar, filters, and `localStorage` persistence.
- `contact.html`: Direct contact details in Enugu, Nigeria, response time note, and validated form with green check indicators, shake feedback, live character counter, and delivery to `o.victory0585@miva.edu.ng`.
- `css/style.css`: Shared studio palette (`#f7f5f0`, `#0f172a`, `#0b2a4a`, `#b08d57`, `#e7e4dc`), Playfair Display + Inter typography, animations, and reduced motion rules.
- `js/main.js`: Scroll navbar shrink, animated hamburger toggle, typing effect, scroll reveal, animated counters, skill bars, profile photo upload preview, and back to top button.
- `js/projects.js`: Projects page reading progress bar, active anchor highlight, and lightbox modal.
- `js/planner.js`: Task manager logic (`addTask`, `toggleTask`, `deleteTask`, `renderTasks`).
- `js/contact.js`: Form validation, live character counter, and FormSubmit delivery.
- `images/`: Portrait placeholder (`profile.jpg`) and six case study SVG charts (`p1-*.svg`, `p2-*.svg`).
- `media/intro.mp3`: Personal voice recording introduction.

## Customisation Checklist

Search for `REPLACE` across the HTML files to update:
1. `images/profile.jpg` with your own headshot photo (you can also test your photo on `index.html` using the **Upload Your Photo** button).
2. `about.html` secondary school name and enrolment years.
3. `projects.html` sample case study numbers marked `REPLACE with real figures` and the project links (`View Live Dashboard`, `GitHub Repository`, `View Report`).
4. `contact.html` phone number and GitHub repository link.
5. Footer social profile URLs across all five HTML pages.

## Hosting on GitHub Pages

1. Create a public GitHub repository and upload every file and folder (`index.html`, `about.html`, `projects.html`, `planner.html`, `contact.html`, `README.md`, `css/`, `js/`, `images/`, `media/`) to the repository root.
2. Open **Settings** then **Pages**, select **Deploy from a branch**, pick `main` and `/ (root)`, and click **Save**.
3. Wait one to two minutes and open your published link.
4. Submit one test message on `contact.html` and click the activation link sent by FormSubmit to `o.victory0585@miva.edu.ng`.

## Hosting on Vercel

1. Push the full project to GitHub with **all folders intact** (`css/`, `js/`, `images/`, `media/`, `index.html`, `about.html`, `projects.html`, `planner.html`, `contact.html`, `package.json`, `vite.config.ts`, `vercel.json`).
   - **Important if using GitHub's web Upload Files page:** Drag and drop the entire extracted project contents (folders included) into the GitHub upload box rather than clicking "choose your files" (which skips folders and leaves pages unstyled without CSS, JavaScript, or images).
2. Open Vercel, click **Add New Project**, and import your GitHub repository.
3. Leave **Root Directory** as `./` and keep the detected settings (`vercel.json` automatically sets Framework Preset to **Vite**, Build Command to `npm run build`, and Output Directory to `dist`), then click **Deploy**.
4. Once live, open `/`, `/about`, `/projects`, `/planner`, and `/contact` and submit one test message on the Contact page to activate FormSubmit for `o.victory0585@miva.edu.ng`.


