import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Divider, Typography } from '@material-ui/core';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { getMail } from '../../../redux/slices/mail';
// theme
import typography from '../../../theme/typography';
//
import Markdown from '../../Markdown';
import Scrollbar from '../../Scrollbar';
import MailDetailsToolbar from './MailDetailsToolbar';
import MailDetailsReplyInput from './MailDetailsReplyInput';
import MailDetailsAttachments from './MailDetailsAttachments';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column'
});

const MarkdownWrapperStyle = styled('div')(({ theme }) => ({
  '& > p': {
    ...typography.body1,
    marginBottom: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function MailDetails() {
  const { mailId = '' } = useParams();
  const dispatch = useDispatch();
  const mail = useSelector((state: RootState) => state.mail.mails.byId[mailId]);
  const isAttached = mail && mail.files.length > 0;

  useEffect(() => {
    dispatch(getMail(mailId));
  }, [dispatch, mailId]);

  if (!mail) {
    return null;
  }

  return (
    <RootStyle>
      <MailDetailsToolbar mail={mail} />

      <Divider />

      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h3" gutterBottom>
            {mail.subject}
          </Typography>
          <MarkdownWrapperStyle>
            <Markdown children={mail.message} />
          </MarkdownWrapperStyle>
        </Box>
      </Scrollbar>

      {isAttached && <MailDetailsAttachments mail={mail} />}

      <Divider />

      <MailDetailsReplyInput />
    </RootStyle>
  );
}
