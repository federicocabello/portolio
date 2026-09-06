(function() {
    'use strict';

    var STORAGE_KEY = 'portfolio-language';
    var supportedLanguages = ['en', 'es'];
    var htmlKeys = new Set([
        'hero.description',
        'sections.projects.title',
        'sections.experience.title',
        'sections.skills.title',
        'sections.education.title',
        'sections.contact.title',
        'footer.copy'
    ]);

    var messages = {
        en: {
            'nav.about': 'About me',
            'nav.aboutShort': 'About',
            'nav.projects': 'Projects',
            'nav.experience': 'Work experience',
            'nav.experienceShort': 'Experience',
            'nav.skills': 'Tech Stack',
            'nav.education': 'Education',
            'nav.contact': 'Contact',
            'language.english': 'English',
            'language.spanish': 'Spanish',
            'hero.title': "Hello! I'm Federico.",
            'hero.description': '<p>As a <span class="hero-role-highlight">Software Engineer</span>, I specialize in building <strong class="hero-key-highlight">full-stack systems</strong> with <span class="hero-tech-inline" style="--inline-tech-color:#61DAFB"><i class="iconify" data-icon="simple-icons:react" aria-hidden="true"></i>React</span>, <span class="hero-tech-inline" style="--inline-tech-color:#66B2FF"><i class="iconify" data-icon="simple-icons:python" aria-hidden="true"></i>Python</span>, <span class="hero-tech-inline" style="--inline-tech-color:#68A063"><i class="iconify" data-icon="fontisto:nodejs" aria-hidden="true"></i>Node.js</span>, and <span class="hero-tech-inline" style="--inline-tech-color:#D5D9E0"><i class="iconify" data-icon="simple-icons:flask" aria-hidden="true"></i>Flask</span>, as well as <span class="hero-tech-inline" style="--inline-tech-color:#73B6E6"><i class="fas fa-database" aria-hidden="true"></i>database design and administration</span>. I have hands-on experience creating <strong class="hero-key-highlight">solutions for businesses</strong> and providing <strong class="hero-key-highlight">commercial guidance</strong> on how technology can improve operations, such as <strong class="hero-key-highlight">AI agents</strong> and <strong class="hero-key-highlight">management platforms</strong> for analyzing financial data, products, customers, and employees, with several of these systems currently being used in real-world environments.</p><p>My skills are complemented by <span class="hero-tech-inline" style="--inline-tech-color:#4C9CEB"><i class="iconify" data-icon="simple-icons:typescript" aria-hidden="true"></i>TypeScript</span>, <span class="hero-tech-inline" style="--inline-tech-color:#59B86A"><i class="iconify" data-icon="simple-icons:django" aria-hidden="true"></i>Django</span>, and <span class="hero-tech-inline" style="--inline-tech-color:#FFB33B"><i class="iconify" data-icon="simple-icons:amazonaws" aria-hidden="true"></i>AWS</span>, which I have used across different projects to expand and support the solutions I build.</p>',
            'hero.open': 'Open to new opportunities',
            'hero.capabilities.aiTools': 'AI Tools',
            'hero.capabilities.businessSystems': 'Business Management Systems',
            'hero.capabilities.crm': 'CRM Systems',
            'hero.capabilities.restApis': 'REST APIs',
            'hero.capabilities.cloud': 'Cloud Deployment',
            'hero.capabilities.appDevelopment': 'Application Development',
            'hero.capabilities.databases': 'Database Design & Management',
            'hero.capabilities.dataAnalysis': 'Data Analysis',
            'hero.capabilities.automation': 'Automation & Integration',
            'hero.capabilities.responsiveWebsites': 'Responsive Websites',
            'actions.viewCv': 'View CV',
            'actions.copy': 'Copy',
            'actions.copied': 'Copied!',
            'actions.emailCopied': 'Email copied',
            'actions.location': 'Go to location',
            'actions.linkedinProfile': 'Go to Profile',
            'actions.githubRepository': 'Go to Repository',
            'assistant.title': "Federico's AI Agent",
            'assistant.launcherTitle': "Federico's AI Agent",
            'assistant.launcherHint': 'Hello! Ask me something',
            'assistant.localStatus': 'Local preview',
            'assistant.onlineStatus': 'AI assistant online',
            'assistant.open': 'Open AI assistant',
            'assistant.close': 'Close assistant',
            'assistant.clear': 'Clear conversation',
            'assistant.send': 'Send question',
            'assistant.inputLabel': 'Question about Federico',
            'assistant.placeholder': 'Ask about experience, projects or skills...',
            'assistant.welcome': "Hi! I can answer concise questions about Federico's experience, projects, technologies, and education.",
            'assistant.suggestionOne': 'What does he build?',
            'assistant.suggestionTwo': 'Does he build AI?',
            'assistant.suggestionThree': 'Is he available?',
            'assistant.suggestionFour': 'How can I contact him?',
            'assistant.suggestionFive': 'Remote or on-site?',
            'assistant.suggestionSix': 'Freelance or company?',
            'assistant.error': 'I could not answer right now. Please try again in a moment.',
            'assistant.empty': 'Write a question before sending it.',
            'sections.projects.title': 'Selected<br><em>Projects</em>',
            'sections.projects.description': 'Explore my work by solution type.',
            'sections.experience.title': 'Work<br><em>Experience</em>',
            'sections.experience.description': 'A concise overview of the roles, responsibilities, and results that shaped my professional journey.',
            'sections.skills.title': 'Skills &<br><em>Tech Stack</em>',
            'sections.skills.description': 'Core technologies I use to build projects, applications, APIs, databases, and business systems.',
            'sections.education.title': 'Formation &<br><em>Education</em>',
            'sections.education.description': 'A summary of my formal education and language training.',
            'sections.contact.title': 'Contact<br><em>Me</em>',
            'sections.contact.description': 'Let us build new paths together!',
            'skills.languages': 'Languages',
            'skills.frontend': 'Frontend',
            'skills.backend': 'Backend',
            'skills.dataCloud': 'Data, Cloud & Tools',
            'experience.responsibilities': 'Responsibilities',
            'experience.problems': 'Problems solved',
            'experience.impact': 'Impact',
            'experience.1.type': 'Independent software venture / Digital services',
            'experience.1.period': 'January 2026 - Present',
            'experience.1.role': 'Founder & CTO',
            'experience.1.location': 'Hybrid / San Rafael, Mendoza, Argentina',
            'experience.1.responsibilities': 'Run an independent venture offering technology guidance, landing pages, and custom business systems.',
            'experience.1.problems': 'Help clients define digital needs and replace manual processes with tailored software solutions.',
            'experience.1.impact': 'Created practical demos and production tools that make technology easier to evaluate and adopt.',
            'experience.2.type': 'Local business software / Web services',
            'experience.2.period': 'January 2024 - Present',
            'experience.2.role': 'Software Engineer',
            'experience.2.location': 'Remote / Brownsville, Texas, USA',
            'experience.2.responsibilities': 'Develop and maintain business systems and websites offered by the company to local clients.',
            'experience.2.problems': 'Translate regional business needs into maintainable platforms, websites, and connected digital processes.',
            'experience.2.impact': "Expanded the company's digital service offering and supported more efficient client operations.",
            'experience.3.type': 'Database administration / Business systems',
            'experience.3.period': 'January 2024 - Present',
            'experience.3.role': 'Database Administrator',
            'experience.3.location': 'Remote / Brownsville, Texas, USA',
            'experience.3.responsibilities': 'Design, administer, and maintain databases for customer, financial, and internal management systems.',
            'experience.3.problems': 'Organize critical business records and reduce inconsistencies across connected company platforms.',
            'experience.3.impact': 'Improved data integrity, availability, and reliability for daily operations and financial control.',
            'experience.4.type': 'Desktop software / Inventory and sales',
            'experience.4.period': 'January - December 2023',
            'experience.4.role': 'Software Developer',
            'experience.4.location': 'Hybrid / San Rafael, Mendoza, Argentina',
            'experience.4.responsibilities': "Designed and developed PICAR's desktop system for products, stock, sales, clients, and suppliers.",
            'experience.4.problems': 'Replaced manual inventory and administrative records with a centralized workflow built for the company.',
            'experience.4.impact': 'Improved stock visibility, sales control, billing organization, and everyday administration.',
            'experience.5.type': 'Early independent work / APIs and software',
            'experience.5.period': 'August - December 2022',
            'experience.5.role': 'Independent Software Developer',
            'experience.5.location': 'Hybrid / San Rafael, Mendoza, Argentina',
            'experience.5.responsibilities': 'Developed REST APIs and small software products as my first independent commercial offering.',
            'experience.5.problems': 'Turned early client ideas into focused scopes, functional prototypes, and practical applications.',
            'experience.5.impact': 'Established my first service portfolio and strengthened client communication and software delivery.',
            'education.higher': 'Higher Education',
            'education.degree': 'Advanced Technical Training Course in Systems Analysis and Programming',
            'education.period': 'Feb 2018 - Dec 2021',
            'education.degreeType': 'University degree',
            'education.languageType': 'Language Education',
            'education.english': 'English',
            'education.training': 'Language Training',
            'education.level': 'Level B2',
            'education.institute': 'Private Teaching Institute I.C.A.A.',
            'education.course': 'Intensive Communicational English Course - Level B2',
            'education.graduated': 'Graduated in 2022',
            'education.communicational': 'Communicational English',
            'contact.message': 'Let us explore new projects together to grow both professionally and personally. I am here for you!',
            'footer.copy': 'Made with code and coffee by Federico Cabello &copy; <span id="current-year"></span> - Always learning, always coding.',
            'projects.groupsLabel': 'Project categories',
            'projects.groups.crm': 'CRM',
            'projects.groups.business': 'Business Management Systems',
            'projects.groups.automation': 'Automation & AI',
            'projects.groups.landing': 'Landing Pages',
            'projects.groups.additional': 'Additional Projects',
            'projects.mainFunctions': 'Main functions',
            'projects.whatSolved': 'What it solved',
            'projects.howSolved': 'How it was solved',
            'projects.impact': 'Impact',
            'projects.technologies': 'Technologies used',
            'projects.demoStatus': 'Demo status',
            'projects.viewCase': 'View case study',
            'projects.collapseCase': 'Collapse case study',
            'projects.repository': 'Repository',
            'projects.openRepository': 'Open repository',
            'projects.visitWebsite': 'Visit website',
            'projects.openWebsite': 'Open website',
            'projects.publicWebsite': 'Public website',
            'projects.publicWebsiteDescription': 'Explore the live preview or open the website in a new tab.',
            'projects.previewPending': 'Preview being prepared',
            'projects.previewPendingDescription': 'Screenshots or a public project link will be added when they are available.',
            'projects.previousImage': 'Previous image',
            'projects.nextImage': 'Next image',
            'projects.closeGallery': 'Close gallery',
            'projects.imageOf': 'Image {current} of {total}',
            'projects.livePreview': 'Live preview of {project}',
            'projects.coverAlt': '{project} project cover',
            'projects.openInTab': 'Open {project} in a new tab',
            'access.languageSelector': 'Language selector',
            'access.viewEnglish': 'View site in English',
            'access.viewSpanish': 'View site in Spanish',
            'access.argentinaFlag': 'Argentina flag',
            'access.mainServices': 'Main services',
            'access.technologyGroups': 'Technology groups',
            'access.copyEmail': 'Copy email address',
            'access.location': 'Open Argentina location in Google Maps',
            'access.backAbout': 'Back to About Me',
            'access.enlargeDiploma': 'Enlarge university diploma',
            'access.closeDiploma': 'Close diploma preview',
            'access.diplomaDialog': 'University diploma preview',
            'years.one': '{years} year',
            'years.many': '{years} years',
            'years.monthOne': '{months} month',
            'years.monthMany': '{months} months',
            'years.separator': ' and ',
            'years.lessMonth': 'Less than 1 month'
        },
        es: {
            'nav.about': 'Sobre mí',
            'nav.aboutShort': 'Sobre mí',
            'nav.projects': 'Proyectos',
            'nav.experience': 'Experiencia laboral',
            'nav.experienceShort': 'Experiencia',
            'nav.skills': 'Stack tecnológico',
            'nav.education': 'Educación',
            'nav.contact': 'Contacto',
            'language.english': 'Inglés',
            'language.spanish': 'Español',
            'hero.title': 'Hola! Soy Federico.',
            'hero.description': '<p>Como <span class="hero-role-highlight">Ingeniero de Software</span>, me especializo en desarrollar <strong class="hero-key-highlight">sistemas full-stack</strong> con <span class="hero-tech-inline" style="--inline-tech-color:#61DAFB"><i class="iconify" data-icon="simple-icons:react" aria-hidden="true"></i>React</span>, <span class="hero-tech-inline" style="--inline-tech-color:#66B2FF"><i class="iconify" data-icon="simple-icons:python" aria-hidden="true"></i>Python</span>, <span class="hero-tech-inline" style="--inline-tech-color:#68A063"><i class="iconify" data-icon="fontisto:nodejs" aria-hidden="true"></i>Node.js</span> y <span class="hero-tech-inline" style="--inline-tech-color:#D5D9E0"><i class="iconify" data-icon="simple-icons:flask" aria-hidden="true"></i>Flask</span>, además del <span class="hero-tech-inline" style="--inline-tech-color:#73B6E6"><i class="fas fa-database" aria-hidden="true"></i>diseño y administración de bases de datos</span>. Tengo experiencia práctica creando <strong class="hero-key-highlight">soluciones para empresas</strong> y brindando <strong class="hero-key-highlight">asesoría comercial</strong> sobre cómo la tecnología puede mejorar sus operaciones, mediante <strong class="hero-key-highlight">agentes de IA</strong> y <strong class="hero-key-highlight">plataformas de gestión</strong> para analizar datos financieros, productos, clientes y empleados. Varios de estos sistemas se utilizan actualmente en entornos reales.</p><p>Complemento estas habilidades con <span class="hero-tech-inline" style="--inline-tech-color:#4C9CEB"><i class="iconify" data-icon="simple-icons:typescript" aria-hidden="true"></i>TypeScript</span>, <span class="hero-tech-inline" style="--inline-tech-color:#59B86A"><i class="iconify" data-icon="simple-icons:django" aria-hidden="true"></i>Django</span> y <span class="hero-tech-inline" style="--inline-tech-color:#FFB33B"><i class="iconify" data-icon="simple-icons:amazonaws" aria-hidden="true"></i>AWS</span>, tecnologías que utilicé en distintos proyectos para ampliar y respaldar las soluciones que desarrollo.</p>',
            'hero.open': 'Abierto a nuevas oportunidades',
            'hero.capabilities.aiTools': 'Herramientas de IA',
            'hero.capabilities.businessSystems': 'Sistemas de gestión empresarial',
            'hero.capabilities.crm': 'Sistemas CRM',
            'hero.capabilities.restApis': 'APIs REST',
            'hero.capabilities.cloud': 'Despliegue en la nube',
            'hero.capabilities.appDevelopment': 'Desarrollo de aplicaciones',
            'hero.capabilities.databases': 'Diseño y gestión de bases de datos',
            'hero.capabilities.dataAnalysis': 'Análisis de datos',
            'hero.capabilities.automation': 'Automatización e integración',
            'hero.capabilities.responsiveWebsites': 'Sitios web responsive',
            'actions.viewCv': 'Ver CV',
            'actions.copy': 'Copiar',
            'actions.copied': '¡Copiado!',
            'actions.emailCopied': 'Correo copiado',
            'actions.location': 'Ir a mi ubicación',
            'actions.linkedinProfile': 'Ir al perfil',
            'actions.githubRepository': 'Ir al repositorio',
            'assistant.title': 'Agente IA de Federico',
            'assistant.launcherTitle': 'Agente IA de Federico',
            'assistant.launcherHint': '¡Hola! Preguntame algo',
            'assistant.localStatus': 'Vista local',
            'assistant.onlineStatus': 'Asistente IA en línea',
            'assistant.open': 'Abrir asistente de IA',
            'assistant.close': 'Cerrar asistente',
            'assistant.clear': 'Limpiar conversación',
            'assistant.send': 'Enviar pregunta',
            'assistant.inputLabel': 'Pregunta sobre Federico',
            'assistant.placeholder': 'Preguntá sobre experiencia, proyectos o tecnologías...',
            'assistant.welcome': '¡Hola! Puedo responder preguntas breves sobre la experiencia, los proyectos, las tecnologías y la formación de Federico.',
            'assistant.suggestionOne': '¿Qué sistemas desarrolla?',
            'assistant.suggestionTwo': '¿Programa con IA?',
            'assistant.suggestionThree': '¿Tiene disponibilidad?',
            'assistant.suggestionFour': '¿Cómo puedo contactarlo?',
            'assistant.suggestionFive': '¿Remoto o presencial?',
            'assistant.suggestionSix': '¿Freelance o empresa?',
            'assistant.error': 'No pude responder en este momento. Intentá nuevamente en unos segundos.',
            'assistant.empty': 'Escribí una pregunta antes de enviarla.',
            'sections.projects.title': 'Proyectos<br><em>Seleccionados</em>',
            'sections.projects.description': 'Explorá mi trabajo según el tipo de solución.',
            'sections.experience.title': 'Experiencia<br><em>Laboral</em>',
            'sections.experience.description': 'Un resumen de los roles, responsabilidades y resultados que marcaron mi recorrido profesional.',
            'sections.skills.title': 'Habilidades y<br><em>Stack tecnológico</em>',
            'sections.skills.description': 'Tecnologías principales que utilizo para crear proyectos, aplicaciones, APIs, bases de datos y sistemas empresariales.',
            'sections.education.title': 'Formación y<br><em>Educación</em>',
            'sections.education.description': 'Un resumen de mi formación académica y capacitación en idiomas.',
            'sections.contact.title': 'Contactame',
            'sections.contact.description': '¡Construyamos nuevos caminos juntos!',
            'skills.languages': 'Lenguajes',
            'skills.frontend': 'Frontend',
            'skills.backend': 'Backend',
            'skills.dataCloud': 'Datos, nube y herramientas',
            'experience.responsibilities': 'Responsabilidades',
            'experience.problems': 'Problemas resueltos',
            'experience.impact': 'Impacto',
            'experience.1.type': 'Emprendimiento de software / Servicios digitales',
            'experience.1.period': 'Enero de 2026 - Actualidad',
            'experience.1.role': 'Fundador y CTO',
            'experience.1.location': 'Híbrido / San Rafael, Mendoza, Argentina',
            'experience.1.responsibilities': 'Dirijo un emprendimiento independiente que ofrece asesoría tecnológica, landing pages y sistemas empresariales a medida.',
            'experience.1.problems': 'Ayudo a definir necesidades digitales y reemplazar procesos manuales por soluciones de software personalizadas.',
            'experience.1.impact': 'Creé demos prácticos y herramientas productivas que facilitan evaluar y adoptar nuevas tecnologías.',
            'experience.2.type': 'Software empresarial local / Servicios web',
            'experience.2.period': 'Enero de 2024 - Actualidad',
            'experience.2.role': 'Ingeniero de Software',
            'experience.2.location': 'Remoto / Brownsville, Texas, EE. UU.',
            'experience.2.responsibilities': 'Desarrollo y mantengo sistemas empresariales y sitios web que la compañía ofrece a clientes locales.',
            'experience.2.problems': 'Transformo necesidades comerciales regionales en plataformas mantenibles, sitios web y procesos digitales conectados.',
            'experience.2.impact': 'Amplié la oferta de servicios digitales y contribuí a mejorar las operaciones de sus clientes.',
            'experience.3.type': 'Administración de bases de datos / Sistemas empresariales',
            'experience.3.period': 'Enero de 2024 - Actualidad',
            'experience.3.role': 'Administrador de Bases de Datos',
            'experience.3.location': 'Remoto / Brownsville, Texas, EE. UU.',
            'experience.3.responsibilities': 'Diseño, administro y mantengo bases de datos para sistemas de clientes, finanzas y gestión interna.',
            'experience.3.problems': 'Organizo registros críticos y reduzco inconsistencias entre las plataformas conectadas de la empresa.',
            'experience.3.impact': 'Mejoré la integridad, disponibilidad y confiabilidad de los datos utilizados en las operaciones diarias.',
            'experience.4.type': 'Software de escritorio / Inventario y ventas',
            'experience.4.period': 'Enero - Diciembre de 2023',
            'experience.4.role': 'Desarrollador de Software',
            'experience.4.location': 'Híbrido / San Rafael, Mendoza, Argentina',
            'experience.4.responsibilities': 'Diseñé y desarrollé el sistema de escritorio de PICAR para productos, stock, ventas, clientes y proveedores.',
            'experience.4.problems': 'Reemplacé registros manuales por un flujo centralizado diseñado específicamente para la empresa.',
            'experience.4.impact': 'Mejoré la visibilidad del stock, el control de ventas, la facturación y la administración cotidiana.',
            'experience.5.type': 'Primeros trabajos independientes / APIs y software',
            'experience.5.period': 'Agosto - Diciembre de 2022',
            'experience.5.role': 'Desarrollador de Software Independiente',
            'experience.5.location': 'Híbrido / San Rafael, Mendoza, Argentina',
            'experience.5.responsibilities': 'Desarrollé APIs REST y pequeños productos de software como mi primera oferta comercial independiente.',
            'experience.5.problems': 'Convertí ideas iniciales de clientes en alcances concretos, prototipos funcionales y aplicaciones prácticas.',
            'experience.5.impact': 'Construí mi primer portfolio de servicios y fortalecí la comunicación con clientes y la entrega de software.',
            'education.higher': 'Educación superior',
            'education.degree': 'Tecnicatura Superior en Análisis y Programación de Sistemas',
            'education.period': 'Feb 2018 - Dic 2021',
            'education.degreeType': 'Título universitario',
            'education.languageType': 'Formación en idiomas',
            'education.english': 'Inglés',
            'education.training': 'Capacitación en idiomas',
            'education.level': 'Nivel B2',
            'education.institute': 'Instituto Privado de Enseñanza I.C.A.A.',
            'education.course': 'Curso Intensivo de Inglés Comunicacional - Nivel B2',
            'education.graduated': 'Graduado en 2022',
            'education.communicational': 'Inglés comunicacional',
            'contact.message': 'Exploremos nuevos proyectos para crecer juntos, tanto profesional como personalmente. ¡Estoy para ayudarte!',
            'footer.copy': 'Hecho con código y café por Federico Cabello &copy; <span id="current-year"></span> - Siempre aprendiendo, siempre programando.',
            'projects.groupsLabel': 'Categorías de proyectos',
            'projects.groups.crm': 'CRM',
            'projects.groups.business': 'Sistemas de gestión empresarial',
            'projects.groups.automation': 'Automatización e IA',
            'projects.groups.landing': 'Landing pages',
            'projects.groups.additional': 'Proyectos adicionales',
            'projects.mainFunctions': 'Funciones principales',
            'projects.whatSolved': 'Qué resolvió',
            'projects.howSolved': 'Cómo se resolvió',
            'projects.impact': 'Impacto',
            'projects.technologies': 'Tecnologías utilizadas',
            'projects.demoStatus': 'Estado del demo',
            'projects.viewCase': 'Ver caso de estudio',
            'projects.collapseCase': 'Contraer caso de estudio',
            'projects.repository': 'Repositorio',
            'projects.openRepository': 'Abrir repositorio',
            'projects.visitWebsite': 'Visitar sitio',
            'projects.openWebsite': 'Abrir sitio web',
            'projects.publicWebsite': 'Sitio web público',
            'projects.publicWebsiteDescription': 'Explorá la vista en vivo o abrí el sitio en una nueva pestaña.',
            'projects.previewPending': 'Vista previa en preparación',
            'projects.previewPendingDescription': 'Las capturas o el enlace público se agregarán cuando estén disponibles.',
            'projects.previousImage': 'Imagen anterior',
            'projects.nextImage': 'Imagen siguiente',
            'projects.closeGallery': 'Cerrar galería',
            'projects.imageOf': 'Imagen {current} de {total}',
            'projects.livePreview': 'Vista en vivo de {project}',
            'projects.coverAlt': 'Portada del proyecto {project}',
            'projects.openInTab': 'Abrir {project} en una nueva pestaña',
            'access.languageSelector': 'Selector de idioma',
            'access.viewEnglish': 'Ver sitio en inglés',
            'access.viewSpanish': 'Ver sitio en español',
            'access.argentinaFlag': 'Bandera de Argentina',
            'access.mainServices': 'Servicios principales',
            'access.technologyGroups': 'Grupos de tecnologías',
            'access.copyEmail': 'Copiar dirección de correo',
            'access.location': 'Abrir ubicación de Argentina en Google Maps',
            'access.backAbout': 'Volver a Sobre mí',
            'access.enlargeDiploma': 'Ampliar título universitario',
            'access.closeDiploma': 'Cerrar vista del título',
            'access.diplomaDialog': 'Vista del título universitario',
            'years.one': '{years} año',
            'years.many': '{years} años',
            'years.monthOne': '{months} mes',
            'years.monthMany': '{months} meses',
            'years.separator': ' y ',
            'years.lessMonth': 'Menos de 1 mes'
        }
    };

    var projectTranslationsEs = {
        'breakers-plaza-crm': {
            category: 'CRM / Administración de condominios',
            summary: 'CRM condominial que centraliza residentes, cuotas de mantenimiento, reservas de espacios comunes, solicitudes de playa y trabajos de mantenimiento.',
            functions: 'Gestiona residentes y cuotas, sincroniza pagos con QuickBooks, valida la disponibilidad del SUM y registra solicitudes y tareas de mantenimiento.',
            problem: 'Los residentes, pagos, reservas y solicitudes se administraban por separado, generando pérdidas, conflictos de horarios y registros contables duplicados.',
            solution: 'Mapeé el flujo administrativo y desarrollé un sistema centralizado con sincronización de QuickBooks, reservas en tiempo real, solicitudes online y capacitación al personal.',
            impacts: ['100% de residentes centralizados', 'Sin conflictos de reservas', 'Un único registro contable', 'Solicitudes online'],
            demo: { title: 'Sistema privado', description: 'El acceso público no está disponible porque contiene datos sensibles de residentes, pagos, reservas y operaciones.' }
        },
        'breakers-plaza-website': {
            category: 'Landing page de lujo / Condominios',
            summary: 'Sitio elegante para un condominio frente al mar, diseñado para transmitir una identidad premium y conectar a los residentes con su portal privado.',
            functions: 'Presenta la propiedad y sus comodidades mediante una galería interactiva, muestra la ubicación y brinda acceso directo al CRM del condominio.',
            problem: 'The Breakers Plaza necesitaba una presencia digital refinada que representara su experiencia frente al mar y orientara a residentes y compradores.',
            solution: 'Creé una experiencia responsive con fotografías en alta resolución, tipografía elegante, galería optimizada, mapa integrado y acceso directo al CRM.',
            impacts: ['Presencia digital premium', 'Acceso directo para residentes', 'Exploración clara de la propiedad', 'Imágenes optimizadas']
        },
        'cactus-alojamientos': {
            category: 'Sitio de reservas / Alojamientos',
            summary: 'Plataforma responsive donde los huéspedes exploran alojamientos, comparan comodidades y precios, consultan disponibilidad y reservan sin crear una cuenta.',
            functions: 'Presenta propiedades, ubicaciones, tarifas y disponibilidad; gestiona solicitudes, avisos por email y la confirmación o rechazo desde administración.',
            problem: 'Los huéspedes necesitaban consultar fechas y reservar con rapidez, mientras la administración debía evitar superposiciones y centralizar los alojamientos.',
            solution: 'Desarrollé un calendario conectado a SQL con reservas sin cuenta, notificaciones SMTP y un panel para administrar propiedades, contenido y disponibilidad.',
            impacts: ['Reservas sin crear cuenta', 'Disponibilidad en tiempo real', 'Avisos automáticos por email', 'Control centralizado de reservas']
        },
        'cadpo-simracing': {
            name: 'Plataforma de Campeonatos de Esports',
            category: 'Liga de simracing / Tiempos en vivo y analítica',
            summary: 'Plataforma responsive que centraliza campeonatos, inscripciones, resultados históricos, estadísticas de pilotos, próximos eventos y tiempos en vivo.',
            functions: 'Publica calendarios, inscripciones, resultados, historia, tiempos y estadísticas, e incluye un panel autenticado para administrar la liga.',
            problem: 'Años de información estaban fragmentados y los datos crudos del servidor de tiempos eran difíciles de consultar, especialmente desde celulares.',
            solution: 'Construí una plataforma que transforma la API en una interfaz responsive, incorpora análisis histórico con Pandas y permite gestionar contenidos y eventos.',
            impacts: ['Tiempos de carrera en vivo', 'Acceso responsive', 'Análisis histórico de datos', 'Gestión centralizada de la liga']
        },
        'carlo-taboada-crm': {
            name: 'CRM del Estudio Jurídico Carlos Taboada',
            category: 'CRM jurídico / Gestión de casos',
            summary: 'CRM jurídico privado que organiza citas, notas de admisión, clientes, evaluación de casos y seguimiento para abogados y secretarios.',
            functions: 'Registra casos en recepción, agenda citas, almacena notas, facilita la revisión legal y acompaña cada caso aceptado hasta el contacto y seguimiento.',
            problem: 'El estudio necesitaba recibir consultas, evaluar requisitos, asignar casos y resguardar información sensible dentro de un proceso seguro.',
            solution: 'Desarrollé un sistema por roles donde secretarios registran consultas y abogados evalúan casos migratorios, penales y de otras áreas antes de continuar.',
            impacts: ['Admisión de casos estructurada', 'Revisión legal por roles', 'Citas centralizadas', 'Seguimiento trazable'],
            demo: { title: 'Sistema jurídico privado', description: 'El acceso público está restringido porque contiene casos y datos de clientes protegidos por privacidad, secreto profesional y requisitos legales.' }
        },
        'cell-repair': {
            name: 'Sistema de Seguimiento de Reparaciones',
            category: 'Aplicación de escritorio / Seguimiento de reparaciones',
            summary: 'Sistema que registra clientes, teléfonos, fechas, fallas, reparaciones y avances dentro de una base de datos centralizada.',
            functions: 'Registra clientes y dispositivos, almacena reparaciones y fechas, administra estados y genera un código público de seguimiento para cada equipo.',
            problem: 'Los talleres necesitaban un historial confiable y una forma simple de informar avances sin exponer datos internos ni responder consultas repetidas.',
            solution: 'Conecté la aplicación Java con SQL y un sitio PHP donde cada cliente consulta de forma segura el avance mediante un código único.',
            impacts: ['Trazabilidad de reparaciones', 'Consulta pública de estados', 'Asignación de técnicos', 'Recepción organizada']
        },
        'crm-losandes': {
            category: 'CRM / Gestión multiempresa',
            summary: 'CRM multiempresa que centraliza llamadas, clientes, movimientos financieros, usuarios y registros operativos de distintas áreas comerciales.',
            functions: 'Registra llamadas y actividad por empresa y rubro, incluyendo alquileres, inmuebles, cámaras, productos, finanzas, usuarios y permisos.',
            problem: 'Las interacciones y movimientos de distintas empresas eran difíciles de separar, organizar y seguir.',
            solution: 'Desarrollé un CRM por roles que segmenta los registros por empresa y rubro, y centraliza llamadas, finanzas, actividad, usuarios y permisos.',
            impacts: ['Registros separados por empresa', 'Historial de llamadas centralizado', 'Trazabilidad financiera', 'Acceso según roles'],
            demo: { title: 'Sistema privado', description: 'El acceso público no está disponible porque la plataforma pertenece a la empresa y contiene información sensible de clientes, finanzas y operaciones.' }
        },
        'distribuidora-picar': {
            name: 'Sistema de Distribución de Herramientas PICAR',
            category: 'Aplicación de escritorio / Distribución y venta de herramientas',
            summary: 'Aplicación Java desarrollada para administrar inventario, ventas, compras, clientes, proveedores, cuentas, pagos y reportes de PICAR.',
            functions: 'Gestiona herramientas, stock, cuentas de clientes y proveedores, compras, ventas, pagos, cheques y reportes desde una aplicación local.',
            problem: 'PICAR necesitaba reemplazar registros desconectados por un sistema confiable para controlar inventario y actividad comercial.',
            solution: 'Desarrollé una aplicación Java a medida que centraliza productos, movimientos de stock, ventas, compras, saldos, pagos, alertas y reportes.',
            impacts: ['Inventario centralizado', 'Facturación más rápida', 'Control de proveedores', 'Reportes de ventas']
        },
        'easy-forms': {
            category: 'Landing page de servicios / Asistencia con formularios',
            summary: 'Sitio cálido y accesible que explica cómo Easy Form Solutions organiza y prepara documentación para trámites con formularios en Estados Unidos.',
            functions: 'Explica el proceso de revisión, organización, preparación y seguimiento, responde preguntas, muestra avisos y recibe solicitudes de asistencia.',
            problem: 'El negocio necesitaba explicar un servicio complejo de forma clara y confiable antes de que cada visitante contactara al equipo.',
            solution: 'Diseñé una arquitectura responsive con cuatro etapas, preguntas frecuentes, avisos visibles y un formulario directo de consulta.',
            impacts: ['Proceso claro en cuatro etapas', 'Mayor confianza del cliente', 'Más conversiones de consultas', 'Información accesible']
        },
        'facebook-chats-ai-agent': {
            name: 'Agente de IA MVP',
            category: 'Automatización con IA / Agente conversacional',
            summary: 'Agente de IA que monitorea Facebook Messenger, califica prospectos, agenda citas en Urbana y reporta conversiones en tiempo real.',
            functions: 'Responde mensajes, clasifica intenciones, consulta disponibilidad, crea citas sin superposiciones y registra interacciones en un dashboard analítico.',
            problem: 'Los mensajes fuera de horario quedaban sin respuesta, generando oportunidades perdidas y poca información sobre conversión y rendimiento.',
            solution: 'Conecté un flujo NLP con la API de Messenger y Urbana, incorporando agenda automática 24/7 y analítica en vivo del embudo y las conversaciones.',
            impacts: ['Intención clasificada en menos de 1,2 s', 'Respuestas en menos de 30 s', 'Agenda automática 24/7', 'Analítica de conversión en vivo'],
            demo: { title: 'Integración privada', description: 'El agente está conectado a conversaciones privadas, prospectos, analítica y la agenda de Urbana, por lo que no dispone de acceso público.' }
        },
        'portfolio-ai-assistant': {
            name: 'Asistente IA del Portfolio',
            category: 'Automatización con IA / Portfolio conversacional',
            summary: 'Asistente bilingüe que responde preguntas concretas sobre mi experiencia, proyectos, tecnologías y formación mediante un contexto público controlado.',
            functions: 'Ofrece preguntas sugeridas, mantiene una conversación breve, responde en inglés o español y utiliza respuestas locales seguras si el servicio de IA no está disponible.',
            problem: 'El portfolio contiene mucha información y encontrar rápidamente un proyecto, una habilidad o una experiencia específica requiere recorrer varias secciones.',
            solution: 'Diseñé un asistente compacto con una API en Python y Workers AI, una fuente de conocimiento JSON curada, alcance estricto y sin aprendizaje automático desde las conversaciones.',
            impacts: ['Exploración más rápida', 'Respuestas bilingües', 'Contexto público controlado', 'Conversaciones no almacenadas'],
            demo: { title: 'Asistente IA disponible', description: 'El asistente está disponible desde el botón de chat de este portfolio y responde mediante un Worker en Python conectado a Workers AI.' }
        },
        'professional-portfolio': {
            name: 'Portfolio Profesional',
            category: 'Sitio personal / Perfil profesional',
            summary: 'Portfolio bilingüe y responsive que reúne mis proyectos, experiencia, stack tecnológico, formación y canales de contacto.',
            functions: 'Organiza proyectos por categorías, presenta casos de estudio, traduce el contenido y permite explorar mi perfil mediante un asistente de IA.',
            problem: 'Necesitaba centralizar mi experiencia y mis proyectos en una presentación clara, visual y accesible desde cualquier dispositivo.',
            solution: 'Desarrollé una experiencia responsive con navegación por secciones, proyectos interactivos, traducción y acceso directo a mis perfiles profesionales.',
            impacts: ['Perfil profesional centralizado', 'Contenido bilingüe', 'Experiencia responsive', 'Proyectos organizados']
        },
        'ferreteria-mendez': {
            name: 'Ferretería Méndez',
            category: 'Punto de venta / Analítica empresarial',
            summary: 'Sistema web autenticado utilizado por una ferretería para administrar ventas, presupuestos, productos, inventario, facturación y analítica.',
            functions: 'Gestiona ventas de mostrador, presupuestos, productos, facturación PDF, APIs y reportes de ventas, ganancias, empleados y rendimiento.',
            problem: 'La empresa necesitaba conectar ventas y presupuestos con stock, facturación y un análisis confiable de ingresos, rentabilidad y productos.',
            solution: 'Desarrollé una plataforma por roles que centraliza las operaciones y transforma transacciones en reportes por período, producto, ganancia y empleado.',
            impacts: ['Ventas de mostrador más rápidas', 'Productos centralizados', 'Presupuestos y facturas PDF', 'Análisis de ventas y ganancias'],
            demo: { title: 'Sistema productivo privado', description: 'La plataforma está en uso y no puede ser pública porque contiene información confidencial de finanzas, productos, ventas y empleados.' }
        },
        'los-andes-website': {
            category: 'Landing page corporativa / Servicios B2B',
            summary: 'Sitio corporativo que presenta servicios de desarrollo de software, BPO y marketing digital para empresas de Estados Unidos.',
            functions: 'Organiza servicios B2B, compara planes Standard, Premium y VIP, comunica entregables y dirige prospectos a un formulario de contacto.',
            problem: 'La empresa necesitaba un canal profesional que explicara su oferta y facilitara comparar precios y entregables.',
            solution: 'Estructuré una experiencia responsive orientada a ventas con servicios claros, recursos visuales, precios interactivos y contacto directo.',
            impacts: ['Canal principal de adquisición B2B', 'Precios transparentes', 'Presencia institucional clara', 'Consultas directas']
        },
        'proyecto-prisma': {
            category: 'Sitio empresarial / Demos interactivos',
            summary: 'Sitio de mi emprendimiento de software donde presento servicios, soluciones empresariales, experiencia profesional y nueve demos interactivos.',
            functions: 'Presenta servicios de software, landing pages, asesoría comercial, canales de contacto y nueve demos para distintas necesidades empresariales.',
            problem: 'Los clientes necesitaban comprender los servicios y evaluar una solución digital antes de comprometerse con el desarrollo.',
            solution: 'Construí un sitio responsive donde pueden explorar servicios, conocer mi enfoque y probar nueve demos antes de solicitar una solución a medida.',
            impacts: ['9 demos interactivos', 'Servicios fáciles de explorar', 'Validación temprana', 'Contacto directo con clientes']
        },
        'ts-network-website': {
            category: 'Landing page bilingüe / Internet y seguridad',
            summary: 'Sitio bilingüe orientado a conversión para promocionar internet de alta velocidad y cámaras de seguridad en Brownsville y el Valle de Texas.',
            functions: 'Presenta planes de internet y cámaras, consulta cobertura, capta prospectos, permite solicitar presupuestos y conecta con pagos y cuentas.',
            problem: 'TS Network necesitaba una presencia profesional en español e inglés que explicara sus servicios y convirtiera visitantes en prospectos.',
            solution: 'Diseñé una experiencia responsive en dark mode con navegación bilingüe, planes interactivos, consultas de cobertura, contacto y portal de pagos.',
            impacts: ['Acceso bilingüe', 'Generación constante de prospectos', 'Pagos online directos', 'Exploración mobile-first']
        },
        'tsnetwork-crm': {
            category: 'CRM / Servicio técnico y operaciones',
            summary: 'CRM multirol para coordinar visitas de repetidores y cámaras, llamadas, citas, pagos, inventario y trabajo técnico en campo.',
            functions: 'Agenda llamadas y visitas, asigna tareas, controla cuotas mensuales y stock, y genera PDFs operativos para cuatro niveles de permisos.',
            problem: 'Las llamadas, visitas, cobranzas, inventario y asignaciones técnicas eran difíciles de coordinar entre distintos roles y procesos.',
            solution: 'Centralicé las operaciones en un sistema por roles con agenda, visitas, pagos, stock, tareas y reportes PDF.',
            impacts: ['Operaciones técnicas centralizadas', 'Permisos claros por rol', 'Mejor seguimiento de pagos', 'Control de stock y tareas'],
            demo: { title: 'Sistema privado', description: 'El acceso público no está disponible porque pertenece a la empresa y contiene información sensible de clientes y operaciones.' }
        },
        'urbana-studios': {
            category: 'Sistema de administración inmobiliaria',
            summary: 'Plataforma para administrar departamentos, disponibilidad, inquilinos, contratos, rentas, facturación, visitas y analítica de ocupación.',
            functions: 'Centraliza unidades, contratos, inquilinos, pagos, facturas, citas de prospectos y métricas de ingresos y ocupación.',
            problem: 'La empresa necesitaba gestionar propiedades, contratos, inquilinos, cobranzas y visitas desde un único sistema profesional.',
            solution: 'Desarrollé una plataforma con React y Node.js, interfaz dark premium, calendario interactivo y panel administrativo para ventas y alquileres.',
            impacts: ['Administración inmobiliaria centralizada', 'Visitas agendadas online', 'Analítica de ingresos y ocupación', 'Mayor conversión de alquileres'],
            demo: { title: 'Sistema productivo privado', description: 'El acceso público no está disponible porque contiene información confidencial de inquilinos, contratos, pagos, facturación y propiedades.' }
        }
    };

    var selectorBindings = [
        ['.opentowork span:last-child', 'hero.open'],
        ['#moving-contact-actions .contact-action:first-child .contact-action-tooltip', 'actions.viewCv'],
        ['#email-action-tooltip', 'actions.copy'],
        ['.linkedin-action-tooltip', 'actions.linkedinProfile'],
        ['.github-action-tooltip', 'actions.githubRepository'],
        ['.location-action-tooltip', 'actions.location', 'direct'],
        ['.education-card-degree .education-type', 'education.higher', 'direct'],
        ['.education-card-degree .education-program', 'education.degree'],
        ['.education-card-degree .education-meta time', 'education.period', 'direct'],
        ['.education-card-degree .education-meta span', 'education.degreeType', 'direct'],
        ['.education-card-language .education-type', 'education.languageType', 'direct'],
        ['.education-language-cover strong', 'education.english'],
        ['.education-language-cover div span', 'education.training'],
        ['.education-language-cover small', 'education.level'],
        ['.education-card-language .education-copy h2', 'education.institute'],
        ['.education-card-language .education-program', 'education.course'],
        ['.education-card-language .education-meta time', 'education.graduated', 'direct'],
        ['.education-card-language .education-meta span', 'education.communicational', 'direct'],
        ['#contact .contact-message strong', 'contact.message'],
        ['#contact .contact-button.cv', 'actions.viewCv', 'direct'],
        ['#contact .contact-copy-feedback', 'actions.copied'],
        ['.footer p', 'footer.copy']
    ];

    function t(key, replacements) {
        var language = document.documentElement.lang || 'en';
        var value = (messages[language] && messages[language][key]) || messages.en[key] || key;
        if (replacements) {
            Object.keys(replacements).forEach(function(name) {
                value = value.replaceAll('{' + name + '}', replacements[name]);
            });
        }
        return value;
    }

    function setDirectText(element, value) {
        var textNode = Array.prototype.find.call(element.childNodes, function(node) {
            return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
        });
        if (textNode) {
            textNode.textContent = value;
        } else {
            element.appendChild(document.createTextNode(value));
        }
    }

    function prepareBindings() {
        selectorBindings.forEach(function(binding) {
            document.querySelectorAll(binding[0]).forEach(function(element) {
                element.dataset.i18n = binding[1];
                if (binding[2]) {
                    element.dataset.i18nMode = binding[2];
                }
            });
        });

        document.querySelectorAll('.work-item').forEach(function(item, index) {
            var prefix = 'experience.' + (index + 1) + '.';
            var bindings = [
                ['.work-company > span', 'type'],
                ['.work-period', 'period'],
                ['.work-role-row h4', 'role'],
                ['.work-location', 'location', 'direct'],
                ['.work-outcomes section:nth-child(1) p', 'responsibilities'],
                ['.work-outcomes section:nth-child(2) p', 'problems'],
                ['.work-outcomes section:nth-child(3) p', 'impact']
            ];
            bindings.forEach(function(binding) {
                var element = item.querySelector(binding[0]);
                if (!element) return;
                element.dataset.i18n = prefix + binding[1];
                if (binding[2]) element.dataset.i18nMode = binding[2];
            });
        });

        document.querySelectorAll('.work-outcomes').forEach(function(outcomes) {
            ['experience.responsibilities', 'experience.problems', 'experience.impact'].forEach(function(key, index) {
                var heading = outcomes.querySelector('section:nth-child(' + (index + 1) + ') h5');
                if (heading) heading.dataset.i18n = key;
            });
        });
    }

    var heroTypingTimer = null;

    function renderHeroTitle(element, value) {
        clearTimeout(heroTypingTimer);
        element.setAttribute('aria-label', value);
        element.setAttribute('aria-live', 'off');

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.textContent = value;
            return;
        }

        var characters = Array.from(value);
        var currentIndex = 0;
        element.textContent = '';

        function typeNextCharacter() {
            currentIndex += 1;
            element.textContent = characters.slice(0, currentIndex).join('');

            if (currentIndex >= characters.length) return;

            var typedCharacter = characters[currentIndex - 1];
            var delay = /[.!?]/.test(typedCharacter) ? 140 : 42;
            heroTypingTimer = window.setTimeout(typeNextCharacter, delay);
        }

        heroTypingTimer = window.setTimeout(typeNextCharacter, 180);
    }

    function applyTranslations(animateHeroTitle) {
        document.querySelectorAll('[data-i18n]').forEach(function(element) {
            var key = element.dataset.i18n;
            var value = t(key);
            if (key === 'hero.title') {
                if (animateHeroTitle === false) {
                    clearTimeout(heroTypingTimer);
                    element.textContent = value;
                    element.setAttribute('aria-label', value);
                } else {
                    renderHeroTitle(element, value);
                }
            } else if (element.dataset.i18nMode === 'direct') {
                setDirectText(element, value);
            } else if (htmlKeys.has(key)) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        });

        document.querySelectorAll('.skill-tech-node small').forEach(function(element) {
            var years = element.dataset.years || parseInt(element.textContent, 10);
            element.dataset.years = years;
            element.textContent = document.documentElement.lang === 'es' ? years + '+ años' : years + '+ years';
        });

        document.querySelectorAll('.language-option').forEach(function(button) {
            var selected = button.dataset.lang === document.documentElement.lang;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });

        var attributeBindings = [
            ['.language-switcher', 'aria-label', 'access.languageSelector'],
            ['.language-option[data-lang="en"]', 'aria-label', 'access.viewEnglish'],
            ['.language-option[data-lang="es"]', 'aria-label', 'access.viewSpanish'],
            ['.hero-location-button img', 'alt', 'access.argentinaFlag'],
            ['.hero-capabilities', 'aria-label', 'access.mainServices'],
            ['.skill-network-groups', 'aria-label', 'access.technologyGroups'],
            ['#email-button', 'aria-label', 'access.copyEmail'],
            ['#contact-email-button', 'aria-label', 'access.copyEmail'],
            ['#contact-email-button', 'title', 'actions.copy'],
            ['.hero-location-button', 'aria-label', 'access.location'],
            ['.portfolio-up-button', 'aria-label', 'access.backAbout'],
            ['.portfolio-up-button', 'title', 'access.backAbout'],
            ['.education-document-trigger', 'aria-label', 'access.enlargeDiploma'],
            ['.education-document-close', 'aria-label', 'access.closeDiploma'],
            ['.education-document-close', 'title', 'access.closeDiploma'],
            ['#education-document-dialog', 'aria-label', 'access.diplomaDialog']
        ];
        attributeBindings.forEach(function(binding) {
            document.querySelectorAll(binding[0]).forEach(function(element) {
                element.setAttribute(binding[1], t(binding[2]));
            });
        });

        var cvAction = document.querySelector('#moving-contact-actions .contact-action:first-child');
        if (cvAction) cvAction.setAttribute('aria-label', t('actions.viewCv'));

        var year = document.getElementById('current-year');
        if (year) year.textContent = new Date().getFullYear();

        document.title = document.documentElement.lang === 'es'
            ? 'Federico Cabello • Ingeniero de Software'
            : 'Federico Cabello • Software Engineer';
    }

    function setLanguage(language, emitEvent, animateHeroTitle) {
        if (!supportedLanguages.includes(language)) language = 'en';
        document.documentElement.lang = language;
        localStorage.setItem(STORAGE_KEY, language);
        applyTranslations(animateHeroTitle);
        if (emitEvent !== false) {
            document.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { language: language } }));
        }
    }

    function localizeProject(config, folder) {
        if (document.documentElement.lang !== 'es' || !projectTranslationsEs[folder]) {
            return config;
        }
        var translation = projectTranslationsEs[folder];
        var localized = Object.assign({}, config, translation);
        if (config.demo && translation.demo) {
            localized.demo = Object.assign({}, config.demo, translation.demo);
        }
        return localized;
    }

    function changeLanguage(language) {
        var url = new URL(window.location.href);
        url.searchParams.set('lang', language);
        window.history.replaceState({}, '', url.toString());
        setLanguage(language, true, false);
    }

    var urlLanguage = new URLSearchParams(window.location.search).get('lang');
    var requestedLanguage = supportedLanguages.includes(urlLanguage) ? urlLanguage : localStorage.getItem(STORAGE_KEY);
    var initialLanguage = supportedLanguages.includes(requestedLanguage) ? requestedLanguage : 'en';
    document.documentElement.lang = initialLanguage;

    window.portfolioI18n = {
        t: t,
        setLanguage: setLanguage,
        getLanguage: function() { return document.documentElement.lang; },
        localizeProject: localizeProject,
        apply: applyTranslations
    };

    document.addEventListener('DOMContentLoaded', function() {
        prepareBindings();
        document.querySelectorAll('.language-option').forEach(function(button) {
            button.addEventListener('click', function() {
                var language = button.dataset.lang;
                if (language === document.documentElement.lang) return;
                changeLanguage(language);
            });
        });
        setLanguage(initialLanguage, false);
    });
})();
