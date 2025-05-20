const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, emailId) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        // Html: {
        //   Charset: "UTF-8",
        //   Data: "<h1> This is Html body. </h1>",
        // },
        Text: {
          Charset: "UTF-8",
          Data: "This is a text body.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `You have a friend request from ${emailId}`,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (emailId) => {
  const sendEmailCommand = createSendEmailCommand(
    "shubhashisroy360@gmail.com", // recipient
    "shubhashis@crushes.in", // sender
    emailId
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
