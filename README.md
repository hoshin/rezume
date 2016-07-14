# rEZume, because using .docx for resumes is a pain in the bum

rEZume is aimed at people that'd rather edit JS files than fire up a special text editor they only use to edit their resume in the first place.
It gives a certain level of flexibility, making edit / preview "as simple as" editing a single file and reloading a browser tab
rEZume enables you to pretty much write as much data as possible about you and what you've done so far "once and for all" and then 
decide to use it or not for a resume and in what order, and to avoid deleting or putting aside stuff. Also, this should render the modding of
resumes to fit the job opening in a job hunt a little easier (no more copy-pasting around, or at least as little as possible). 
It also enables "quick fixes" (like rearranging assignments, adding / removing keywords ...) to be actually quick without messing up your whole document.

# Features

* No special tools needed to edit / display / export to PDF
* You can version your work and keep track of the modifications you did
* You can switch on/off some features : 
    * Display "Relevant assignments" only / display all
    * Display keywords under assignments or not
* You can insert html code into the assignments descriptions. I'd suggest keeping it short though =)
* Makes a nice header section w/ most relevant data (the basics + twitter / github)
* Academic knowledge section lets you pick and mix what you want to show (aka, the "show" property on each academic knowledge entry)
* You can edit all the titles of all the sections and subsections to fit your needs

# How it works

Not much magic happening here, you fill in data, rEZume takes them and fills a template.

## Getting started

### Putting data together

The `samples/assignments.js` and `samples/resumeData.js` are sample files to get familiar with the data structure used. They respectively : 

- Contains the list of your (wonderful) professional assignments
- Contains basic personal information you'd probably find on any resume + some additions like twitter / github accounts 

### Loading data / configuring rEZume

On the sample html template, loading the data sums up to this : 

```
<script type="text/javascript" src="./samples/assignments.js" charset="utf-8"></script>
<script type="text/javascript" src="./samples/resumeData.js" charset="utf-8"></script>
```

Once you're done here, your template must load rEZume with the appropriate data and tell it to render the whole thing. This is done as follows in the sample template :

```
window.onload = function () {
    var resumeOptions = {
        showOtherAssignments: true,
        showKeywords        : true
    };

    try{
        // the 'assignments' var comes from the loading of the ./samples/assignments.js (that defines the variable).
        // same goes for the resumeData variable
        var resume = new Rezume(resumeOptions, resumeData, assignments, document);
        resume.render(document);
    } catch(err){
        document.getElementsByClassName('cv')[0].innerHTML = '';
        alert(err.message);
    }
};
```


## Advantages ?

* You can make a self contained resume if you cram everything in the same html file (well if you think you need to)
* Anyone with a basic browser will be able to display that resume.
* PDF export is a walk in the park from the browser.

## Drawbacks ?

It probably takes some getting used to to edit JS files to edit a resume, but it works, I swear =)

It's probably a bit cumbersome to rewrite your resume as "metadata" if you already have a neat one that does the job. 
This tool is probably more aimed at people planning to rewrite their resumes from scratch or just wanting to get rid of specific "resume writing" tools.

## Why not use a templating engine?

Multiple reasons for that, one being I wanted something where I could cram everything in one file and it'd still work,
 another would probably be that I simply did not know what to choose and did not want to get stuck with an ill chosen fwk 
 for such simple tasks and potentially have to deal with bugs and whatnot. That's why i've pretty much gone the vanilla way.

# The included template sucks ... anything you wanna do 'bout that?
Unfortunately no, I probably won't. But I'm okay with pull requests =)