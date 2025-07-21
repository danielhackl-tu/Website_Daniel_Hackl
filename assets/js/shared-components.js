/**
 * Shared Components for Daniel Hackl Portfolio Website
 * Contains common functionality used across all language versions
 * GDPR-compliant lazy loading and Swiper gallery initialization
 */

// GDPR-compliant mobile detection without collecting personal data
const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Enhanced image loading function with better error handling
function loadImageWithFade(element, callback) {
  const img = new Image();
  const dataSrc = element.getAttribute('data-src');
  
  if (!dataSrc) {
    console.warn('No data-src attribute found on element');
    return;
  }
  
  img.onload = function() {
    element.src = img.src;
    element.style.transition = 'opacity 0.5s ease-in-out';
    element.style.opacity = '1';
    if (callback) callback();
  };
  
  img.onerror = function() {
    console.warn('Image failed to load:', dataSrc);
    // On mobile, retry once after a delay
    if (isMobile) {
      setTimeout(() => {
        img.src = dataSrc;
      }, 1000);
    }
  };
  
  img.src = dataSrc;
}

// Simplified hero background loading (based on working code)
const initializeHeroBackground = () => {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;
  
  const gifSrc = heroBg.getAttribute('data-src');
  
  if (!gifSrc) {
    console.warn('Hero background data-src not found');
    return;
  }
  
  // Function to load GIF
  const loadHeroGif = () => {
    const gifImg = new Image();
    
    // Add timeout for mobile devices
    const timeoutId = setTimeout(() => {
      console.warn('GIF loading timeout - keeping static image');
    }, isMobile ? 8000 : 12000);
    
    gifImg.onload = function() {
      clearTimeout(timeoutId);
      heroBg.style.transition = 'opacity 0.3s ease-in-out';
      heroBg.src = gifImg.src;
    };
    
    gifImg.onerror = function() {
      clearTimeout(timeoutId);
      console.warn('GIF failed to load, keeping static image');
    };
    
    gifImg.src = gifSrc;
  };
  
  // Mobile-optimized timing (based on working code)
  if (isMobile) {
    // On mobile, wait for page to be fully loaded
    if (document.readyState === 'complete') {
      // Add extra delay on mobile to ensure everything is loaded
      setTimeout(loadHeroGif, 150);
    } else {
      window.addEventListener('load', () => {
        setTimeout(loadHeroGif, 150);
      });
    }
  } else {
    // Desktop: load immediately after DOM is ready
    setTimeout(loadHeroGif, 100);
  }
};

// GDPR-compliant cache detection function - NON-BLOCKING
const checkIfCached = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    const startTime = performance.now();
    
    img.onload = function() {
      const loadTime = performance.now() - startTime;
      // If image loads very quickly (< 30ms), it's likely cached
      // This is a technical performance metric, not user tracking
      resolve(loadTime < 30);
    };
    
    img.onerror = function() {
      resolve(false);
    };
    
    // Much shorter timeout for non-blocking behavior
    setTimeout(() => resolve(false), 50);
    
    img.src = src;
  });
};

// Enhanced portrait loading with mobile-optimized Intersection Observer
const initializePortraitLoading = () => {
  const portrait = document.querySelector('.portrait-lazy');
  if (!portrait) return;
  
  // More lenient settings for mobile
  const observerOptions = {
    threshold: isMobile ? 0.01 : 0.1, // Much lower threshold on mobile
    rootMargin: isMobile ? '200px' : '50px' // Larger margin on mobile
  };
  
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImageWithFade(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    observer.observe(portrait);
  } else {
    // Fallback for browsers without Intersection Observer
    loadImageWithFade(portrait);
  }
};

// Mobile-specific optimizations
const initializeMobileOptimizations = () => {
  if (!isMobile) return;
  
  // Handle visibility change (mobile browsers often pause JS when tab is hidden)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      // Page is visible again - check if images need loading
      const unloadedImages = document.querySelectorAll('img[data-src]:not([src*="assets/images"])');
      unloadedImages.forEach(img => {
        if (img.getBoundingClientRect().top < window.innerHeight) {
          loadImageWithFade(img);
        }
      });
    }
  });
  
  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      // Re-trigger intersection observer checks after orientation change
      const portraitImg = document.querySelector('.portrait-lazy');
      if (portraitImg && !portraitImg.src.includes('portrait.jpg')) {
        loadImageWithFade(portraitImg);
      }
    }, 500);
  });
};

