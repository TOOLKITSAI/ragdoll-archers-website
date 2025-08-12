// Ragdoll Archers Website - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    initMobileMenu();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Lazy loading for images
    initLazyLoading();
    
    // Track user engagement
    initEngagementTracking();
    
    // Initialize game loader when needed
    initGameInteractions();
    
    // Initialize FAQ functionality
    initFAQ();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to Game Function (called by Play Now button)
function scrollToGame() {
    const gameSection = document.getElementById('game');
    if (gameSection) {
        const offsetTop = gameSection.offsetTop - 80;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Track game section view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_to_game', {
                event_category: 'engagement',
                event_label: 'cta_button'
            });
        }
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
        });
    }
}

// Engagement Tracking
function initEngagementTracking() {
    let scrollDepth = 0;
    let timeOnPage = 0;
    let hasSeenGame = false;
    
    // Start time tracking
    const startTime = Date.now();
    
    // Track scroll depth
    window.addEventListener('scroll', throttle(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const currentDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
        
        if (currentDepth > scrollDepth) {
            scrollDepth = currentDepth;
            
            // Track milestone depths
            if (scrollDepth >= 25 && scrollDepth < 50) {
                trackEvent('scroll_depth_25');
            } else if (scrollDepth >= 50 && scrollDepth < 75) {
                trackEvent('scroll_depth_50');
            } else if (scrollDepth >= 75) {
                trackEvent('scroll_depth_75');
            }
        }
        
        // Check if game section is in view
        const gameSection = document.getElementById('game');
        if (gameSection && !hasSeenGame) {
            const rect = gameSection.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                hasSeenGame = true;
                trackEvent('game_section_viewed');
            }
        }
    }, 250));
    
    // Track time on page before leaving
    window.addEventListener('beforeunload', () => {
        timeOnPage = Math.round((Date.now() - startTime) / 1000);
        
        if (timeOnPage > 30) {
            trackEvent('engaged_user', timeOnPage);
        }
    });
    
    // Track visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            timeOnPage = Math.round((Date.now() - startTime) / 1000);
            if (timeOnPage > 10) {
                trackEvent('tab_hidden', timeOnPage);
            }
        }
    });
}

// Game Interactions
function initGameInteractions() {
    const gameIframe = document.querySelector('.game-wrapper iframe');
    
    if (gameIframe) {
        // Track when iframe loads
        gameIframe.addEventListener('load', () => {
            trackEvent('game_iframe_loaded');
        });
        
        // Track when user clicks on game area
        const gameWrapper = document.querySelector('.game-wrapper');
        if (gameWrapper) {
            gameWrapper.addEventListener('click', () => {
                trackEvent('game_area_clicked');
            });
        }
    }
}

// Utility Functions
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function(...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

function trackEvent(eventName, eventValue = null) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        const eventParams = {
            event_category: 'engagement',
            event_label: eventName
        };
        
        if (eventValue !== null) {
            eventParams.value = eventValue;
        }
        
        gtag('event', eventName, eventParams);
    }
    
    // Console log for debugging
    console.log(`Event tracked: ${eventName}`, eventValue);
}

// FAQ Functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentNode;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const toggle = this.querySelector('.faq-toggle');
            
            // Toggle active class
            faqItem.classList.toggle('active');
            
            // Update toggle symbol
            if (faqItem.classList.contains('active')) {
                toggle.textContent = '−';
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                faqAnswer.style.paddingBottom = '25px';
            } else {
                toggle.textContent = '+';
                faqAnswer.style.maxHeight = '0px';
                faqAnswer.style.paddingBottom = '0px';
            }
            
            // Track FAQ interaction
            if (typeof trackEvent !== 'undefined') {
                const questionText = this.querySelector('h3').textContent;
                trackEvent('faq_clicked', questionText.substring(0, 50));
            }
        });
    });
}

// Expose functions globally for HTML onclick handlers
window.scrollToGame = scrollToGame;
window.trackEvent = trackEvent;