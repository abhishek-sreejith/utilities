const express = require('express');
const bodyParser = require('body-parser');
const { CognitoIdentityProviderClient, InitiateAuthCommand, GetUserCommand } = require("@aws-sdk/client-cognito-identity-provider");

const app = express();
app.use(bodyParser.json());

const clientId = '6j7kkdfgu6ol5sebgureonsbe5'

const cognitoClient = new CognitoIdentityProviderClient({ });

// Authentication
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username  ,  password)
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const data = await cognitoClient.send(new InitiateAuthCommand(params));
    res.json({ token: data.AuthenticationResult.AccessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Authorization
app.get('/protected', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    const data = await cognitoClient.send(new GetUserCommand({ AccessToken: token.split(' ')[1] }));
    const username = data.Username;
    // Check user's authorization here based on username or other attributes
    res.json({ message: 'Authorized access' });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
