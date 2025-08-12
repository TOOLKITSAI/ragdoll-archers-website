// Ragdoll Archers Website - Analytics JavaScript

// Google Analytics 4 Configuration
function initGoogleAnalytics() {
    // Replace 'GA_MEASUREMENT_ID' with actual GA4 measurement ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // This should be replaced with real ID
    
    // Load Google Analytics script
    if (typeof gtag === 'undefined') {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(gaScript);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            page_title: document.title,
            page_location: window.location.href
        });
        
        console.log('Google Analytics initialized');
    }
}

// Enhanced Event Tracking
function setupEnhancedTracking() {
    // Track external links
    trackExternalLinks();
    
    // Track download attempts
    trackDownloads();
    
    // Track social sharing
    trackSocialSharing();
    
    // Track search interactions
    trackSearchInteractions();
    
    // Track form submissions
    trackFormSubmissions();
}

// Track External Links
function trackExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.href;
            const linkText = this.textContent.trim();
            
            gtag('event', 'click', {
                event_category: 'outbound',
                event_label: url,
                transport_type: 'beacon'
            });
            
            console.log('External link clicked:', url, linkText);
        });
    });
}

// Track Downloads
function trackDownloads() {
    const downloadLinks = document.querySelectorAll('a[href$=".pdf"], a[href$=".zip"], a[href$=".doc"], a[href$=".docx"]');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const fileName = this.href.split('/').pop();
            const fileType = fileName.split('.').pop();
            
            gtag('event', 'file_download', {
                event_category: 'downloads',
                event_label: fileName,
                file_extension: fileType
            });
        });
    });
}

// Track Social Sharing
function trackSocialSharing() {
    const socialLinks = document.querySelectorAll('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="pinterest.com"]');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.href.includes('facebook') ? 'Facebook' :
                           this.href.includes('twitter') ? 'Twitter' :
                           this.href.includes('linkedin') ? 'LinkedIn' :
                           this.href.includes('pinterest') ? 'Pinterest' : 'Unknown';
            
            gtag('event', 'share', {
                method: platform,
                content_type: 'webpage',
                item_id: window.location.pathname
            });
        });
    });
}

// Track Search Interactions
function trackSearchInteractions() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                gtag('event', 'search', {
                    search_term: this.value.trim()
                });
            }
        });
    });
}

// Track Form Submissions
function trackFormSubmissions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const formId = this.id || this.className || 'unknown';
            
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: formId
            });
        });
    });
}

// Game-Specific Analytics
function setupGameAnalytics() {
    // Track game interactions
    trackGameStart();
    trackGameErrors();
    trackGamePerformance();
    trackUserBehavior();
}

// Track Game Start
function trackGameStart() {
    const gameIframe = document.querySelector('.game-wrapper iframe');
    
    if (gameIframe) {
        gameIframe.addEventListener('load', function() {
            gtag('event', 'game_start', {
                event_category: 'games',
                event_label: 'ragdoll_archers',
                value: 1
            });
        });
    }
}

// Track Game Errors
function trackGameErrors() {
    window.addEventListener('error', function(e) {
        if (e.filename && e.filename.includes('ragdoll-archers')) {
            gtag('event', 'exception', {
                description: e.message,
                fatal: false
            });
        }
    });
}

// Track Game Performance
function trackGamePerformance() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach((entry) => {
                if (entry.name.includes('ragdoll-archers')) {
                    gtag('event', 'timing_complete', {
                        name: 'game_load_time',
                        value: Math.round(entry.duration)
                    });
                }
            });
        });
        
        observer.observe({entryTypes: ['navigation', 'resource']});
    }
}

// Track User Behavior
function trackUserBehavior() {
    let sessionStartTime = Date.now();
    let isEngaged = false;
    let scrollDepth = 0;
    let timeOnGame = 0;
    
    // Track session duration
    window.addEventListener('beforeunload', function() {
        const sessionDuration = Date.now() - sessionStartTime;
        
        gtag('event', 'session_duration', {
            event_category: 'engagement',
            value: Math.round(sessionDuration / 1000)
        });
    });
    
    // Track scroll behavior
    window.addEventListener('scroll', throttle(function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > scrollDepth) {
            scrollDepth = scrollPercent;
            
            if (scrollDepth >= 25 && !isEngaged) {
                isEngaged = true;
                gtag('event', 'scroll', {
                    event_category: 'engagement',
                    event_label: 'engaged_user'
                });
            }
        }
    }, 1000));
    
    // Track time spent on game section
    const gameSection = document.getElementById('game');
    if (gameSection) {
        let gameInView = false;
        let gameViewStartTime = 0;
        
        const gameObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !gameInView) {
                    gameInView = true;
                    gameViewStartTime = Date.now();
                } else if (!entry.isIntersecting && gameInView) {
                    gameInView = false;
                    timeOnGame += Date.now() - gameViewStartTime;
                    
                    if (timeOnGame > 10000) { // More than 10 seconds
                        gtag('event', 'game_engagement', {
                            event_category: 'games',
                            event_label: 'time_spent',
                            value: Math.round(timeOnGame / 1000)
                        });
                    }
                }
            });
        }, { threshold: 0.5 });
        
        gameObserver.observe(gameSection);
    }
}

// Custom Event Tracking Functions
function trackCustomEvent(eventName, category = 'custom', label = '', value = null) {
    const eventParams = {
        event_category: category,
        event_label: label
    };
    
    if (value !== null) {
        eventParams.value = value;
    }
    
    gtag('event', eventName, eventParams);
}

// Page View Tracking
function trackPageView(pagePath = null, pageTitle = null) {
    gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath || window.location.pathname,
        page_title: pageTitle || document.title
    });
}

// User Properties Tracking
function setUserProperties() {
    // Track user preferences
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isTablet = /iPad|Android/.test(userAgent) && !/Mobile/.test(userAgent);
    
    gtag('config', 'GA_MEASUREMENT_ID', {
        custom_map: {
            'device_type': isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
            'user_agent': userAgent.substring(0, 100) // Limit length
        }
    });
}

// Ecommerce Tracking (for future premium features)
function trackEcommerce(action, data) {
    if (action === 'purchase') {
        gtag('event', 'purchase', {
            transaction_id: data.transactionId,
            value: data.value,
            currency: data.currency || 'USD',
            items: data.items
        });
    } else if (action === 'add_to_cart') {
        gtag('event', 'add_to_cart', {
            currency: data.currency || 'USD',
            value: data.value,
            items: data.items
        });
    }
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize Analytics on Page Load
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if user hasn't opted out
    if (!localStorage.getItem('analytics_disabled')) {
        initGoogleAnalytics();
        setupEnhancedTracking();
        setupGameAnalytics();
        setUserProperties();
        
        console.log('Analytics initialized successfully');
    }
});

// Privacy Controls
function disableAnalytics() {
    localStorage.setItem('analytics_disabled', 'true');
    console.log('Analytics disabled by user preference');
}

function enableAnalytics() {
    localStorage.removeItem('analytics_disabled');
    location.reload(); // Reload to initialize analytics
}

// Expose functions globally
window.trackCustomEvent = trackCustomEvent;
window.trackPageView = trackPageView;
window.trackEcommerce = trackEcommerce;
window.disableAnalytics = disableAnalytics;
window.enableAnalytics = enableAnalytics;