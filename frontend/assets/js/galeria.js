(() => {
    const TOTAL      = 4;
    const INTERVAL   = 2000; // ms entre slides automáticos

    const slider    = document.querySelector('.galeria__slider');
    if (!slider) return;

    const track     = slider.querySelector('.galeria__track');
    const counter   = slider.querySelector('.galeria__counter');
    const btnPrev   = slider.querySelector('.galeria__btn-prev');
    const btnNext   = slider.querySelector('.galeria__btn-next');
    const btnPause  = slider.querySelector('.galeria__btn-pause');
    const iconPause = btnPause.querySelector('.galeria__icon-pause');
    const iconPlay  = btnPause.querySelector('.galeria__icon-play');
    const dots      = Array.from(document.querySelectorAll('.galeria__dots .galeria__dot'));
    const slides    = Array.from(slider.querySelectorAll('.galeria__slide'));

    let current   = 0;
    let paused    = false;
    let timer     = null;

    function goTo(index) {
        // Desactiva slide anterior
        slides[current].classList.remove('is-active');
        dots[current].classList.remove('is-active');

        current = (index + TOTAL) % TOTAL;

        // Activa nuevo slide
        slides[current].classList.add('is-active');
        dots[current].classList.add('is-active');

        // Mueve el track: cada slide ocupa un 25% del track (track es 400%)
        track.style.transform = `translateX(-${current * 25}%)`;

        // Actualiza el contador
        counter.textContent = `${current + 1} / ${TOTAL}`;
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    function togglePause() {
        paused = !paused;
        if (paused) {
            stopTimer();
            iconPause.hidden = true;
            iconPlay.hidden  = false;

            // iconPause = querySelector('.galeria__icon-pause');
            // iconPause.style.display = 'none';

            btnPause.setAttribute('aria-label', 'Reanudar reproducción');
        } else {
            startTimer();
            iconPause.hidden = false;
            iconPlay.hidden  = true;
            btnPause.setAttribute('aria-label', 'Pausar reproducción');
        }
    }

    // ── Eventos de los botones ──────────────────────────────────────────
    btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(current - 1);
        if (!paused) startTimer(); // reinicia el intervalo para no saltar rápido
    });

    btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(current + 1);
        if (!paused) startTimer();
    });

    btnPause.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePause();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goTo(i);
            if (!paused) startTimer();
        });
    });

    // ── Pausa al mantener el mouse dentro del slider ────────────────────
    slider.addEventListener('mouseenter', () => {
        if (!paused) stopTimer();
    });

    slider.addEventListener('mouseleave', () => {
        if (!paused) startTimer();
    });

    // ── Teclado: flechas izquierda / derecha cuando el slider tiene foco ─
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goTo(current - 1);
            if (!paused) startTimer();
        } else if (e.key === 'ArrowRight') {
            goTo(current + 1);
            if (!paused) startTimer();
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            togglePause();
        }
    });

    // ── Inicialización ──────────────────────────────────────────────────
    goTo(0);
    startTimer();
})();
