// Ragdoll Archers Website - Game Loader JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initGameLoader();
});

// Game Loading Functionality
function initGameLoader() {
    const gameIframe = document.querySelector('.game-wrapper iframe');
    const gameWrapper = document.querySelector('.game-wrapper');
    
    if (gameIframe && gameWrapper) {
        // Create loading overlay
        createLoadingOverlay(gameWrapper);
        
        // Handle iframe load events
        handleGameLoading(gameIframe);
        
        // Add error handling
        handleGameErrors(gameIframe);
        
        // Optimize iframe performance
        optimizeGamePerformance(gameIframe);
    }
}

// Create Loading Overlay
function createLoadingOverlay(gameWrapper) {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'game-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <h3>🎯 Loading Ragdoll Archers...</h3>
            <p>Preparing your archery adventure!</p>
            <div class="loading-tips">
                <p><strong>Pro Tip:</strong> Aim for the head for maximum damage!</p>
            </div>
        </div>
    `;
    
    // Add loading overlay styles
    const style = document.createElement('style');
    style.textContent = `
        .game-loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--game-container-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            border-radius: 10px;
        }
        
        .loading-content {
            text-align: center;
            padding: 40px 20px;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-content h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
            font-size: 1.5rem;
        }
        
        .loading-content p {
            color: var(--text-secondary);
            margin-bottom: 20px;
        }
        
        .loading-tips {
            background: var(--card-bg);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            max-width: 300px;
            margin: 0 auto;
        }
        
        .loading-tips p {
            margin: 0;
            font-size: 0.9rem;
            color: var(--text-secondary);
        }
        
        .game-loading-error {
            background: rgba(233, 69, 96, 0.1);
            border: 2px solid var(--primary-color);
            color: var(--text-primary);
        }
        
        .error-content {
            text-align: center;
            padding: 30px;
        }
        
        .error-content h3 {
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        
        .retry-button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 15px;
            transition: background 0.3s ease;
        }
        
        .retry-button:hover {
            background: #d63651;
        }
    `;
    
    document.head.appendChild(style);
    
    // Make wrapper relative for absolute positioning
    gameWrapper.style.position = 'relative';
    gameWrapper.appendChild(loadingOverlay);
}

// Handle Game Loading
function handleGameLoading(gameIframe) {
    const loadingOverlay = document.querySelector('.game-loading-overlay');
    let loadTimeout;
    
    // Set loading timeout (30 seconds)
    loadTimeout = setTimeout(() => {
        showGameError('Game is taking longer than expected to load. Please check your internet connection.');
    }, 30000);
    
    // Handle successful load
    gameIframe.addEventListener('load', () => {
        clearTimeout(loadTimeout);
        
        // Wait a bit for game to initialize
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                loadingOverlay.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }
            
            // Track successful game load
            if (typeof trackEvent !== 'undefined') {
                trackEvent('game_loaded_successfully');
            }
        }, 1000);
    });
    
    // Handle load error
    gameIframe.addEventListener('error', () => {
        clearTimeout(loadTimeout);
        showGameError('Failed to load the game. Please try refreshing the page.');
    });
}

// Handle Game Errors
function handleGameErrors(gameIframe) {
    // Monitor for iframe navigation errors
    window.addEventListener('message', (event) => {
        if (event.source === gameIframe.contentWindow) {
            if (event.data && event.data.type === 'error') {
                showGameError('Game encountered an error. Please try reloading.');
            }
        }
    });
}

// Show Game Error
function showGameError(errorMessage) {
    const loadingOverlay = document.querySelector('.game-loading-overlay');
    
    if (loadingOverlay) {
        loadingOverlay.className = 'game-loading-overlay game-loading-error';
        loadingOverlay.innerHTML = `
            <div class="error-content">
                <h3>⚠️ Game Loading Error</h3>
                <p>${errorMessage}</p>
                <button class="retry-button" onclick="retryGameLoad()">🔄 Retry</button>
                <p style="margin-top: 15px; font-size: 0.9rem;">
                    Or try our <a href="/guide.html" style="color: var(--accent-color);">game guide</a> 
                    while you wait!
                </p>
            </div>
        `;
        
        // Track error
        if (typeof trackEvent !== 'undefined') {
            trackEvent('game_load_error', errorMessage);
        }
    }
}

// Retry Game Load
function retryGameLoad() {
    const gameIframe = document.querySelector('.game-wrapper iframe');
    const gameWrapper = document.querySelector('.game-wrapper');
    
    if (gameIframe && gameWrapper) {
        // Remove existing error overlay
        const errorOverlay = document.querySelector('.game-loading-error');
        if (errorOverlay) {
            errorOverlay.remove();
        }
        
        // Recreate loading overlay
        createLoadingOverlay(gameWrapper);
        
        // Reload iframe
        const currentSrc = gameIframe.src;
        gameIframe.src = '';
        
        setTimeout(() => {
            gameIframe.src = currentSrc;
        }, 100);
        
        // Track retry attempt
        if (typeof trackEvent !== 'undefined') {
            trackEvent('game_retry_attempted');
        }
    }
}

// Optimize Game Performance
function optimizeGamePerformance(gameIframe) {
    // Add loading attribute for better performance
    gameIframe.loading = 'lazy';
    
    // Set iframe sandbox for security (but allow necessary permissions)
    gameIframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';
    
    // Add referrer policy
    gameIframe.referrerPolicy = 'strict-origin-when-cross-origin';
    
    // Monitor iframe performance
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
            if (entry.name.includes('ragdoll-archers')) {
                if (typeof trackEvent !== 'undefined') {
                    trackEvent('game_performance', Math.round(entry.duration));
                }
            }
        });
    });
    
    if (window.PerformanceObserver) {
        observer.observe({entryTypes: ['navigation', 'resource']});
    }
}

// Game Tips Rotation
function initGameTips() {
    const tips = [
        "🎯 Aim for the head for maximum damage!",
        "🏹 Different arrows have unique properties - experiment!",
        "💨 Account for wind direction when aiming",
        "🎪 Use physics to your advantage with trick shots",
        "⚡ Quick shots can catch enemies off guard",
        "🛡️ Learn enemy patterns to predict movement",
        "💎 Collect power-ups for special abilities",
        "🎨 Master the art of bank shots and ricochets"
    ];
    
    let currentTipIndex = 0;
    const tipElement = document.querySelector('.loading-tips p');
    
    if (tipElement) {
        setInterval(() => {
            currentTipIndex = (currentTipIndex + 1) % tips.length;
            tipElement.innerHTML = `<strong>Pro Tip:</strong> ${tips[currentTipIndex]}`;
        }, 3000);
    }
}

// Initialize tips rotation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initGameTips, 1000);
});

// Expose retry function globally
window.retryGameLoad = retryGameLoad;