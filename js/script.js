// script.js - Tailwind refactor interactivity
document.addEventListener('DOMContentLoaded', () => {

 
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('hidden');
    });
    window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    mobileMenu.classList.add('hidden');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

  }

  // Compact portfolio filters (add/append in script.js)
(function () {
  const filterBtns = Array.from(document.querySelectorAll('#portfolio .filter-btn'));
  const cards = Array.from(document.querySelectorAll('#compactGrid .compact-card'));

  if (!filterBtns.length || !cards.length) return;

  // Activate initial state
  const setActive = (btn) => {
    filterBtns.forEach(b => {
     b.classList.remove('bg-[#0A66FF]', 'text-white');
     b.classList.add('border-[#E6EAF0]', 'text-[#1A1A1A]');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('bg-[#0A66FF]', 'text-white');
    btn.classList.remove('bg-transparent');
  btn.setAttribute('aria-pressed', 'true');
  };

  filterBtns.forEach(btn => {
    // click
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      setActive(btn);
      cards.forEach(card => {
        const matches = f === 'all' || card.classList.contains(f);
        // smooth show/hide using opacity/transform
        if (matches) {
  card.classList.remove('pointer-events-none');
  card.style.opacity = '1';
  card.style.transform = 'translateY(0) scale(1)';
  card.setAttribute('aria-hidden', 'false');
  card.setAttribute('tabindex', '0');
} else {
  card.style.opacity = '0';
  card.style.transform = 'translateY(6px) scale(0.98)';
  card.setAttribute('aria-hidden', 'true');
  card.setAttribute('tabindex', '-1');
  setTimeout(() => card.classList.add('pointer-events-none'), 260);
}

      });
    });

    // keyboard tab/enter support
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // make cards keyboard-focus friendly: Enter opens primary link
  cards.forEach(card => {
    const link = card.querySelector('a');
    if (!link) return;
    card.tabIndex = 0;
   // make cards keyboard-focus friendly: Enter opens primary link
  cards.forEach(card => {
    const link = card.querySelector('a');
    if (!link) return;
    card.tabIndex = 0;
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        link.click();
      }
    });
  });
  });
})();


  // intersection observer for reveal animations & skill bars
  const ioOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-6');
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    });
  }, ioOptions);

  // observe resume cards and portfolio items
  document.querySelectorAll(
  '.compact-card,  #about img'
)
.forEach(el => {
    el.classList.add('opacity-0', 'translate-y-6');
    el.style.transition = 'opacity 500ms ease, transform 500ms ease';
    observer.observe(el);
  });

  // skill bars animation
  const skillBars = Array.from(document.querySelectorAll('.skill-bar'));
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const percent = parseInt(bar.dataset.percent || '0', 10);
        bar.style.width = percent + '%';
        bar.style.transition = 'width 1300ms ease-in-out';
        
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(sb => {
    sb.style.width = '0%';
    skillObserver.observe(sb);
  });

  // Form handling (AJAX submit with graceful fallback)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = 'Sending…';

      fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        mode: 'cors'
      }).then(res => {
        if (res.ok || res.status === 0) { // formsubmit may redirect; treat 0 as ok for file:// demos
          status.textContent = 'Message sent. Thank you!';
          form.reset();
        } else {
          status.textContent = 'Could not send message. Please try via email.';
        }
      }).catch(() => {
        status.textContent = 'Network error — please try again.';
      });
    });
  }
});

