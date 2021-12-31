# note-publish
This is a small [Notable.app](https://notable.app) interceptor to take in a POST request from the "Share via Link..." function and publish a file directly to a Github repository, designed for easy blog posting.

I'm currently using it with [Hugo](https://gohugo.io) but I don't see why it also wouldn't work with Jekyll/any other Markdown based CMS with the appropriate fields in the front matter (see Requirements below).

This can be run locally or anywhere that can run node.js + some dependencies (I picked Vercel in this instance).

Skip to "Configuring notable.app" if you just want to use the instance I've set up.

# Requirements
- Get a github personal access token and add the repo permission
- Configure `SAMPLE.env` and fill/replace with your desired setup - you will need these values later
  - `GITHUB_USER`: the username of the Github account
  - `GITHUB_REPO`: the name of the Github repository
  - `GITHUB_AUTH`: the Github Personal Access Token for the account
  - `GITHUB_PATH`: the path within the repo where the file should end up (content/blog is provided as an example)
  - `BLOG_URL`: the resulting published URL - this is only to provide Notable with the URL to copy to your clipboard. If you have a different blog setup, feel free to leave it as is, however you will have to retrieve the published URL by hand.
- Notable files must contain a front matter with the following fields at a minimum
  - date (in 2021-11-30T20:00:00-07:00 format)
  - slug (for blog url)

# Setup / Run
- Install nodejs and yarn
- `yarn install` to install dependencies
- `node index.js` to run locally
- `vercel dev` if Vercel CLI is installed

# Deploying to Vercel (optional)
- Install Vercel CLI
- Configure a new vercel project
- `vercel` to deploy

# Configuring notable.app
- Go to [https://note-publish.thinkaliker.com/](https://note-publish.thinkaliker.com/)
- Fill in all the fields with values from SAMPLE.env
  - No data is sent from the webpage. For the paranoid, inspect the source, or disconnect from the internet.
  - Note that the password is NOT ENCRYPTED, guard the password as well as your own Personal Access Token
- Press Generate Configuration
  - The configuration should be copied to your clipboard automatically
- Open Notable settings (File > Preferences > Settings...)
- Append the following to your global settings by pasting your clipboard

```json
  ...
  ...},
  "sharing":{
    "endpoint": "https://note-publish.thinkaliker.com/post/https%3A%2F%2Fexample.com%2Fblog/octocat/my-website/content/blog",
    "password": "<your generated password here>",
    "ttl": 86400
  }
  ...
```

# Publishing from notable.app
- To publish, click **File > Share via Link...** or right click on the note and click **Share via Link...**
- If successful, your new blog post URL should be on your clipboard