// ============================================
// PREMIUM DARK PORTFOLIO - DIOUBI ISSAM
// Interactive JavaScript with Smooth Animations
// ============================================

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Initialize all features
    initNavbar();
    initAccentSwitcher();
    initTypewriter();
    initScrollAnimations();
    initCarousel();
    initContactForm();
    initCopyEmail();
    initMobileMenu();
    initSmoothScroll();
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scrolled class on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Set initial active link
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// ACCENT COLOR SWITCHER
// ============================================
function initAccentSwitcher() {
    const accentButtons = document.querySelectorAll('.accent-btn');
    const root = document.documentElement;

    // Load saved accent from localStorage
    const savedAccent = localStorage.getItem('accentColor') || 'blue';
    setAccent(savedAccent);

    accentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const accent = btn.getAttribute('data-accent');
            setAccent(accent);
            localStorage.setItem('accentColor', accent);
        });
    });

    function setAccent(accent) {
        // Remove active class from all buttons
        accentButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to selected button
        const activeBtn = document.querySelector(`[data-accent="${accent}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update CSS custom properties
        root.setAttribute('data-accent', accent);
    }
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
function initTypewriter() {
    const element = document.getElementById('typewriter-text');
    if (!element) return;

    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);

    let index = 0;
    const speed = 80; // ms per character

    function type() {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            element.appendChild(cursor);
            index++;
            setTimeout(type, speed);
        } else {
            // Keep cursor blinking after typing is done
            cursor.classList.add('blink');
        }
    }

    // Start typing after a short delay
    setTimeout(type, 1000);
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay for multiple items
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.about-text, .badge, .skill-category, .project-card, .contact-method, .contact-form'
    );

    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// PROJECT CAROUSEL
// ============================================
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let isAnimating = false;

    // Update carousel position with crazy animations
    function updateCarousel(direction = 'none') {
        if (isAnimating) return;
        isAnimating = true;

        // Add swipe direction class for animation
        if (direction === 'left') {
            track.classList.add('swiping-left');
        } else if (direction === 'right') {
            track.classList.add('swiping-right');
        }

        // Wait for swipe out animation
        setTimeout(() => {
            // Move track
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update active slide
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'entering');
                if (index === currentIndex) {
                    slide.classList.add('entering');
                    setTimeout(() => {
                        slide.classList.add('active');
                        slide.classList.remove('entering');
                    }, 50);
                }
            });

            // Remove swipe classes
            track.classList.remove('swiping-left', 'swiping-right');

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            // Reinitialize icons after slide change
            lucide.createIcons();

            // Reset animation lock
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }, direction !== 'none' ? 300 : 0);
    }

    // Next slide
    function nextSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel('left');
    }

    // Previous slide
    function prevSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel('right');
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isAnimating || index === currentIndex) return;
            const direction = index > currentIndex ? 'left' : 'right';
            currentIndex = index;
            updateCarousel(direction);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    }

    // Auto-play (optional - commented out by default)
    // setInterval(nextSlide, 5000);

    // Initial update
    updateCarousel('none');
}

// ============================================
// CONTACT FORM HANDLING
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('span').textContent;

        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';

        // Simulate API call
        setTimeout(() => {
            showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = originalText;

            // Reinitialize icons after content change
            lucide.createIcons();
        }, 1500);
    });
}

// ============================================
// COPY EMAIL FUNCTIONALITY
// ============================================
function initCopyEmail() {
    const copyButtons = document.querySelectorAll('.copy-email');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const email = btn.getAttribute('data-email');

            // Copy to clipboard
            navigator.clipboard.writeText(email).then(() => {
                // Update button text
                const originalText = btn.querySelector('span').textContent;
                btn.querySelector('span').textContent = 'Copied!';

                // Show toast
                showToast(`Email copied: ${email}`, 'success');

                // Reset button text after 2 seconds
                setTimeout(() => {
                    btn.querySelector('span').textContent = originalText;
                }, 2000);
            }).catch(err => {
                showToast('Failed to copy email', 'error');
            });
        });
    });
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message;
    toast.classList.add('show');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// PROJECT DEMO MODAL (for missing CV/Demo)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const viewDemoBtn = document.getElementById('view-demo');
    const modal = document.getElementById('cv-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (viewDemoBtn) {
        viewDemoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event listeners
const optimizedScroll = debounce(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Keyboard navigation for accent switcher
document.querySelectorAll('.accent-btn').forEach(btn => {
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
});

// Focus trap for modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }

        // Close on Escape
        if (e.key === 'Escape') {
            const modal = document.getElementById('cv-modal');
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        }
    });
}

// Apply focus trap to modal
const modal = document.getElementById('cv-modal');
if (modal) {
    trapFocus(modal);
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log(
    '%c👋 Hello, Developer!',
    'font-size: 20px; font-weight: bold; color: #3b82f6;'
);
console.log(
    '%cLooking for something? Feel free to reach out!',
    'font-size: 14px; color: #94a3b8;'
);
console.log(
    '%c📧 issamdiyou@gmail.com',
    'font-size: 14px; color: #60a5fa;'
);

// ============================================
// EDIT INSTRUCTIONS
// ============================================

/*
 * ============================================
 * CUSTOMIZATION GUIDE
 * ============================================
 * 
 * 1. ADD AGROCONNECT IMAGE:
 *    - Place your image in: assets/agroconnect.jpg or assets/agroconnect.png
 *    - The HTML will automatically detect and display it
 *    - Recommended size: 1200x750px (16:10 ratio)
 * 
 * 2. ADD YOUR CV:
 *    - Place CV in: assets/cv.pdf
 *    - Update the "View Demo" button href in index.html:
 *      <a href="assets/cv.pdf" download class="project-link">
 * 
 * 3. ADD MORE PROJECTS:
 *    - Find the "Placeholder Projects" section in index.html
 *    - Replace the placeholder cards with your project details
 *    - Add project images to assets/ folder
 *    - Update project title, description, tech tags, and links
 * 
 * 4. CHANGE ACCENT COLOR:
 *    - Click the color switcher in the navbar (blue/teal/violet)
 *    - Or modify CSS variables in styles.css:
 *      --accent: #your-color;
 *      --accent-secondary: #your-lighter-color;
 * 
 * 5. UPDATE CONTACT INFO:
 *    - Edit the contact methods in the Contact section
 *    - Update email, GitHub, LinkedIn URLs
 * 
 * 6. ADD GOOGLE ANALYTICS (optional):
 *    - Add your GA tracking code before </head> in index.html
 * 
 * ============================================
 */
