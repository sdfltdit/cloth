# auth.md

This service supports agentic access. Resource server: https://sdfltd.com. Authorization server: https://sdfltd.com.

## 1. Discover

Fetch Protected Resource Metadata:
GET /.well-known/oauth-protected-resource

Fetch Authorization Server Metadata:
GET /.well-known/oauth-authorization-server

Read the agent_auth block: register_uri, identity_types_supported, credential_types_supported.

## 2. Pick a method

- No user account required for public content
- Use anonymous flow for all public pages

## 3. Register

POST /contact HTTP/1.1
Content-Type: application/json

{"type": "anonymous"}

Response:
{"status": "ok", "access": "public", "credential": null}

## 4. Claim ceremony

No claim required. All content is publicly accessible without OTP or verification.

## 5. Use the credential

No credential required for public content.
Authorization: Bearer (not required)

## 6. Errors

| Error | Endpoint | Action |
|---|---|---|
| 404 | Any | Resource not found |
| 500 | Any | Retry request |

## 7. Revocation

No credentials are issued. No revocation required.
