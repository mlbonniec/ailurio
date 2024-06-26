# Ailurio

Dynamically generate images cover for your GitHub repository, issues, pull requests or commits.

The design and functionality are inspired by a new GitHub feature, which dynamically modifies `og:image` of GitHub repository pages.

## Table of Contents
- [Ailurio](#ailurio)
	- [Table of Contents](#table-of-contents)
	- [Preview](#preview)
	- [Functioning](#functioning)
	- [To-do](#to-do)

## Preview

When you make a `GET` request at `/mlbonniec/OnBoardingKit`, you'll get an image like this one. Displaying your repository statistics.  
You can create images for any GitHub repository.

[![OnBoardingKit](./docs/demo.png)](https://github.com/mlbonniec/OnBoardingKit)

## Functioning

Ailurio is a web server, running with [`Fastify`](https://www.fastify.io/), which serves images, generated by [`node-canvas`](https://github.com/Automattic/node-canvas) which allows to use HTML canvas from NodeJS.  
The data is retrieved from the GitHub API, using the official GitHub client for NodeJS, [`@octokit/rest.js`](https://octokit.github.io/rest.js/).

## To-do

- [ ] Catch errors
  - [x] Unexisting owner or repository
  - [ ] Rate limit
- [ ] Display contributors (*currently disabled due to GitHub pagination system*).
- [ ] Support issues
- [ ] Support commits
- [ ] Support pull requests
- [ ] Add caching system
- [x] Fix too long descriptions
- [ ] Fix build script
