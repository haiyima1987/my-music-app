import * as React from 'react';

class About extends React.Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="about-wrapper">
            <h1>Summary of this music search app/assessment</h1>
            <p>Hi. It's a very nice assessment. I liked it a lot! I haven't worked with React for long time so lately I
              caught up some latest updates in React and implemented some of them in this assignment to practice.</p>
            <p>Therefore, the finished website definitely looks like more than 4 hours' work. But I will explain below
              which parts are within and which parts are outside the 4 hours.</p>
            <h2>Within 4 hours mark:</h2>
            <ul>
              <li>Project initialization and file structure</li>
              <li>API connection handling setup</li>
              <li>Store setup</li>
              <li>Login page</li>
              <li>Search page</li>
              <li>Track list page</li>
              <li>Artist list page</li>
              <li>Album list page</li>
            </ul>
            <h2>Outside 4 hours mark:</h2>
            <ul>
              <li>Protected routes</li>
              <li>Infinite scroll wrapper component</li>
              <li>Simple responsive design</li>
              <li>Image styling optimization</li>
              <li>About page</li>
              <li>Navigation</li>
              <li>404 and logout pages</li>
            </ul>
            <h2>Some remarks:</h2>
            <ul>
              <li>React Redux is chosen to do the state management since it's a tool/methodology I used in the past.
                There are many updates in these years and I selected some of the useful ones I find interesting.
              </li>
              <li>The DataHandler and ApiHandler files are in JavaScript since they are just 2 files I use usually to
                handle API, cookies, local storage, etc. They are "plug-and-play" files which are almost generic to all
                JS/TS projects.
              </li>
              <li>Due to the limited time, the token refresh on route enter isn't implemented. It can be seen as future
                extension. Currently only the existence of the token is checked.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
