const { CognitoIdentityServiceProviderClient, SignUpCommand, AdminCreateUserCommand } = require("@aws-sdk/client-cognito-identity-provider");

const cognitoISPClient = new CognitoIdentityServiceProviderClient({ });

const signUpUser = async (user_name, username, password, email) => {
    const clientId = '6j7kkdfgu6ol5sebgureonsbe5'
    const userPoolId = 'us-east-1_mmDpmkzC9'
    const signUpParams = {
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: "email", Value: email },
            { Name: 'name',Value: user_name}
            // Add other user attributes as needed
        ],
    };

    try {
        // Sign up the user
        await cognitoISPClient.send(new SignUpCommand(signUpParams));

        // Initiate email verification
        const verifyEmailParams = {
            UserPoolId: userPoolId,
            Username: email,
            MessageAction: "RESEND" // Resend verification email
        };

        await cognitoISPClient.send(new AdminCreateUserCommand(verifyEmailParams));

        console.log("User signed up successfully. Verification email sent.");
    } catch (error) {
        console.error("Error signing up user:", error);
        // Handle error
    }
};

// Example usage
const user_name = "Abhishek C Sreejith"
const username = 'abhi_sree6';
const email = 'abhisheksreejithabhi673@gmail.com';
const password = "P@ssw0rd";
signUpUser(user_name, username, password, email);
