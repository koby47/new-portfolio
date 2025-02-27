document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll(".filter");
    const items = document.querySelectorAll(".portfolio-item");

    filters.forEach(filter => {
        filter.addEventListener("click", function () {
            const filterValue = this.getAttribute("data-filter");

            // Update active class
            filters.forEach(f => f.classList.remove("active"));
            this.classList.add("active");

            // Show/hide items with animation
            items.forEach(item => {
                if (filterValue === "all" || item.classList.contains(filterValue)) {
                    item.classList.remove("hide");
                } else {
                    item.classList.add("hide");
                }
            });
        });
    });
});

// Add a fade-in effect for the cards on scroll
// document.addEventListener("DOMContentLoaded", () => {
//     const cards = document.querySelectorAll(".resume-card");

//     function fadeInCards() {
//         cards.forEach((card) => {
//             const rect = card.getBoundingClientRect();
//             if (rect.top < window.innerHeight - 100) {
//                 card.style.opacity = 1;
//                 card.style.transform = "translateY(0)";
//             }
//         });
//     }

//     window.addEventListener("scroll", fadeInCards);
//     fadeInCards();
// });

document.addEventListener("DOMContentLoaded", function () {
    const skillsSection = document.querySelector(".skills-section-unique");
    const progressBars = document.querySelectorAll(".progress-unique");

    function showProgress() {
        const sectionTop = skillsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 100) {
            progressBars.forEach(bar => {
                bar.style.width = bar.classList.contains("photoshop-unique") ? "90%" :
                                  bar.classList.contains("html-unique") ? "90%" :
                                  bar.classList.contains("css-unique") ? "80%" :
                                  bar.classList.contains("javascript-unique") ? "75%" :
                                  bar.classList.contains("problem-solving-unique") ? "90%" :
                                  bar.classList.contains("communication-unique") ? "90%" :
                                  bar.classList.contains("time-management-unique") ? "90%" :
                                  bar.classList.contains("collaboration-unique") ? "90%" : "0%";
            });
        }
    }

    window.addEventListener("scroll", showProgress);
});

document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default submission
    fetch(this.action, {
        method: this.method,
        body: new FormData(this),
    }).then(() => {
        alert("Your message has been sent successfully!");
        this.reset(); // Clear form after submission
    });
});