# Business connections

Administrators can open **Settings → Business connections** (`/settings/connections`) to review integration configuration and reach provider setup. Setup and import endpoints for the new connectors require administrator access in multi-user deployments; the existing authenticated single-user setup remains supported.

## Available setup flows

| Connection                 | Implemented use                                                         | Setup                                           |
| -------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| AI provider                | Workspace chat and document questions                                   | Model provider settings                         |
| Gmail                      | Assistant email search, drafts, and sending                             | Agent skill setup and Google Apps Script bridge |
| Google Calendar            | Assistant event lookup and management                                   | Agent skill setup and Google Apps Script bridge |
| Microsoft Outlook          | Assistant email search, drafts, and sending                             | Agent skill setup and Microsoft OAuth           |
| Telegram                   | Workspace conversations through a bot                                   | Telegram connection settings                    |
| MCP tools                  | Tools exposed by configured MCP servers                                 | Agent MCP configuration                         |
| Manual Google Drive import | Selected documents from a chosen folder into the local document library | `/settings/connections/google-drive`            |
| HubSpot contact import     | Bounded batches of contacts into the local CRM                          | `/settings/connections/hubspot`                 |

The older Gmail, Google Calendar, Outlook, and Telegram integrations currently support single-user mode only. Drive and HubSpot are separate administrator-only manual import flows. Neither adds automatic synchronization or provider writeback. The catalog reports configuration and deployment restrictions; it does not itself authorize accounts, start bots, refresh tokens, or perform provider checks.

## Manual Google Drive import

1. Open **Business connections → Manual Google Drive import**.
2. Obtain a temporary Google OAuth access token with `https://www.googleapis.com/auth/drive.readonly`. Enter that token in the password field. This release has no Google sign-in redirect, refresh token, or automatic token renewal. Use your organization's approved Google authorization procedure; see [Google Drive authorization scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).
3. Enter a **root folder ID**, not a URL. It is the identifier after `/folders/` in the Drive folder URL. The application's importer checks that files and nested folders belong under this selected root. The OAuth scope itself can access other Drive files available to that Google account; the application enforces the narrower import boundary.
4. Select **Verify and save authorization**. The server checks token scope, expiry, and access to the root folder before saving the credential. Drive write scopes are rejected. Failed authorization does not replace a valid saved credential.
5. Review the displayed expiry. Select **Verify access** to perform a new provider check. When the token expires, obtain a new temporary token and repeat setup.
6. Select **Browse root folder**. Open nested folders explicitly and select supported files. Each batch accepts at most 10 files, at most 10 MB per file, and at most 25 MB combined. Folder rows browse; they do not recursively import everything.
7. Select **Import selected files** and review the result for each file. The server returns actual imported and failed counts. Google Docs export to text, Sheets to XLSX, and Slides to PDF. Supported ordinary files include PDF, TXT, MD, CSV, JSON, DOCX, XLSX, PPTX, and ODT. Unsupported types and shortcuts cannot be imported by this flow.
8. Imported documents are saved to the **document library**, not automatically embedded or attached to a workspace. Open a workspace, use its document management/upload control, select the imported library documents, and add them to the workspace. Wait for document processing/indexing before asking questions about their contents.

Disconnect removes the locally stored Google credential. It does not delete imported documents or revoke Google's authorization; revoke provider access separately through Google when needed. Repeating imports is manual; no automatic change tracking, conflict handling, or background sync is promised.

## HubSpot contact import

1. Open **Business connections → HubSpot contact import**.
2. In HubSpot, create a service key under **Development → Keys → Service keys**, with only `crm.objects.contacts.read` for this workflow. HubSpot requires a super admin or developer tools access. An existing private app token can also be used; creation of new legacy private apps is no longer supported. See [HubSpot service key setup](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys).
3. Enter the credential and the numeric **HubSpot account ID**, then select **Save credentials**. The account ID is administrator-supplied and is **not verified against HubSpot** in this release. It namespaces contact identities locally. Use the same actual account ID consistently when renewing credentials for that account.
4. Select **Verify contact access**. A real, bounded contacts read checks access. A successful read verifies that capability; it does not prove the supplied account ID, verify every record, or enable webhooks.
5. Choose a batch size of 25, 50, or 100 contacts and select **Preview first batch**. Preview is read-only for both HubSpot and the local CRM. Use **Preview next batch** to move through the provider cursor; there is no automatic import-all loop.
6. Review names, email addresses, company names, and phone numbers. Select **Import this batch to local CRM**. Import reads the batch again, so data may have changed since the preview. The backend supports a maximum of 500 per request, while the setup UI intentionally limits each reviewed batch to 100.
7. Review actual fetched, added, updated, and skipped counts, then open **CRM & sales** to inspect the imported local records. Matching uses the supplied account ID and HubSpot contact ID; repeating a batch updates or skips matches without adding duplicate records under that identity. Existing local sales stages and notes are preserved.

The connector reads non-archived contacts. It does not import deals, synchronize sales stages, send messages, modify contacts in HubSpot, or run in the background. Disconnect removes local credentials and preserves imported local CRM records. Rotate or revoke the credential in HubSpot separately when required.

## Status and credential handling

- **Credentials saved / Configured:** Local setup is present. This alone does not prove remote access.
- **Verified:** The setup page's explicit provider check succeeded at the displayed time. Permission changes, revocation, or token expiry can invalidate that result later.
- **Verification failed / Authorization expired:** Renew or correct authorization, then retry. Errors stay visible; the UI does not replace failures with sample records or successful counts.
- **Not configured / Not verified:** Finish setup or request a provider check.
- The catalog's **Needs attention** also covers incomplete configuration, unavailable configuration sources, or deployment restrictions.

Passwords/tokens are entered in masked fields and are never prefilled from API responses. The new connector stores encrypt credentials locally and expose only allowlisted metadata. Do not paste credentials into chat, diagnostic output, or documentation. Removing credentials does not remove records already imported.

Provider accounts, permissions, and any applicable subscription, API, or hosting costs remain the administrator's responsibility. No paid account is created and no provider plan is purchased by these setup screens.

## Next phase

Microsoft 365 document import, operational WhatsApp Business messaging, and n8n workflows remain future work. The omnichannel gateway's saved preferences are not working provider adapters. Existing Confluence, Paperless-ngx, Obsidian, website, and repository imports can already be reached through workspace document management; treat imports separately from continuously connected apps.

## Development boundaries

Read-only catalog definitions belong in `server/services/integrations/`; the catalog endpoint remains thin and administrator-protected. Do not initialize provider SDKs or integration singletons merely to render the catalog. Keep secrets out of status payloads and logs.

New provider requests must use authenticated administrator endpoints, strict input validation, bounded provider calls, visible failures, and confirmed persistence results. Adapter tests cover missing/incomplete configuration, credential redaction, provider rejection, bounds, and import identities. Live provider authorization and real-account import require administrator-supplied credentials and are not certified by mocked tests alone.

See [Architecture](ARCHITECTURE.md) for module boundaries and [Local development](DEVELOPMENT.md) for running and testing services locally.
