const { CognitoIdentityProviderClient, SignUpCommand, AdminConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
const {crypto} = require('crypto')

// Set the AWS region
//const region = 'us-east-1';

// Create a Cognito Identity Provider client
const client = new CognitoIdentityProviderClient({/*region*/});

// Function to sign up a user
async function signUpUser(user_name, username, password, email) {
  const clientId = '6j7kkdfgu6ol5sebgureonsbe5'
  const userPoolId = 'us-east-1_mmDpmkzC9'
 // const clientSecret = '5mbtdfa1ljpfdk697rjm1sg63lh7pom80je4389vvlpkc4m01el'
  
  const params = {
    ClientId: clientId, // Replace 'your-client-id' with your Cognito User Pool Client ID
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: 'name', Value: user_name },
      { Name: 'email', Value: email}
    ],
    //SecretHash: secrethash,
  };

  try {
    const data = await client.send(new SignUpCommand(params));
    //console.log('User signed up successfully:', data.UserSub);
    console.log('User signed up successfully:', data);
    return data.UserSub; // Return the user's sub (unique identifier)
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error; // Propagate the error to the caller
  }
}

// Usage example
const user_name = "Abhishek C Sreejith"
const username = 'abhi_sree8';
const password = 'Abhishek@321';
const email = 'abhisheksreejithabhi673@gmail.com';

signUpUser(user_name,username, password, email)
  .then(userSub => {
    console.log('User sub:', userSub);
  })
  .catch(error => {
    console.error('Error:', error);
  });
