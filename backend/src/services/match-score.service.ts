export interface JobScoreInput {
  id: string;
  description: string;
}

export interface JobScoreResult {
  jobId: string;
  score: number; // 0–100 integer
}

/**
 * Score jobs against the candidate's skill set.
 * Algorithm: candidate-relevance — what % of MY skills appear in the job description?
 * Score = (resume skills found in JD text) / (total resume skills) × 100
 * This answers: "How relevant is this job to my skill set?"
 */
export function scoreJobsAgainstResume(
  resumeSkills: string[],
  jobs: JobScoreInput[],
): JobScoreResult[] {
  if (resumeSkills.length === 0) return jobs.map((job) => ({ jobId: job.id, score: 0 }));

  // Build normalized skill tokens — each skill contributes unigrams + the full phrase
  const skillEntries: string[][] = resumeSkills.map((skill) => {
    const norm = skill
      .toLowerCase()
      .replace(/[^a-z0-9\s+#.]/g, ' ')
      .trim();
    const words = norm.split(/\s+/).filter((w) => w.length > 1);
    // Return both the full phrase (if multi-word) and individual words
    return words.length > 1 ? [norm, ...words] : words;
  });

  return jobs.map((job) => {
    const jdText = job.description.toLowerCase().replace(/[^a-z0-9\s+#.]/g, ' ');

    let matched = 0;
    skillEntries.forEach((tokens) => {
      // A skill matches if ANY of its tokens appear in the JD text
      const found = tokens.some((token) => {
        // Use word-boundary aware search: token surrounded by non-alphanumeric chars
        const escaped = token.replace(/[+#.]/g, '\\$&');
        return new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`).test(jdText);
      });
      if (found) matched++;
    });

    // Score: what % of my skills are relevant to this job
    const score = Math.min(100, Math.round((matched / resumeSkills.length) * 100));
    return { jobId: job.id, score };
  });
}
