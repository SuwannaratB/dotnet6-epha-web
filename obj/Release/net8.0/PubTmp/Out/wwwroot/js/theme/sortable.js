/* -------------------------------------------------------------------------- */
/*                                    Toast                                   */
/* -------------------------------------------------------------------------- */

const sortableInit = () => {
  const sortableEl = document.querySelectorAll('[data-sortable]');
  const kanbanContainer = document.querySelector('[data-kanban-container]');
  if (kanbanContainer) {
    kanbanContainer.addEventListener('click', e => {
      if (e.target.hasAttribute('data-kanban-collapse')) {
        e.target.closest('.kanban-column').classList.toggle('collapsed');
      }
    });
  }

  sortableEl.forEach(el => {
    return window.Sortable.create(el, {
      animation: 150,
      group: {
        name: 'shared'
      },
      delay: 100,
      delayOnTouchOnly: true,
      forceFallback: true,
      onStart(e) {
        window.Sortable.ghost.style.opacity = 1;
        document.body.classList.add('sortable-dragging');

        // close dropdown item when start dragging
        window.Sortable.ghost
          .querySelector('.dropdown-menu')
          .classList.remove('show');
        const dropdownElement = e.item.querySelector(
          `[data-bs-toggle='dropdown']`
        );
        window.bootstrap.Dropdown.getInstance(dropdownElement)?.hide();
      },
      onEnd() {
        document.body.classList.remove('sortable-dragging');
      }
    });
  });
};

export default sortableInit;
