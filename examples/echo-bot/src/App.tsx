import {
  Box,
  Button,
  CssBaseline,
  Divider,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import {
  ActionRequest,
  AudioActionResponse,
  ChatController,
  FileActionResponse,
  MuiChat
} from 'chat-ui-react';
import React from 'react';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#3F8EDF',
    },
  },
});

export function App(): React.ReactElement {
  const [chatCtl] = React.useState(
    new ChatController({
      showDateTime: true,
    }),
  );

  React.useMemo(() => {
    echo(chatCtl);
  }, [chatCtl]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ height: '100%', backgroundColor: 'gray' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxWidth: '640px',
            marginLeft: 'auto',
            marginRight: 'auto',
            bgcolor: 'background.default',
          }}
        >
          <Typography sx={{ p: 1 }}>
            너의 분위기를 찾아줄게!
          </Typography>
          <Divider />
          <Box sx={{ flex: '1 1 0%', minHeight: 0 }}>
            <MuiChat chatController={chatCtl} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

async function echo(chatCtl: ChatController): Promise<void> {
  await chatCtl.addMessage({
    type: 'text',
    content: `안녕 나는 명탐정 세포야!`,
    self: false,
    avatar: 'https://blogfiles.pstatic.net/MjAyMjAxMTVfMTIy/MDAxNjQyMTgyNDkwMzI1.D0SLDp4DZ61napZY4n1dqYmSIqUS3QJd2cwpcdxWGfAg.4e-SfbwmQ14it-IKDfKHOh-ibfvtz-iYZ9LJVrI1Pv0g.PNG.100yewon/%EB%AA%85%ED%83%90%EC%A0%95.png?type=w1',
    username:'명탐정 세포',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `너 이름은 뭐야?`,
    self: false,
    avatar: '-',
    username:'명탐정 세포',
  });

  const text = await chatCtl.setActionRequest({
    type: 'text',
    placeholder: '이름을 입력해주세요.',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `${text.value}~ 세포마을에 온 걸 환영해!`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your gender?`,
    self: false,
    avatar: '-',
  });
  const sel = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'man',
        text: 'Man',
      },
      {
        value: 'woman',
        text: 'Woman',
      },
      {
        value: 'other',
        text: 'Other',
      },
    ],
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have selected ${sel.value}.`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your favorite fruit?`,
    self: false,
    avatar: '-',
  });
  const mulSel = await chatCtl.setActionRequest({
    type: 'multi-select',
    options: [
      {
        value: 'apple',
        text: 'Apple',
      },
      {
        value: 'orange',
        text: 'Orange',
      },
      {
        value: 'none',
        text: 'None',
      },
    ],
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have selected '${mulSel.value}'.`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `What is your favorite picture?`,
    self: false,
    avatar: '-',
  });
  const file = (await chatCtl.setActionRequest({
    type: 'file',
    accept: 'image/*',
    multiple: true,
  })) as FileActionResponse;
  await chatCtl.addMessage({
    type: 'jsx',
    content: (
      <div>
        {file.files.map((f) => (
          <img
            key={file.files.indexOf(f)}
            src={window.URL.createObjectURL(f)}
            alt="File"
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
    ),
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `Please enter your voice.`,
    self: false,
    avatar: '-',
  });
  const audio = (await chatCtl
    .setActionRequest({
      type: 'audio',
    })
    .catch(() => ({
      type: 'audio',
      value: 'Voice input failed.',
      avatar: '-',
    }))) as AudioActionResponse;
  await (audio.audio
    ? chatCtl.addMessage({
        type: 'jsx',
        content: (
          <a href={window.URL.createObjectURL(audio.audio)}>Audio downlaod</a>
        ),
        self: false,
        avatar: '-',
      })
    : chatCtl.addMessage({
        type: 'text',
        content: audio.value,
        self: false,
        avatar: '-',
      }));

  await chatCtl.addMessage({
    type: 'text',
    content: `Please press the button.`,
    self: false,
    avatar: '-',
  });
  const good = await chatCtl.setActionRequest({
    type: 'custom',
    Component: GoodInput,
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `You have pressed the ${good.value} button.`,
    self: false,
    avatar: '-',
  });

  echo(chatCtl);
}

function GoodInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: ActionRequest;
}) {
  const chatCtl = chatController;

  const setResponse = React.useCallback((): void => {
    const res = { type: 'custom', value: 'Good!' };
    chatCtl.setActionResponse(actionRequest, res);
  }, [actionRequest, chatCtl]);

  return (
    <div>
      <Button
        type="button"
        onClick={setResponse}
        variant="contained"
        color="primary"
      >
        Good!
      </Button>
    </div>
  );
}
