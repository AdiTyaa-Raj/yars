import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Link as RouterLink } from "react-router-dom";

import ContextPostCard from "../components/ContextPostCard";
import { fetchRedditAnswer } from "../services/api";

const starterPrompts = [
  "best remote jobs for developers",
  "how to negotiate software engineer salary",
  "what to learn after React",
  "effective coding interview prep",
];

function ChatPage() {
  const [query, setQuery] = useState("");
  const [subreddit, setSubreddit] = useState("programming");
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const canSubmit = useMemo(() => query.trim().length > 0 && subreddit.trim().length > 0, [query, subreddit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await fetchRedditAnswer({ query, subreddit, limit });
      setResult(payload);
    } catch (submitError) {
      setResult(null);
      setError(submitError instanceof Error ? submitError.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="app-shell">
      <Box className="glow-orb glow-orb-three" />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, position: "relative", zIndex: 1 }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={0.5}>
              <Typography variant="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}>
                AskRedditAI Chat
              </Typography>
              <Typography color="text.secondary">Get a grounded answer from subreddit context and top comments.</Typography>
            </Stack>
            <Button component={RouterLink} to="/" variant="outlined" startIcon={<ArrowBackRoundedIcon />}>
              Back to Landing
            </Button>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              border: "1px solid rgba(18,32,48,0.08)",
              bgcolor: "rgba(255,255,255,0.86)",
            }}
          >
            <Stack component="form" spacing={2.25} onSubmit={handleSubmit}>
              <TextField
                label="What do you want to ask?"
                placeholder="Example: how are developers using AI agents in production?"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                required
                fullWidth
              />
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Subreddit"
                  placeholder="programming"
                  value={subreddit}
                  onChange={(event) => setSubreddit(event.target.value)}
                  required
                  fullWidth
                />
                <FormControl sx={{ minWidth: 130 }}>
                  <InputLabel id="limit-select-label">Post limit</InputLabel>
                  <Select
                    labelId="limit-select-label"
                    value={limit}
                    label="Post limit"
                    onChange={(event) => setLimit(Number(event.target.value))}
                  >
                    {[3, 5, 8, 10].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {starterPrompts.map((prompt) => (
                  <Chip key={prompt} label={prompt} onClick={() => setQuery(prompt)} variant="outlined" />
                ))}
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Endpoint: <code>/api/v1/search/answer</code>
                </Typography>
                <Button type="submit" variant="contained" endIcon={<SendRoundedIcon />} disabled={!canSubmit || loading}>
                  {loading ? "Thinking..." : "Ask Reddit"}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {error ? <Alert severity="error">{error}</Alert> : null}

          {loading ? (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, textAlign: "center", bgcolor: "rgba(255,255,255,0.86)" }}>
              <Stack spacing={1.5} alignItems="center">
                <CircularProgress size={28} />
                <Typography>Fetching subreddit context and generating answer...</Typography>
              </Stack>
            </Paper>
          ) : null}

          {result ? (
            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid rgba(18,32,48,0.08)",
                  bgcolor: "rgba(255,255,255,0.9)",
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    LLM Answer
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                    {result.answer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Query: {result.query} • subreddit: r/{result.subreddit}
                  </Typography>
                </Stack>
              </Paper>

              <Stack>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Context Sources
                </Typography>
                {(result.context || []).map((post, index) => (
                  <ContextPostCard key={`${post.title}-${index}`} post={post} index={index + 1} />
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}

export default ChatPage;
