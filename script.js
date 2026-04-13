/**
 * Cross-browser Polyfills & Adjustments
 */

// NodeList.forEach Polyfill for IE 11
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Navbar subtle shadow on scroll
var nav = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll reveal animations (with IE Fallback)
function initAnimations() {
    var elements = document.querySelectorAll('.animate-scroll, .spec-card');
    
    if ('IntersectionObserver' in window) {
        var observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(function(el, index) {
            if (el.tagName.toLowerCase() === 'li' || el.classList.contains('spec-card')) {
                el.classList.add('animate-scroll');
                el.style.transitionDelay = ((index % 10) * 0.05) + 's';
            }
            observer.observe(el);
        });
    } else {
        // Fallback for browsers without IntersectionObserver (like IE)
        // Simply show elements immediately or use a scroll listener
        elements.forEach(function(el) {
            el.classList.add('in-view');
        });
    }
}

document.addEventListener('DOMContentLoaded', initAnimations);

// Smooth scroll functionality for internal links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href');
        var targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            var headerOffset = 110; 
            var elementPosition = targetElement.getBoundingClientRect().top;
            var offsetPosition = elementPosition + (window.pageYOffset || document.documentElement.scrollTop) - headerOffset;
  
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            } else {
                // Fallback for IE smooth scroll
                window.scrollTo(0, offsetPosition);
            }
        }
    });
});

// Form submit interception
var contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var nameInput = document.getElementById('name');
        var emailInput = document.getElementById('email');
        var messageInput = document.getElementById('message');
        var btn = e.target.querySelector('button');
        
        // Remove existing error messages
        var existingErrors = e.target.querySelectorAll('.error-msg');
        existingErrors.forEach(function(error) { error.remove(); });

        var isValid = true;

        // Name Validation: At least 3 letters, no numbers or special characters except .
        var nameValue = nameInput.value.trim();
        var nameRegex = /^[a-zA-Z.\s]{3,}$/;
        if (!nameRegex.test(nameValue)) {
            showError(nameInput, 'Please enter a valid name');
            isValid = false;
        }

        // Email Validation
        var emailValue = emailInput.value.trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            showError(emailInput, 'Please enter a valid email address.');
            isValid = false;
        }

        if (isValid) {
            var originalText = btn.innerText;
            
            // Success state
            btn.innerText = 'Request Received ✓';
            btn.style.background = 'transparent';
            btn.style.color = '#5e7a6b';
            btn.style.border = '1px solid #5e7a6b';
            btn.style.boxShadow = 'none';
            btn.disabled = true;
            
            setTimeout(function() {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.border = '';
                btn.style.boxShadow = '';
                btn.disabled = false;
                e.target.reset();
            }, 3500);
        }
    });
}

function showError(inputElement, message) {
    var errorDiv = document.createElement('div');
    errorDiv.className = 'error-msg';
    errorDiv.innerText = message;
    errorDiv.style.color = '#d9534f';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.3rem';
    inputElement.parentNode.appendChild(errorDiv);
    inputElement.style.borderColor = '#d9534f';
    
    // Reset border color on input
    inputElement.addEventListener('input', function() {
        inputElement.style.borderColor = '';
        var parent = inputElement.parentNode;
        var error = parent.querySelector('.error-msg');
        if (error) parent.removeChild(error);
    }, { once: true });
}
