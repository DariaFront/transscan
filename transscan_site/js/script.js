(() => {
  "use strict";

  const body = document.body;

  /* =========================
     Navigation
     ========================= */

  const burgerButton = document.getElementById("burgerButton");
  const mainNav = document.getElementById("mainNav");

  function setMenuState(open) {
    if (!burgerButton || !mainNav) return;

    burgerButton.classList.toggle("is-active", open);
    mainNav.classList.toggle("is-open", open);

    burgerButton.setAttribute("aria-expanded", String(open));
    burgerButton.setAttribute(
      "aria-label",
      open ? "Закрыть меню" : "Открыть меню"
    );

    body.classList.toggle("is-menu-open", open);
  }

  burgerButton?.addEventListener("click", () => {
    const open = burgerButton.getAttribute("aria-expanded") !== "true";
    setMenuState(open);
  });

  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1080) {
        setMenuState(false);
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      setMenuState(false);
    }
  });


  /* =========================
     Calculation modal
     ========================= */

  const calcModal = document.getElementById("calcModal");
  const calcForm = document.getElementById("calcForm");
  const calcService = document.getElementById("calcService");

  const openCalcButtons = document.querySelectorAll(".js-open-calc");
  const closeCalcButtons =
    calcModal?.querySelectorAll(".js-close-modal") || [];

  let calcLastFocusedElement = null;

  function openCalcModal(serviceName = "") {
    if (!calcModal) return;

    calcLastFocusedElement = document.activeElement;

    if (calcService) {
      calcService.value = serviceName;
    }

    calcModal.classList.add("is-open");
    calcModal.setAttribute("aria-hidden", "false");
    body.classList.add("is-modal-open");

    const firstInput = calcModal.querySelector(
      "input:not([type='hidden']), textarea"
    );

    window.setTimeout(() => firstInput?.focus(), 20);
  }

  function closeCalcModal(restoreFocus = true) {
    if (!calcModal) return;

    calcModal.classList.remove("is-open");
    calcModal.setAttribute("aria-hidden", "true");

    if (!serviceModal?.classList.contains("is-open")) {
      body.classList.remove("is-modal-open");
    }

    if (restoreFocus) {
      calcLastFocusedElement?.focus();
    }
  }

  openCalcButtons.forEach((button) => {
    button.addEventListener("click", () => openCalcModal());
  });

  closeCalcButtons.forEach((button) => {
    button.addEventListener("click", () => closeCalcModal());
  });

  calcForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!calcForm.checkValidity()) {
      calcForm.reportValidity();
      return;
    }

    const submitButton = calcForm.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const oldHtml = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.textContent = "Заявка отправлена";

    /*
      Здесь можно заменить демонстрационную отправку на fetch()
      к вашему backend/API.
    */
    window.setTimeout(() => {
      calcForm.reset();
      submitButton.disabled = false;
      submitButton.innerHTML = oldHtml;
      closeCalcModal();
    }, 1200);
  });


  /* =========================
     Services gallery
     ========================= */

  const services = [
    {
      id: "transport",
      title: "Транспортные услуги",
      image: "img/service-transport.png",
      description:
        "Организуем перевозку обычных и опасных грузов с учетом требований к конкретному типу продукции, маршруту и виду транспорта. Берём на себя координацию перевозки и контроль ключевых этапов доставки.",
      benefits: [
        "Подбираем транспорт и маршрут с учетом требований ADR, IMDG и RID.",
        "Контролируем сроки, документы и основные этапы перевозки.",
        "Помогаем снизить риски простоев, штрафов и срывов поставки."
      ]
    },
    {
      id: "containers",
      title: "Перемещение и размещение",
      image: "img/service-containers.png",
      description:
        "Организуем перемещение и размещение гружёных и порожних контейнеров на терминалах Москвы и Московской области. Координируем транспорт и работу терминала, чтобы контейнер проходил необходимые операции без лишних задержек.",
      benefits: [
        "Работаем с гружёными и порожними контейнерами.",
        "Координируем подачу транспорта и операции на терминале.",
        "Сокращаем простои автомобиля и контейнера."
      ]
    },
    {
      id: "storage",
      title: "Склад временного хранения",
      image: "img/service-storage.png",
      description:
        "Организуем временное размещение грузов на специализированных складских площадках. Услуга подходит для ситуаций, когда грузу необходимо безопасное промежуточное хранение перед дальнейшей отправкой.",
      benefits: [
        "Безопасное размещение груза на период ожидания дальнейшей перевозки.",
        "Контроль сроков хранения и движения груза.",
        "Гибкая организация дальнейшего вывоза или доставки."
      ]
    },
    {
      id: "documents",
      title: "Документальное сопровождение",
      image: "img/service-documents.png",
      description:
        "Помогаем подготовить и проверить документы, необходимые для организации перевозки. Сопровождаем процесс от подготовки маршрута до взаимодействия с перевозчиками, терминалами и другими участниками логистической цепочки.",
      benefits: [
        "Проверяем комплект транспортной и сопроводительной документации.",
        "Помогаем согласовать маршрут и требования участников перевозки.",
        "Снижаем вероятность ошибок в документах и связанных с ними задержек."
      ]
    }
  ];

  const serviceModal = document.getElementById("serviceModal");
  const serviceImage = document.getElementById("serviceModalImage");
  const serviceTitle = document.getElementById("serviceModalTitle");
  const serviceDescription = document.getElementById(
    "serviceModalDescription"
  );
  const serviceBenefits = document.getElementById("serviceModalBenefits");
  const serviceCounter = document.getElementById("serviceModalCounter");
  const servicePrev = document.getElementById("servicePrev");
  const serviceNext = document.getElementById("serviceNext");
  const serviceRequest = document.querySelector(".js-service-request");
  const serviceLinks = document.querySelectorAll(".js-service-open");

  let currentServiceIndex = 0;
  let serviceLastFocusedElement = null;

  function renderService(index) {
    if (
      !serviceImage ||
      !serviceTitle ||
      !serviceDescription ||
      !serviceBenefits ||
      !serviceCounter
    ) {
      return;
    }

    currentServiceIndex = (index + services.length) % services.length;

    const service = services[currentServiceIndex];

    serviceImage.src = service.image;
    serviceImage.alt = service.title;
    serviceTitle.textContent = service.title;
    serviceDescription.textContent = service.description;
    serviceCounter.textContent =
      `${currentServiceIndex + 1} / ${services.length}`;

    serviceBenefits.replaceChildren(
      ...service.benefits.map((benefit) => {
        const item = document.createElement("li");
        item.textContent = benefit;
        return item;
      })
    );
  }

  function openServiceModal(serviceId) {
    if (!serviceModal) return;

    const index = services.findIndex((service) => service.id === serviceId);

    currentServiceIndex = index >= 0 ? index : 0;
    renderService(currentServiceIndex);

    serviceLastFocusedElement = document.activeElement;

    serviceModal.classList.add("is-open");
    serviceModal.setAttribute("aria-hidden", "false");
    body.classList.add("is-modal-open");

    window.setTimeout(() => {
      serviceModal.querySelector(".service-modal__close")?.focus();
    }, 20);
  }

  function closeServiceModal(restoreFocus = true) {
    if (!serviceModal) return;

    serviceModal.classList.remove("is-open");
    serviceModal.setAttribute("aria-hidden", "true");

    if (!calcModal?.classList.contains("is-open")) {
      body.classList.remove("is-modal-open");
    }

    if (restoreFocus) {
      serviceLastFocusedElement?.focus();
    }
  }

  function nextService() {
    renderService(currentServiceIndex + 1);
  }

  function prevService() {
    renderService(currentServiceIndex - 1);
  }

  serviceLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openServiceModal(link.dataset.service);
    });
  });

  serviceModal
    ?.querySelectorAll(".js-close-service-modal")
    .forEach((button) => {
      button.addEventListener("click", () => closeServiceModal());
    });

  servicePrev?.addEventListener("click", prevService);
  serviceNext?.addEventListener("click", nextService);

  serviceRequest?.addEventListener("click", () => {
    const service = services[currentServiceIndex];

    closeServiceModal(false);
    openCalcModal(service.title);
  });


  /* =========================
     Swipe services on touch devices
     ========================= */

  let touchStartX = 0;
  let touchStartY = 0;

  serviceModal?.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.screenX;
      touchStartY = touch.screenY;
    },
    { passive: true }
  );

  serviceModal?.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];

      const deltaX = touch.screenX - touchStartX;
      const deltaY = touch.screenY - touchStartY;

      if (Math.abs(deltaX) < 60 || Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }

      if (deltaX < 0) {
        nextService();
      } else {
        prevService();
      }
    },
    { passive: true }
  );


  /* =========================
     Keyboard
     ========================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (serviceModal?.classList.contains("is-open")) {
        closeServiceModal();
        return;
      }

      if (calcModal?.classList.contains("is-open")) {
        closeCalcModal();
        return;
      }

      if (mainNav?.classList.contains("is-open")) {
        setMenuState(false);
      }

      return;
    }

    if (!serviceModal?.classList.contains("is-open")) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextService();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevService();
    }
  });


  /* =========================
     Active nav section
     ========================= */

  const navLinks = [...document.querySelectorAll(".main-nav__link")];

  const sectionMap = navLinks
    .map((link) => {
      const target = link.getAttribute("href");

      if (!target?.startsWith("#")) {
        return null;
      }

      const section = document.querySelector(target);

      return section
        ? {
          link,
          section
        }
        : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sectionMap.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          )[0];

        if (!visible) return;

        navLinks.forEach((link) => {
          link.classList.remove("is-active");
        });

        const item = sectionMap.find(
          ({ section }) => section === visible.target
        );

        item?.link.classList.add("is-active");
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5]
      }
    );

    sectionMap.forEach(({ section }) => {
      observer.observe(section);
    });
  }


  /* =========================
     Mobile hero parallax
     ========================= */

  const hero = document.querySelector(".hero");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let parallaxFrame = null;

  function updateHeroParallax() {
    parallaxFrame = null;

    if (
      !hero ||
      window.innerWidth > 720 ||
      reduceMotion.matches
    ) {
      hero?.style.removeProperty("--hero-parallax-y");
      return;
    }

    const rect = hero.getBoundingClientRect();

    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      return;
    }

    const scrollInsideHero = Math.max(0, -rect.top);
    const maxShift = hero.offsetHeight * 0.16;
    const shift = Math.min(scrollInsideHero * 0.18, maxShift);

    hero.style.setProperty(
      "--hero-parallax-y",
      `${shift.toFixed(2)}px`
    );
  }

  function requestParallaxUpdate() {
    if (parallaxFrame !== null) return;

    parallaxFrame = window.requestAnimationFrame(
      updateHeroParallax
    );
  }

  window.addEventListener(
    "scroll",
    requestParallaxUpdate,
    { passive: true }
  );

  window.addEventListener("resize", requestParallaxUpdate);

  reduceMotion.addEventListener?.(
    "change",
    requestParallaxUpdate
  );

  updateHeroParallax();
})();