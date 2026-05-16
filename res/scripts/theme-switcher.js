// theme-switcher.js
(() => {
  const STORAGE_KEY = 'asciidoc-theme';
  const DARK_CLASS = 'dark-theme';

  function applyTheme(theme) {
    const isDark = theme === 'dark';

    // Aplicar clase al <body>
    document.body.classList.toggle(DARK_CLASS, isDark);

    // Actualizar atributos útiles para CSS
    document.documentElement.setAttribute('data-theme', theme);

    // Guardar preferencia
    localStorage.setItem(STORAGE_KEY, theme);

    // Actualizar apariencia del botón
    updateButton(theme);
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    // Si no hay preferencia guardada, usar la del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function updateButton(theme) {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const isDark = theme === 'dark';

    // Ícono SVG de Bootstrap Icons: arrow-clockwise
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-half" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16"/>
        </svg>
    `;

    // Accesibilidad
    button.setAttribute(
        'aria-label',
        isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
    );
    button.setAttribute(
        'title',
        isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
    );

    // Centrar el ícono
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.padding = '0';

    // Colores obtenidos de las variables CSS activas
    const styles = getComputedStyle(document.documentElement);

    const bg = styles.getPropertyValue('--color-bg-secondary').trim() || '#f6f8fa';
    const fg = styles.getPropertyValue('--color-text').trim() || '#24292f';
    const border = styles.getPropertyValue('--color-border').trim() || '#d0d7de';
    const hover = styles.getPropertyValue('--color-link').trim() || '#0969da';

    // Aplicar estilo
    button.style.background = bg;
    button.style.color = fg;
    button.style.border = `1px solid ${border}`;
    button.style.borderRadius = '9999px'; // circular
    button.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';

    // Guardar color para hover
    button.dataset.hoverColor = hover;
  }

  function createButton() {
    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.type = 'button';

    // Posición fija en la esquina superior derecha del viewport.
    // Al estar fuera del flujo del documento, no altera el ancho
    // de la tabla de contenido ni del contenido principal.
    Object.assign(button.style, {
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: '10000',

        // Tamaño del botón
        width: '40px',
        height: '40px',
        padding: '0',

        // Layout interno
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        // Apariencia general
        borderRadius: '9999px',
        cursor: 'pointer',

        // Tipografía (por si en el futuro agregas texto)
        fontSize: '14px',
        fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',

        // Animaciones suaves
        transition:
        'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
    });

    // Efecto hover
    button.addEventListener('mouseenter', () => {
        const hoverColor = button.dataset.hoverColor;
        if (hoverColor) {
        button.style.borderColor = hoverColor;
        button.style.boxShadow = `0 0 0 3px ${hoverColor}22`;
        }
    });

    button.addEventListener('mouseleave', () => {
        const styles = getComputedStyle(document.documentElement);
        const border =
        styles.getPropertyValue('--color-border').trim() || '#d0d7de';

        button.style.borderColor = border;
        button.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';
    });

    // Alternar tema
    button.addEventListener('click', () => {
        const current =
        document.documentElement.getAttribute('data-theme') || 'light';

        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    // Insertar directamente en body.
    // Como usa position: fixed, siempre permanecerá visible
    // en la esquina superior derecha del viewport.
    document.body.appendChild(button);
  }

  document.addEventListener('DOMContentLoaded', () => {
    createButton();
    applyTheme(getPreferredTheme());
  });
})();