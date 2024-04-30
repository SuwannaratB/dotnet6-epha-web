/* -------------------------------------------------------------------------- */
/*                               Navbar Vertical                              */
/* -------------------------------------------------------------------------- */

const handleNavbarVerticalCollapsed = () => {
  const { getItemFromStore, hasClass, setItemToStore, resize } =
    window.phoenix.utils;
  const Selector = {
    HTML: 'html',
    BODY: 'body',
    NAVBAR_VERTICAL: '.navbar-vertical',
    NAVBAR_VERTICAL_TOGGLE: '.navbar-vertical-toggle',
    NAVBAR_VERTICAL_COLLAPSE: '.navbar-vertical .navbar-collapse',
    ECHART_RESPONSIVE: '[data-echart-responsive]',
    ACTIVE_NAV_LINK: '.navbar-vertical .nav-link.active'
  };

  const Events = {
    CLICK: 'click',
    MOUSE_OVER: 'mouseover',
    MOUSE_LEAVE: 'mouseleave',
    NAVBAR_VERTICAL_TOGGLE: 'navbar.vertical.toggle'
  };
  const ClassNames = {
    NAVBAR_VERTICAL_COLLAPSED: 'navbar-vertical-collapsed',
    NAVBAR_VERTICAL_COLLAPSED_HOVER: 'navbar-vertical-collapsed-hover'
  };
  const navbarVerticalToggle = document.querySelector(
    Selector.NAVBAR_VERTICAL_TOGGLE
  );
  const html = document.querySelector(Selector.HTML);
  const navbarVerticalCollapse = document.querySelector(
    Selector.NAVBAR_VERTICAL_COLLAPSE
  );
  const activeNavLinkItem = document.querySelector(Selector.ACTIVE_NAV_LINK);
  const isNavbarVerticalCollapsed = getItemFromStore(
    'phoenixIsNavbarVerticalCollapsed',
    false
  );
  if (navbarVerticalToggle) {
    navbarVerticalToggle.addEventListener(Events.CLICK, e => {
      navbarVerticalToggle.blur();
      html?.classList.toggle(ClassNames.NAVBAR_VERTICAL_COLLAPSED);

      // Set collapse state on localStorage
      setItemToStore(
        'phoenixIsNavbarVerticalCollapsed',
        !isNavbarVerticalCollapsed
      );

      const event = new CustomEvent(Events.NAVBAR_VERTICAL_TOGGLE);
      e.currentTarget?.dispatchEvent(event);
    });
  }
  if (navbarVerticalCollapse) {
    navbarVerticalCollapse.addEventListener(Events.MOUSE_OVER, () => {
      if (hasClass(html, ClassNames.NAVBAR_VERTICAL_COLLAPSED)) {
        html?.classList.add(ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER);
      }
    });
    navbarVerticalCollapse.addEventListener(Events.MOUSE_LEAVE, () => {
      if (hasClass(html, ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER)) {
        html?.classList.remove(ClassNames.NAVBAR_VERTICAL_COLLAPSED_HOVER);
      }
    });

    if (activeNavLinkItem && !isNavbarVerticalCollapsed) {
      activeNavLinkItem.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const setDocumentMinHeight = () => {
    const bodyHeight = document.querySelector(Selector.BODY).offsetHeight;
    const navbarVerticalHeight = document.querySelector(
      Selector.NAVBAR_VERTICAL
    )?.offsetHeight;

    if (
      document.documentElement.classList.contains(
        ClassNames.NAVBAR_VERTICAL_COLLAPSED
      ) &&
      bodyHeight < navbarVerticalHeight
    ) {
      document.documentElement.style.minHeight = `${navbarVerticalHeight}px`;
    } else {
      document.documentElement.removeAttribute('style');
    }
  };

  // set document min height for collapse vertical nav
  setDocumentMinHeight();
  resize(() => {
    setDocumentMinHeight();
  });
  if (navbarVerticalToggle) {
    navbarVerticalToggle.addEventListener('navbar.vertical.toggle', () => {
      setDocumentMinHeight();
    });
  }
};

export default handleNavbarVerticalCollapsed;
