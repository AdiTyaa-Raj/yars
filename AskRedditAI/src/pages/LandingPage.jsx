import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Link as RouterLink } from "react-router-dom";

const featureCards = [
  {
    title: "Smart Reddit Context",
    description: "Pulls relevant subreddit posts and comments before answering.",
    icon: <SearchRoundedIcon fontSize="small" />,
  },
  {
    title: "Grounded LLM Answers",
    description: "Every answer is generated with citations tied to source posts.",
    icon: <AutoAwesomeRoundedIcon fontSize="small" />,
  },
  {
    title: "One-Tap Querying",
    description: "Jump into chat mode and test ideas in a focused interface.",
    icon: <HubRoundedIcon fontSize="small" />,
  },
];

function LandingPage() {
  return (
    <Box className="app-shell">
      <Box className="glow-orb glow-orb-one" />
      <Box className="glow-orb glow-orb-two" />
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 11 }, position: "relative", zIndex: 1 }}>
        <Stack spacing={6}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 5,
              border: "1px solid rgba(18,32,48,0.08)",
              backdropFilter: "blur(8px)",
              bgcolor: "rgba(255,255,255,0.78)",
            }}
          >
            <Stack spacing={3}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="AskRedditAI" color="primary" />
                <Chip label="Reddit + LLM" variant="outlined" color="secondary" />
              </Stack>
              <Typography variant="h1" sx={{ fontSize: { xs: "2.25rem", md: "3.6rem" }, lineHeight: 1.05 }}>
                Turn noisy Reddit threads into focused answers.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, fontWeight: 500 }}>
                Search a subreddit, gather the strongest context, and let the model generate concise insights grounded in the posts and comments it found.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/chat"
                  variant="contained"
                  size="large"
                  endIcon={<ChatRoundedIcon />}
                  sx={{ px: 3.5, py: 1.25 }}
                >
                  Open Chat
                </Button>
                <Button component={RouterLink} to="/chat" variant="outlined" size="large" sx={{ px: 3.5, py: 1.25 }}>
                  Try a Query
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Grid container spacing={2.25}>
            {featureCards.map((card) => (
              <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  className="lift-card"
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    border: "1px solid rgba(18,32,48,0.08)",
                    bgcolor: "rgba(255,255,255,0.84)",
                    height: "100%",
                  }}
                >
                  <Stack spacing={1.25}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "rgba(255,107,53,0.14)",
                        color: "primary.main",
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontSize: "1.1rem" }}>
                      {card.title}
                    </Typography>
                    <Typography color="text.secondary">{card.description}</Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default LandingPage;
