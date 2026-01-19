# WXT + React + User Settings

This example demonstrates the local wxt-user-settings module.

Highlights:
- Build-time configuration in [example/wxt.config.ts](example/wxt.config.ts)
- Generated settings page using a custom adapter
- Runtime usage in background, content, and popup

## Setup

	pnpm -C example install

## Run

	pnpm -C example dev

## Settings page

The settings page is an unlisted page. You can open it with:

	const url = browser.runtime.getURL('/user-settings.html');
	window.open(url, '_blank');

## Customize the schema

Update the schema in [example/wxt.config.ts](example/wxt.config.ts) and re-run:

	pnpm -C example exec wxt prepare
