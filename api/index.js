const app = require('../index');

export default async function handler(req, res) {
    if (req.body['password'] === process.env.NOTABLE_PASSWORD) {
        const fileName = createFilename(req.body.md);
        // const fileName = createFile(req.body.md);
        const newUrlString = createUrl(req.body.md);
        const urlResponse = createResponse(newUrlString);
        sendToGithub(fileName, req.body.md);
        res.setHeader("Content-Type", "application/json");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.writeHead(200);
        res.end(urlResponse);
        console.log(`Sent response: ${urlResponse}`)
    } else {
        res.writeHead(401);
        res.end('INVALID PASSWORD');
        console.log('Invalid password provided')
    }
  }
  