const socialPlatforms = [
  'Instagram',
  'Facebook',
  'TikTok',
  'Pinterest',
  'YouTube',
  'X (Twitter)',
  'LinkedIn',
]

const normalizeSocialPlatform = (platform = '') =>
  platform
    .toLowerCase()
    .replace(/\(.+\)/g, '')
    .replace(/[^a-z]/g, '')

const supportedSocialIconKeys = [
  'instagram',
  'facebook',
  'tiktok',
  'pinterest',
  'youtube',
  'x',
  'twitter',
  'linkedin',
]

const hasSupportedSocialIcon = (platform = '') =>
  supportedSocialIconKeys.includes(normalizeSocialPlatform(platform))

export {
  hasSupportedSocialIcon,
  normalizeSocialPlatform,
  socialPlatforms,
}
