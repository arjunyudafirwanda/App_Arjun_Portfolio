document.addEventListener("DOMContentLoaded", function () {
  // =====================================
  // 1. ENABLE JAVASCRIPT ANIMATIONS
  // =====================================

  document.documentElement.classList.add("js-enabled");

  // =====================================
  // 2. MOBILE NAVIGATION
  // =====================================

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Buka menu navigasi");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi",
      );
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileMenu();
      });
    });

    document.addEventListener("click", function (event) {
      const clickedInside =
        navLinks.contains(event.target) || menuToggle.contains(event.target);

      if (!clickedInside) {
        closeMobileMenu();
      }
    });
  }

  // =====================================
  // 3. DYNAMIC COPYRIGHT YEAR
  // =====================================

  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // =====================================
  // 4. HEADER SCROLL EFFECT
  // =====================================

  const header = document.getElementById("header");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 30);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, { passive: true });

  // =====================================
  // 5. SCROLL REVEAL ANIMATION
  // =====================================

  const revealElements = document.querySelectorAll("[data-reveal]");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
          }
        });
      },

      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    // Pastikan konten tetap terlihat pada browser
    // yang tidak mendukung IntersectionObserver.
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  // =====================================
  // 6. ACTIVE NAVIGATION - SCROLL SPY
  // =====================================

  // Ambil seluruh menu navigasi utama
  const navigationItems = document.querySelectorAll(".nav-links .nav-link");

  // Tombol Let's Connect
  const navContact = document.querySelector(".nav-contact");

  // Ambil seluruh section berdasarkan ID
  // Tidak menggunakan main section karena section
  // selain Hero berada di luar elemen main.
  const pageSections = document.querySelectorAll("section[id]");

  // Menghindari pemanggilan update berulang
  let navigationTicking = false;

  // =====================================
  // SET ACTIVE NAVIGATION
  // =====================================

  function setActiveNavigation(sectionId) {
    // Update menu utama
    navigationItems.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + sectionId;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Update tombol Let's Connect
    if (navContact) {
      const isContactActive = sectionId === "contact";

      navContact.classList.toggle("active", isContactActive);

      if (isContactActive) {
        navContact.setAttribute("aria-current", "location");
      } else {
        navContact.removeAttribute("aria-current");
      }
    }
  }

  // =====================================
  // DETECT CURRENT SECTION
  // =====================================

  function updateActiveNavigation() {
    if (!pageSections.length) return;

    // Posisi vertikal saat ini
    const scrollPosition = window.scrollY;

    // Tinggi navbar
    const headerHeight = header ? header.offsetHeight : 0;

    // Garis aktivasi pada layar
    // Menu berubah saat section melewati area ini.
    const activationPoint =
      scrollPosition + Math.max(headerHeight + 30, window.innerHeight * 0.33);

    // Default section pertama
    let currentSection = pageSections[0].id;

    // Periksa posisi setiap section
    pageSections.forEach(function (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      if (sectionTop <= activationPoint) {
        currentSection = section.id;
      }
    });

    // Pastikan Contact aktif ketika mencapai
    // bagian paling bawah halaman.
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5;

    if (isAtBottom) {
      currentSection = pageSections[pageSections.length - 1].id;
    }

    // Terapkan menu aktif
    setActiveNavigation(currentSection);
  }

  // =====================================
  // OPTIMIZE SCROLL EVENT
  // =====================================

  function handleNavigationScroll() {
    if (!navigationTicking) {
      window.requestAnimationFrame(function () {
        updateActiveNavigation();

        navigationTicking = false;
      });

      navigationTicking = true;
    }
  }

  // =====================================
  // NAVIGATION CLICK
  // =====================================

  // Klik menu navbar
  navigationItems.forEach(function (link) {
    link.addEventListener("click", function () {
      const targetId = link.getAttribute("href").substring(1);

      setActiveNavigation(targetId);
    });
  });

  // Klik tombol Let's Connect
  if (navContact) {
    navContact.addEventListener("click", function () {
      setActiveNavigation("contact");
    });
  }

  // =====================================
  // HERO ACTION BUTTONS
  // =====================================

  const heroActionLinks = document.querySelectorAll(
    ".hero-actions a[href^='#']",
  );

  heroActionLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      const targetId = link.getAttribute("href").substring(1);

      setActiveNavigation(targetId);
    });
  });

  // =====================================
  // WINDOW SCROLL & RESIZE
  // =====================================

  window.addEventListener("scroll", handleNavigationScroll, { passive: true });

  window.addEventListener("resize", updateActiveNavigation);

  window.addEventListener("load", updateActiveNavigation);

  // Jalankan saat halaman pertama kali dibuka
  updateActiveNavigation();

  // =====================================
  // 7. PROJECT FILTER
  // =====================================

  const filterButtons = document.querySelectorAll(".filter-button");

  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach(function (item) {
        item.classList.remove("active");

        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");

      button.setAttribute("aria-pressed", "true");

      projectCards.forEach(function (card) {
        const categories = card.dataset.category.split(" ");

        const shouldShow =
          selectedFilter === "all" || categories.includes(selectedFilter);

        card.hidden = !shouldShow;

        if (shouldShow) {
          card.animate(
            [
              {
                opacity: 0,
                transform: "translateY(15px)",
              },
              {
                opacity: 1,
                transform: "translateY(0)",
              },
            ],
            {
              duration: 350,
              easing: "ease-out",
            },
          );
        }
      });
    });
  });

  // =====================================
  // 8. CONTACT FORM - MAILTO
  // =====================================

  const contactForm = document.getElementById("contact-form");

  const contactFeedback = document.getElementById("contact-feedback");

  const contactSubmit = document.getElementById("contact-submit");

  // GANTI dengan alamat email profesional milikmu.
  const CONTACT_EMAIL = "arjunfirwanda@gmail.com";

  if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Cek validasi formulir
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();

        return;
      }

      // Pastikan email tujuan sudah dikonfigurasi
      const emailConfigured = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL);

      if (!emailConfigured) {
        contactFeedback.textContent =
          "Alamat email tujuan belum dikonfigurasi. Silakan isi CONTACT_EMAIL pada script.js terlebih dahulu.";

        contactFeedback.className = "contact-feedback error";

        return;
      }

      // Ambil data formulir
      const formData = new FormData(contactForm);

      const name = formData.get("name").trim();

      const senderEmail = formData.get("email").trim();

      const subject = formData.get("subject").trim();

      const message = formData.get("message").trim();

      // Susun isi email
      const emailBody = `
Halo Arjun Yuda Firwanda,

Saya ingin menghubungi Anda melalui website portofolio.

Nama Pengirim:
${name}

Email Pengirim:
${senderEmail}

Subjek:
${subject}

Pesan:
${message}


Pesan dikirim melalui website portofolio.
            `;

      // Buat tautan email
      const mailtoLink =
        `mailto:${CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(emailBody)}`;

      // Tampilkan informasi
      contactFeedback.textContent =
        "Aplikasi email akan dibuka. Silakan periksa kembali pesan dan kirim melalui aplikasi email Anda.";

      contactFeedback.className = "contact-feedback success";

      // Buka aplikasi email pengguna
      window.location.href = mailtoLink;
    });
  }

  // =====================================
  // 9. BACK TO TOP BUTTON
  // =====================================

  const backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    // Menampilkan atau menyembunyikan tombol
    function toggleBackToTop() {
      if (window.scrollY > 350) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    }

    // Periksa posisi scroll saat halaman dibuka
    toggleBackToTop();

    // Periksa posisi scroll saat pengguna menggulir
    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    // Kembali ke bagian paling atas
    backToTop.addEventListener("click", function () {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        top: 0,

        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }

  // =====================================
  // 10. DARK MODE / LIGHT MODE SWITCHER
  // =====================================

  const themeToggle = document.getElementById("theme-toggle");

  const themeIcon = document.getElementById("theme-icon");

  const themeLabel = document.getElementById("theme-label");

  // Mengatur tema website
  function applyTheme(theme, savePreference = true) {
    const isLight = theme === "light";

    // Terapkan tema pada HTML
    if (isLight) {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    // Perbarui ikon tombol
    if (themeIcon) {
      themeIcon.textContent = isLight ? "☾" : "☀";
    }

    // Perbarui label tombol
    if (themeLabel) {
      themeLabel.textContent = isLight ? "Dark Mode" : "Light Mode";
    }

    // Perbarui aksesibilitas tombol
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));

      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Aktifkan dark mode" : "Aktifkan light mode",
      );
    }

    // Simpan preferensi pengunjung
    if (savePreference) {
      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch (error) {
        console.warn("Theme preference could not be saved.", error);
      }
    }
  }

  // Baca tema terakhir yang disimpan
  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  } catch (error) {
    console.warn("Could not access saved theme.", error);
  }

  // Terapkan tema saat halaman dibuka
  applyTheme(savedTheme === "light" ? "light" : "dark", false);

  // Event klik tombol pergantian tema
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");

      const nextTheme = currentTheme === "light" ? "dark" : "light";

      applyTheme(nextTheme);
    });
  }
});
