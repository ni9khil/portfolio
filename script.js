function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function scrollToContact() {
  const el = document.getElementById('contact');
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    location.href = '#contact';
  }
}

// Theme helpers: simple toggle and persistence
function setTheme(name) {
  const root = document.documentElement;
  if (name === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  try { localStorage.setItem('theme', name); } catch (e) {}
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
}

function initTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) { setTheme(saved); return; }
  } catch (e) {}
  // fallback to system preference
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}


document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const toggle = document.getElementById('theme-toggle');
  const toggleMobile = document.getElementById('theme-toggle-mobile');
  if (toggle) toggle.addEventListener('click', toggleTheme);
  if (toggleMobile) toggleMobile.addEventListener('click', toggleTheme);
  fetch('config.json')
    .then(res => res.ok ? res.json() : Promise.reject('no config'))
    .then(cfg => {
      // cache config so other helpers can reuse it without fetching again
      try { window.__siteConfig = cfg; } catch (e) {}
      const logo = document.getElementById('logo-name');
      const logoMobile = document.getElementById('logo-name-mobile');
      const profileName = document.getElementById('profile-name');
      const profileRole = document.getElementById('profile-role');
      if (logo && cfg.displayName) logo.textContent = cfg.displayName;
      if (logoMobile && cfg.displayName) logoMobile.textContent = cfg.displayName;
      if (profileName && cfg.displayName) profileName.textContent = cfg.displayName;
      if (profileRole && cfg.role) profileRole.textContent = cfg.role;

      const downloadBtn = document.getElementById('download-cv-btn');
      if (downloadBtn && cfg.resume) downloadBtn.onclick = () => window.open(cfg.resume, '_blank');

      const socialLinkedIn = document.getElementById('social-linkedin');
      const socialGitHub = document.getElementById('social-github');
      if (socialLinkedIn && cfg.linkedin) socialLinkedIn.onclick = () => location.href = cfg.linkedin;
      if (socialGitHub && cfg.github) socialGitHub.onclick = () => location.href = cfg.github;

      const contactEmail = document.getElementById('contact-email');
      if (contactEmail && cfg.email) {
        contactEmail.href = 'mailto:' + cfg.email;
        contactEmail.textContent = cfg.email;
      }
      const contactLinkedIn = document.getElementById('contact-linkedin');
      if (contactLinkedIn && cfg.linkedin) contactLinkedIn.href = cfg.linkedin;

      const cName = document.getElementById('copyright-name');
      const cYear = document.getElementById('copyright-year');
      if (cName && cfg.copyrightName) cName.textContent = cfg.copyrightName;
      if (cYear && cfg.copyrightYear) cYear.textContent = cfg.copyrightYear;

      if (Array.isArray(cfg.projects)) {
        cfg.projects.slice(0,3).forEach((p, i) => {
          const idx = i + 1;
          const g = document.getElementById(`project${idx}-github`);
          const l = document.getElementById(`project${idx}-live`);
          if (g && p.github) g.onclick = () => location.href = p.github;
          if (l && p.live) l.onclick = () => location.href = p.live;
          const titles = document.querySelectorAll('.project-title');
          if (titles[i] && p.title) titles[i].textContent = p.title;
        });
      }
    })
    .catch(err => console.warn('Could not load config.json:', err));
});

// Redirect helper: go to LinkedIn URL from config.json
function redirectToLinkedIn() {
  const cfg = window.__siteConfig;
  if (cfg && cfg.linkedin) {
    window.location.href = cfg.linkedin;
    return;
  }
  // fallback: fetch config then redirect
  fetch('config.json')
    .then(res => res.ok ? res.json() : Promise.reject('no config'))
    .then(c => {
      try { window.__siteConfig = c; } catch (e) {}
      if (c && c.linkedin) window.location.href = c.linkedin;
      else console.warn('No linkedin URL found in config.json');
    })
    .catch(err => console.warn('Could not load config.json for redirect:', err));
}


console.log(contactLinkedIn);