/**
 * Navigation utilities for smooth scrolling and element targeting
 */

export interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  offset?: number;
}

/**
 * Smoothly scroll to an element with optional offset and visual feedback
 */
export function scrollToElement(
  selector: string, 
  options: ScrollOptions = {}
): boolean {
  const element = document.querySelector(selector);
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return false;
  }

  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    offset = 0
  } = options;

  // Calculate scroll position with offset
  if (offset !== 0) {
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const targetPosition = absoluteElementTop + offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior
    });
  } else {
    element.scrollIntoView({
      behavior,
      block,
      inline
    });
  }

  // Add visual feedback
  addHighlightEffect(element);
  
  return true;
}

/**
 * Add highlight effect to an element
 */
export function addHighlightEffect(element: Element): void {
  element.classList.add('highlight-section');
  
  // Remove highlight after animation
  setTimeout(() => {
    element.classList.remove('highlight-section');
  }, 2000);
}

/**
 * Focus an element with accessibility considerations
 */
export function focusElement(selector: string, delay: number = 500): boolean {
  const element = document.querySelector(selector) as HTMLElement;
  
  if (!element) {
    console.warn(`Element with selector "${selector}" not found for focusing`);
    return false;
  }

  setTimeout(() => {
    // Ensure element is focusable
    if (element.tabIndex < 0) {
      element.tabIndex = -1;
    }
    
    element.focus();
    
    // Add focus ring for accessibility
    element.style.outline = '2px solid var(--brand-primary)';
    element.style.outlineOffset = '2px';
    
    // Remove custom focus ring after a delay
    setTimeout(() => {
      element.style.outline = '';
      element.style.outlineOffset = '';
    }, 3000);
  }, delay);
  
  return true;
}

/**
 * Navigation handler for different sections
 */
export function navigateToSection(sectionId: string): void {
  const sectionMap: Record<string, { selector: string; focusSelector?: string; offset?: number }> = {
    'prompt-input': {
      selector: '#prompt-input-section',
      focusSelector: '#prompt-input',
      offset: -20
    },
    'technique-selector': {
      selector: '#technique-selector-section',
      offset: -20
    },
    'results': {
      selector: '#results-section',
      offset: -20
    },
    'interface': {
      selector: '#prompt-enhancer-interface',
      offset: -20
    },
    'features': {
      selector: '#features-section',
      offset: -80
    },
    'about': {
      selector: '#about-section',
      offset: -80
    }
  };

  const config = sectionMap[sectionId];
  
  if (!config) {
    console.warn(`Unknown section ID: ${sectionId}`);
    return;
  }

  const success = scrollToElement(config.selector, {
    behavior: 'smooth',
    block: 'start',
    offset: config.offset
  });

  // Focus element if specified and scroll was successful
  if (success && config.focusSelector) {
    focusElement(config.focusSelector);
  }
}

/**
 * Check if an element is in viewport
 */
export function isElementInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get the current active section based on scroll position
 */
export function getCurrentSection(): string | null {
  const sections = [
    '#prompt-enhancer-interface',
    '#results-section',
    '#features-section',
    '#about-section'
  ];

  for (const selector of sections) {
    const element = document.querySelector(selector);
    if (element && isElementInViewport(element)) {
      return selector;
    }
  }

  return null;
}

/**
 * Debounce function for scroll events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
