# note-publish
notable.app interceptor


# setup
- install yarn
- `yarn install`
- `node index.js` or `vercel dev` if vercel cli is installed
- POST to /api/post


# requirements
- get a github personal access token and add the repo permission
- configure the SAMPLE.env and fill/replace with your desired setup


# deploying to vercel
- install vercel cli
- configure a new vercel project
- input the same environment variables fron SAMPLE.env into the build environment
- `vercel` to deploy