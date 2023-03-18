const { S3Client, GetObjectCommand  } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuid } = require('uuid');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new S3Client({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: 'eu-central-1',
  signatureVersion: 'v4',
}); 

module.exports = app => {
  app.get('/api/upload', requireLogin, async (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    const command = new GetObjectCommand({
      Bucket: 'rolandpakai-blog-bucket', 
      Key: key,
    });

    const url = await getSignedUrl(s3, command); 
    
    res.send({key, url});
  });
}