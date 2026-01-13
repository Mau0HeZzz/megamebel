// Подключение функционала "Чертоги Фрилансера"
import { debounce, isMobile } from "./functions.js";
// Подключение списка активных модулей
import { mhzModules } from "./modules.js";

document.addEventListener('DOMContentLoaded', () => {
  const headerSearch = document.querySelector('[data-header-search]');
  if (headerSearch) {
    headerSearchActions(headerSearch);
  }

  const headerCatalog = document.querySelector('[data-catalog-header]');
  if (headerCatalog) {
    headerCatalogActions(headerCatalog);
  }
})

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-header-catalog-btn]')) {
    document.documentElement.classList.toggle('catalog-open');
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

