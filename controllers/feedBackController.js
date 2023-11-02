const { google } = require("googleapis");

// everytime you make an exports you have to import in postRoute
// create post with the controller name
exports.createFeedback = async (req, res, next) => {
  const spreadsheetId = "1KSbjdJI8FHdxAqlATAI5CebutUD49qRaGv4VJkrsV-M";
  // const spreadsheetId = "15BEBCmAa14mVzRseiLoXG8NT-6tSU26O2dg5z-AjnyI";
  const credentials = require("../client_secret_2.json");

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const sheets = google.sheets({ version: "v4", auth });
  const { email, name, feedback } = req.body;
  let values = [[name, email, feedback]];
  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "A1",
    valueInputOption: "RAW",
    resource,
  });

  return res.status(201).json({
    success: true,
    data: result.data,
  });
};
