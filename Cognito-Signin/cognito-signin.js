const { CognitoIdentityProviderClient, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});

async function signInUser(username, password) {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "6j7kkdfgu6ol5sebgureonsbe5",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };

  try {
    const data = await client.send(new InitiateAuthCommand(params));
    const accessToken = data.AuthenticationResult.AccessToken;
    const idToken = data.AuthenticationResult.IdToken;
    const refreshToken = data.AuthenticationResult.RefreshToken;
    return { accessToken, idToken, refreshToken };
  } catch (error) {
    throw error;
  }
}

// Example usage:
const username = "abhi_sree";
const password = 'Abhishek@321';

signInUser(username, password)
  .then((tokens) => {
    console.log("Successfully signed in:", tokens);
  })
  .catch((error) => {
    console.error("Error signing in:", error);
  });
