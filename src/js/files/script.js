// Подключение функционала "Чертоги Фрилансера"
import stickySidebar from "sticky-sidebar";
import { bodyLockToggle, bodyUnlock, debounce, getRandomString, isMobile } from "./functions.js";
// Подключение списка активных модулей
import { mhzModules } from "./modules.js";
import PincodeInput from 'pincode-input'
// import 'pincode-input/dist/pincode-input.min.css'

document.addEventListener('DOMContentLoaded', () => {
  const headerSearch = document.querySelector('[data-header-search]');
  if (headerSearch) {
    headerSearchActions(headerSearch);
  }

  const headerCatalog = document.querySelector('[data-catalog-header]');
  if (headerCatalog) {
    headerCatalogActions(headerCatalog);
  }

  const pininputs = document.querySelectorAll('[class*="__pininput"]');
  if (pininputs.length) {
    pininputsInit(pininputs)
  }

  setMaxHeight('.categories__slide span');
  setMaxHeight('.chapters__item span');
  setMaxHeight('.product-slide__name', '.productslider');

  if (document.querySelector('[data-filters]')) {
    setFiltersPosition(document.querySelector('[data-filters]'))
  }
})

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-header-catalog-btn]')) {
    document.documentElement.classList.toggle('catalog-open');
    bodyLockToggle();
  }
  if (e.target.closest('[data-filter-button]')) {
    document.documentElement.classList.toggle('filters-open');
    bodyLockToggle(10);
    if (!document.querySelector('.filters-productlisting__backdrop')) {
      const div = document.createElement('div');
      div.classList.add('filters-productlisting__backdrop');
      div.setAttribute('data-filter-button', '');
      document.body.appendChild(div);
    }
  }

  if (e.target.closest('.menu-top-header__link')) {
    onTopHeaderLinkClick(e.target.closest('.menu-top-header__link'), e);
  }

  if (e.target.closest('.menu-top-header__back')) {
    const items = document.querySelectorAll('.menu-top-header__item');
    if (items.length) {
      items.forEach(item => item.classList.remove('_active'));
    }
  }
  if (e.target.closest('.catalog-header__back')) {
    const items = document.querySelectorAll('.catalog-header__content');
    const links = document.querySelectorAll('.catalog-header__link');
    if (items.length) {
      items.forEach(item => {
        item.classList.remove('_active');
        item.hidden = true;
      });
    }
    if (links.length) {
      links.forEach(link => link.classList.remove('_active'))
    }
  }

  const productAction = e.target.closest('[data-comparsion-btn]') || e.target.closest('[data-fav-btn]');
  if (productAction) {
    e.preventDefault();
    productAction.classList.toggle('_active')
  }

  checkCatalog(e)
})

window.addEventListener('scroll', (e) => {
  document.body.style.setProperty('--scrollY', `${window.scrollY}px`);
})

window.addEventListener('resize', () => {
  setMaxHeight('.categories__slide span');
  setMaxHeight('.product-slide__name', '.productslider');
})

document.addEventListener('formSent', (e) => {
  const { form } = e.detail;

  if (form.closest('#phoneAuthPopup')) mhzModules.popup.open('#phonePinPopup')
})


function headerSearchActions(headerSearch) {
  const input = headerSearch.querySelector('[data-header-search-input]');
  const dropdown = document.querySelector('[data-header-search-dropdown]');

  if (!input||!dropdown) return;

  input.addEventListener('focusin', () => {
    dropdown.hidden = false;
  })
  input.addEventListener('blur', () => {
    setTimeout(() => {
      dropdown.hidden = true;
    }, 0);
  })
}

function headerCatalogActions(headerCatalog) {
  const links = headerCatalog.querySelectorAll('[data-catalog-header-link]');
  const contents = headerCatalog.querySelectorAll('[data-catalog-header-content]');
  if (!links.length||!contents.length) return;

  links.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const id = link.getAttribute('data-catalog-header-link');
      links.forEach(link => link.getAttribute('data-catalog-header-link') == id ? link.classList.add('_active') : link.classList.remove('_active'))
      contents.forEach(content => content.hidden = content.getAttribute('data-catalog-header-content') != id)
    })
    link.addEventListener('click', (e) => {
      const menuBody = link.closest('.menu__body');

      if (menuBody) {
        menuBody.scrollTo(0, 0)
      }

      if (isMobile.any()) {
        e.preventDefault();
      }
      const id = link.getAttribute('data-catalog-header-link');
      links.forEach(link => link.getAttribute('data-catalog-header-link') == id ? link.classList.add('_active') : link.classList.remove('_active'))
      contents.forEach(content => {
        if (content.getAttribute('data-catalog-header-content') == id) {
          content.hidden = false;
          content.classList.add('_active');
        } else {
          content.hidden = true;
          content.classList.remove('_active');
        }
      })
    })
  });
}

function onTopHeaderLinkClick(target, event) {
  const item = target.closest('.menu-top-header__item');
  const dropdown = item?.querySelector('.menu-top-header__dropdown');
  const menuBody = target.closest('.menu__body');

  if (!dropdown) return;

  event.preventDefault();

  if (!dropdown.innerHTML.includes(target.textContent.trim())) {
    const clone = target.cloneNode(true);
    clone.removeAttribute('class');
    clone.classList.add('menu-top-header__sublink');
    dropdown.append(clone)
  }

  item.classList.add('_active');

  if (menuBody) {
    menuBody.scrollTo(0, 0)
  }
}

function checkCatalog(e) {
  const catalogTarget = e.target.closest('[data-catalog-header]')
  const catalogBtnTarget = e.target.closest('[data-header-catalog-btn]')

  if (catalogTarget||catalogBtnTarget) return;

  document.documentElement.classList.remove('catalog-open');
  bodyUnlock();
}

function setMaxHeight(selector, parentSelector) {
  const parents = parentSelector ? document.querySelectorAll(parentSelector) : [document];
  if (!parents.length) return;

  parents.forEach(parent => {
    const els = parent.querySelectorAll(selector);
  
    if (!els.length) return;
    els.forEach(el => el.style.removeProperty('--min-height'));
  
    const heights = [...els].map(el => el.offsetHeight);
    const max = Math.max(...heights);
  
    els.forEach(el => el.style.setProperty('--min-height', `${max}px`));
  })
}

function setMinHeight(selector, parentSelector) {
  const parents = parentSelector ? document.querySelectorAll(parentSelector) : [document];
  if (!parents.length) return;

  parents.forEach(parent => {
    const els = parent.querySelectorAll(selector);
  
    if (!els.length) return;
    els.forEach(el => el.style.remoiveProperty('--max-height'));
  
    const heights = [...els].map(el => el.offsetHeight);
    const max = Math.min(...heights);
  
    els.forEach(el => el.style.setProperty('--max-height', `${max}px`));
  })
}

function pininputsInit(pininputs) {
  pininputs.forEach(pininput => {
    const className = `pininput_${getRandomString(16)}`;
    pininput.classList.add(className)
    pininput.pininput = new PincodeInput(`.${className}`, {
      count: 4,
      secure: false,
    })
  })
}

function setFiltersPosition(filtersEl) {
  const sidebar = new stickySidebar(filtersEl, {
    innerWrapperSelector: '.filters-productlisting__body',
    bottomSpacing: 30,
    topSpacing: 30,
    minWidth: 992
  })
}

window.mhzModules = mhzModules;