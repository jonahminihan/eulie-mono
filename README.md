# Eulie

Eulie is an agent harness built on top of the Pi SDK.

> [!WARNING]
> Eulie is very early, and is currently very minimal.
> Please feel free to create issues for features you want to see, or bugs you encounter.
> Check out the roadmap section for what's next.

## Features

- Easily add projects, new sessions, and load previous sessions.
- Chat with agents that have access to Pi's capabilities (read, write, edit, bash tools)
- Work across multiple sessions simultaneously

## Getting Started

1. Install [Pi](https://pi.dev/), [Setup](https://pi.dev/docs/latest/providers) a model provider, and [setup](https://pi.dev/docs/latest/settings) default model and thinking level (Eulie currently uses this for new sessions)
2. Clone the repo `git clone https://github.com/jonahminihan/eulie-mono.git`
3. Run `pnpm install` in the package
4. Run `cd apps/web && pnpm run dev`
5. In a new terminal session, run `pnpm run start` in the apps/desktop directory
