window.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const headerEnd = document.getElementById('header-end');

    const BASE_ALPHA = 0.2;

    const DISTANCE_SCALING = 2;

    if(nav && headerEnd) {
        // Sets the nav bar to be transparent
        nav.style.backgroundColor = `rgba(51, 51, 51, ${BASE_ALPHA})`;

        const animateNavBackground = () => {
            // Distance from end of header to end of navigation bar used to determine
            // how transparent the nav bar should be
            const distFromNav = headerEnd.getBoundingClientRect().y 
                - (1 + DISTANCE_SCALING) * nav.getBoundingClientRect().height;
            
            // Alpha calcualted as a percentage - 
            // this range is not normalized to be within BASE_ALPHA and 1.0
            let percentage = -distFromNav / (DISTANCE_SCALING * 100);

            // Forces the percentage to be between BASE_ALPHA and 1.0.
            if(percentage < BASE_ALPHA) {
                percentage = BASE_ALPHA;
            }
            else if(percentage > 1) {
                percentage = 1;
            }

            nav.style.backgroundColor = `rgba(51, 51, 51, ${percentage})`;
            
            // This asks the browser to run this function ~ 60 times a second, which is great for
            // rendering stuff
            requestAnimationFrame(animatedNavBackground);
        }

        // Calls `animateNavBackground` the first time to start the cycle
        requestAnimationFrame(animateNavBackground);
    }
});