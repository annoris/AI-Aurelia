# Security Policy

## Supported Versions

Security fixes are maintained on the `main` branch for the current major release line (`1.x`).

## Reporting a Vulnerability

Please report all security vulnerabilities privately through
[GitHub Security Advisories (GHSA)](https://github.com/annoris/aurelia/security/advisories/new)
on **annoris/aurelia**. Do **not** open public GitHub issues, pull requests,
or discussions for undisclosed vulnerabilities.

For low-severity hardening improvements that have an obvious, non-exploitable fix,
you may open a pull request describing the improvement directly.

## Out-of-Scope / Expected-Behavior Reports

To help security researchers focus on actionable findings, the following
documented behaviors are intentional design choices and will be closed as
informational or out of scope:

### 1. Admin-Configured Internal URLs & Scraping (SSRF)

Web-scraping and document collection target URLs submitted by authenticated
administrators or managers. When deployed inside a VPC or private network,
administrators intentionally configure Aurelia AI to index internal services,
local inference endpoints (`basePath` for Ollama, LM Studio, LocalAI, etc.),
and private APIs (see
[`collector/utils/url/index.js`](https://github.com/annoris/aurelia/blob/main/collector/utils/url/index.js#L2-L13)).
Network isolation and egress filtering must be enforced at the infrastructure/VPC
or firewall layer.

### 2. Self-Interaction XSS via User-Supplied Image URLs

Reports requiring a user to right-click and paste a crafted URL into their own
browser bar (self-XSS), or affecting only an isolated local profile image
uploaded by that same user, are out of scope. Valid XSS reports must demonstrate
script execution without contrived user self-interaction.

### 3. Single-User / Unauthenticated Deployment Mode

Aurelia AI supports single-user / trusted-network deployments without login
credentials alongside password-protected and multi-user RBAC modes. Running an
instance with authentication disabled on a public network is a deployment
misconfiguration, not a software vulnerability. Reports demonstrating an actual
**authentication bypass** when password or multi-user mode is enabled **are** in scope.

### 4. Guessing High-Entropy UUIDv4 Identifiers

Reports that depend on guessing or brute-forcing UUIDv4 identifiers (such as
embed IDs or session IDs) without demonstrating a concrete enumeration or leak
vector are out of scope.

### 5. Developer API Keys

Developer API keys are system-level credentials created exclusively by
administrators and intentionally grant full `/v1/*` API access equivalent to
admin privileges. Attack scenarios that begin with "an attacker already possesses
a valid developer API key" describe compromised admin credentials rather than
privilege escalation.

### 6. Admin-Enabled Agent Tools

Privileged agent capabilities (such as `sql-agent` or local filesystem tools)
are disabled by default and must be explicitly enabled and configured by an
administrator. Enforce least-privilege boundaries on the underlying database
role, credentials, and OS/container filesystem permissions rather than expecting
application-level string filters to block an authorized administrator's tool
configuration.

### 7. Public `GET /api/setup-complete` Endpoint

`/api/setup-complete` is intentionally unauthenticated so the frontend can
determine onboarding status, authentication mode, and non-secret display
configuration before login. Secret values are exposed only as boolean presence
flags (`true`/`false`), never plaintext values. Only a report showing an actual
credential or secret plaintext leak from this endpoint is valid.

### 8. `env-dump` Configuration Flush Endpoints

`GET /api/env-dump` and `GET /api/v1/system/env-dump` are intentionally
unauthenticated so container lifecycle and shutdown hooks can persist the
server's existing in-memory environment state to its local `.env` file. These
endpoints accept no user input and return no configuration data in the HTTP
response.

## Submission Quality Standards

Please verify your findings against an actual running Aurelia AI instance and
include reproducible steps, affected files/versions, and security impact.
Automated scanner dumps or unverified LLM-generated reports without a working
reproduction will be closed without action.
