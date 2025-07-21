// Browser Language Detection and Redirect
// AI-assisted development: Automatic language detection with fallback

(function() {
    'use strict';
    
    // Configuration
    const SUPPORTED_LANGUAGES = {
        'de': 'de/index.html',    // German
        'en': 'index.html'        // English (default)
    };
    
    const DEFAULT_LANGUAGE = 'en';
    const STORAGE_KEY = 'preferred-language';
    
    /**
     * Get browser's preferred language
     * @returns {string} Language code (e.g., 'en', 'de')
     */
    function getBrowserLanguage() {
        let language = navigator.language || navigator.userLanguage;
        
        if (!language && navigator.languages && navigator.languages.length > 0) {
            language = navigator.languages[0];
        }
        
        if (language) {
            language = language.toLowerCase().split('-')[0];
        }
        
        return language || DEFAULT_LANGUAGE;
    }
    
    /**
     * Get stored language preference
     * @returns {string|null} Stored language code or null
     */
    function getStoredLanguage() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Store language preference
     * @param {string} language - Language code to store
     */
    function storeLanguage(language) {
        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch (e) {
            // LocalStorage not available - ignore silently
        }
    }
    
    /**
     * Get current page language based on URL
     * @returns {string} Current language code
     */
    function getCurrentLanguage() {
        const path = window.location.pathname;
        
        if (path.includes('/de/')) {
            return 'de';
        }
        
        return 'en';
    }
    
    /**
     * Get site root URL
     * @returns {string} Root URL of the site
     */
    function getSiteRoot() {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const pathname = window.location.pathname;
        
        // For local development (file://)
        if (protocol === 'file:') {
            // Find the root directory (where index.html is located)
            let rootPath = pathname;
            
            // If we're in /de/ folder, go up one level
            if (pathname.includes('/de/')) {
                rootPath = pathname.substring(0, pathname.indexOf('/de/'));
            } else {
                // Remove filename to get directory
                rootPath = pathname.substring(0, pathname.lastIndexOf('/'));
            }
            
            return protocol + '//' + rootPath + '/';
        }
        
        // For web servers
        let rootPath = pathname;
        
        // If we're in /de/ folder, go up one level
        if (pathname.includes('/de/')) {
            rootPath = pathname.substring(0, pathname.indexOf('/de/'));
        } else {
            // Remove filename to get directory
            rootPath = pathname.substring(0, pathname.lastIndexOf('/'));
        }
        
        // Ensure we have the correct root path
        if (!rootPath.endsWith('/')) {
            rootPath += '/';
        }
        
        return protocol + '//' + host + rootPath;
    }
    
    /**
     * Determine target language
     * @returns {string} Target language code
     */
    function getTargetLanguage() {
        // 1. Check stored preference first
        const storedLang = getStoredLanguage();
        if (storedLang && SUPPORTED_LANGUAGES.hasOwnProperty(storedLang)) {
            return storedLang;
        }
        
        // 2. Use browser language
        const browserLang = getBrowserLanguage();
        if (SUPPORTED_LANGUAGES.hasOwnProperty(browserLang)) {
            return browserLang;
        }
        
        // 3. Fallback to default
        return DEFAULT_LANGUAGE;
    }
    
    /**
     * Check if redirect is needed and safe
     * @returns {boolean} True if redirect should happen
     */
    function shouldRedirect() {
        // Don't redirect if this is a page reload
        if (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            return false;
        }
        
        // Don't redirect if user came from same domain (manual navigation)
        const referrer = document.referrer;
        const currentDomain = window.location.hostname;
        
        if (referrer && referrer.includes(currentDomain)) {
            return false;
        }
        
        // Don't redirect if we've already redirected recently (prevent loops)
        const lastRedirect = sessionStorage.getItem('last-language-redirect');
        const now = Date.now();
        
        if (lastRedirect && (now - parseInt(lastRedirect)) < 2000) {
            return false; // Don't redirect if we redirected in the last 2 seconds
        }
        
        return true;
    }
    
    /**
     * Perform redirect if necessary
     */
    function handleLanguageRedirect() {
        const currentLang = getCurrentLanguage();
        const targetLang = getTargetLanguage();
        
        // If we're already on the correct page, just store the preference
        if (currentLang === targetLang) {
            storeLanguage(currentLang);
            return;
        }
        
        // Check if we should redirect
        if (!shouldRedirect()) {
            storeLanguage(currentLang); // Respect user's current choice
            return;
        }
        
        // Perform redirect
        const siteRoot = getSiteRoot();
        const targetPath = SUPPORTED_LANGUAGES[targetLang];
        const targetUrl = siteRoot + targetPath;
        
        // Store redirect timestamp to prevent loops
        try {
            sessionStorage.setItem('last-language-redirect', Date.now().toString());
        } catch (e) {
            // SessionStorage not available
        }
        
        // Store the target language
        storeLanguage(targetLang);
        
        // Redirect
        window.location.href = targetUrl;
    }
    
    /**
     * Initialize language detection (only on first page load)
     */
    function init() {
        // Only run automatic detection on initial page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handleLanguageRedirect);
        } else {
            // Page already loaded, run immediately
            handleLanguageRedirect();
        }
    }
    
    // Run initialization only once
    if (!window.LanguageRedirectInitialized) {
        window.LanguageRedirectInitialized = true;
        init();
    }
    
    // Export functions for manual language switching
    window.LanguageRedirect = {
        setLanguage: function(language) {
            if (SUPPORTED_LANGUAGES.hasOwnProperty(language)) {
                // Store preference
                storeLanguage(language);
                
                // Clear redirect prevention
                try {
                    sessionStorage.removeItem('last-language-redirect');
                } catch (e) {
                    // SessionStorage not available
                }
                
                // Build target URL
                const siteRoot = getSiteRoot();
                const targetPath = SUPPORTED_LANGUAGES[language];
                const targetUrl = siteRoot + targetPath;
                
                // Redirect immediately for manual switches
                window.location.href = targetUrl;
            }
        },
        getCurrentLanguage: getCurrentLanguage,
        getSupportedLanguages: function() {
            return Object.keys(SUPPORTED_LANGUAGES);
        }
    };
    
})();