const axios = require("axios");
const qs = require("qs");
const CONFIG = require("./config");

async function sendNotify({ token, options }) {
  const {
    message,
    imageThumbnail,
    imageFullsize,
    imageFile,
    stickerPackageId,
    stickerId,
    notificationDisabled, // boolean
  } = options;

  try {
    const fetch = await axios({
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // or  'multipart/form-data'
        Authorization: `Bearer ${token}`,
      },
      url: CONFIG.line.notifyURL,
      data: qs.stringify({
        message,
        imageThumbnail,
        imageFullsize,
        imageFile,
        stickerPackageId,
        stickerId,
        notificationDisabled: !!notificationDisabled,
      }),
    });
    if (fetch.status === 200) return { code: "OK" };
  } catch (error) {
    if (error.response) {
      console.log("Config ", error.response.config);
      console.log("Status ", error.response.status);
      console.log("Headers ", error.response.headers);
      console.log("Data", error.response.data);
      return {
        code: "ERROR",
        message: `Error ${error.response.status}, ` + JSON.stringify(error.response.data),
      };
    } else {
      console.error("Cannot send Line notify", "No reponse code", error);
      return {
        code: "ERROR",
        message: `Unexpected error`,
      };
    }
  }
}

module.exports = { sendNotify };
