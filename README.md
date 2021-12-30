# note-publish
This is a small [Notable.app](https://notable.app) interceptor to take in a POST request from the "Share via Link..." function and publish a file directly to a Github repository, designed for easy blog posting.

I'm currently using it with [Hugo](https://gohugo.io) but I don't see why it also wouldn't work with Jekyll/any other Markdown based CMS with the appropriate fields in the front matter (see Requirements below).

This can be run locally or anywhere that can run node.js + some dependencies (I picked Vercel in this instance).


# Requirements
- Get a github personal access token and add the repo permission
- Configure `SAMPLE.env` and fill/replace with your desired setup
  - `NOTABLE_PASSWORD`: the password you set in Notable (default is none, recommend changing it, I suggest something long and unguessable)
  - `GITHUB_USER`: the username of the Github account
  - `GITHUB_REPO`: the name of the Github repository
  - `GITHUB_AUTH`: the Github Personal Access Token for the account
  - `GITHUB_PATH`: the path within the repo where the file should end up (content/blog is provided as an example)
  - `BLOG_URL`: the resulting published URL - this is only to provide Notable with the URL to copy to your clipboard. If you have a different blog setup, feel free to leave it as is, however you will have to retrieve the published URL by hand.
- Rename `SAMPLE.env` to just `.env`
- Files must contain a front matter with the following fields
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
- Input the same environment variables fron SAMPLE.env into the build environment
- `vercel` to deploy
  - Advanced configuration: set up separate "Preview" and "Production" repositories that way you can test publishing without affecting the actual site (requires forking this repository)


# Configuring notable.app
- Open Notable settings (File > Preferences > Settings...)
- Append the following to your global settings

```json
  ...
  ...},
  "sharing": {
    "endpoint": "https://<your hosted/vercel url here>/api/post",
    "password": "<your selected password here>",
    "ttl": 86400
  }
  ...
```

# Publishing from notable.app
- To publish, click **File > Share via Link...** or right click on the note and click **Share via Link...**
- If successful, your new blog post URL should be on your clipboard