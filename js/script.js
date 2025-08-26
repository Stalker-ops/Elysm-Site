document.addEventListener('DOMContentLoaded', () => {n
    initApp();
});

function initApp() {
    initTheme();
    initNavigation();
    initSmoothScrolling();
    initAnimations();
    initAnalytics();
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeStyle = document.getElementById('theme-style');
    const body = document.body;
    const savedTheme = localStorage.getItem('elysm-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkTheme();
    } else {
        enableLightTheme();
    }

    themeToggle.addEventListener('click', toggleTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('elysm-theme')) {
            e.matches ? enableDarkTheme() : enableLightTheme();
        }
    });

    function toggleTheme() {
        if (body.classList.contains('dark-theme')) {
            enableLightTheme();
        } else {
            enableDarkTheme();
        }
    }

    function enableLightTheme() {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('elysm-theme', 'light');
        updateThemeToggleIcon('light');
    }

    function enableDarkTheme() {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('elysm-theme', 'dark');
        updateThemeToggleIcon('dark');
    }

    function updateThemeToggleIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');

        themeIcon.setAttribute('data-theme', theme);
    }
}

function initNavigation() {
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100));
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            history.pushState(null, null, targetId);
        });
    });
}

function initAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .community-stat, .security-feature, .download-badge');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function initAnalytics() {
    const downloadButtons = document.querySelectorAll('.download-badge, .btn-primary');
    downloadButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Download button clicked:', button.textContent);
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        console.log('Theme changed to:', newTheme);
    });
}

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
    }
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        throttle,
        debounce
    };
}
