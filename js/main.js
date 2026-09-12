jQuery(document).ready(function($) {

    'use strict';

        $(".Modern-Slider").slick({
            autoplay:true,
            speed:1000,
            slidesToShow:1,
            slidesToScroll:1,
            pauseOnHover:true,
            dots:true,
            fade: true,
            pauseOnDotsHover:true,
            cssEase:'linear',
            draggable:false,
            prevArrow:'<button class="PrevArrow"></button>',
            nextArrow:'<button class="NextArrow"></button>', 
          });

        $('#nav-toggle').on('click', function (event) {
            event.preventDefault();
            $('#main-nav').toggleClass("open");
        });


        $('.tabgroup > div').hide();
            $('.tabgroup > div:first-of-type').show();
            $('.tabs a').click(function(e){
              e.preventDefault();
                var $this = $(this),
                tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
                others = $this.closest('li').siblings().children('a'),
                target = $this.attr('href');
            others.removeClass('active');
            $this.addClass('active');
            $(tabgroup).children('div').hide();
            $(target).show();
          
        })



        $(".box-video").click(function(){
          $('iframe',this)[0].src += "&amp;autoplay=1";
          $(this).addClass('open');
        });

        $('.owl-carousel').owlCarousel({
            loop:true,
            margin:30,
            responsiveClass:true,
            responsive:{
                0:{
                    items:1,
                    nav:true
                },
                600:{
                    items:2,
                    nav:false
                },
                1000:{
                    items:3,
                    nav:true,
                    loop:false
                }
            }
        })



        var contentSection = $('.content-section, .content-section-education, .content-section-contact, .main-banner');
        var navigation = $('nav');
        var backToTop = $('.portfolio-up-button');
        var movingProfile = document.getElementById('moving-profile');
        var heroProfileSlot = document.getElementById('hero-profile-slot');
        var sidebarProfileSlot = document.getElementById('sidebar-profile-slot');
        var profilePhotoFrame = movingProfile ? movingProfile.querySelector('.profile-photo-frame') : null;
        var movingContactActions = document.getElementById('moving-contact-actions');
        var heroActionsSlot = document.getElementById('hero-actions-slot');
        var sidebarActionsSlot = document.getElementById('sidebar-actions-slot');
        var profileAnimation = null;
        var contactActionsAnimation = null;
        var profileResizeTimer = null;

        function translate(key, replacements) {
            if (window.portfolioI18n) {
                return window.portfolioI18n.t(key, replacements);
            }
            return key;
        }
        
        navigation.on('click', 'a', function(event){
            if (!this.hash) {
                return;
            }
            var target = $(this.hash);
            if (!target.length) {
                return;
            }
            event.preventDefault();
            navigation.find('a').removeClass('active-section');
            $('nav a[href="' + this.hash + '"]').addClass('active-section');
            smoothScroll(target);
        });
        
        $(window).on('scroll', function(){
            updateNavigation();
            updateBackToTop();
            syncProfilePosition(true);
            syncContactActionsPosition(true);
        })
        updateNavigation();
        updateBackToTop();
        syncProfilePosition(false);
        syncContactActionsPosition(false);

        if (heroActionsSlot) {
            setTimeout(function() {
                heroActionsSlot.classList.remove('is-initializing');
            }, 1100);
        }

        var skillNetwork = document.getElementById('skill-network');

        if (skillNetwork) {
            var skillTabs = Array.prototype.slice.call(skillNetwork.querySelectorAll('.skill-group-node'));
            var skillPanels = Array.prototype.slice.call(skillNetwork.querySelectorAll('.skill-tech-panel'));
            var skillLines = skillNetwork.querySelector('.skill-network-lines');
            var skillResizeTimer = null;

            skillPanels.forEach(function(panel) {
                Array.prototype.forEach.call(panel.querySelectorAll('.skill-tech-node'), function(node, index) {
                    node.style.setProperty('--node-index', index);
                });
            });

            function drawSkillConnections() {
                var activeTab = skillNetwork.querySelector('.skill-group-node.is-active');
                var activePanel = skillNetwork.querySelector('.skill-tech-panel.is-active');

                if (!activeTab || !activePanel || !skillLines) {
                    return;
                }

                var networkRect = skillNetwork.getBoundingClientRect();
                var tabRect = activeTab.getBoundingClientRect();
                var nodes = Array.prototype.slice.call(activePanel.querySelectorAll('.skill-tech-node'));

                skillLines.replaceChildren();
                skillLines.setAttribute('viewBox', '0 0 ' + networkRect.width + ' ' + networkRect.height);

                var nodePositions = nodes.map(function(node) {
                    var nodeRect = node.getBoundingClientRect();
                    return {
                        x: nodeRect.left - networkRect.left + nodeRect.width / 2,
                        top: nodeRect.top - networkRect.top,
                        bottom: nodeRect.bottom - networkRect.top
                    };
                });

                if (!nodePositions.length) {
                    return;
                }

                var columns = [];

                nodePositions.forEach(function(position) {
                    var column = columns.find(function(item) {
                        return Math.abs(item.x - position.x) < 8;
                    });

                    if (!column) {
                        column = { x: position.x, nodes: [] };
                        columns.push(column);
                    }

                    column.nodes.push(position);
                });

                columns.sort(function(a, b) { return a.x - b.x; });
                columns.forEach(function(column) {
                    column.nodes.sort(function(a, b) { return a.top - b.top; });
                });

                var startX = tabRect.left - networkRect.left + tabRect.width / 2;
                var startY = tabRect.bottom - networkRect.top;
                var lineIndex = 0;

                function appendConnection(pathData) {
                    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', pathData);
                    path.setAttribute('pathLength', '1');
                    path.setAttribute('class', 'skill-connection');
                    path.style.setProperty('--line-index', lineIndex++);
                    skillLines.appendChild(path);
                }

                function appendEndpoint(x, y, index) {
                    var endpoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    endpoint.setAttribute('cx', x);
                    endpoint.setAttribute('cy', y);
                    endpoint.setAttribute('r', '2.4');
                    endpoint.setAttribute('class', 'skill-connection-end');
                    endpoint.style.setProperty('--line-index', index);
                    skillLines.appendChild(endpoint);
                }

                columns.forEach(function(column) {
                    var firstNode = column.nodes[0];
                    var branchIndex = lineIndex;
                    var branchHeight = Math.max(firstNode.top - startY, 1);
                    var firstControlY = startY + branchHeight * 0.48;
                    var secondControlY = firstNode.top - branchHeight * 0.42;

                    appendConnection(
                        'M ' + startX + ' ' + startY +
                        ' C ' + startX + ' ' + firstControlY +
                        ', ' + column.x + ' ' + secondControlY +
                        ', ' + column.x + ' ' + firstNode.top
                    );
                    appendEndpoint(column.x, firstNode.top, branchIndex);

                    for (var index = 1; index < column.nodes.length; index++) {
                        var previousNode = column.nodes[index - 1];
                        var currentNode = column.nodes[index];
                        var continuationIndex = lineIndex;
                        var gap = currentNode.top - previousNode.bottom;
                        var curveOffset = Math.min(8, gap * 0.22);

                        appendConnection(
                            'M ' + column.x + ' ' + previousNode.bottom +
                            ' C ' + (column.x + curveOffset) + ' ' + (previousNode.bottom + gap * 0.34) +
                            ', ' + (column.x - curveOffset) + ' ' + (currentNode.top - gap * 0.34) +
                            ', ' + column.x + ' ' + currentNode.top
                        );
                        appendEndpoint(column.x, currentNode.top, continuationIndex);
                    }
                });
            }

            function activateSkillPanel(tab, moveFocus) {
                var panelId = tab.getAttribute('data-skill-panel');

                skillTabs.forEach(function(item) {
                    var selected = item === tab;
                    item.classList.toggle('is-active', selected);
                    item.setAttribute('aria-selected', selected ? 'true' : 'false');
                    item.setAttribute('tabindex', selected ? '0' : '-1');
                });

                skillPanels.forEach(function(panel) {
                    var selected = panel.id === panelId;
                    panel.classList.toggle('is-active', selected);
                    panel.setAttribute('aria-hidden', selected ? 'false' : 'true');
                    panel.toggleAttribute('inert', !selected);
                });

                if (moveFocus) {
                    tab.focus();
                }

                window.requestAnimationFrame(function() {
                    window.requestAnimationFrame(drawSkillConnections);
                });
            }

            skillTabs.forEach(function(tab, index) {
                tab.setAttribute('tabindex', tab.classList.contains('is-active') ? '0' : '-1');

                tab.addEventListener('click', function() {
                    activateSkillPanel(tab, false);
                });

                tab.addEventListener('keydown', function(event) {
                    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
                        return;
                    }

                    event.preventDefault();
                    var nextIndex = index;

                    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                        nextIndex = (index + 1) % skillTabs.length;
                    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                        nextIndex = (index - 1 + skillTabs.length) % skillTabs.length;
                    } else if (event.key === 'Home') {
                        nextIndex = 0;
                    } else if (event.key === 'End') {
                        nextIndex = skillTabs.length - 1;
                    }

                    activateSkillPanel(skillTabs[nextIndex], true);
                });
            });

            $(window).on('resize', function() {
                clearTimeout(skillResizeTimer);
                skillResizeTimer = setTimeout(drawSkillConnections, 120);
            });

            window.requestAnimationFrame(drawSkillConnections);
            setTimeout(drawSkillConnections, 400);
        }

        $(window).on('resize', function() {
            clearTimeout(profileResizeTimer);
            profileResizeTimer = setTimeout(function() {
                syncProfilePosition(false);
                syncContactActionsPosition(false);
            }, 120);
        });

        backToTop.on('click', function(event) {
            event.preventDefault();
            navigation.find('a').removeClass('active-section');
            $('nav a[href="#top"]').addClass('active-section');
            smoothScroll($('#top'));
        });

        function updateBackToTop() {
            backToTop.toggleClass('is-visible', $(window).scrollTop() > 32);
        }

        function updateSidebarProfileLink(isInSidebar) {
            if (!profilePhotoFrame) {
                return;
            }

            profilePhotoFrame.classList.toggle('is-about-link', isInSidebar);

            if (isInSidebar) {
                profilePhotoFrame.setAttribute('role', 'link');
                profilePhotoFrame.setAttribute('tabindex', '0');
                profilePhotoFrame.setAttribute('aria-label', 'Back to About Me');
                profilePhotoFrame.setAttribute('title', 'Back to About Me');
                return;
            }

            profilePhotoFrame.removeAttribute('role');
            profilePhotoFrame.removeAttribute('tabindex');
            profilePhotoFrame.removeAttribute('aria-label');
            profilePhotoFrame.removeAttribute('title');
        }

        function syncProfilePosition(animate) {
            if (!movingProfile || !heroProfileSlot || !sidebarProfileSlot) {
                return;
            }

            var desktopSidebarVisible = window.matchMedia('(min-width: 992px)').matches;
            var currentSlot = movingProfile.parentElement;
            var targetSlot = heroProfileSlot;

            if (desktopSidebarVisible) {
                if (currentSlot === sidebarProfileSlot) {
                    targetSlot = $(window).scrollTop() < 60 ? heroProfileSlot : sidebarProfileSlot;
                } else {
                    targetSlot = $(window).scrollTop() > 140 ? sidebarProfileSlot : heroProfileSlot;
                }
            }

            sidebarProfileSlot.classList.toggle('has-profile', targetSlot === sidebarProfileSlot);
            updateSidebarProfileLink(targetSlot === sidebarProfileSlot);

            if (currentSlot !== targetSlot) {
                moveProfileTo(targetSlot, animate);
            }
        }

        if (profilePhotoFrame) {
            profilePhotoFrame.addEventListener('click', function() {
                if (movingProfile.parentElement !== sidebarProfileSlot) {
                    return;
                }

                navigation.find('a').removeClass('active-section');
                $('nav a[href="#top"]').addClass('active-section');
                smoothScroll($('#top'));
            });

            profilePhotoFrame.addEventListener('keydown', function(event) {
                if (movingProfile.parentElement !== sidebarProfileSlot || (event.key !== 'Enter' && event.key !== ' ')) {
                    return;
                }

                event.preventDefault();
                profilePhotoFrame.click();
            });
        }

        function moveProfileTo(targetSlot, animate) {
            var firstRect = movingProfile.getBoundingClientRect();

            if (profileAnimation) {
                profileAnimation.cancel();
                profileAnimation = null;
            }

            targetSlot.appendChild(movingProfile);
            var lastRect = movingProfile.getBoundingClientRect();
            var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (!animate || reduceMotion || !movingProfile.animate) {
                return;
            }

            var offsetX = firstRect.left - lastRect.left;
            var offsetY = firstRect.top - lastRect.top;
            var scaleX = firstRect.width / lastRect.width;
            var scaleY = firstRect.height / lastRect.height;

            profileAnimation = movingProfile.animate([
                {
                    transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px) scale(' + scaleX + ', ' + scaleY + ')',
                    transformOrigin: 'top left'
                },
                {
                    transform: 'translate(0, 0) scale(1, 1)',
                    transformOrigin: 'top left'
                }
            ], {
                duration: 780,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });

            profileAnimation.onfinish = function() {
                profileAnimation = null;
            };
        }

        function syncContactActionsPosition(animate) {
            if (!movingContactActions || !heroActionsSlot || !sidebarActionsSlot) {
                return;
            }

            var desktopSidebarVisible = window.matchMedia('(min-width: 992px)').matches;
            var currentSlot = movingContactActions.parentElement;
            var targetSlot = heroActionsSlot;

            sidebarActionsSlot.classList.toggle('is-contact-active', isContactAreaActive());

            if (desktopSidebarVisible) {
                if (currentSlot === sidebarActionsSlot) {
                    targetSlot = $(window).scrollTop() < 60 ? heroActionsSlot : sidebarActionsSlot;
                } else {
                    targetSlot = $(window).scrollTop() > 140 ? sidebarActionsSlot : heroActionsSlot;
                }
            }

            if (currentSlot !== targetSlot) {
                moveContactActionsTo(targetSlot, animate);
            }
        }

        function moveContactActionsTo(targetSlot, animate) {
            var firstRect = movingContactActions.getBoundingClientRect();

            if (contactActionsAnimation) {
                contactActionsAnimation.cancel();
                contactActionsAnimation = null;
            }

            if (targetSlot === heroActionsSlot) {
                var fixedLocation = heroActionsSlot.querySelector('.hero-location-button');
                heroActionsSlot.insertBefore(movingContactActions, fixedLocation);
            } else {
                targetSlot.appendChild(movingContactActions);
            }
            var lastRect = movingContactActions.getBoundingClientRect();
            var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (!animate || reduceMotion || !movingContactActions.animate) {
                return;
            }

            var offsetX = firstRect.left - lastRect.left;
            var offsetY = firstRect.top - lastRect.top;
            var scaleX = firstRect.width / lastRect.width;
            var scaleY = firstRect.height / lastRect.height;

            contactActionsAnimation = movingContactActions.animate([
                {
                    transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px) scale(' + scaleX + ', ' + scaleY + ')',
                    transformOrigin: 'top left'
                },
                {
                    transform: 'translate(0, 0) scale(1, 1)',
                    transformOrigin: 'top left'
                }
            ], {
                duration: 720,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });

            contactActionsAnimation.onfinish = function() {
                contactActionsAnimation = null;
            };
        }
        
        function updateNavigation(){
            if (isContactAreaActive()) {
                navigation.find('a').removeClass('active-section');
                $('nav a[href="#contact"]').addClass('active-section');
                return;
            }

            contentSection.each(function(){
                var sectionName = $(this).attr('id');
                var navigationMatch = $('nav a[href="#' + sectionName + '"]');
                if( ($(this).offset().top - $(window).height()/2 < $(window).scrollTop()) &&
                      ($(this).offset().top + $(this).height() - $(window).height()/2 > $(window).scrollTop()))
                    {
                        navigationMatch.addClass('active-section');
                    }
                else {
                    navigationMatch.removeClass('active-section');
                }
            });
        }

        function isContactAreaActive() {
            var contactSection = $('#contact');

            if (!contactSection.length) {
                return false;
            }

            var scrollTop = $(window).scrollTop();
            var viewportHeight = $(window).height();
            var documentHeight = $(document).height();
            var reachedContact = scrollTop + viewportHeight * 0.72 >= contactSection.offset().top;
            var reachedPageEnd = scrollTop + viewportHeight >= documentHeight - 32;

            return reachedContact || reachedPageEnd;
        }

        function smoothScroll(target){
            var mobileNav = $('.mobile-navigation:visible');
            var offset = mobileNav.length ? mobileNav.outerHeight() + 12 : 0;
            var targetTop = Math.max(target.offset().top - offset, 0);
            var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            window.scrollTo({
                top: targetTop,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        }


        $('.button a[href*=#]').on('click', function(e) {
          e.preventDefault();
          $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top -0 }, 500, 'linear');
        });

        var projectContainer = document.querySelector('.project-container');
        var projectContainerTemplate = projectContainer ? projectContainer.cloneNode(true) : null;
        var projectBuildVersion = 0;
        var projectJsonCache = {};

        organizeProjectGroups();

        document.addEventListener('portfolio:languagechange', function() {
            var currentScrollPosition = window.scrollY;
            var currentContainer = document.querySelector('.project-container');
            if (!currentContainer || !projectContainerTemplate) {
                return;
            }
            projectBuildVersion += 1;
            var freshContainer = projectContainerTemplate.cloneNode(true);
            currentContainer.replaceWith(freshContainer);
            organizeProjectGroups(true).then(function() {
                window.scrollTo(0, currentScrollPosition);
                window.requestAnimationFrame(function() {
                    drawProjectConnections(true);
                    window.scrollTo(0, currentScrollPosition);
                });
            });
            if (typeof updateRoleDurations === 'function') {
                updateRoleDurations();
            }
        });

        async function organizeProjectGroups(skipInitialAnimation) {
            var container = document.querySelector('.project-container');
            var buildVersion = ++projectBuildVersion;

            if (!container || container.querySelector('.project-group-tabs')) {
                return;
            }

            var cards = Array.prototype.slice.call(container.querySelectorAll(':scope > .project-case-card'));
            var cardsByTitle = new Map(cards.map(function(card) {
                return [card.querySelector('h4').textContent.trim(), card];
            }));
            var cardsByFolder = new Map(cards.filter(function(card) {
                return Boolean(card.dataset.projectFolder);
            }).map(function(card) {
                return [card.dataset.projectFolder, card];
            }));
            var previewProjects = [
                { folder: 'breakers-plaza-crm', name: 'The Breakers Plaza', category: 'CRM System', icon: 'fa-building', summary: 'A centralized CRM workspace for customer relationships and operational follow-up.' },
                { folder: 'urbana-studios', name: 'Urbana Studios', category: 'Property Management System', icon: 'fa-building', summary: 'A property management platform for apartment availability, tenants, contracts, rent payments, invoicing, visit scheduling, and occupancy analytics.' },
                { folder: 'facebook-chats-ai-agent', name: 'AI Agent MVP', category: 'AI Automation / Conversational Agent', icon: 'fa-robot', summary: 'An AI agent that monitors Facebook Messenger conversations, qualifies prospects, schedules appointments in Urbana, and reports conversion metrics in real time.' },
                { folder: 'portfolio-ai-assistant', name: 'Portfolio AI Assistant', category: 'AI Automation / Conversational Portfolio', icon: 'fa-comment-dots', summary: 'A bilingual AI assistant that answers focused questions about my experience, projects, technologies, and education using a controlled public context.' },
                { folder: 'professional-portfolio', name: 'Professional Portfolio', category: 'Personal Website / Professional Profile', icon: 'fa-id-card', summary: 'A bilingual professional portfolio that presents my projects, experience, technology stack, education, and contact channels in one responsive experience.' },
                { folder: 'ts-network-website', name: 'TS Network Website', category: 'Bilingual Landing Page / Internet & Security', icon: 'fa-globe', summary: 'A bilingual conversion-focused website promoting high-speed internet and security camera services for homes and businesses across Brownsville and the Texas Valley.' },
                { folder: 'los-andes-website', name: 'Los Andes Website', category: 'Corporate Landing Page / B2B Services', icon: 'fa-globe-americas', summary: 'A clear corporate website presenting software development, BPO, and digital marketing services to businesses across the United States.' },
                { folder: 'breakers-plaza-website', name: 'The Breakers Plaza Website', category: 'Luxury Landing Page / Condominiums', icon: 'fa-building', summary: 'An elegant beachfront condominium website designed to express a premium identity and connect residents with their private portal.' },
                { folder: 'easy-forms', name: 'Easy Form Solutions', category: 'Service Landing Page / Form Assistance', icon: 'fa-file-alt', summary: 'A warm, accessible website that explains a clear four-stage process for organizing and preparing form documentation.' }
            ];
            var projectResults = {
                'TS Network CRM': { folder: 'tsnetwork-crm' },
                'Cactus Alojamientos': { folder: 'cactus-alojamientos' },
                'Ferreteria Mendez Management System': { folder: 'ferreteria-mendez' },
                'eSports Championship Platform': { folder: 'cadpo-simracing' },
                'Proyecto Prisma': { folder: 'proyecto-prisma' },
                'Los Andes CRM': { folder: 'crm-losandes' },
                'Carlos Taboada Law Firm CRM': { folder: 'carlo-taboada-crm' },
                'PICAR - Tools Distribution System': { folder: 'distribuidora-picar' },
                'Cell Repair Technical Service System': { folder: 'cell-repair' }
            };
            var groups = [
                { id: 'crm', label: translate('projects.groups.crm'), icon: 'fa-users-cog', projects: ['tsnetwork-crm', 'breakers-plaza-crm', 'carlo-taboada-crm', 'crm-losandes'] },
                { id: 'business', label: translate('projects.groups.business'), icon: 'fa-chart-line', projects: ['proyecto-prisma', 'ferreteria-mendez', 'urbana-studios'] },
                { id: 'automation', label: translate('projects.groups.automation'), icon: 'fa-robot', projects: ['facebook-chats-ai-agent', 'portfolio-ai-assistant'] },
                { id: 'landing', label: translate('projects.groups.landing'), icon: 'fa-globe', projects: ['ts-network-website', 'los-andes-website', 'breakers-plaza-website', 'easy-forms'] },
                { id: 'additional', label: translate('projects.groups.additional'), icon: 'fa-folder', secondary: true, projects: ['cadpo-simracing', 'cactus-alojamientos', 'professional-portfolio', 'distribuidora-picar', 'cell-repair'] }
            ];

            var detailedConfigs = await Promise.all(Object.keys(projectResults).map(function(title) {
                return loadProjectConfig(projectResults[title].folder, projectResults[title]);
            }));
            var previewConfigs = await Promise.all(previewProjects.map(function(project) {
                return loadProjectConfig(project.folder, project);
            }));

            if (buildVersion !== projectBuildVersion || !container.isConnected) {
                return;
            }
            var cardsByProject = new Map();

            Object.keys(projectResults).forEach(function(title, index) {
                var folder = projectResults[title].folder;
                var card = cardsByFolder.get(folder) || cardsByTitle.get(title);
                if (!card) {
                    return;
                }
                var config = detailedConfigs[index];
                enhanceProjectCase(card, config);
                cardsByProject.set(config.folder, card);
            });

            previewConfigs.forEach(function(project) {
                cardsByProject.set(project.folder, createProjectPreview(project));
            });

            var explorer = document.createElement('div');
            var tabs = document.createElement('div');
            var stage = document.createElement('div');
            var connectionLines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var panels = document.createElement('div');
            explorer.className = 'project-explorer';
            explorer.classList.toggle('skip-initial-animation', skipInitialAnimation === true);
            tabs.className = 'project-group-tabs';
            tabs.setAttribute('role', 'tablist');
            tabs.setAttribute('aria-label', translate('projects.groupsLabel'));
            stage.className = 'project-group-stage';
            connectionLines.classList.add('project-group-lines');
            connectionLines.setAttribute('aria-hidden', 'true');
            panels.className = 'project-group-panels';

            groups.forEach(function(group, index) {
                var tab = document.createElement('button');
                var tabIcon = document.createElement('i');
                var tabLabel = document.createElement('span');
                var panel = document.createElement('div');
                var isActive = index === 0;

                tab.type = 'button';
                tab.className = 'project-group-tab' + (isActive ? ' is-active' : '');
                tab.classList.toggle('is-secondary', group.secondary === true);
                tab.id = 'project-tab-' + group.id;
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                tab.setAttribute('aria-controls', 'project-panel-' + group.id);
                tab.tabIndex = isActive ? 0 : -1;
                tabIcon.className = 'fas ' + group.icon;
                tabIcon.setAttribute('aria-hidden', 'true');
                tabLabel.textContent = group.label;
                tab.append(tabIcon, tabLabel);

                panel.className = 'project-group-panel' + (isActive ? ' is-active' : '');
                panel.classList.toggle('is-secondary', group.secondary === true);
                panel.id = 'project-panel-' + group.id;
                panel.setAttribute('role', 'tabpanel');
                panel.setAttribute('aria-labelledby', tab.id);
                panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
                panel.hidden = !isActive;
                panel.toggleAttribute('inert', !isActive);

                group.projects.forEach(function(title) {
                    if (cardsByProject.has(title)) {
                        panel.appendChild(cardsByProject.get(title));
                        cardsByProject.delete(title);
                    }
                });

                tab.addEventListener('click', function() {
                    explorer.classList.remove('skip-initial-animation');
                    $('.project-case-card.is-expanded').each(function() {
                        collapseProjectCase($(this));
                    });

                    tabs.querySelectorAll('.project-group-tab').forEach(function(item) {
                        var selected = item === tab;
                        item.classList.toggle('is-active', selected);
                        item.setAttribute('aria-selected', selected ? 'true' : 'false');
                        item.tabIndex = selected ? 0 : -1;
                    });
                    panels.querySelectorAll('.project-group-panel').forEach(function(item) {
                        var selected = item === panel;
                        item.classList.toggle('is-active', selected);
                        item.setAttribute('aria-hidden', selected ? 'false' : 'true');
                        item.hidden = !selected;
                        item.toggleAttribute('inert', !selected);
                    });
                    explorer.classList.toggle('is-secondary-view', group.secondary === true);

                    if (window.matchMedia('(max-width: 767px)').matches) {
                        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        tab.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
                    }

                    window.requestAnimationFrame(drawProjectConnections);
                });

                tab.addEventListener('keydown', function(event) {
                    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
                        return;
                    }

                    event.preventDefault();
                    var nextIndex = index;

                    if (event.key === 'ArrowRight') {
                        nextIndex = (index + 1) % groups.length;
                    } else if (event.key === 'ArrowLeft') {
                        nextIndex = (index - 1 + groups.length) % groups.length;
                    } else if (event.key === 'Home') {
                        nextIndex = 0;
                    } else if (event.key === 'End') {
                        nextIndex = groups.length - 1;
                    }

                    tabs.children[nextIndex].click();
                    tabs.children[nextIndex].focus();
                });

                tabs.appendChild(tab);
                panels.appendChild(panel);
            });

            stage.appendChild(panels);
            explorer.append(connectionLines, tabs, stage);
            container.replaceChildren(explorer);
            $(container).find('.project-case-card').each(function() {
                initializeInteractiveProjectCard($(this));
            });
            var galleryCards = Array.prototype.slice.call(container.querySelectorAll('.project-case-card'));
            var preloadGalleries = function() {
                galleryCards.forEach(function(card, index) {
                    window.setTimeout(function() {
                        initializeProjectGallery(card);
                    }, index * 100);
                });
            };
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(preloadGalleries, { timeout: 1200 });
            } else {
                window.setTimeout(preloadGalleries, 500);
            }
            window.requestAnimationFrame(function() {
                drawProjectConnections(skipInitialAnimation === true);
            });
            setTimeout(function() {
                drawProjectConnections(skipInitialAnimation === true);
            }, 350);
        }

        function drawProjectConnections(staticLines) {
            staticLines = staticLines === true;
            var explorer = document.querySelector('.project-explorer');

            if (!explorer) {
                return;
            }

            var svg = explorer.querySelector('.project-group-lines');
            var activeTab = explorer.querySelector('.project-group-tab.is-active');
            var activePanel = explorer.querySelector('.project-group-panel.is-active');

            svg.replaceChildren();

            if (!activeTab || !activePanel || window.matchMedia('(max-width: 767px)').matches) {
                return;
            }

            var explorerRect = explorer.getBoundingClientRect();
            var tabRect = activeTab.getBoundingClientRect();
            var cards = Array.prototype.slice.call(activePanel.querySelectorAll('.project-card'));

            if (!cards.length) {
                return;
            }

            var startX = tabRect.right - explorerRect.left;
            var startY = tabRect.top - explorerRect.top + tabRect.height / 2;
            var cardPoints = cards.map(function(card) {
                var rect = card.getBoundingClientRect();
                return {
                    x: rect.left - explorerRect.left,
                    y: rect.top - explorerRect.top + rect.height / 2
                };
            });
            var endX = Math.min.apply(null, cardPoints.map(function(point) { return point.x; }));
            var trunkX = startX + Math.max(18, (endX - startX) * 0.48);
            var branchYs = cardPoints.map(function(point) { return point.y; });
            var trunkTop = Math.min.apply(null, branchYs.concat(startY));
            var trunkBottom = Math.max.apply(null, branchYs.concat(startY));

            svg.setAttribute('viewBox', '0 0 ' + explorerRect.width + ' ' + explorerRect.height);

            function appendLine(pathData, index) {
                var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathData);
                path.setAttribute('pathLength', '1');
                path.setAttribute('class', 'project-group-connection' + (staticLines ? ' is-static' : ''));
                path.style.setProperty('--connection-index', index);
                svg.appendChild(path);
            }

            appendLine('M ' + startX + ' ' + startY + ' H ' + trunkX, 0);
            appendLine('M ' + trunkX + ' ' + trunkTop + ' V ' + trunkBottom, 1);

            cardPoints.forEach(function(point, index) {
                appendLine('M ' + trunkX + ' ' + point.y + ' H ' + point.x, index + 2);
                var endpoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                endpoint.setAttribute('cx', point.x);
                endpoint.setAttribute('cy', point.y);
                endpoint.setAttribute('r', '2.5');
                endpoint.setAttribute('class', 'project-group-endpoint');
                svg.appendChild(endpoint);
            });
        }

        var projectConnectionFrame;

        function trackProjectConnections(duration) {
            var startedAt = performance.now();
            cancelAnimationFrame(projectConnectionFrame);

            function updateFrame(timestamp) {
                drawProjectConnections(true);

                if (timestamp - startedAt < duration) {
                    projectConnectionFrame = requestAnimationFrame(updateFrame);
                }
            }

            projectConnectionFrame = requestAnimationFrame(updateFrame);
        }

        function loadProjectConfig(folder, fallback) {
            if (projectJsonCache[folder]) {
                var cached = Object.assign({}, fallback, projectJsonCache[folder], { folder: folder });
                return Promise.resolve(window.portfolioI18n ? window.portfolioI18n.localizeProject(cached, folder) : cached);
            }

            return fetch('img/projects/' + folder + '/project.json?v=20260912-tsnetwork-typescript')
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Project configuration not found');
                    }
                    return response.json();
                })
                .then(function(config) {
                    projectJsonCache[folder] = config;
                    var result = Object.assign({}, fallback, config, { folder: folder });
                    return window.portfolioI18n ? window.portfolioI18n.localizeProject(result, folder) : result;
                })
                .catch(function() {
                    var result = Object.assign({}, fallback, { folder: folder });
                    return window.portfolioI18n ? window.portfolioI18n.localizeProject(result, folder) : result;
                });
        }

        function getTechnologyAppearance(name) {
            var key = name.toLowerCase().replace(/\s+/g, ' ').trim();
            var technologies = {
                'python': ['simple-icons:python', '#66B2FF'],
                'javascript': ['simple-icons:javascript', '#F7DF1E'],
                'typescript': ['simple-icons:typescript', '#3178C6'],
                'html5': ['simple-icons:html5', '#E34F26'],
                'css3': ['simple-icons:css3', '#1572B6'],
                'sql': ['mdi:database', '#76B4E0'],
                'nosql': ['mdi:database-outline', '#77C5A3'],
                'mysql': ['simple-icons:mysql', '#4479A1'],
                'mongodb': ['simple-icons:mongodb', '#47A248'],
                'react': ['simple-icons:react', '#61DAFB'],
                'vite': ['simple-icons:vite', '#A78BFA'],
                'node.js': ['fontisto:nodejs', '#68A063'],
                'tailwind css': ['file-icons:tailwind', '#38BDF8'],
                'next.js': ['simple-icons:nextdotjs', '#F5F5F5'],
                'express.js': ['simple-icons:express', '#D6DCE5'],
                'flask': ['simple-icons:flask', '#D5D9E0'],
                'django': ['simple-icons:django', '#44B78B'],
                'jquery': ['simple-icons:jquery', '#0769AD'],
                'bootstrap': ['simple-icons:bootstrap', '#7952B3'],
                'java': ['fontisto:java', '#F89820'],
                'php': ['simple-icons:php', '#8892BF'],
                'pandas': ['simple-icons:pandas', '#E8D44D'],
                'aws': ['simple-icons:amazonaws', '#FF9900'],
                'prisma': ['simple-icons:prisma', '#F5F5F5'],
                'api': ['mdi:api', '#8CEADD'],
                'messenger api': ['simple-icons:messenger', '#00B2FF'],
                'nlp': ['mdi:brain', '#C39BFF'],
                'webhooks': ['mdi:webhook', '#FF9F6E'],
                'smtp': ['mdi:email-fast-outline', '#71D5C5'],
                'workers ai': ['simple-icons:cloudflare', '#F48120'],
                'cloudflare': ['simple-icons:cloudflare', '#F48120'],
                'cloudflare d1': ['mdi:database-cog-outline', '#F48120'],
                'rest api': ['mdi:api', '#8CEADD'],
                'json': ['mdi:code-json', '#C8D2DC']
            };
            return technologies[key] || ['mdi:code-tags', '#9FB0C2'];
        }

        function createTechnologyBadge(name) {
            var appearance = getTechnologyAppearance(name);
            var badge = document.createElement('span');
            var icon = document.createElement('i');
            badge.style.setProperty('--project-tech-color', appearance[1]);
            icon.className = 'iconify';
            icon.setAttribute('data-icon', appearance[0]);
            badge.append(icon, document.createTextNode(name));
            return badge;
        }

        function createProjectLocation(location, detailView) {
            if (!location || typeof location !== 'object') {
                return null;
            }

            var locationText = String(location.name || '').trim();
            var flagSource = String(location.flag || '').trim();

            if (!locationText) {
                return null;
            }

            var badge = document.createElement('span');
            var marker = document.createElement('span');
            var label = document.createElement('span');

            badge.className = 'project-client-location' + (detailView ? ' is-detail-location' : '');
            badge.title = translate('projects.clientLocation') + ': ' + locationText;
            badge.setAttribute('aria-label', badge.title);
            marker.className = 'project-client-location-marker';
            marker.setAttribute('aria-hidden', 'true');
            if (flagSource) {
                var flag = document.createElement('img');
                flag.src = flagSource;
                flag.alt = '';
                marker.appendChild(flag);
            } else {
                var markerIcon = document.createElement('i');
                markerIcon.className = 'fas fa-map-marker-alt';
                marker.appendChild(markerIcon);
            }
            label.className = 'project-client-location-text';
            label.textContent = detailView
                ? translate('projects.clientLocatedIn', { location: locationText })
                : locationText;
            badge.append(marker, label);
            return badge;
        }

        function createProjectLink(url, type, projectTitle) {
            var link = document.createElement('a');
            var icon = document.createElement('i');
            var label = document.createElement('span');
            var isRepository = type === 'repository';
            link.className = 'project-case-link' + (isRepository ? ' is-repository' : '');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', isRepository
                ? translate('projects.openRepository') + ': ' + projectTitle
                : translate('projects.openInTab', { project: projectTitle }));
            link.title = isRepository ? translate('projects.openRepository') : translate('projects.openWebsite');
            icon.className = isRepository ? 'fab fa-github' : 'fas fa-external-link-alt';
            icon.setAttribute('aria-hidden', 'true');
            label.textContent = isRepository ? translate('projects.repository') : translate('projects.visitWebsite');
            link.append(icon, label);
            return link;
        }

        function createProjectAction(action) {
            if (action !== 'open-assistant') return null;

            var button = document.createElement('button');
            var icon = document.createElement('i');
            var label = document.createElement('span');
            button.type = 'button';
            button.className = 'project-case-link project-agent-action';
            button.setAttribute('aria-label', translate('projects.openAgent'));
            button.title = translate('projects.openAgent');
            icon.className = 'fas fa-robot';
            icon.setAttribute('aria-hidden', 'true');
            label.textContent = translate('projects.tryAgent');
            button.append(icon, label);
            button.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                document.dispatchEvent(new CustomEvent('portfolio:assistantopen'));
            });
            return button;
        }

        function createDemoNote(demo) {
            var note = document.createElement('div');
            var icon = document.createElement('i');
            var copy = document.createElement('p');
            var title = document.createElement('strong');
            var status = demo && demo.status ? demo.status : 'pending';
            var iconNames = {
                'public': 'fas fa-globe',
                'private': 'fas fa-shield-alt',
                'desktop': 'fas fa-desktop',
                'legal': 'fas fa-balance-scale',
                'pending': 'fas fa-images'
            };
            note.className = 'project-access-note project-access-note-' + status;
            icon.className = iconNames[status] || iconNames.pending;
            icon.setAttribute('aria-hidden', 'true');
            title.textContent = demo && demo.title ? demo.title : translate('projects.previewPending');
            copy.append(title, document.createTextNode(' ' + (demo && demo.description ? demo.description : translate('projects.previewPendingDescription'))));
            note.append(icon, copy);
            return note;
        }

        function enhanceProjectCase(card, result) {
            var info = card.querySelector('.project-info');
            var detailsInner = card.querySelector('.project-case-details-inner');
            var meta = card.querySelector('.project-case-meta');
            var technologies = card.querySelector('.project-tech-grid');
            var titleRow = card.querySelector('.project-title-row');
            var toggle = card.querySelector('.project-case-toggle');
            var visual = card.querySelector('.project-visual');
            var summary = card.querySelector('.project-info > .project-summary');
            var caseCopy = card.querySelector('.project-case-copy');
            var category = card.querySelector('.project-info > .project-category');
            var projectTitle = titleRow.querySelector('h4');
            var projectYear = titleRow.querySelector('time');
            var legacyProjectLink = visual.querySelector('.project-github-float');
            var accessNote = detailsInner.querySelector('.project-access-note');

            if (!info || !detailsInner || !meta || !technologies || !titleRow || !toggle || !visual || !summary || !caseCopy || !category || !projectTitle || !result) {
                return;
            }

            var previousLocation = info.querySelector('.project-client-location');
            if (previousLocation) {
                previousLocation.remove();
            }
            info.classList.remove('has-project-location');
            var clientLocation = createProjectLocation(result.location, false);
            if (clientLocation) {
                info.classList.add('has-project-location');
                info.prepend(clientLocation);
            }

            category.textContent = result.category || category.textContent;
            projectTitle.textContent = result.name || projectTitle.textContent;
            summary.textContent = result.summary || summary.textContent;
            if (projectYear && result.year) {
                projectYear.setAttribute('datetime', result.year);
                projectYear.lastChild.nodeValue = result.year;
            }

            var caseParagraphs = caseCopy.querySelectorAll('p');
            if (caseParagraphs[0] && result.problem) {
                caseParagraphs[0].textContent = result.problem;
            }
            if (caseParagraphs[1] && result.solution) {
                caseParagraphs[1].textContent = result.solution;
            }

            var technologyNames = Array.isArray(result.technologies) && result.technologies.length
                ? result.technologies
                : Array.prototype.map.call(technologies.querySelectorAll('span'), function(item) { return item.textContent.trim(); });
            technologies.replaceChildren();
            technologyNames.forEach(function(technology) {
                technologies.appendChild(createTechnologyBadge(technology));
            });

            var hasDemoConfig = Object.prototype.hasOwnProperty.call(result, 'demo');
            if (hasDemoConfig) {
                accessNote = result.demo ? createDemoNote(result.demo) : null;
            }

            var leftColumn = document.createElement('div');
            var leftMeta = document.createElement('div');
            var expandedCategory = category.cloneNode(true);
            var expandedYear = projectYear ? projectYear.cloneNode(true) : null;
            var detailHeader = document.createElement('div');
            var expandedTitle = document.createElement('h3');
            var functions = document.createElement('section');
            var functionsTitle = document.createElement('h5');
            var functionsCopy = document.createElement('p');
            var impactTitle = document.createElement('h5');
            var impactList = document.createElement('div');
            var technologyTitle = document.createElement('h5');
            var demoTitle = document.createElement('h5');

            leftColumn.className = 'project-case-left';
            if (result.media && result.media.type === 'live') {
                leftColumn.classList.add('has-live-media');
            }
            leftMeta.className = 'project-case-left-meta';
            detailHeader.className = 'project-case-header';
            expandedTitle.className = 'project-case-left-title';
            expandedTitle.textContent = projectTitle.textContent;
            functions.className = 'project-main-functions';
            functionsTitle.textContent = translate('projects.mainFunctions');
            functionsCopy.textContent = result.functions || summary.textContent;
            impactTitle.className = 'project-case-section-title';
            impactTitle.textContent = translate('projects.impact');
            impactList.className = 'project-impact-list';
            technologyTitle.className = 'project-case-section-title';
            technologyTitle.textContent = translate('projects.technologies');
            demoTitle.className = 'project-case-section-title project-demo-title';
            demoTitle.textContent = translate('projects.demoStatus');
            toggle.setAttribute('aria-label', translate('projects.viewCase'));
            toggle.setAttribute('title', translate('projects.viewCase'));

            leftMeta.appendChild(expandedCategory);
            if (expandedYear) {
                expandedYear.classList.add('project-case-year');
                detailHeader.appendChild(expandedYear);
            }
            if (result.links) {
                if (legacyProjectLink) {
                    legacyProjectLink.remove();
                }
                if (result.links.repository) {
                    detailHeader.appendChild(createProjectLink(result.links.repository, 'repository', projectTitle.textContent));
                }
                if (result.links.website) {
                    detailHeader.appendChild(createProjectLink(result.links.website, 'website', projectTitle.textContent));
                }
            } else if (legacyProjectLink) {
                var legacyUrl = legacyProjectLink.href;
                var legacyType = legacyProjectLink.querySelector('.fa-github') ? 'repository' : 'website';
                legacyProjectLink.remove();
                detailHeader.appendChild(createProjectLink(legacyUrl, legacyType, projectTitle.textContent));
            }
            var detailLocation = createProjectLocation(result.location, true);

            functions.append(functionsTitle, functionsCopy);
            (result.impacts || result.impact || []).forEach(function(impact) {
                var item = document.createElement('span');
                var icon = document.createElement('i');
                icon.className = 'fas fa-check';
                icon.setAttribute('aria-hidden', 'true');
                item.append(icon, document.createTextNode(impact));
                impactList.appendChild(item);
            });

            if (!hasDemoConfig && !accessNote) {
                accessNote = createDemoNote(result.media && result.media.type === 'live' ? {
                    status: 'public',
                    title: translate('projects.publicWebsite'),
                    description: translate('projects.publicWebsiteDescription')
                } : null);
            }

            visual.dataset.projectFolder = result.folder;
            buildProjectMedia(visual, result.media, projectTitle.textContent);
            var projectAction = createProjectAction(result.action);
            if (projectAction) {
                visual.appendChild(projectAction);
            }
            visual.insertAdjacentElement('beforebegin', leftColumn);
            leftColumn.appendChild(visual);
            leftColumn.append(leftMeta, expandedTitle, functions);
            if (detailLocation) {
                leftColumn.appendChild(detailLocation);
            }
            projectTitle.insertAdjacentElement('afterend', toggle);

            var copyHeadings = caseCopy.querySelectorAll('h5');
            if (copyHeadings[0]) {
                copyHeadings[0].textContent = translate('projects.whatSolved');
            }
            if (copyHeadings[1]) {
                copyHeadings[1].textContent = translate('projects.howSolved');
            }

            meta.remove();
            detailsInner.replaceChildren(detailHeader, caseCopy, impactTitle, impactList, technologyTitle, technologies);
            if (accessNote) {
                detailsInner.append(demoTitle, accessNote);
            }
        }

        function buildProjectMedia(visual, media, projectTitle) {
            if (!media || media.type !== 'live') {
                visual.classList.add('project-gallery-ready');
                visual.dataset.galleryLoaded = 'false';
                visual.dataset.projectTitle = projectTitle;
                return;
            }

            if (!media.url) {
                var pendingImage = visual.querySelector('img');
                if (pendingImage) {
                    pendingImage.alt = translate('projects.coverAlt', { project: projectTitle });
                }
                visual.classList.add('project-live-pending');
                return;
            }

            var browser = document.createElement('div');
            var toolbar = document.createElement('div');
            var controls = document.createElement('span');
            var address = document.createElement('span');
            var externalLink = document.createElement('a');
            var externalIcon = document.createElement('i');
            var frame = document.createElement('iframe');

            browser.className = 'project-live-browser';
            toolbar.className = 'project-browser-toolbar';
            controls.className = 'project-browser-controls';
            controls.setAttribute('aria-hidden', 'true');
            controls.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
            address.className = 'project-browser-address';
            address.textContent = media.label;
            externalLink.href = media.url;
            externalLink.target = '_blank';
            externalLink.rel = 'noopener noreferrer';
            externalLink.setAttribute('aria-label', translate('projects.openInTab', { project: projectTitle }));
            externalLink.title = translate('projects.openWebsite');
            externalIcon.className = 'fas fa-external-link-alt';
            externalIcon.setAttribute('aria-hidden', 'true');
            externalLink.appendChild(externalIcon);
            frame.src = media.url;
            frame.title = translate('projects.livePreview', { project: projectTitle });
            frame.loading = 'lazy';
            frame.referrerPolicy = 'strict-origin-when-cross-origin';

            toolbar.append(controls, address, externalLink);
            browser.append(toolbar, frame);
            visual.replaceChildren(browser);
            visual.classList.add('has-live-browser');
        }

        function initializeProjectGallery(card) {
            var visual = card.querySelector('.project-gallery-ready[data-gallery-loaded="false"]');

            if (!visual) {
                return;
            }

            visual.dataset.galleryLoaded = 'loading';
            visual.classList.add('is-gallery-loading');
            var folder = visual.dataset.projectFolder;
            var basePath = 'img/projects/' + folder + '/';
            var slides = [];

            function addSlide(path) {
                if (!path) return;
                slides.push(path);
                if (slides.length === 1) {
                    renderProjectGallery(visual, slides);
                } else if (typeof visual.refreshProjectGallery === 'function') {
                    visual.refreshProjectGallery();
                }
            }

            function finishLoading() {
                visual.dataset.galleryLoaded = 'true';
                visual.classList.remove('is-gallery-loading');
                if (typeof visual.refreshProjectGallery === 'function') {
                    visual.refreshProjectGallery();
                }
            }

            function probe(fileName, onComplete) {
                var image = new Image();
                image.onload = function() { onComplete(basePath + fileName); };
                image.onerror = function() { onComplete(null); };
                image.src = basePath + fileName;
            }

            function probeNumber(index) {
                if (index > 12) {
                    finishLoading();
                    return;
                }

                probe(index + '.png', function(path) {
                    if (!path) {
                        finishLoading();
                        return;
                    }
                    addSlide(path);
                    probeNumber(index + 1);
                });
            }

            probe('portada.png', function(path) {
                if (path) {
                    addSlide(path);
                    probeNumber(1);
                    return;
                }

                probe('1.png', function(firstNumberedImage) {
                    if (!firstNumberedImage) {
                        finishLoading();
                        return;
                    }
                    addSlide(firstNumberedImage);
                    probeNumber(2);
                });
            });
        }

        function animateProjectSlide(image, direction, enlarged) {
            if (!direction || !image.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            var distance = enlarged ? 42 : 24;
            image.animate([
                { opacity: 0.25, transform: 'translateX(' + (direction * distance) + 'px) scale(0.99)' },
                { opacity: 1, transform: 'translateX(0) scale(1)' }
            ], {
                duration: enlarged ? 340 : 280,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
        }

        function renderProjectGallery(visual, slides) {
            visual.dataset.galleryLoaded = 'true';
            visual.classList.remove('is-gallery-loading');

            if (!slides.length) {
                return;
            }

            var projectTitle = visual.dataset.projectTitle;
            var overlays = Array.prototype.slice.call(visual.querySelectorAll(':scope > a, :scope > .project-agent-action'));
            var gallery = document.createElement('div');
            var viewport = document.createElement('div');
            var image = document.createElement('img');
            var navigation = document.createElement('div');
            var previous = document.createElement('button');
            var next = document.createElement('button');
            var previousIcon = document.createElement('i');
            var nextIcon = document.createElement('i');
            var counter = document.createElement('span');
            var currentIndex = 0;

            gallery.className = 'project-gallery';
            viewport.className = 'project-gallery-viewport';
            image.className = 'project-gallery-image';
            navigation.className = 'project-gallery-navigation';
            previous.type = 'button';
            previous.className = 'project-gallery-control';
            previous.setAttribute('aria-label', translate('projects.previousImage'));
            next.type = 'button';
            next.className = 'project-gallery-control';
            next.setAttribute('aria-label', translate('projects.nextImage'));
            previousIcon.className = 'fas fa-chevron-left';
            nextIcon.className = 'fas fa-chevron-right';
            previousIcon.setAttribute('aria-hidden', 'true');
            nextIcon.setAttribute('aria-hidden', 'true');
            counter.className = 'project-gallery-counter';
            previous.appendChild(previousIcon);
            next.appendChild(nextIcon);

            function showSlide(index, direction) {
                currentIndex = (index + slides.length) % slides.length;
                image.src = slides[currentIndex];
                image.alt = translate('projects.imageOf', { current: currentIndex + 1, total: slides.length }) + ': ' + projectTitle;
                image.setAttribute('aria-label', translate('projects.imageOf', { current: currentIndex + 1, total: slides.length }));
                counter.textContent = (currentIndex + 1) + ' / ' + slides.length;
                previous.disabled = slides.length < 2;
                next.disabled = slides.length < 2;
                animateProjectSlide(image, direction, false);
            }

            visual.refreshProjectGallery = function() {
                counter.textContent = (currentIndex + 1) + ' / ' + slides.length;
                previous.disabled = slides.length < 2;
                next.disabled = slides.length < 2;
            };

            previous.addEventListener('click', function() { showSlide(currentIndex - 1, -1); });
            next.addEventListener('click', function() { showSlide(currentIndex + 1, 1); });
            image.tabIndex = 0;
            image.setAttribute('role', 'button');
            image.addEventListener('click', function(event) {
                event.stopPropagation();
                openProjectLightbox(slides, currentIndex, projectTitle);
            });
            image.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    openProjectLightbox(slides, currentIndex, projectTitle);
                }
            });
            viewport.appendChild(image);
            navigation.append(previous, counter, next);
            gallery.append(viewport, navigation);
            visual.replaceChildren(gallery);
            overlays.forEach(function(overlay) { visual.appendChild(overlay); });
            showSlide(0);
            trackProjectConnections(350);
        }

        function openProjectLightbox(slides, startIndex, projectTitle) {
            var previousLightbox = document.querySelector('.project-lightbox');
            var returnFocus = document.activeElement;
            if (previousLightbox) {
                previousLightbox.remove();
            }

            var lightbox = document.createElement('div');
            var dialog = document.createElement('div');
            var image = document.createElement('img');
            var close = document.createElement('button');
            var previous = document.createElement('button');
            var next = document.createElement('button');
            var closeIcon = document.createElement('i');
            var previousIcon = document.createElement('i');
            var nextIcon = document.createElement('i');
            var counter = document.createElement('span');
            var currentIndex = startIndex;

            lightbox.className = 'project-lightbox';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-modal', 'true');
            lightbox.setAttribute('aria-label', projectTitle + ' - ' + translate('projects.imageOf', { current: currentIndex + 1, total: slides.length }));
            dialog.className = 'project-lightbox-dialog';
            image.className = 'project-lightbox-image';
            close.type = 'button';
            close.className = 'project-lightbox-close';
            close.setAttribute('aria-label', translate('projects.closeGallery'));
            previous.type = 'button';
            previous.className = 'project-lightbox-control project-lightbox-previous';
            previous.setAttribute('aria-label', translate('projects.previousImage'));
            next.type = 'button';
            next.className = 'project-lightbox-control project-lightbox-next';
            next.setAttribute('aria-label', translate('projects.nextImage'));
            closeIcon.className = 'fas fa-times';
            previousIcon.className = 'fas fa-chevron-left';
            nextIcon.className = 'fas fa-chevron-right';
            closeIcon.setAttribute('aria-hidden', 'true');
            previousIcon.setAttribute('aria-hidden', 'true');
            nextIcon.setAttribute('aria-hidden', 'true');
            counter.className = 'project-lightbox-counter';
            close.appendChild(closeIcon);
            previous.appendChild(previousIcon);
            next.appendChild(nextIcon);

            function showSlide(index, direction) {
                currentIndex = (index + slides.length) % slides.length;
                image.src = slides[currentIndex];
                image.alt = translate('projects.imageOf', { current: currentIndex + 1, total: slides.length }) + ': ' + projectTitle;
                counter.textContent = (currentIndex + 1) + ' / ' + slides.length;
                previous.disabled = slides.length < 2;
                next.disabled = slides.length < 2;
                animateProjectSlide(image, direction, true);
            }

            function closeLightbox() {
                document.removeEventListener('keydown', handleKeyboard);
                document.body.classList.remove('project-lightbox-open');
                lightbox.classList.remove('is-visible');
                setTimeout(function() {
                    lightbox.remove();
                    if (returnFocus && typeof returnFocus.focus === 'function') {
                        returnFocus.focus();
                    }
                }, 180);
            }

            function handleKeyboard(event) {
                if (event.key === 'Escape') {
                    closeLightbox();
                } else if (event.key === 'ArrowLeft') {
                    showSlide(currentIndex - 1, -1);
                } else if (event.key === 'ArrowRight') {
                    showSlide(currentIndex + 1, 1);
                }
            }

            close.addEventListener('click', closeLightbox);
            previous.addEventListener('click', function() { showSlide(currentIndex - 1, -1); });
            next.addEventListener('click', function() { showSlide(currentIndex + 1, 1); });
            lightbox.addEventListener('click', function(event) {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });
            document.addEventListener('keydown', handleKeyboard);
            dialog.append(image, close, previous, next, counter);
            lightbox.appendChild(dialog);
            document.body.appendChild(lightbox);
            document.body.classList.add('project-lightbox-open');
            showSlide(currentIndex);
            requestAnimationFrame(function() {
                lightbox.classList.add('is-visible');
                close.focus();
            });
        }

        function createProjectPreview(project) {
            var card = document.createElement('article');
            var info = document.createElement('div');
            var iconContainer = document.createElement('div');
            var icon = document.createElement('i');
            var category = document.createElement('span');
            var titleRow = document.createElement('div');
            var title = document.createElement('h4');
            var summary = document.createElement('p');
            var hasCaseStudy = Boolean(project.functions && project.problem && project.solution);

            card.className = 'project-card project-case-card project-preview-card';
            info.className = 'project-info';
            iconContainer.className = 'project-list-icon';
            iconContainer.setAttribute('aria-hidden', 'true');
            icon.className = 'fas ' + project.icon;
            category.className = 'project-category';
            category.textContent = project.category;
            titleRow.className = 'project-title-row';
            title.textContent = project.name || project.title;
            summary.className = 'project-summary';
            summary.textContent = project.summary;

            var clientLocation = createProjectLocation(project.location, false);
            if (clientLocation) {
                info.classList.add('has-project-location');
                info.appendChild(clientLocation);
            }

            iconContainer.appendChild(icon);
            titleRow.appendChild(title);

            if (hasCaseStudy) {
                var visual = document.createElement('div');
                var cover = document.createElement('img');
                var year = document.createElement('time');
                var yearIcon = document.createElement('i');
                var technologies = document.createElement('div');
                var toggle = document.createElement('button');
                var toggleIcon = document.createElement('i');
                var details = document.createElement('div');
                var detailsInner = document.createElement('div');
                var caseCopy = document.createElement('div');
                var problemTitle = document.createElement('h5');
                var problem = document.createElement('p');
                var solutionTitle = document.createElement('h5');
                var solution = document.createElement('p');
                var meta = document.createElement('div');
                var detailsId = 'project-' + project.folder + '-details';

                card.classList.remove('project-preview-card');
                visual.className = 'project-visual';
                cover.className = 'project-image project-image-placeholder';
                cover.src = 'img/codificacion.png';
                cover.alt = translate('projects.coverAlt', { project: project.name });
                year.dateTime = project.year;
                yearIcon.className = 'far fa-calendar-alt';
                yearIcon.setAttribute('aria-hidden', 'true');
                year.append(yearIcon, document.createTextNode(project.year));
                titleRow.appendChild(year);
                technologies.className = 'project-tech-grid';
                toggle.type = 'button';
                toggle.className = 'project-case-toggle';
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-controls', detailsId);
                toggle.setAttribute('aria-label', translate('projects.viewCase'));
                toggle.title = translate('projects.viewCase');
                toggleIcon.className = 'fas fa-chevron-down';
                toggleIcon.setAttribute('aria-hidden', 'true');
                toggle.appendChild(toggleIcon);
                details.id = detailsId;
                details.className = 'project-case-details';
                details.setAttribute('aria-hidden', 'true');
                details.setAttribute('inert', '');
                detailsInner.className = 'project-case-details-inner';
                caseCopy.className = 'project-case-copy';
                problemTitle.textContent = translate('projects.whatSolved');
                problem.textContent = project.problem;
                solutionTitle.textContent = translate('projects.howSolved');
                solution.textContent = project.solution;
                meta.className = 'project-case-meta';
                caseCopy.append(problemTitle, problem, solutionTitle, solution);
                detailsInner.append(caseCopy, meta);
                details.appendChild(detailsInner);
                visual.appendChild(cover);
                info.append(iconContainer, category, titleRow, summary, technologies, toggle, details);
                card.replaceChildren(visual, info);
                enhanceProjectCase(card, project);
                initializeInteractiveProjectCard($(card));
                return card;
            }

            info.append(iconContainer, category, titleRow, summary);
            card.appendChild(info);
            return card;
        }

        function collapseProjectCase(card) {
            card.removeClass('is-expanded');
            card.attr('aria-expanded', 'false');
            card.closest('.project-group-panel').removeClass('has-expanded-card');
            card.find('.project-case-toggle')
                .attr('aria-expanded', 'false')
                .attr('aria-label', translate('projects.viewCase'))
                .attr('title', translate('projects.viewCase'));
            card.find('.project-case-details')
                .attr('aria-hidden', 'true')
                .attr('inert', '');
        }

        $(document).on('click', '.project-case-toggle', function() {
            var button = $(this);
            var card = button.closest('.project-case-card');
            var willOpen = !card.hasClass('is-expanded');

            $('.project-case-card.is-expanded').not(card).each(function() {
                collapseProjectCase($(this));
            });

            card.toggleClass('is-expanded', willOpen);
            card.attr('aria-expanded', willOpen ? 'true' : 'false');
            card.closest('.project-group-panel').toggleClass('has-expanded-card', willOpen);
            button.attr('aria-expanded', willOpen ? 'true' : 'false');
            button.attr('aria-label', willOpen ? translate('projects.collapseCase') : translate('projects.viewCase'));
            button.attr('title', willOpen ? translate('projects.collapseCase') : translate('projects.viewCase'));
            card.find('.project-case-details')
                .attr('aria-hidden', willOpen ? 'false' : 'true')
                .prop('inert', !willOpen);

            if (willOpen) {
                initializeProjectGallery(card[0]);
            }

            if (!willOpen) {
                card.addClass('suppress-case-hint').one('mouseleave', function() {
                    card.removeClass('suppress-case-hint');
                });
                this.blur();
            }

            trackProjectConnections(520);
        });

        function initializeInteractiveProjectCard(card) {
            var toggle = card.find('.project-case-toggle');

            if (!toggle.length || card.hasClass('is-case-interactive')) {
                return;
            }

            card.addClass('is-case-interactive')
                .attr('tabindex', '0')
                .attr('aria-expanded', 'false')
                .attr('aria-controls', toggle.attr('aria-controls'));

            card.on('click', function(event) {
                if ($(event.target).closest('a, button').length) {
                    return;
                }
                toggle.trigger('click');
            });

            card.on('keydown', function(event) {
                if ((event.key === 'Enter' || event.key === ' ') && !$(event.target).is('a, button')) {
                    event.preventDefault();
                    toggle.trigger('click');
                }
            });
        }

        $('.project-case-card').each(function() {
            initializeInteractiveProjectCard($(this));
        });

        $(window).on('resize', function() {
            window.requestAnimationFrame(function() {
                drawProjectConnections(true);
            });
        });

        window.addEventListener('load', function() {
            window.requestAnimationFrame(function() {
                drawProjectConnections(true);
            });
        });

        var educationDialog = document.getElementById('education-document-dialog');
        var educationTrigger = document.querySelector('.education-document-trigger');
        var educationClose = document.querySelector('.education-document-close');

        if (educationDialog && educationTrigger && educationClose) {
            educationTrigger.addEventListener('click', function() {
                educationDialog.showModal();
            });

            educationClose.addEventListener('click', function() {
                educationDialog.close();
            });

            educationDialog.addEventListener('click', function(event) {
                if (event.target === educationDialog) {
                    educationDialog.close();
                }
            });

            document.querySelectorAll('.education-protected-image').forEach(function(image) {
                image.addEventListener('contextmenu', function(event) {
                    event.preventDefault();
                });

                image.addEventListener('dragstart', function(event) {
                    event.preventDefault();
                });
            });
        }


});
