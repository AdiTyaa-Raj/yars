import { Link, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function normalizeAnswerMarkdown(text) {
  if (!text) {
    return "";
  }

  return text
    .replace(/:\s*(\d+\.\s)/, ":\n\n$1")
    .replace(/(\[[0-9,\-\s]+\]\.?|\.)\s+(\d+\.\s+(?:\*\*)?)/g, "$1\n$2")
    .trim();
}

function AnswerMarkdown({ answer }) {
  const normalizedAnswer = normalizeAnswerMarkdown(answer);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <Typography variant="body1" sx={{ mb: 1.25, lineHeight: 1.75 }}>
            {children}
          </Typography>
        ),
        ol: ({ children }) => (
          <ol style={{ marginTop: 4, marginBottom: 14, paddingLeft: 22, lineHeight: 1.7 }}>{children}</ol>
        ),
        ul: ({ children }) => (
          <ul style={{ marginTop: 4, marginBottom: 14, paddingLeft: 22, lineHeight: 1.7 }}>{children}</ul>
        ),
        li: ({ children }) => (
          <li>
            <Typography component="span" variant="body1" sx={{ lineHeight: 1.75 }}>
              {children}
            </Typography>
          </li>
        ),
        strong: ({ children }) => (
          <Typography component="strong" sx={{ fontWeight: 700 }}>
            {children}
          </Typography>
        ),
        a: ({ href, children }) => (
          <Link href={href} target="_blank" rel="noreferrer" underline="hover">
            {children}
          </Link>
        ),
      }}
    >
      {normalizedAnswer}
    </ReactMarkdown>
  );
}

export default AnswerMarkdown;
