const accessTokenSchema = `
  CREATE TABLE IF NOT EXISTS access_tokens (
    tokenId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    token TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
  );
`;

module.exports = accessTokenSchema;
