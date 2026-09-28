(function () {
  "use strict";

  const SITE = window.SITE;
  const PROJECTS = window.PROJECTS;
  const INTERESTS_ROUTE = "more-about-me";

  const main = document.getElementById("main");
  const toggle = document.getElementById("projects-toggle");
  const menu = document.getElementById("projects-menu");

  let slideshow = null; // active slideshow controller, if a project view is open

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

  function setTitle(page) {
    document.title = page ? `${page} | ${SITE.name}` : `${SITE.name} | Engineering Portfolio`;
  }

  // ---------- Projects dropdown ----------
  function buildMenu() {
    PROJECTS.forEach((project) => {
      const link = el("a", { href: `#/project/${project.slug}`, "data-route": project.slug }, [
        project.title,
        project.period ? el("span", { class: "menu-date", text: project.period }) : null,
      ]);
      menu.append(el("li", {}, link));
    });
    menu.append(el("li", { class: "menu-separator", role: "presentation" }));
    menu.append(el("li", {}, el("a", { href: `#/${INTERESTS_ROUTE}`, "data-route": INTERESTS_ROUTE, text: "More About Me" })));
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
    if (menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener("click", () => (menu.hidden ? openMenu(false) : closeMenu(false)));

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

  document.querySelector(".dropdown").addEventListener("focusout", (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeMenu(false);
  });

  // ---------- Views ----------
  function renderAbout() {
    setTitle("");
    const bio = el("div", { class: "bio" }, [
      el("h1", { tabindex: "-1", id: "about-heading", text: SITE.name }),
      el("h2", { text: "Introduction" }),
      ...SITE.bio.map((para) => el("p", { text: para })),
      el("h2", { text: "Contact" }),
      el("ul", { class: "contact" }, [
        el("li", {}, ["Email: ", el("a", { href: `mailto:${SITE.contact.email}`, text: SITE.contact.email })]),
        el("li", {}, ["LinkedIn: ", el("a", {
          href: SITE.contact.linkedin, target: "_blank", rel: "noopener",
          text: SITE.contact.linkedin.replace(/^https:\/\/(www\.)?|\/$/g, ""),
        }, el("span", { class: "visually-hidden", text: " (opens in a new tab)" }))]),
      ]),
      el("h2", { text: "Professional Interests" }),
      el("p", { class: "tagline", text: SITE.professionalInterests.join(" · ") }),
      el("div", { class: "cta" }, [
        el("a", { class: "button", href: `#/project/${PROJECTS[0].slug}`, text: "View latest project" }),
      ]),
      el("p", { class: "more-link" }, el("a", { href: `#/${INTERESTS_ROUTE}`, text: "More about me" })),
    ]);
    const photo = el("img", { src: SITE.profile.src, alt: SITE.profile.alt, width: "340", height: "340" });
    return el("section", { class: "about", "aria-labelledby": "about-heading" }, [photo, bio]);
  }

  function renderInterests() {
    setTitle("More About Me");
    return el("section", { class: "interests" }, [
      el("h1", { tabindex: "-1", text: "More About Me" }),
      el("p", { class: "eyebrow", text: "Interests outside of engineering" }),
      el("div", { class: "card" }, el("ul", {}, SITE.interests.map((item) => el("li", { text: item })))),
    ]);
  }

  function renderProject(project) {
    setTitle(project.title);
    const details = el("div", { class: "project-details" }, [
      el("h1", { tabindex: "-1", text: project.title }),
      project.period ? el("p", { class: "eyebrow", text: project.period }) : null,
      el("div", { class: "card" }, el("ul", { class: "project-bullets" }, project.bullets.map(bulletItem))),
    ]);
    const container = el("section", { class: "project" }, [details]);
    if (project.slides.length) container.append(buildSlideshow(project));
    return container;
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

    const prev = el("button", { class: "slide-btn", type: "button", "aria-label": "Previous slide", text: "←" });
    const next = el("button", { class: "slide-btn", type: "button", "aria-label": "Next slide", text: "→" });

    function show(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      const slide = slides[index];
      video.pause();
      frame.replaceChildren();
      if (slide.type === "video") {
        video.src = slide.src;
        video.poster = slide.poster || "";
        video.setAttribute("aria-label", slide.alt);
        video.setAttribute("aria-describedby", caption.id);
        frame.append(video);
      } else {
        video.removeAttribute("src");
        video.load();
        img.src = slide.src;
        img.alt = slide.alt;
        frame.append(img);
      }
      caption.textContent = slide.caption;
      description.textContent = (slide.type === "video" ? "Video: " : "") + slide.alt;
      counter.textContent = `${index + 1} / ${slides.length}`;
      // Warm the cache for the next image so clicking forward feels instant.
      const upcoming = slides[(index + 1) % slides.length];
      if (upcoming.type === "image") new Image().src = upcoming.src;
    }

    prev.addEventListener("click", () => show(index - 1));
    next.addEventListener("click", () => show(index + 1));

    const wrapper = el("section", { class: "slideshow", "aria-roledescription": "carousel", "aria-label": `${project.title} gallery` }, [
      frame,
      el("div", { class: "slide-controls" }, [prev, live, next]),
      el("p", { class: "slide-hint", text: "Use the arrow buttons or your keyboard's ← → keys to browse." }),
    ]);

    show(0);
    slideshow = {
      prev: () => show(index - 1),
      next: () => show(index + 1),
      stop: () => video.pause(),
    };
    return wrapper;
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
  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [section, slug] = hash.split("/");

    if (slideshow) slideshow.stop();
    slideshow = null;

    let view;
    let current = null;
    const project = section === "project" && PROJECTS.find((p) => p.slug === slug);
    if (project) {
      view = renderProject(project);
      current = project.slug;
    } else if (section === INTERESTS_ROUTE) {
      view = renderInterests();
      current = INTERESTS_ROUTE;
    } else {
      view = renderAbout();
    }

    main.replaceChildren(view);
    menuLinks().forEach((link) => {
      if (link.dataset.route === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    window.scrollTo(0, 0);
    // Move focus to the new heading on navigation so screen readers announce the page change.
    if (routed) main.querySelector("h1").focus({ preventScroll: true });
    routed = true;
  }

  let routed = false;
  buildMenu();
  document.getElementById("year").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  route();
})();
