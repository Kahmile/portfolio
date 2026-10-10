(function () {
  "use strict";

  const SITE = window.SITE;
  const PROJECTS = window.PROJECTS;

  // Every page's <base href> points at the site root ("./" on the homepage, "../../" on project pages).
  // Freeze it as an absolute URL so relative links keep working after history.pushState changes the address.
  const base = document.querySelector("base");
  base.setAttribute("href", base.href);
  const ROOT = base.href; // e.g. https://kahmile.github.io/portfolio/
  const ROOT_PATH = new URL(ROOT).pathname;
  // _build/build.py loads each page with ?prerender to save fully rendered HTML for crawlers and AI tools.
  const PRERENDER = new URLSearchParams(location.search).has("prerender");
  let expandMoreOnce = false; // legacy "#/more-about-me" links open that panel on the homepage

  const main = document.getElementById("main");
  const toggle = document.getElementById("projects-toggle");
  const menu = document.getElementById("projects-menu");

  let slideshow = null; // active slideshow controller, if a project view is open
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Bold right-pointing arrow; the "previous" button flips it with CSS.
  const ARROW_SVG = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">' +
    '<path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3.5" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---------- Helpers ----------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (key === "text") node.textContent = value;
      else if (key === "class") node.className = value;
      else node.setAttribute(key, value);
    }
    for (const child of [].concat(children || [])) {
      if (child) node.append(child);
    }
    return node;
  }

  // "Label: detail" bullets get a bold label; plain sentences are left as-is.
  function bulletItem(text) {
    const match = text.match(/^([^.:]{2,70}):\s+(.+)$/s);
    if (!match) return el("li", { text });
    return el("li", {}, [el("strong", { text: match[1] + ":" }), " " + match[2]]);
  }

  function esc(text) {
    return String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }

  const projectPath = (project) => `projects/${project.slug}/`;
  const absolute = (path) => SITE.url + encodeURI(path);

  function summarize(text, limit = 160) {
    if (text.length <= limit) return text;
    return text.slice(0, text.lastIndexOf(" ", limit - 1)).replace(/[,;:]$/, "") + "…";
  }

  // ---------- Search / sharing metadata ----------
  // Title, description, canonical URL, link-preview (Open Graph) tags, and schema.org structured data,
  // updated for every page so prerendered HTML carries the right values.
  function setMeta({ title, description, path, image, type, data }) {
    const url = SITE.url + path;
    document.title = title;
    const set = (selector, attr, value) => document.head.querySelector(selector).setAttribute(attr, value);
    set('meta[name="description"]', "content", description);
    set('link[rel="canonical"]', "href", url);
    set('meta[property="og:type"]', "content", type);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", description);
    set('meta[property="og:url"]', "content", url);
    set('meta[property="og:image"]', "content", image);
    document.getElementById("structured-data").textContent = JSON.stringify(data);
  }

  function person() {
    return {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
      image: absolute(SITE.profile.src),
      email: `mailto:${SITE.contact.email}`,
      sameAs: [SITE.contact.linkedin],
      affiliation: { "@type": "CollegeOrUniversity", name: SITE.affiliation },
      knowsAbout: SITE.professionalInterests,
      description: SITE.bio.join(" "),
    };
  }

  function homeMeta() {
    const title = `${SITE.name} | Engineering Portfolio`;
    setMeta({
      title,
      description: summarize(SITE.bio.join(" ")),
      path: "",
      image: absolute(SITE.profile.src),
      type: "profile",
      data: {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: title,
        url: SITE.url,
        mainEntity: person(),
        hasPart: PROJECTS.map((p) => ({ "@type": "CreativeWork", name: p.title, url: SITE.url + projectPath(p) })),
      },
    });
  }

  function projectMeta(project) {
    const images = project.slides.filter((s) => s.type === "image").map((s) => absolute(s.src));
    setMeta({
      title: `${project.title} | ${SITE.name}`,
      description: summarize(project.bullets.join(" ")),
      path: projectPath(project),
      image: images[0] || absolute(SITE.profile.src),
      type: "article",
      data: {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        url: SITE.url + projectPath(project),
        description: project.bullets.join(" "),
        ...(project.period ? { temporalCoverage: project.period } : {}),
        image: images,
        author: { "@type": "Person", name: SITE.name, url: SITE.url },
      },
    });
  }

  // ---------- Hamburger menu ----------
  // Two entries only: About Me, and Projects (opens the latest project; the sidebar lists the rest).
  function buildMenu() {
    menu.replaceChildren(); // prerendered pages already contain a copy of the menu
    menu.append(el("li", {}, el("a", { href: "./", "data-route": "about", text: "About Me" })));
    const projectsLink = el("a", { href: projectPath(PROJECTS[0]), "data-route": "projects", text: "Projects" });
    projectsLink.addEventListener("click", openWithSidebar);
    menu.append(el("li", {}, projectsLink));
  }

  // Used by the menu's "Projects" link and the "View latest project" button:
  // always arrive with the All Projects list expanded, even if the visitor collapsed it earlier.
  function openWithSidebar() {
    sidebarCollapsed = false; // the page-link click handler further down does the navigation
  }

  function menuLinks() {
    return Array.from(menu.querySelectorAll("a"));
  }

  function openMenu(focusFirst) {
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    if (focusFirst) menuLinks()[0].focus();
  }

  function closeMenu(returnFocus) {
    openedByHover = false;
    if (menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus();
  }

  // Mouse users get hover-to-open; a click while hover-opened "pins" the menu instead of closing it.
  // Touch and keyboard users keep click / Enter / ArrowDown behavior.
  const dropdown = document.querySelector(".dropdown");
  let openedByHover = false;
  let hoverCloseTimer = null;

  dropdown.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(hoverCloseTimer);
    if (menu.hidden) {
      openMenu(false);
      openedByHover = true;
    }
  });

  dropdown.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse" || !openedByHover) return;
    hoverCloseTimer = setTimeout(() => {
      if (openedByHover) closeMenu(false);
    }, 250); // grace period for crossing the gap between button and menu
  });

  toggle.addEventListener("click", () => {
    if (openedByHover) {
      openedByHover = false; // pin it open
      return;
    }
    if (menu.hidden) openMenu(false);
    else closeMenu(false);
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(true);
    }
  });

  menu.addEventListener("keydown", (event) => {
    const links = menuLinks();
    const index = links.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      links[(index + step + links.length) % links.length].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      links[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      links[links.length - 1].focus();
    }
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) closeMenu(true);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown")) closeMenu(false);
  });

  dropdown.addEventListener("focusout", (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeMenu(false);
  });

  // ---------- Views ----------
  function renderAbout(expandMore) {
    const latestButton = el("a", { class: "button", href: projectPath(PROJECTS[0]), text: "View latest project" });
    latestButton.addEventListener("click", openWithSidebar);
    const bio = el("div", { class: "bio" }, [
      el("h1", { tabindex: "-1", id: "about-heading", text: SITE.name }),
      el("h2", { text: "Introduction" }),
      ...SITE.bio.map((para) => el("p", { text: para })),
      el("h2", { text: "Professional Interests" }),
      el("p", { class: "tagline", text: SITE.professionalInterests.join(" · ") }),
      el("h2", { text: "Contact" }),
      el("ul", { class: "contact" }, [
        el("li", {}, ["Email: ", el("a", { href: `mailto:${SITE.contact.email}`, text: SITE.contact.email })]),
        el("li", {}, ["LinkedIn: ", el("a", {
          href: SITE.contact.linkedin, target: "_blank", rel: "noopener",
          text: SITE.contact.linkedin.replace(/^https:\/\/(www\.)?|\/$/g, ""),
        }, el("span", { class: "visually-hidden", text: " (opens in a new tab)" }))]),
      ]),
      el("div", { class: "cta" }, [
        latestButton,
      ]),
      buildMoreAboutMe(expandMore),
    ]);
    const photo = el("img", { src: SITE.profile.src, alt: SITE.profile.alt, width: "340", height: "340" });
    return el("section", { class: "about", "aria-labelledby": "about-heading" }, [photo, bio]);
  }

  // Expand/collapse "More About Me" panel at the bottom of the homepage (no page switch needed).
  function buildMoreAboutMe(expanded) {
    const panel = el("div", { class: "more-panel", id: "more-about-me-panel" }, [
      el("p", { class: "more-intro", text: "My interests beyond engineering include:" }),
      el("ul", {}, SITE.interests.map((item) => el("li", { text: item }))),
    ]);
    const button = el("button", {
      class: "more-toggle", type: "button", id: "more-about-me",
      "aria-expanded": String(expanded), "aria-controls": panel.id,
    }, [el("span", { class: "chevron", "aria-hidden": "true", text: "▸" }), " More About Me"]);
    panel.hidden = !expanded;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
    });
    return el("section", { class: "more-about" }, [el("h2", {}, button), panel]);
  }

  function renderProject(project) {
    const index = PROJECTS.indexOf(project);
    const details = el("div", { class: "project-details" }, [
      el("h1", { tabindex: "-1", text: project.title }),
      project.period ? el("p", { class: "eyebrow", text: project.period }) : null,
      el("div", { class: "card" }, el("ul", { class: "project-bullets" }, project.bullets.map(bulletItem))),
    ]);
    const content = el("section", { class: "project" }, [details]);
    if (project.slides.length) content.append(buildSlideshow(project));

    return el("div", { class: "project-main" }, [content, buildPager(index)]);
  }

  // Previous / next project links so visitors can move between projects without the top menu.
  function buildPager(index) {
    const link = (project, direction) => el("a", { class: `pager-link ${direction}`, href: projectPath(project) }, [
      el("span", { class: "pager-label", text: direction === "prev" ? "← Previous project" : "Next project →" }),
      el("span", { class: "pager-title", text: project.title }),
    ]);
    return el("nav", { class: "pager", "aria-label": "Project navigation" }, [
      index > 0 ? link(PROJECTS[index - 1], "prev") : el("span"),
      index < PROJECTS.length - 1 ? link(PROJECTS[index + 1], "next") : el("span"),
    ]);
  }

  // Collapsible left-hand list of all projects.
  // Starts open on every page load; toggling carries over while moving between pages.
  let sidebarCollapsed = false;
  function buildSidebar(current) {
    const collapsed = sidebarCollapsed;

    const list = el("ul", { class: "sidebar-list", id: "sidebar-list" }, PROJECTS.map((project) => {
      const attrs = { href: projectPath(project) };
      if (project === current) attrs["aria-current"] = "page";
      return el("li", {}, el("a", attrs, project.title));
    }));
    const button = el("button", {
      class: "sidebar-toggle", type: "button", "aria-controls": list.id, "aria-expanded": String(!collapsed),
      title: collapsed ? "Show project list" : "Hide project list",
    }, [el("span", { class: "chevron", "aria-hidden": "true", text: "▸" }), el("span", { class: "sidebar-heading", text: "All Projects" })]);

    const aside = el("nav", { class: "sidebar", "aria-label": "All projects" }, [button, list]);
    function apply(isCollapsed) {
      aside.classList.toggle("collapsed", isCollapsed);
      list.hidden = isCollapsed;
      button.setAttribute("aria-expanded", String(!isCollapsed));
      button.title = isCollapsed ? "Show project list" : "Hide project list";
    }
    apply(collapsed);
    button.addEventListener("click", () => {
      const isCollapsed = button.getAttribute("aria-expanded") === "true";
      sidebarCollapsed = isCollapsed;
      apply(isCollapsed);
    });
    return aside;
  }

  // ---------- Slideshow ----------
  function buildSlideshow(project) {
    const slides = project.slides;
    let index = 0;

    const frame = el("div", { class: "slide-frame" });
    const img = el("img", { src: "", alt: "" });
    const video = el("video", { controls: "", playsinline: "", preload: "metadata" });

    const caption = el("p", { class: "slide-caption", id: `caption-${project.slug}` });
    const counter = el("p", { class: "slide-counter" });
    const description = el("span", { class: "visually-hidden" });
    // Polite live region: announces caption, alt description, and position on every change.
    const live = el("div", { class: "slide-info", "aria-live": "polite", "aria-atomic": "true" }, [
      caption,
      el("p", { class: "visually-hidden" }, description),
      counter,
    ]);

    const prev = el("button", { class: "slide-btn", type: "button", "aria-label": "Previous slide" });
    const next = el("button", { class: "slide-btn", type: "button", "aria-label": "Next slide" });
    prev.innerHTML = ARROW_SVG;
    next.innerHTML = ARROW_SVG;
    prev.firstChild.classList.add("flip");

    // autoplay: start videos when the visitor navigates to them (not on first page load).
    function show(newIndex, autoplay = true) {
      index = (newIndex + slides.length) % slides.length;
      const slide = slides[index];
      video.pause();
      frame.replaceChildren();
      if (slide.type === "video") {
        video.src = encodeURI(slide.src);
        video.poster = slide.poster ? encodeURI(slide.poster) : "";
        video.setAttribute("aria-label", slide.alt);
        video.setAttribute("aria-describedby", caption.id);
        frame.append(video);
      } else {
        video.removeAttribute("src");
        video.load();
        img.src = encodeURI(slide.src);
        img.alt = slide.alt;
        frame.append(img);
      }
      caption.textContent = slide.caption;
      description.textContent = (slide.type === "video" ? "Video: " : "") + slide.alt;
      counter.textContent = `${index + 1} / ${slides.length}`;
      // Warm the cache for the next image so clicking forward feels instant.
      const upcoming = slides[(index + 1) % slides.length];
      if (upcoming.type === "image") new Image().src = encodeURI(upcoming.src);
      if (slide.type === "video" && autoplay && !reducedMotion.matches) {
        // Clicks/keypresses count as user interaction, so sound is allowed; fall back to muted if blocked.
        video.muted = false;
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    }

    prev.addEventListener("click", () => show(index - 1));
    next.addEventListener("click", () => show(index + 1));

    const wrapper = el("section", { class: "slideshow", "aria-roledescription": "carousel", "aria-label": `${project.title} gallery` }, [
      frame,
      el("div", { class: "slide-controls" }, [prev, live, next]),
      el("p", { class: "slide-hint", text: "Use the arrow buttons or your keyboard's ← → keys to browse." }),
    ]);

    if (PRERENDER) wrapper.append(staticGallery(slides));
    show(0, false);
    slideshow = {
      prev: () => show(index - 1),
      next: () => show(index + 1),
      stop: () => video.pause(),
    };
    return wrapper;
  }

  // Full list of slides inside <noscript>: browsers ignore it, but crawlers and AI tools that don't
  // run JavaScript can read every image, caption, and description.
  function staticGallery(slides) {
    const items = slides.map((s) => {
      const media = s.type === "video"
        ? `<a href="${esc(encodeURI(s.src))}">Video: ${esc(s.caption)}</a>`
        : `<img src="${esc(encodeURI(s.src))}" alt="${esc(s.alt)}" loading="lazy">`;
      return `<li><figure>${media}<figcaption>${esc(s.caption)}: ${esc(s.alt)}</figcaption></figure></li>`;
    });
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<ol class="static-gallery">${items.join("")}</ol>`;
    return noscript;
  }

  document.addEventListener("keydown", (event) => {
    if (!slideshow || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    // Let focused media, form fields, and the open menu keep their own arrow-key behavior.
    const target = event.target;
    if (target.closest && (target.closest("video, input, textarea, select, [contenteditable]") || target.closest("#projects-menu"))) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      slideshow.prev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      slideshow.next();
    }
  });

  // ---------- Router ----------
  // Pages are real URLs: "" (homepage) and "projects/<slug>/". Each has a prebuilt HTML file for
  // direct visits and crawlers; clicks between pages swap content in place via the History API.
  function pagePath(url) {
    const path = decodeURI(url.pathname);
    return path.startsWith(ROOT_PATH) ? path.slice(ROOT_PATH.length) : null;
  }

  function isPage(url) {
    const path = pagePath(url);
    return path === "" || path === "index.html" || /^projects\/[^/]+\/$/.test(path || "");
  }

  function route() {
    const path = pagePath(location) || "";
    const slug = (path.match(/^projects\/([^/]+)\/$/) || [])[1];
    const project = slug && PROJECTS.find((p) => p.slug === slug);
    if (!project && path !== "") history.replaceState(null, "", ROOT); // unknown address -> homepage

    if (slideshow) slideshow.stop();
    slideshow = null;

    const expandMore = expandMoreOnce;
    expandMoreOnce = false;
    const view = project ? renderProject(project) : renderAbout(expandMore);
    if (project) projectMeta(project);
    else homeMeta();

    // Every page gets the collapsible project list on the left.
    main.replaceChildren(el("div", { class: "page-layout" }, [buildSidebar(project || null), view]));
    const current = project ? "projects" : "about";
    menuLinks().forEach((link) => {
      if (link.dataset.route === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    if (expandMore) {
      // "More About Me" lives on the homepage: open it there and bring it into view.
      const moreToggle = document.getElementById("more-about-me");
      moreToggle.closest(".more-about").scrollIntoView({ block: "start" });
      if (routed) moreToggle.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
      // Move focus to the new heading on navigation so screen readers announce the page change.
      if (routed) main.querySelector("h1").focus({ preventScroll: true });
    }
    routed = true;
  }

  // Same-site page links navigate without a full reload (keeps the sidebar state, feels instant).
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (link.classList.contains("skip-link")) {
      // With <base>, "#main" would point at the homepage; just jump to this page's content.
      event.preventDefault();
      main.focus();
      return;
    }
    if (link.target || link.hasAttribute("download")) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !isPage(url)) return;
    event.preventDefault();
    if (url.href !== location.href) history.pushState(null, "", url.href);
    route();
  });

  window.addEventListener("popstate", route);

  // Old "#/..." links (from before pages had their own URLs) still land in the right place.
  function upgradeLegacyHash() {
    const match = location.hash.match(/^#\/(project\/([^/]+)|more-about-me|about)/);
    if (!match) return;
    if (match[2]) history.replaceState(null, "", ROOT + `projects/${match[2]}/`);
    else {
      expandMoreOnce = match[1] === "more-about-me";
      history.replaceState(null, "", ROOT);
    }
  }

  let routed = false;
  upgradeLegacyHash();
  buildMenu();
  document.getElementById("year").textContent = new Date().getFullYear();
  route();
})();
