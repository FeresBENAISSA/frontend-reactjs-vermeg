import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Container } from '@mui/material';
// comeToChat User interface
import { CometChatUI } from './../../cometchat-pro-react-ui-kit/CometChatWorkspace/src/components';

// create user function

// ---------------------------------------------------------------------

export default function Chat() {
  return (
    <>
      <Helmet>
        <title> Chat </title>
      </Helmet>

      <Container>
        <Card
          sx={{
            height: '600px',
          }}
        >
          <CometChatUI />
        </Card>
      </Container>
    </>
  );
}
