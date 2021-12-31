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

function createUrl(blogUrl, contents) {
    const frontMatter = fm(contents);
    const slugString = frontMatter.attributes.slug;
    const fileName = blogUrl + "/" + slugString;
    return fileName;
}

function createFilename(contents) {
    const frontMatter = fm(contents);
    const dateString = frontMatter.attributes.date.toISOString().slice(0,10);
    const slugString = frontMatter.attributes.slug;
    const fileName = dateString + '-' + slugString + '.md';
    return fileName;
}


async function checkSHA(username, repo, octokit, path) {
    try {
        const result = await octokit.rest.repos.getContent({
            owner: username,
            repo: repo,
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

async function sendToGithub(username, repo, location, octokit, filename, textContents) {
    const encodedContent = Base64.encode(textContents);
    const repoPath = location + '/' + filename;
    const sha = await checkSHA(username, repo, octokit, repoPath);
    
    try {
        const res = await octokit.rest.repos.createOrUpdateFileContents({
            owner: username,
            repo: repo,
            path: repoPath,
            message: '🤖 Published via note-publish',
            content: encodedContent,
            sha
        });
        console.log(`GitHub returned ${res.status}, new commit ${res.data.commit.sha}`);
    } catch (err) {
        console.error(`Github returned ${err}`);
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

    console.log('URL parameters', req.query.website, req.query.username, req.query.repository, req.query.location);

    const hexStr = Buffer.from(req.body.password, 'hex').toString();
    const hexJson = JSON.parse(hexStr)
   
    const githubAuth = hexJson.pa_token;

    const octokit = new ok.Octokit({ auth: githubAuth });
    const cors = Cors({
        methods: ['GET', 'POST']
    });

    await runMiddleware(req, res, cors);

    try {
        const fileName = createFilename(req.body.md);
        const newUrlString = createUrl(req.query.website, req.body.md);
        const urlResponse = createResponse(newUrlString);
        console.log('Sending to Github');
        await sendToGithub(req.query.username, req.query.repository, req.query.location, octokit, fileName, req.body.md);
        res.end(urlResponse);
        console.log(`Sent response to client: ${urlResponse}`)
    } catch (err) {
        res.status(400);
        res.end('400: API Error');
        console.error(`Error: ${err}`);
    }
}

module.exports = handler;