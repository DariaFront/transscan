(() => {
  "use strict";

  const body = document.body;
  const burgerButton = document.getElementById("burgerButton");
  const mainNav = document.getElementById("mainNav");

  const modal = document.getElementById("calcModal");
  const calcForm = document.getElementById("calcForm");
  const openCalcButtons = document.querySelectorAll(".js-open-calc");
  const closeModalButtons = document.querySelectorAll(".js-close-modal");

  let lastFocusedElement = null;

  // Мобильное меню
  function setMenuState(open) {
    if (!burgerButton || !mainNav) return;

    burgerButton.classList.toggle("is-active", open);
    mainNav.classList.toggle("is-open", open);
    burgerButton.setAttribute("aria-expanded", String(open));
    burgerButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    body.classList.toggle("is-menu-open", open);
  }

  burgerButton?.addEventListener("click", () => {
    const open = burgerButton.getAttribute("aria-expanded") !== "true";
    setMenuState(open);
  });

  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1080) setMenuState(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) setMenuState(false);
  });

  // Модальное окно расчета
  function openModal() {
    if (!modal) return;

    lastFocusedElement = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("is-modal-open");

    const firstInput = modal.querySelector("input, textarea, button");
    window.setTimeout(() => firstInput?.focus(), 20);
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("is-modal-open");
    lastFocusedElement?.focus();
  }

  openCalcButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modal?.classList.contains("is-open")) closeModal();
      if (mainNav?.classList.contains("is-open")) setMenuState(false);
    }
  });

  // Пример отправки формы.
  // Замените этот блок на fetch() к вашему backend/API.
  calcForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!calcForm.checkValidity()) {
      calcForm.reportValidity();
      return;
    }

    const submitButton = calcForm.querySelector('button[type="submit"]');
    const oldText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.textContent = "Заявка отправлена";

    window.setTimeout(() => {
      calcForm.reset();
      submitButton.disabled = false;
      submitButton.innerHTML = oldText;
      closeModal();
    }, 1200);
  });

  // Подсветка текущего раздела в меню при прокрутке
  const navLinks = [...document.querySelectorAll(".main-nav__link")];

  const sectionMap = navLinks
    .map((link) => {
      const target = link.getAttribute("href");
      if (!target?.startsWith("#")) return null;
      const section = document.querySelector(target);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sectionMap.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => link.classList.remove("is-active"));

        const item = sectionMap.find(({ section }) => section === visible.target);
        item?.link.classList.add("is-active");
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5]
      }
    );

    sectionMap.forEach(({ section }) => observer.observe(section));
  }
})();
