document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownContent = document.querySelector(".dropdown-content");
    const filterLinks = document.querySelectorAll(".dropdown-content a");
    const galleryItems = document.querySelectorAll(".gallery-item");

    dropdownBtn.addEventListener("click", function () {
        dropdownContent.classList.toggle("show");
    });

    filterLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const filter = this.getAttribute("data-filter");

            galleryItems.forEach(item => {
                if (filter === "all" || item.getAttribute("data-category") === filter) {
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            });

            dropdownContent.classList.remove("show");
            dropdownBtn.textContent = this.textContent;
        });
    });

    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove("show");
        }
    });
});
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const accordionContent = button.nextElementSibling;

        document.querySelectorAll('.accordion-content').forEach(content => {
            if (content !== accordionContent) {
                content.classList.remove('show');
                content.previousElementSibling.classList.remove('active');
                content.previousElementSibling.querySelector('.icon').textContent = '+';
            }
        });

        accordionContent.classList.toggle('show');
        button.classList.toggle('active');
        button.querySelector('.icon').textContent = accordionContent.classList.contains('show') ? '−' : '+';
    });
});
document.querySelector(".contact-form button").addEventListener("click", function() {
    alert("Your message has been sent!");
});
