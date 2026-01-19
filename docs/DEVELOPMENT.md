# Development

## Scripts

From the repo root:

- Build the package:

    pnpm run build

- Refresh the example after changes:

    pnpm run example:refresh

- Regenerate the example artifacts only:

    pnpm run example:prepare

- Run tests:

    pnpm test

## Notes

- The example consumes the local package via a file dependency. Run example:refresh after changes.
- Use the browser namespace for extension APIs.
- Avoid calling extension APIs outside entrypoint main functions.