(function () {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const overlay = document.getElementById('modalOverlay');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalLive = document.getElementById('modalLive');
  const modalCode = document.getElementById('modalCode');
  const modalClose = document.getElementById('modalClose');

  // Utility: show/hide
  const openModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // focus close button for accessibility
    modalClose.focus();
  };
  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    // return focus to previously focused element (if stored)
    if (openModal._lastFocused) try { openModal._lastFocused.focus(); } catch (e) {}
  };

  // focus trap (basic)
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select');
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // close handlers
  overlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  // Build modal content from a clicked card
  function populateAndOpen(card) {
    // save last focused element
    openModal._lastFocused = document.activeElement;

    const imgEl = card.querySelector('img');
    const titleEl = card.querySelector('h3') || card.querySelector('h2');
    const descEl = card.querySelector('p') || null;
    const tags = Array.from(card.querySelectorAll('[aria-hidden="true"] span, .tag, .tech, .text-xs'));
    const linkLive = card.querySelector('a[href][target="_blank"]:not([href*="github"])') || null;
    const linkCode = card.querySelector('a[href*="github"]') || null;

    // image: prefer data-large on img, fallback to src
    const largeSrc = imgEl && (imgEl.dataset.large || imgEl.getAttribute('data-large')) || (imgEl && imgEl.src) || '';
    modalImage.src = largeSrc;
    modalImage.alt = titleEl ? (titleEl.textContent.trim() + ' screenshot') : 'Project screenshot';

    // title
    modalTitle.textContent = titleEl ? titleEl.textContent.trim() : 'Project';

    // description: prefer card dataset, else p text, else default
    const dataDesc = card.dataset.desc || card.getAttribute('data-desc') || (descEl ? descEl.textContent.trim() : '');
    modalDesc.textContent = dataDesc || 'Short project summary not provided. Check the repository or live demo for details.';

    // tech badges — clear then add
    modalTech.innerHTML = '';
    // gather tech items: find .text-xs tags inside card (our compact cards use small spans)
    const techSpans = Array.from(card.querySelectorAll('div[aria-hidden="true"] span, .tech, .tag'));
    if (techSpans.length) {
      techSpans.forEach(s => {
        const node = document.createElement('span');
       node.className ='text-xs px-2 py-0.5 rounded bg-[#F7F9FC] text-[#4A4A4A] border border-[#E6EAF0]';

        node.textContent = s.textContent.trim();
        modalTech.appendChild(node);
      });
    }

    // Live link & Code link
    if (linkLive) {
      modalLive.href = linkLive.href;
      modalLive.classList.remove('hidden');
    } else {
      modalLive.classList.add('hidden');
      modalLive.href = '#';
    }
    if (linkCode) {
      modalCode.href = linkCode.href;
      modalCode.classList.remove('hidden');
    } else {
      modalCode.classList.add('hidden');
      modalCode.href = '#';
    }

    // open
    openModal();
  }

  // attach listeners to compact cards
  const cards = Array.from(document.querySelectorAll('.compact-card'));
  cards.forEach(card => {
    // allow entire card to be clickable
    card.style.cursor = 'pointer';

    card.addEventListener('click', (e) => {
      // ignore clicks on code/live buttons so they still navigate
      const maybeLink = e.target.closest('a');
      if (maybeLink && maybeLink.closest('.compact-card') === card) {
        // if anchor was clicked, let the default behavior happen (open link)
        // but we also want modals when clicking empty space; so skip modal if anchor clicked
        if (maybeLink.href) return;
      }
      populateAndOpen(card);
    });

    // keyboard enter to open
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        populateAndOpen(card);
      }
    });

    // ensure card is focusable
    if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
  });
})();


 


