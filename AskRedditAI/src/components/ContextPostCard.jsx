import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

function ContextPostCard({ post, index }) {
  const topComments = Array.isArray(post.top_comments) ? post.top_comments : [];

  return (
    <Accordion disableGutters sx={{ bgcolor: "rgba(255,255,255,0.82)", borderRadius: 3, mb: 1.25 }}>
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
        <Stack spacing={0.5} sx={{ width: "100%" }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={`Source [${index}]`} size="small" color="secondary" variant="outlined" />
            <Typography variant="h6" sx={{ fontSize: "1rem" }}>
              {post.title || "Untitled post"}
            </Typography>
          </Stack>
          {post.link ? (
            <Link href={post.link} target="_blank" rel="noreferrer" underline="hover" color="primary">
              {post.link}
            </Link>
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1.5}>
          {post.description ? <Typography>{post.description}</Typography> : null}
          <Divider />
          <Typography variant="subtitle2" color="text.secondary">
            Top comments
          </Typography>
          {topComments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No comments available.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {topComments.slice(0, 5).map((comment, commentIndex) => (
                <Box
                  key={`${comment.author}-${commentIndex}`}
                  sx={{
                    bgcolor: "rgba(18,116,117,0.08)",
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 2,
                    border: "1px solid rgba(18,116,117,0.15)",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    u/{comment.author || "unknown"} • score {comment.score ?? 0}
                  </Typography>
                  <Typography variant="body2">{comment.body || "No body"}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default ContextPostCard;
