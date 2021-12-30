const fm = require('front-matter');
const ok = require('octokit');
const Base64 = require('js-base64');
const Cors = require('cors');

function createResponse(url) {
    let response = {}
    response.id = "note-publish_interceptor";
    response.url = url;
    return JSON.stringify(response);
}

function createUrl(contents) {
    const frontMatter = fm(contents);
    const slugString = frontMatter.attributes.slug;
    const fileName = process.env.BLOG_URL + "/" + slugString;
    return fileName;
}

function createFilename(contents) {
    const frontMatter = fm(contents);
    const dateString = frontMatter.attributes.date.toISOString().slice(0,10);
    const slugString = frontMatter.attributes.slug;
    const fileName = dateString + '-' + slugString + '.md';
    return fileName;
}


async function checkSHA(octokit, path) {
    try {
        const result = await octokit.rest.repos.getContent({
            owner: process.env.GITHUB_USER,
            repo: process.env.GITHUB_REPO,
            path,
        });

        let shaResult = result?.data?.sha;
        console.log(`Github found SHA for ${path}: ${shaResult}`)
        return shaResult;
    } catch (err) {
        console.log(`Github returned error for ${path}, ignoring sha`);
        return '';
    }
}

async function sendToGithub(octokit, filename, contents) {
    const encodedContent = Base64.encode(contents);
    const path = process.env.GITHUB_PATH + '/' + filename;
    const sha = await checkSHA(octokit, path);
    
    try {
        const res = await octokit.rest.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_USER,
            repo: process.env.GITHUB_REPO,
            path: process.env.GITHUB_PATH + '/' + filename,
            message: '🤖 Published via note-publish',
            content: encodedContent,
            sha
        });
        console.log(`GitHub returned ${res.status}, new commit ${res.data.commit.sha}`);
    } catch (err) {
        console.error(err);
    }
}

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
  }

const handler = async (req, res) => {
    const octokit = new ok.Octokit({ auth: process.env.GITHUB_AUTH });
    const cors = Cors({
        methods: ['GET', 'POST']
    });

    await runMiddleware(req, res, cors);

    try {
        if (req.body['password'] === process.env.NOTABLE_PASSWORD) {
            console.log('Recieved post with correct password');
            const fileName = createFilename(req.body.md);
            const newUrlString = createUrl(req.body.md);
            const urlResponse = createResponse(newUrlString);
            console.log('Sending to Github');
            await sendToGithub(octokit, fileName, req.body.md);
            res.end(urlResponse);
            console.log(`Sent response to client: ${urlResponse}`)
        } else {
            res.status(401);
            res.end('401: Unauthorized');
            console.log('Invalid password provided');
        }
    } catch (err) {
        res.status(400);
        res.end('400: API Error');
        console.error(`Error: ${err}`);
    }
}

module.exports = handler;