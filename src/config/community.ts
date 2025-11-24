/**
 * Community statistics configuration
 * Update these values in one place to reflect across the entire site
 */

export const communityStats = {
  // Total community member count
  memberCount: "500+",

  // Number of meetups held (2 past + 1 upcoming = 3 total)
  meetupCount: "3",

  // Talks and demos across all meetups
  talksAndDemos: "10+",

  // Opportunities for learning and networking
  opportunities: "∞",
} as const;

// Display labels (customize as needed)
export const communityLabels = {
  members: "Members",
  developers: "Developers",
  meetups: "Meetups",
  talksAndDemos: "Talks & Demos",
  opportunities: "Opportunities",
} as const;