// Swiper gallery initialization with better error handling
const initializeSwiperGalleries = () => {
  // Check if Swiper is available
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper not loaded yet, retrying...');
    setTimeout(initializeSwiperGalleries, 100);
    return;
  }

  // Check if swiper elements exist before initializing
  const swiperElements = document.querySelectorAll('.swiper');
  if (swiperElements.length === 0) {
    return; // No swiper elements found, skip initialization
  }

  // Initialize ANS Leadership Swiper Gallery
  const ansLeadershipSwiper = new Swiper('.ans-leadership-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'slide',
    speed: 600,
    navigation: {
      nextEl: '.ans-leadership-swiper .swiper-button-next',
      prevEl: '.ans-leadership-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.ans-leadership-swiper .swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    keyboard: { enabled: true },
    touchRatio: 1,
    touchAngle: 45,
    watchSlidesProgress: true,
    preloadImages: false,
    lazy: true,
  });

  // Initialize IYNC Swiper Gallery
  const iyncSwiper = new Swiper('.iync-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'slide',
    speed: 600,
    navigation: {
      nextEl: '.iync-swiper .swiper-button-next',
      prevEl: '.iync-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.iync-swiper .swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    keyboard: { enabled: true },
    touchRatio: 1,
    touchAngle: 45,
    watchSlidesProgress: true,
    preloadImages: false,
    lazy: true,
  });

  // Initialize DACH Conference Swiper Gallery
  const dachSwiper = new Swiper('.dach-conference-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'slide',
    speed: 600,
    navigation: {
      nextEl: '.dach-conference-swiper .swiper-button-next',
      prevEl: '.dach-conference-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.dach-conference-swiper .swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    keyboard: { enabled: true },
    touchRatio: 1,
    touchAngle: 45,
    watchSlidesProgress: true,
    preloadImages: false,
    lazy: true,
  });

  // Initialize Conferences Swiper Gallery
  const conferencesSwiper = new Swiper('.conferences-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 4700,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'slide',
    speed: 600,
    navigation: {
      nextEl: '.conferences-swiper .swiper-button-next',
      prevEl: '.conferences-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.conferences-swiper .swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    keyboard: { enabled: true },
    touchRatio: 1,
    touchAngle: 45,
    watchSlidesProgress: true,
    preloadImages: false,
    lazy: true,
  });

  // Initialize NPP Tours Swiper Gallery
  const nppToursSwiper = new Swiper('.npp-tours-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 5200,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'slide',
    speed: 600,
    navigation: {
      nextEl: '.npp-tours-swiper .swiper-button-next',
      prevEl: '.npp-tours-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.npp-tours-swiper .swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    keyboard: { enabled: true },
    touchRatio: 1,
    touchAngle: 45,
    watchSlidesProgress: true,
    preloadImages: false,
    lazy: true,
  });
  
  // Pause autoplay when hovering over containers
  const containers = document.querySelectorAll('.engagement-image-container');
  containers.forEach(container => {
    container.addEventListener('mouseenter', () => {
      if (container.querySelector('.ans-leadership-swiper')) ansLeadershipSwiper.autoplay.stop();
      if (container.querySelector('.iync-swiper')) iyncSwiper.autoplay.stop();
      if (container.querySelector('.dach-conference-swiper')) dachSwiper.autoplay.stop();
      if (container.querySelector('.conferences-swiper')) conferencesSwiper.autoplay.stop();
      if (container.querySelector('.npp-tours-swiper')) nppToursSwiper.autoplay.stop();
    });
    
    container.addEventListener('mouseleave', () => {
      if (container.querySelector('.ans-leadership-swiper')) ansLeadershipSwiper.autoplay.start();
      if (container.querySelector('.iync-swiper')) iyncSwiper.autoplay.start();
      if (container.querySelector('.dach-conference-swiper')) dachSwiper.autoplay.start();
      if (container.querySelector('.conferences-swiper')) conferencesSwiper.autoplay.start();
      if (container.querySelector('.npp-tours-swiper')) nppToursSwiper.autoplay.start();
    });
  });
};

// Language switcher functionality
const updateActiveLanguageIndicators = () => {
  const currentLang = window.LanguageRedirect ? window.LanguageRedirect.getCurrentLanguage() : 'en';
  
  // Update desktop switcher
  document.querySelectorAll('.lang-link').forEach(link => {
    link.classList.remove('active');
  });
  const activeLangLink = document.getElementById('lang-' + currentLang);
  if (activeLangLink) {
    activeLangLink.classList.add('active');
  }
  
  // Update mobile switcher
  document.querySelectorAll('.mobile-lang-link').forEach(link => {
    link.classList.remove('active');
  });
  const activeMobileLangLink = document.getElementById('mobile-lang-' + currentLang);
  if (activeMobileLangLink) {
    activeMobileLangLink.classList.add('active');
  }
};

// Main initialization function with better timing
const initializeSharedComponents = () => {
  // Initialize non-Swiper components immediately
  initializeHeroBackground();
  initializePortraitLoading();
  initializeMobileOptimizations();
  updateActiveLanguageIndicators();
  
  // Initialize Swiper with delay to ensure it's loaded
  setTimeout(initializeSwiperGalleries, 50);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeSharedComponents);
