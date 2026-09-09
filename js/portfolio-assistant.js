(function() {
    'use strict';

    var root = document.getElementById('portfolio-assistant');
    if (!root) return;

    var launcher = document.getElementById('portfolio-assistant-launcher');
    var panel = document.getElementById('portfolio-assistant-panel');
    var closeButton = document.getElementById('portfolio-assistant-close');
    var resetButton = document.getElementById('portfolio-assistant-reset');
    var form = document.getElementById('portfolio-assistant-form');
    var input = document.getElementById('portfolio-assistant-input');
    var sendButton = form.querySelector('.portfolio-assistant-send');
    var messages = document.getElementById('portfolio-assistant-messages');
    var suggestions = document.getElementById('portfolio-assistant-suggestions');
    var status = root.querySelector('.portfolio-assistant-status span');
    var endpointMeta = document.querySelector('meta[name="portfolio-ai-endpoint"]');
    var endpoint = endpointMeta ? endpointMeta.content.trim() : '';
    var history = [];
    var context = null;
    var pending = false;
    var sessionId = createSessionId();

    function createSessionId() {
        var storageKey = 'portfolio-assistant-session';
        try {
            var existing = window.sessionStorage.getItem(storageKey);
            if (existing) return existing;
            var generated = window.crypto && typeof window.crypto.randomUUID === 'function'
                ? window.crypto.randomUUID()
                : 'session-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
            window.sessionStorage.setItem(storageKey, generated);
            return generated;
        } catch (error) {
            return 'session-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
        }
    }

    function t(key) {
        return window.portfolioI18n ? window.portfolioI18n.t(key) : key;
    }

    function language() {
        return document.documentElement.lang === 'es' ? 'es' : 'en';
    }

    function addMessage(text, role, extraClass) {
        var item = document.createElement('div');
        item.className = 'portfolio-assistant-message is-' + role + (extraClass ? ' ' + extraClass : '');
        item.textContent = text;
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
        return item;
    }

    function addTypingIndicator() {
        var item = document.createElement('div');
        var dots = document.createElement('span');
        item.className = 'portfolio-assistant-message is-assistant';
        item.dataset.typing = 'true';
        dots.className = 'portfolio-assistant-typing';
        dots.setAttribute('aria-label', language() === 'es' ? 'Escribiendo' : 'Typing');
        dots.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
        item.appendChild(dots);
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
        return item;
    }

    function renderSuggestions() {
        suggestions.replaceChildren();
        [
            'assistant.suggestionOne',
            'assistant.suggestionTwo',
            'assistant.suggestionThree',
            'assistant.suggestionFour',
            'assistant.suggestionFive',
            'assistant.suggestionSix'
        ].forEach(function(key) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'portfolio-assistant-suggestion';
            button.textContent = t(key);
            button.addEventListener('click', function() {
                input.value = button.textContent;
                resizeInput();
                form.requestSubmit();
            });
            suggestions.appendChild(button);
        });
    }

    function resetConversation() {
        history = [];
        messages.replaceChildren();
        addMessage(t('assistant.welcome'), 'assistant', 'is-welcome');
        renderSuggestions();
    }

    function updateInterfaceLanguage() {
        input.placeholder = t('assistant.placeholder');
        launcher.setAttribute('aria-label', t('assistant.open'));
        launcher.title = t('assistant.open');
        closeButton.setAttribute('aria-label', t('assistant.close'));
        closeButton.title = t('assistant.close');
        resetButton.setAttribute('aria-label', t('assistant.clear'));
        resetButton.title = t('assistant.clear');
        sendButton.setAttribute('aria-label', t('assistant.send'));
        sendButton.title = t('assistant.send');
        status.textContent = endpoint ? t('assistant.onlineStatus') : t('assistant.localStatus');
        var welcome = messages.querySelector('.is-welcome');
        if (!history.length && welcome) {
            welcome.textContent = t('assistant.welcome');
            renderSuggestions();
        } else if (!messages.children.length) {
            resetConversation();
        } else {
            renderSuggestions();
        }
    }

    function setOpen(open, restoreLauncherFocus) {
        root.classList.toggle('is-open', open);
        panel.hidden = !open;
        launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            window.setTimeout(function() { input.focus(); }, 60);
        } else if (restoreLauncherFocus !== false) {
            launcher.focus();
        }
    }

    function resizeInput() {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 130) + 'px';
    }

    function normalize(value) {
        return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function projectNames() {
        if (!context || !Array.isArray(context.projects)) {
            return 'Proyecto Prisma, TS Network CRM, The Breakers Plaza CRM, Ferreteria Mendez, Urbana Studios';
        }
        return context.projects.slice(0, 6).map(function(project) { return project.name; }).join(', ');
    }

    function localAnswer(question) {
        var query = normalize(question);
        var spanish = language() === 'es';

        if (/contact|email|correo|linkedin|github|contratar|mensaje|message|propuesta|proposal/.test(query)) {
            return spanish
                ? 'La forma más directa es usar el botón “Dejame un mensaje” en la sección de contacto. También podés copiar su email, visitar LinkedIn o revisar sus repositorios en GitHub.'
                : 'The most direct option is the “Leave a message” button in the Contact section. You can also copy his email, visit LinkedIn, or review his GitHub repositories.';
        }

        if (/available|availability|disponible|disponibilidad|oportunidad/.test(query)) {
            return spanish
                ? 'Sí. Federico está abierto a nuevas oportunidades, tanto freelance como dentro de una empresa. Tiene disponibilidad para trabajar remotamente, viajar o reubicarse por una propuesta laboral.'
                : 'Yes. Federico is open to new opportunities, both freelance and within a company. He is available to work remotely, travel, or relocate for the right role.';
        }
        if (/remot|presencial|on.?site|hibrid|hybrid|reubicar|relocat|viajar|travel/.test(query)) {
            return spanish
                ? 'Puede trabajar de forma remota, presencial o híbrida. También está dispuesto a viajar o reubicarse por una oportunidad laboral.'
                : 'He can work remotely, on-site, or in a hybrid role. He is also willing to travel or relocate for a work opportunity.';
        }
        if (/freelance|empresa|company|contract|contrato/.test(query)) {
            return spanish
                ? 'Trabaja tanto con clientes freelance como con empresas. Está abierto a proyectos puntuales, colaboraciones y puestos dentro de una organización.'
                : 'He works with both freelance clients and companies. He is open to individual projects, collaborations, and roles within an organization.';
        }
        if (/\bia\b|inteligencia artificial|artificial intelligence|ai agent|agente/.test(query)) {
            return spanish
                ? 'Sí. Federico desarrolla agentes de IA, automatizaciones y herramientas que integran modelos de inteligencia artificial con sistemas empresariales, APIs y flujos de trabajo.'
                : 'Yes. Federico builds AI agents, automations, and tools that integrate artificial intelligence models with business systems, APIs, and workflows.';
        }
        if (/tecnolog|stack|lenguaje|react|python|node|flask|database|base de datos/.test(query)) {
            return spanish
                ? 'Su stack principal combina React, TypeScript y Tailwind CSS en frontend; Python, Flask, Node.js, Express y Next.js en backend; además de SQL, NoSQL, AWS, Cloudflare, Proxmox, Prisma, Pandas, NumPy y Docker.'
                : 'His main stack combines React, TypeScript, and Tailwind CSS on the frontend; Python, Flask, Node.js, Express, and Next.js on the backend; plus SQL, NoSQL, AWS, Cloudflare, Proxmox, Prisma, Pandas, NumPy, and Docker.';
        }
        if (/proyecto|project|crm|prisma|ferreter|urbana|esport|simracing/.test(query)) {
            var names = projectNames();
            return spanish
                ? 'Entre sus proyectos se destacan ' + names + '. Incluyen CRM multirol, sistemas de gestión empresarial, automatización con IA, analítica y sitios web orientados a conversión.'
                : 'Highlighted projects include ' + names + '. They cover multi-role CRMs, business management systems, AI automation, analytics, and conversion-focused websites.';
        }
        if (/experiencia|experience|trabajo|work|empresa|role|rol/.test(query)) {
            return spanish
                ? 'Federico trabaja como Founder & CTO de Proyecto Prisma y como Software Engineer y Database Administrator para empresas de Texas. Su experiencia se centra en sistemas empresariales, APIs, bases de datos y automatización.'
                : 'Federico works as Founder & CTO of Proyecto Prisma and as a Software Engineer and Database Administrator for Texas-based companies. His experience focuses on business systems, APIs, databases, and automation.';
        }
        if (/educacion|education|titulo|degree|ingles|english/.test(query)) {
            return spanish
                ? 'Es Analista y Programador de Sistemas y cuenta con formación de inglés comunicacional nivel B2.'
                : 'He holds a degree in Systems Analysis and Programming and has B2-level communicational English training.';
        }
        if (/que (hace|desarrolla)|what.*(build|do)|servicio|service|sistema/.test(query)) {
            return spanish
                ? 'Federico diseña, desarrolla, prueba y despliega sistemas full-stack: CRM, plataformas de gestión, APIs REST, automatizaciones, agentes de IA, bases de datos y sitios adaptados para computadoras, tablets y celulares.'
                : 'Federico designs, develops, tests, and deploys full-stack systems: CRMs, management platforms, REST APIs, automation, AI agents, databases, and responsive websites.';
        }
        return spanish
            ? 'Puedo ayudarte con información sobre los proyectos, experiencia, stack tecnológico, formación o formas de contacto de Federico. La IA online se habilitará cuando conectemos el Worker de Cloudflare.'
            : 'I can help with Federico\'s projects, experience, technology stack, education, or contact options. Online AI will be enabled once the Cloudflare Worker is connected.';
    }

    async function requestAnswer(question) {
        if (!endpoint) return localAnswer(question);

        var response = await fetch(endpoint.replace(/\/$/, '') + '/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: question,
                history: history.slice(-6),
                language: language(),
                sessionId: sessionId,
                historyVersion: 'persistent-v1'
            })
        });
        if (!response.ok) throw new Error('Assistant request failed: ' + response.status);
        var data = await response.json();
        if (!data || typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('Invalid assistant response');
        return data.answer.trim();
    }

    async function submitQuestion(event) {
        event.preventDefault();
        if (pending) return;
        var question = input.value.trim();
        if (!question) {
            input.focus();
            return;
        }

        pending = true;
        input.value = '';
        resizeInput();
        input.disabled = true;
        sendButton.disabled = true;
        suggestions.hidden = true;
        addMessage(question, 'user');
        var typing = addTypingIndicator();

        try {
            var answer = await requestAnswer(question);
            typing.remove();
            addMessage(answer, 'assistant');
            history.push({ role: 'user', content: question }, { role: 'assistant', content: answer });
            history = history.slice(-6);
        } catch (error) {
            typing.remove();
            addMessage(t('assistant.error'), 'assistant', 'is-error');
        } finally {
            pending = false;
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    }

    launcher.addEventListener('click', function() { setOpen(true); });
    closeButton.addEventListener('click', function() { setOpen(false); });
    resetButton.addEventListener('click', resetConversation);
    form.addEventListener('submit', submitQuestion);
    input.addEventListener('input', resizeInput);
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && root.classList.contains('is-open')) setOpen(false);
    });
    document.addEventListener('pointerdown', function(event) {
        if (root.classList.contains('is-open') && !root.contains(event.target)) {
            setOpen(false, false);
        }
    });
    document.addEventListener('portfolio:languagechange', updateInterfaceLanguage);
    document.addEventListener('portfolio:assistantopen', function() {
        setOpen(true);
    });

    fetch('data/portfolio-context.json?v=20260908-contact-language')
        .then(function(response) { return response.ok ? response.json() : null; })
        .then(function(data) { context = data; })
        .catch(function() { context = null; });

    updateInterfaceLanguage();
})();
