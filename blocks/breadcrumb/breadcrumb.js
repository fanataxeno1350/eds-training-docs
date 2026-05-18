import { getMetadata } from '../../scripts/aem.js';

async function buildBreadcrumbTrail() {
  const breadcrumbsEnabled = getMetadata('breadcrumbs');

  if (breadcrumbsEnabled !== 'true') {
    return [];
  }

  const navTitle = getMetadata('nav-title') || 'Current Page';
  const parent = getMetadata('parent');

  const trail = [];

  // Home
  trail.push({
    title: 'Home',
    path: '/',
  });

  // Current page
  if (parent === '/') {
    trail.push({
      title: navTitle,
      path: window.location.pathname,
    });
  }

  return trail;
}

export default async function decorate(block) {
  const trail = await buildBreadcrumbTrail();

  if (!trail.length) {
    block.style.display = 'none';
    return;
  }

  const breadcrumbHTML = trail
    .map((item, index) => {
      const isLast = index === trail.length - 1;

      return `
        <li class="breadcrumb-item">
          ${
            isLast
              ? `<span aria-current="page">${item.title}</span>`
              : `<a href="${item.path}">${item.title}</a>`
          }
        </li>
      `;
    })
    .join('<li class="breadcrumb-separator">/</li>');

  block.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol class="breadcrumb-list">
        ${breadcrumbHTML}
      </ol>
    </nav>
  `;
}