/// Data-driven resume renderer (updated: adds spacing between cards)
// Replace your existing renderer block with this code.
(function () {
  // --- 1) Data (pulled & adapted from uploaded resume) ---
  const resumeData = {
    education: [
      {
        id: "mest-2025",
        date: "February 2025 - May 2025",
        title: "Web Developer",
        org: "Mest Africa",
        location: "Accra, Ghana",
        desc: "Intensive web development program focusing on practical projects, deployment, and modern workflows."
      },
      {
        id: "ibm-2025",
        date: "January 2025 - February 2025",
        title: "Web Development Fundamentals",
        org: "IBM",
        location: "Online",
        desc: "Foundational web development training; certificate available.",
        link: "https://www.credly.com/badges/d08d0a78-6e1c-4611-9a42-560d1010746d/linked_in_profile",
        linkLabel: "Credential"
      },
      {
        id: "cisco-2024",
        date: "November 2024 - Present",
        title: "Junior Cybersecurity Analyst",
        org: "Cisco Networking Academy",
        location: "Online",
        desc: "Hands-on cybersecurity labs covering fundamentals of networking security and risk assessment."
      },
      {
        id: "isc2-2024",
        date: "July 2024",
        title: "Certified in Cybersecurity",
        org: "ISC2",
        location: "Accra, Ghana",
        desc: "Certification covering core cybersecurity concepts and best practices."
      },
      {
        id: "ba-gij",
        date: "May 2013 - May 2015",
        title: "B.A. Communication Studies",
        org: "Ghana Institute of Journalism (UNIMAC)",
        location: "Accra, Ghana",
        desc: "Studies in media, communication, and digital content."
      }
    ],
    experience: [
      {
        id: "secure-eyes",
        date: "February 2023 - Present",
        title: "IT & Administrative Support",
        org: "Secure Eyes",
        desc: "Designed and updated client websites (WordPress, Joomla); performed regular backups and implemented basic security measures to protect company data."
      },
      {
        id: "joella",
        date: "November 2018 - January 2023",
        title: "Administrative Assistant",
        org: "Joella Properties",
        desc: "Created marketing materials; coordinated property viewings; managed office inventory and reduced supply costs through vendor negotiations."
      },
      {
        id: "anaess",
        date: "March 2013 - October 2018",
        title: "Office Coordinator",
        org: "Anaess Communication Limited",
        desc: "Assisted with website visuals and troubleshooting desktop hardware; supported office admin duties."
      },
      {
        id: "redan",
        date: "August 2009 - March 2010",
        title: "Computer Repair Technician",
        org: "Redan Systems Ltd",
        desc: "Troubleshot and repaired desktop computers; performed software upgrades and maintenance."
      }
    ]
  };

  // --- 2) DOM targets ---
  const resumeGrid = document.getElementById('resumeGrid');
  if (!resumeGrid) return;

  // helper to create element with classes and text
  const el = (tag, opts = {}) => {
    const node = document.createElement(tag);
    if (opts.cls) node.className = opts.cls;
    if (opts.text) node.textContent = opts.text;
    if (opts.html) node.innerHTML = opts.html;
    if (opts.attrs) {
      Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
    }
    return node;
  };

  // markup builder for a resume card
  function buildCard(item) {
   const card = el('article', {
  cls: 'resume-card bg-white p-5 rounded-lg shadow-md will-change-transform opacity-0 translate-y-[18px]'
});


    const date = el('p', { cls: 'text-sm text-slate-400', text: item.date || '' });
    const title = el('h4', { cls: 'font-bold text-lg mt-1 text-[#1A1A1A]', text: item.title || '' });
    const org = el('p', { cls: 'text-slate-300 mt-2', text: item.org || '' });
    const desc = el('p', { cls: 'text-slate-300 mt-2', text: item.desc || '' });
    const location = item.location ? el('p', { cls: 'text-sm text-slate-500 mt-2', text: item.location }) : null;

    card.appendChild(date);
    card.appendChild(title);
    card.appendChild(desc);
    if (location) card.appendChild(location);

    if (item.link) {
      const linkWrap = el('p', { cls: 'mt-2' });
      const a = el('a', { cls: 'text-[#0A66FF] hover:underline', text: item.linkLabel || 'Link', attrs: { href: item.link, target: '_blank', rel: 'noopener noreferrer' } });
      linkWrap.appendChild(a);
      card.appendChild(linkWrap);
    }

    return card;
  }

  // render function
  function renderResume(data) {
    // clear
    resumeGrid.innerHTML = '';

    // left & right columns with spacing between cards (space-y-6)
    const leftCol = el('div', { cls: 'left-col space-y-6' });
    const rightCol = el('div', { cls: 'right-col space-y-6' });

    // headings
    const leftHeading = el('h3', { cls: 'text-xl font-semibold mb-6 text-[#0A66FF]', text: 'Education & Certification' });
    const rightHeading = el('h3', { cls: 'text-xl font-semibold mb-6 text-[#0A66FF]', text: 'Experience' });

    leftCol.appendChild(leftHeading);
    rightCol.appendChild(rightHeading);

    // build education cards
    (data.education || []).forEach(item => {
      leftCol.appendChild(buildCard(item));
    });

    // build experience cards
    (data.experience || []).forEach(item => {
      rightCol.appendChild(buildCard(item));
    });

    resumeGrid.appendChild(leftCol);
    resumeGrid.appendChild(rightCol);

    // after render, wire animations
    wireResumeAnimations();
  }

  // --- 3) Animations: IntersectionObserver, respects reduced-motion ---
  function wireResumeAnimations() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cards = Array.from(document.querySelectorAll('#resumeGrid .resume-card'));
    if (prefersReduced) {
      cards.forEach(c => {
        c.style.opacity = 1;
        c.style.transform = 'none';
      });
      return;
    }

    // initial state
    cards.forEach(c => {
      c.style.opacity = 0;
      c.style.transform = 'translateY(18px)';
    });

    const observer = new IntersectionObserver((entries, obs) => {
      // simple stagger: reveal with tiny delay based on index
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        const idx = Array.prototype.indexOf.call(document.querySelectorAll('#resumeGrid .resume-card'), node);
        const delay = Math.min(300 + idx * 80, 700); // ms
        node.style.transition = `opacity 600ms cubic-bezier(.2,.9,.3,1) ${delay}ms, transform 600ms cubic-bezier(.2,.9,.3,1) ${delay}ms`;
        node.style.opacity = 1;
        node.style.transform = 'translateY(0)';
        obs.unobserve(node);
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    cards.forEach(c => observer.observe(c));
  }

  // --- 4) Expose a helper to update resume data at runtime if needed ---
  window.updateResumeData = function (newData) {
    // shallow merge for convenience
    const merged = Object.assign({}, resumeData, newData || {});
    renderResume(merged);
  };

  // initial render
  renderResume(resumeData);

})();
