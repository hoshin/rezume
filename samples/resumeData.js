var resumeData = {
    title              : 'Hoshin\'s resume',
    header             : {
        name        : 'Hoshin Awen',
        position    : 'Software Craftsnyan',
        addressLine1: '123 Clarendon road,',
        addressLine2: 'London E18 2AW',
        phone       : '0412 658 4586',
        email       : 'hoshin@awen.co.uk',
        twitter     : 'MartinBahier',
        picture     : 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.algodoo.com%2Falgobox%2Fupload%2Fimage%2F54422_nyan_cat4.png&f=1',
        github      : 'hoshin'
    },
    about              : {
        title   : 'About me',
        contents: 'I\'m a cat who likes rainbows and having a pop tart stuck on my side while I travel through space.'
    },
    academic           : [
        {
            title      : 'Masters in Computer Science',
            description: '(My fancy university)',
            year       : '1234',
            show       : true
        }
    ],
    academicTitle      : 'Academic Knowledge',
    relevantAssignments: {
        title  : 'Relevant assignments',
        comment: ' - as a freelancer since 1994',
        list   : [assignments.assignment1]
    },
    otherAssignments   : {
        title  : 'Other assignments',
        comment: '',
        list   : [assignments.assignment2]
    },
    annex              : {
        title       : 'Annex',
        skills      : {
            title        : 'Skills',
            tech         : {
                title: 'Technical', list: [
                    'JavaScript (NodeJS / AngularJS), HTML5, CSS3 development,',
                    'Linux administration,',
                    'Shell scripting: Bash,'
                ]
            },
            architecture : {
                title: 'Architecture & Technologies', list: [
                    'Project delivery : conception, development, QA, deployment,',
                    'Load testing : Excylis Gatling.'
                ]
            },
            methodologies: {
                title: 'Methodologies', list: [
                    'SCRUM,',
                    ' Kanban,',
                    'Test Driven Development,'
                ]
            },
            other        : {
                title: 'Other skills', list: [
                    'Data structures : XML, JSON',
                    'Version control systems : Git, SVN.'
                ]
            }
        },
        publications: {
            title: 'Conferences / papers',
            list : [
                "Some thing you've written or presented, talks you've been to as a speaker",
                "Some other thing you've done that you think is relevant"
            ]
        },
        misc        : {
            title: 'Miscelaneous',
            list : [
                "Leisure : Nyan-ing in space, Fantasy, cinnamon rolls",
                "Whatever you feel like writing"
            ]
        }
    }
};