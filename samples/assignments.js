var assignments = [{
    name: 'English',
    expectedHeaders: ['twitter', 'github', 'email', 'name', 'position', 'phone'],
    resumeData: {},
    assignment1: {
        logo: 'not-available',
        logoAlt: 'Not available alt',
        duration: 'September 2014 - February 2016',
        shortDescription: "A short description of your fancy project",
        keywords: 'NodeJS, OpenID Connect',
        title: 'What you want to go on top of the description (projectname / position probably)'
    },
    assignment2: {
        logo: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.algodoo.com%2Falgobox%2Fupload%2Fimage%2F54422_nyan_cat4.png&f=1',
        logoAlt: 'Nyanyanyanyanyanyanyanya...',
        duration: 'Hours',
        shortDescription: "<p>You can use basic <b>HTML</b> formatting</p><ul><li>Sometimes it helps</li><li>with concision</li></ul>",
        keywords: 'Rainbows, space, kittens',
        title: 'Nya!'
    }
},
    {
        name: 'French',
        expectedHeaders: ['twitter', 'github', 'email', 'name', 'addressLine1', 'addressLine2', 'position', 'phone', 'picture'],
        resumeData: {
            about: {
                title: 'À propos de moi',
                contents: 'Je suis un chat qui aime les arc-en-ciel et avoir une pop-tart collée sur le côté pendant que je voyage dans l\'espace.'
            },
            academic: [
                {
                    title: 'Master en Sciences Informatiques',
                    description: '(Ma super université)',
                    year: '1234',
                    show: true
                }
            ],
            relevantAssignments: {title: 'Missions', comment:' - Comme freelance depuis 1994'},
            otherAssignments: {title: 'Autres missions'}
        },
        assignment1: {
            logo: 'not-available',
            logoAlt: 'Not available alt',
            duration: 'Septembre 2014 - Février 2016',
            shortDescription: "Une courte description de mon super projet",
            keywords: 'NodeJS, OpenID Connect',
            title: 'Le titre que vous voulez voir apparaître au dessus (son nom / probablement votre rôle aussi)'
        },
        assignment2: {
            logo: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.algodoo.com%2Falgobox%2Fupload%2Fimage%2F54422_nyan_cat4.png&f=1',
            logoAlt: 'Nyanyanyanyanyanyanyanya...',
            duration: 'Quelques heures',
            shortDescription: "<p>Vous pouvez utiliser un formattage <b>HTML</b> basique</p><ul><li>Des fois ça permet</li><li>d'être plus concis</li></ul>",
            keywords: 'Arcs-en ciel, espace, chatons',
            title: 'Nya!'
        }
    }
];