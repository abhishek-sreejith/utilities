const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});

const confirmSignUp = async (username, verificationCode) => {
  const params = {
    ClientId: '6j7kkdfgu6ol5sebgureonsbe5',
    Username: username,
    ConfirmationCode: verificationCode
  };

  try {
    const data = await client.send(new ConfirmSignUpCommand(params));
    console.log("Email confirmed:", data);
    return data; // You may return this to indicate successful confirmation
  } catch (error) {
    console.error("Error confirming email:", error);
    throw error;
  }
};

// Example usage
confirmSignUp("abhi_sree8", "260204")
  .then(() => {
    console.log("Email confirmed successfully");
  })
  .catch((err) => {
    console.error("Error confirming email:", err);
  });
