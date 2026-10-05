// ===== HELPERS =====
const isDesktop = () => window.matchMedia('(min-width: 861px)').matches

// ===== TERMINAL ANIMATION =====
const typeTarget  = document.getElementById('typeTarget')
const termOutput  = document.getElementById('termOutput')
const termCursor  = document.getElementById('termCursor')
const CMD = 'whoami --json'

let charIdx = 0
function typeChar() {
    if (charIdx < CMD.length) {
        typeTarget.textContent += CMD[charIdx++]
        setTimeout(typeChar, 65 + Math.random() * 40)
    } else {
        // hide cursor briefly then show output
        setTimeout(() => {
            termCursor.style.display = 'none'
            termOutput.classList.add('visible')
        }, 400)
    }
}
// Start after a short delay
setTimeout(typeChar, 900)

// ===== NAVBAR =====
const navbar   = document.getElementById('navbar')
const hamburger = document.getElementById('hamburger')
const navLinks  = document.querySelector('.nav-links')

window.addEventListener('scroll', () => {
    const scrolled = isDesktop() ? window.scrollX > 20 : window.scrollY > 20
    navbar.classList.toggle('scrolled', scrolled)
    updateActiveLink()
}, { passive: true })

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open')
    const icon = hamburger.querySelector('i')
    icon.classList.toggle('bx-menu')
    icon.classList.toggle('bx-x')
})

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open')
        const icon = hamburger.querySelector('i')
        icon.classList.add('bx-menu')
        icon.classList.remove('bx-x')
    })
})

// ===== ACTIVE NAV ON SCROLL =====
function updateActiveLink() {
    const sections   = document.querySelectorAll('section[id]')
    const horizontal = isDesktop()
    const pos = (horizontal ? window.scrollX : window.scrollY) + 100

    sections.forEach(sec => {
        const start = horizontal ? sec.offsetLeft : sec.offsetTop
        const size  = horizontal ? sec.offsetWidth : sec.offsetHeight
        const link  = document.querySelector(`.nav-link[href="#${sec.id}"]`)
        if (link) {
            link.classList.toggle('active', pos >= start && pos < start + size)
        }
    })
}

// ===== WHEEL → HORIZONTAL SCROLL (desktop) =====
window.addEventListener('wheel', e => {
    if (!isDesktop()) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault()
        let delta = e.deltaY
        if (e.deltaMode === 1) delta *= 16
        else if (e.deltaMode === 2) delta *= window.innerHeight
        window.scrollBy({ left: delta * 3.5, behavior: 'auto' })
    }
}, { passive: false })

// ===== FORMSPREE =====
const contactForm = document.getElementById('contactForm')
const formStatus  = document.getElementById('formStatus')

if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault()
        const btn = contactForm.querySelector('button[type="submit"]')
        btn.disabled = true
        btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Envoi…'
        formStatus.textContent = ''
        formStatus.className = 'form-note'

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
            if (res.ok) {
                formStatus.textContent = '✓ Message envoyé !'
                formStatus.className   = 'form-note success'
                contactForm.reset()
            } else {
                const json = await res.json()
                formStatus.textContent = '✗ ' + (json.errors?.map(e => e.message).join(', ') || 'Erreur, réessayez.')
                formStatus.className   = 'form-note error'
            }
        } catch {
            formStatus.textContent = '✗ Erreur réseau.'
            formStatus.className   = 'form-note error'
        }

        btn.disabled = false
        btn.innerHTML = '<i class="bx bx-send"></i> Envoyer'
    })
}
