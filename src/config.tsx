const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "auth-dev-attachmentsbucket-1m240br8q5mjl",
  },
  apiGateway: {
    REGION: "af-south-1",
    URL: "https://kapi.kazinzuri.com/dev",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_BsILgENSm",
    APP_CLIENT_ID: "1suuk1q53vnnlpvbago0jaefc2",
    IDENTITY_POOL_ID: "us-east-1:69b7b4c9-864c-4841-a88d-f0de9e422e0d",
  },
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "auth-prod-attachmentsbucket-6o1fukjlbd3v",
  },
  apiGateway: {
    REGION: "af-south-1",
    URL: "https://api.Planturion.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_x8z2YPxXK",
    APP_CLIENT_ID: "6jcoqvjkgslepgc5i83sesjr7t",
    IDENTITY_POOL_ID: "us-east-1:193a62f9-08c9-47d7-8763-3fd43942a732",
  },
};

// Default to dev if not set
export const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
