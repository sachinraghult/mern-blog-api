const { google } = require("googleapis");
const bufferToStream = require("./buf2stream");

const KEYFILEPATH = "./mern-blog-app-340314-1838fe557351.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const createAndUploadFile = (req, auth) => {
  const driveService = google.drive({ version: "v3", auth });

  const fileMetaData = {
    name: req.body.name,
    parents: ["1RCbw3iwEm8uPXYRQ8tChZWy73oYeu6hG"],
  };

  const media = {
    mimeType: "image/",
    body: bufferToStream(req.file.buffer),
  };

  return driveService.files
    .create({
      resource: fileMetaData,
      media: media,
      fields: "id",
    })
    .then((response) => {
      req.fileId = response.data.id;
    })
    .catch((err) => {
      console.log(err);
    });
};

const moveFile = async (fileId, auth) => {
  const driveService = google.drive({ version: "v3", auth });

  folderId = "1AR4lBGhwVQ7i0cXCIzq9bKfLarSwyzr-";

  return driveService.files
    .get({
      fileId: fileId,
      fields: "parents",
    })
    .then(async (response) => {
      var previousParents = response.data.parents.join(",");
      await driveService.files
        .update({
          fileId: fileId,
          addParents: folderId,
          removeParents: previousParents,
          fields: "id, parents",
        })
        .then((response) => {
          console.log("File Moved!");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.createAndUploadFile = createAndUploadFile;
module.exports.moveFile = moveFile;
module.exports.auth = auth;