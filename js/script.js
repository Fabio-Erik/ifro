document.addEventListener('DOMContentLoaded', () => {
    // 1) Ano no copyright
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2) CARROSSEL AUTOMÁTICO (início)
    const slides = document.querySelectorAll('.carousel-auto .slide');
    if (slides.length) {
        slides[0].classList.add('active');
        let index = 0;
        setInterval(() => {
            slides[index].classList.remove('active');
            index = (index + 1) % slides.length;
            slides[index].classList.add('active');
        }, 4000);
    }

    // 3) CARROSSEL DE SERVIÇOS
    (function servicesCarousel() {
        const track = document.querySelector('.servicos-track');
        const prev = document.querySelector('.servicos-prev');
        const next = document.querySelector('.servicos-next');
        if (!track || !prev || !next) return;

        const originalCards = Array.from(track.children);
        if (!originalCards.length) return;

        if (!track.dataset.duplicated) {
            track.innerHTML = track.innerHTML + track.innerHTML;
            track.dataset.duplicated = 'true';
        }

        function computeUnitWidth() {
            const totalOriginalWidth = track.scrollWidth / 2;
            const n = originalCards.length;
            return totalOriginalWidth / n;
        }

        let pos = 0;
        const fullWidth = track.scrollWidth / 2;
        let unit = computeUnitWidth();

        function moveSteps(steps) {
            pos += -steps * unit;
            if (pos <= -fullWidth) pos += fullWidth;
            if (pos > 0) pos -= fullWidth;
            track.style.transition = 'transform 350ms ease';
            track.style.transform = `translateX(${pos}px)`;
        }

        prev.addEventListener('click', () => moveSteps(-1));
        next.addEventListener('click', () => moveSteps(1));

        window.addEventListener('resize', () => {
            unit = computeUnitWidth();
            pos = Math.round(pos / unit) * unit;
            track.style.transition = 'none';
            track.style.transform = `translateX(${pos}px)`;
            void track.offsetWidth;
            track.style.transition = '';
        });
    })();

    // 4) MARQUEES infinitos
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(m => {
        const track = m.querySelector('.marquee-track');
        if (!track) return;

        let left = 0;
        const direction = m.classList.contains('marquee-right') ? 1 : -1;
        const speed = 0.5;

        function animate() {
            left += speed * direction;
            const first = track.children[0];
            const gap = parseInt(window.getComputedStyle(track).gap) || 30;
            const firstWidth = first.offsetWidth + gap;

            if (direction < 0 && -left >= firstWidth) {
                track.appendChild(first);
                left += firstWidth;
            } else if (direction > 0 && left >= firstWidth) {
                track.insertBefore(track.lastElementChild, track.firstElementChild);
                left -= firstWidth;
            }

            track.style.transform = `translateX(${left}px)`;
            requestAnimationFrame(animate);
        }

        animate();

        // pausa on hover
        m.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        m.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    });

    // 5) Acessibilidade teclado
    const svcPrev = document.querySelector('.servicos-prev');
    const svcNext = document.querySelector('.servicos-next');
    if (svcPrev) svcPrev.addEventListener('keydown', (e) => { if (e.key === 'Enter') svcPrev.click(); });
    if (svcNext) svcNext.addEventListener('keydown', (e) => { if (e.key === 'Enter') svcNext.click(); });
});
