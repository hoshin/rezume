var assignments_fr = {
    name: 'Français',
    resumeData: {
        about: {
            title: 'À propos de moi',
            contents: '<p>Je suis passionné par le développement et l\'amélioration continue. J\'aime me plonger dans des sujets de développement complexes mais aussi travailler sur les autres aspects d\'un projet (comme les rituels agiles, par exemple).</p><p>Mon objectif est en transmettre mes connaissances et de construire des systèmes fiables, testés qui font la différence pour leurs utilisateurs. Je travaille à des projets personnels sur mon temps libre (la plupart atterrit sur mon compte github).</a></p>'
        },
        academic:[
            {
                title: 'Mastère Spécialisé : Management de Projets Technologiques (MS MPT)',
                description: 'Essec / Telecom Paris',
                year: '2010',
                show: true
            }, {
                title: 'M2 informatique',
                description: 'Université Paris Diderot',
                year: '2009',
                show: true
            }, {
                title: 'Anglais (diplômes / scores)',
                description: 'CAE (Cambridge, 2006), TOEFL 2010 (945/990)',
                year: '',
                show: true
            }
        ],
        academicTitle: 'Formation',
        relevantAssignments: {
            title: 'Missions'
        },
        annex:{
            title: 'Annexe',
            skills: {
                title: 'Compétences',
                tech: {
                    title: 'Technique', list: [
                        'JavaScript (NodeJS+Express / AngularJS), JQuery, HTML5, CSS3 development,',
                        'JS testing & code quality : Mocha, Chai, Sinon, Ava, PhantomJS, protractor, Istanbul, plato',
                        'Build tools: Less / Sass, Gulp, webpack',
                        'Shell: Bash,',
                        'Spring Framework (C#.Net/Java)',
                        'Structures de données : XML, JSON',
                        'Bases de données non-relationnnelles : MongoDB',
                        'Bases de données relationnelles : MySQL, PostgreSQL'
                    ]
                },
                architecture: {
                    title: 'Outillage', list: [
                        'Tests de charge : Excylis Gatling.',
                        'Systèmes de gestion de version : Git, SVN.',
                        'Usine logicielle (Teamcity, Jenkins)',
                        'Administration Linux'
                    ]
                },
                methodologies: {
                    title: 'Méthodologies', list: [
                        'SCRUM,',
                        'Kanban,',
                        'Test Driven Development,',
                        'Continuous delivery'
                    ]
                },
                other: {
                    title: 'Autres compétences', list: [
                        'Réalisation de projet : développement, QA, déploiement,',
                        'Tech Leading / Mentoring'
                    ]
                }
            },
            publications: {
                title: 'Conférences / articles, contributions',
                list: [
                    "Améliorations de la stratégie passport du Battle.net connector <a href='https://github.com/Blizzard/passport-bnet/pull/12'>https://github.com/Blizzard/passport-bnet/pull/12</a>",
                    "Introduction à l'Agile à l'Univ. Paris Diderot<ul><li>2011 : <a href='http://www.liafa.univ-paris-diderot.fr/~yunes/cours/conferences/MartinBahier2011.pdf'>http://www.liafa.univ-paris-diderot.fr/~yunes/cours/conferences/MartinBahier2011.pdf</a></li><li>2012 : <a href='http://www.liafa.univ-paris-diderot.fr/~yunes/cours/conferences/MartinBahier2012.pdf'>http://www.liafa.univ-paris-diderot.fr/~yunes/cours/conferences/MartinBahier2012.pdf</a></li></ul>",
                    "Blog Octo Technology (co-auteur): \"Passer d'un système de build 100% TFS à un duo Teamcity + Git : Est-ce que cela vaut le coup?\" <a href='http://blog.octo.com/usine-de-developpement-net-avec-git-et-teamcity/'>http://blog.octo.com/usine-de-developpement-net-avec-git-et-teamcity/</a>"
                ]
            },
            misc: {
                title: 'Divers',
                list: [
                    "Joueur passionné, fan d'E-Sports (Starcraft 2, Overwatch), organisateur de tournois Starcraft 2",
                    "Compte GitHub : <a href=\"https://github.com/hoshin\">https://github.com/hoshin</a>",
                    "Membre de l'APRIL et de la FSF",
                    "Blog \"Tech\" : <a href=\"http://hoshin.github.io\">http://hoshin.github.io</a>"
                ]
            }
        }
    },
    prestashop: {
        logo: 'prestashop',
        logoAlt: 'Prestashop',
        duration: '2017',
        shortDescription: "<p>Construire une API e-commerce robuste et scalable</p>",
        keywords: 'NodeJS, REST API, e-commerce, CI/CD',
        title: 'Développeur R&D - Prestashop'
    },
    tl_bandeau: {
        logo: 'laposte',
        logoAlt: 'La Poste',
        duration: '2016',
        keywords: 'Mentoring, NodeJS, Hapi, BackboneJs, SAML, REST API, SPA, CI/CD',
        shortDescription: "<p>Améliorer la façon dont les postiers travaillent en leur fournissant un moyen unique d'accès à leurs applications. Avec 2 développeurs junior, nous avons livré : </p><ul><li>Un ruban 'façon Google' facilement intégrable dans les applications du groupe</li><li>Un catalogue d'applications (pour remplacer la page existante)</li><li>L'API qui expose le catalogue, le tient à jour, et ajoute des fonctionnalités comme les favoris ou les alertes.</li></ul><p>Lors du déploiement (35k utilisateurs le 1er jour), l'API n'a pas eu de soucis de charge, et n'a pas été un \"bottleneck\" pour les applications l'intégrant.</p>",
        title: 'Technical leader - La Poste'
    },
    sncf: {
        logo: 'sncf',
        logoAlt: 'SNCF',
        duration: 'June 2016',
        shortDescription: "Avec un autre consultant, nous avons travaillé avec la SNCF pour les aider à travailler avec leurs partenaires. En particulier sur comment avoir un standard technique cohérent en termes d'implémentation de concepts métier entre les projets.",
        keywords: 'Java',
        title: 'Consultant / Développeur Sénior - SNCF'
    },
    legal_and_general: {
        logo: 'legal_general',
        logoAlt: 'L&G',
        duration: 'May 2013 - Oct. 2013',
        shortDescription: "Refonte du site grand public & de l'espace clients",
        keywords: 'ASP.net, BackboneJS, Orchard',
        title: 'Développeur - Legal & General'
    },
    ludwig: {
        logo: 'incubateur',
        logoAlt: 'Incubateur',
        duration: 'Jan. 2016 - Jun. 2016',
        shortDescription: "Ludwig est un outil dont l'objectif est de réduire les étapes entre une suggestion d'amélioration pour un logiciel et celui où le mainteneur dispose des tests automatisés correspondants. <a href='https://github.com/sgmap/ludwig'>https://github.com/sgmap/ludwig</a>",
        keywords: 'NodeJS, ExpressJs, Github API',
        title: 'Développeur Sénior - "Startups d\'État"'
    },
    france_connect: {
        logo: 'france_connect',
        logoAlt: 'SGMAP',
        duration: '2014 - 2016',
        shortDescription: "<p>FranceConnect est un projet d'État qui s'appuie sur les moyens d'authentification déjà disponibles pour les citoyens (impôts, CNAM ...) pour créer un point unique où s'authentifier et accéder aux services de l'État avec un unique couple d'identifiants, choisi par le citoyen.</p><p>J'y ai été le bras droit du tech leader & mentoré 2 développeurs junior. Le service de base était déployé après 1 mois, nous avons ensuite travaillé à améliorer la documentation, le processus d'intégration des partenaires, la qualité générale & ajouté des fonctionnalités de confort.</p>",
        keywords: 'Mentoring, NodeJS, ExpressJs, OAuth2, REST API, CI/CD',
        title: 'Développeur Sénior / Tech Leader - FranceConnect'
    },
    ing: {
        logo: 'ing',
        logoAlt: 'ING',
        duration: 'June. 2014',
        shortDescription: "<p>Avec un second développeur, nous avons conçu et implémenté un prototype dont le but était de :<ul><li>Créer une API qui pourrait gérer des opérations classique de banque de détail à travers différentes banques.</li><li>Livrer une application mobile s'appuyant sur cette API pour faire des paiements</li></ul></p><p>Après 1 mois, cette première épruve a été montrée au CEO d'ING Hollande et a permis de démarrer le projet aujourd'hui connu sous le nom de Payconiq (<a href='https://payconiq.com/'>https://payconiq.com/</a>)</p>",
        keywords: 'Java, API, AngularJS, mobile, banking',
        title: 'Développement d\'un prototype d\'application de paiement mobile pour ING Hollande'
    },
    fm_logistics: {
        logo: 'fm_logistic',
        logoAlt: 'FM Logistic',
        duration: 'Mai 2014',
        shortDescription: "<p>Intégré des tests de charge au build continu : <ul><li>Créé des tests de charge ciblés (avec l'aide des product owners)</li><li>Configuré la palteforme d'IC pour qu'elle enregistre les tendances et casse le build si la performance descendait sous un certain seuil.</li></ul></p>",
        keywords: 'Excilys Gatling, Scala, Jenkins CI',
        title: 'Tests de charge - FM Logistic'
    },
    digiposte: {
        logo: 'digiposte',
        logoAlt: 'digiposte',
        duration: 'November 2012 - April 2013 & October 2013 - May 2014',
        shortDescription: "J'ai d'abord contribué à ce projet en aidant à valider des choix techniques. Dans un second temps, mon rôle est devenu de m'assurer de la qualité du logiciel produit (délais, documentation, déploiements, infra ...)",
        keywords: 'Architecture, gestion de projet',
        title: 'Chef de projet technique pendant la refonte de Digiposte'
    },
    asip: {
        logo: 'asip',
        logoAlt: 'Asip',
        duration: 'December 2010 – December 2011 & February 2012 – October 2012',
        shortDescription: "<p>J'ai contribué à réaliser une application connectée au \"DMP\" (le \"carnet de santé\" digital). Cette application avait 2 objectifs:</p><ul><li>Montrer aux professionnels de la santé ses bénéfices \"dans le contexte\" (i.e: une application qui pourrait être utilisée pour gérer une patientelle)</li><li>Montrer des composants réutilisable par des éditeurs de logiciels de santé afin de faciliter l'intégration du DMP, alors qu'il était considéré trop complexe par ces derniers.</li></ul><p>L'ASIP Santé est l'agence française en charge des sujets numériques autour du domaine de la santé.</p>",
        keywords: 'C# .Net, WPF, Java, ',
        title: 'Développeur - ASIP Santé'
    },
    orange: {
        logo: 'orange',
        logoAlt: 'Orange',
        duration: '2012',
        shortDescription: "iPhone en scène était une petite application qui mettait en scène des \"histoires utilisateur\" basées sur l'iPhone et ses applications. Mes responsabilités étaient de mettre à jour, réparer & réorganiser cette aplication, ainsi que de mettre à jour les outils permettant de la déployer.",
        keywords: 'PHP, JQuery',
        title: 'Développeur - Orange'
    },
    meltdown: {
        logo: 'meltdown',
        logoAlt: 'Meltdown',
        duration: '2014',
        keywords: 'NodeJS, BinaryBeast, tournament management, API wrapping',
        shortDescription: "<p>J'ai organisé un tournoi hebdomadaire pour le jeu Starcraft 2 & créé une application d'enregistrement pour ses joueurs:</p><ul><li>Création & exploitation de l'application (enregistrement, affichage des arbres, mise à disposition des replays)</li><li>Écrit & présenté le livre de règles au personnel du bar et aux clients</li><li>Géré le tournoi : Accueil des jouers & invités + liaison avec l'équipe du bar</li></ul>",
        title: 'Gestionnaire de tournoi & Développeur - Meltdown Bars'
    }
};