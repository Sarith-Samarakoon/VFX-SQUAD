 document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".wrapper");
    const carousel1 = document.querySelector(".carousel1");
    const arrowBtns = document.querySelectorAll(".wrapper i");

    if (!wrapper) {
        console.error("Wrapper element not found!");
        return;
    }

    if (!carousel1) {
        console.error("Carousel element not found!");
        return;
    }

    if (!arrowBtns.length) {
        console.error("Arrow buttons not found!");
        return;
    }

    const firstCard = carousel1.querySelector(".card");
    if (!firstCard) {
        console.error("Card element not found!");
        return;
    }

    const firstCardWidth = firstCard.offsetWidth;
    const carousel1Children = [...carousel1.children];

    let isDragging = false,
        startX,
        startScrollLeft,
        timeoutId;

    // Get the number of cards that can fit in the carousel at once
    let cardPerView = Math.round(carousel1.offsetWidth / firstCardWidth);

    // Insert copies of the last few cards to the beginning of the carousel for infinite scrolling
    carousel1Children
        .slice(-cardPerView)
        .reverse()
        .forEach((card) => {
            carousel1.insertAdjacentHTML("afterbegin", card.outerHTML);
        });

    // Insert copies of the first few cards to the end of the carousel for infinite scrolling
    carousel1Children.slice(0, cardPerView).forEach((card) => {
        carousel1.insertAdjacentHTML("beforeend", card.outerHTML);
    });

    // Add event listeners for the arrow buttons to scroll the carousel left and right
    arrowBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            carousel1.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
        });
    });

    const dragStart = (e) => {
        isDragging = true;
        carousel1.classList.add("dragging");
        // Record the initial cursor and scroll position of the carousel
        startX = e.pageX;
        startScrollLeft = carousel1.scrollLeft;
    };

    const dragging = (e) => {
        if (!isDragging) return; // If isDragging is false, return from here
        // Update the scroll position of the carousel based on the cursor movement
        carousel1.scrollLeft = startScrollLeft - (e.pageX - startX);
    };

    const dragStop = () => {
        isDragging = false;
        carousel1.classList.remove("dragging");
    };

    const infiniteScroll = () => {
        // If the carousel is at the beginning, scroll to the end
        if (carousel1.scrollLeft === 0) {
            carousel1.classList.add("no-transition");
            carousel1.scrollLeft = carousel1.scrollWidth - (2 * carousel1.offsetWidth);
            carousel1.classList.remove("no-transition");
        }
        // If the carousel is at the end, scroll to the beginning
        else if (Math.ceil(carousel1.scrollLeft) === carousel1.scrollWidth - carousel1.offsetWidth) {
            carousel1.classList.add("no-transition");
            carousel1.scrollLeft = carousel1.offsetWidth;
            carousel1.classList.remove("no-transition");
        }

        // Clear the existing timeout & start autoplay
        clearTimeout(timeoutId);
        if (!wrapper.matches(":hover")) autoPlay();
    };

    const autoPlay = () => {
        if (window.innerWidth < 800) return; // Return if the window is smaller than 800
        // Autoplay the carousel after every 2500 ms
        timeoutId = setTimeout(() => (carousel1.scrollLeft += firstCardWidth), 2500);
    };

    autoPlay();

    carousel1.addEventListener("mousedown", dragStart);
    carousel1.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    carousel1.addEventListener("scroll", infiniteScroll);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);