# kenyatradex

## Newsletter Pipeline

Production requires `NUXT_NEWSLETTER_SECRET`, `NUXT_NEWSLETTER_PIPELINE_SECRET`, and `NUXT_NEWSLETTER_FROM`. Add the same pipeline secret to GitHub Actions as `NEWSLETTER_PIPELINE_SECRET`.

Blog posts are included in the next monthly digest only when `newsletterVersion` is greater than zero. Increment the version for each significant update that should be announced; routine edits must keep the current version to avoid another publication event.
