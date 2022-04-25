# Summary of this music search app/assessment
Hi. It's a very nice assessment. I liked it a lot! I haven't worked with React for long time so lately I caught up some latest updates in React and implemented some of them in this assignment to practice.

Therefore, the finished website definitely looks like more than 4 hours' work. But I will explain below which parts are within and which parts are outside the 4 hours.
## Within 4 hours mark:
* Project initialization and file structure
* API connection handling setup
* Store setup
* Login page
* Search page
* Track list page
* Artist list page
* Album list page
## Outside 4 hours mark:
* Protected routes
* Infinite scroll wrapper component
* Simple responsive design
* Image styling optimization
* About page
* Navigation
* 404 and logout pages
## Some remarks:
* React Redux is chosen to do the state management since it's a tool/methodology I used in the past. There are many updates in these years and I selected some of the useful ones I find interesting.
* The DataHandler and ApiHandler files are in JavaScript since they are just 2 files I use usually to handle API, cookies, local storage, etc. They are "plug-and-play" files which are almost generic to all JS/TS projects.
* Due to the limited time, the token refresh on route enter isn't implemented. It can be seen as future extension. Currently only the existence of the token is checked.
