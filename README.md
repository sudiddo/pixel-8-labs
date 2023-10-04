# Pixel8Labs Product Developer Take-home Test

Thanks for your interest in working with us as a product developer.
This take-home test is for us to gauge your engineering capabilities and determine whether we can move to the work trial phase. It's not a test per se but rather a way for Pixel8Labs to know more about your abilities and also for you to see if you would like the kind of work we do, before we spend more time together in the work trial.

This test should not take you more than a few hours but you are allowed to spend more within the given 3 days just in case you want to touch things up and submit a polished piece of work.

## Tasks

Here are the requirements for the take-home project

### Basic tasks

Implement and deploy (to the platform provider of your choice) an application that

- [ ] Show profile of a github user / organization with:
  - [ ] Profile picture
  - [ ] Full name
  - [ ] Email if it's available
  - [ ] Numbers of followers and following
- [ ] Show the first 6 (or less if there're less repositories from such user) repositories of such user
- [ ] The default home page will redirect to `/octocat`
- [ ] Users can login using their github account using Oauth
- [ ] Show details about profile views:
  - [ ] The total number of views a profile have gotten (regardless whether the view was from an authenticated user or not)
  - [ ] The last 3 people who view a particular profile (link to those profiles on the same app as well)

The frontend design for this app can be found in [this Figma file](https://www.figma.com/file/fLiLQfjSF6X7pEfHli2Lwh/Fullstack-Engineer-Test-Case?type=design&node-id=0%3A1&mode=design&t=RfULQB2MF956TxTT-1)

**Notes**:

- Go usage is optional, you can create your own backend implementation in the backend folder.
- Frontend must be using React and the existing setup that we have in the [frontend](./frontend/) folder.
- Tailwind usage is optional, please feel free to use any CSS libraries / frameworks.

### Stretch (optional) tasks

These tasks are optional but we would encourage you to give them a try to demonstrate more of your skills

- [ ] Setup Github Actions workflow file for lint check on PRs to `master`
- [ ] Setup Github Actions workflow file to deploy on pushes to `master`
- [ ] Deploy the website and submit the URL to us

## Tips

- Github APIs that you might need to checkout:
  - [Github OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
  - [API to get an user profile](https://docs.github.com/en/free-pro-team@latest/rest/users/users?apiVersion=2022-11-28#get-a-user)
  - [API to get repos of an user](https://docs.github.com/en/free-pro-team@latest/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user)
- Remember to document your technical decisions and considerations as we're considering your thought process as much as the absolute development results.
- Last but not least, remember to **have fun**!!
