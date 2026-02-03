# Appwrite Self-Hosted GitHub VCS Installation Fix

## The Problem

When using self-hosted Appwrite, connecting a new project to GitHub via Sites/Functions fails with the message "GitHub app is already connected" even though Appwrite doesn't recognize the connection.

**Root Cause:** Appwrite's VCS model is project-scoped, not console-wide. Each project needs its own installation record in the `_console_installations` table linking it to the GitHub App installation. When you authorize the GitHub App once, GitHub considers it "installed" for your org/account, but Appwrite only creates an installation record for the project you were in at the time.

When you try to connect from a new project:
1. GitHub says "already installed" (correct - the app is authorized)
2. Appwrite's callback expects to create a NEW installation
3. The callback fails silently - no record is created for the new project

This is a known issue with self-hosted Appwrite. A partial fix was made in PR #9138 (Appwrite 1.6.x) for identity collision, but the multi-project propagation issue persists.

## Symptoms

- "GitHub app is already connected" message when trying to connect
- 500 Server Error when viewing VCS installations
- Logs show: `Failed to retrieve access token from GitHub API`
- Logs show: `installations/0/providerRepositories` (installation ID "0" = no valid installation)

## Diagnosis

SSH into the Appwrite server and check the installations table:

```bash
docker exec appwrite-mariadb mysql -u user -ppassword appwrite -e \
  "SELECT _uid, projectId, organization, providerInstallationId FROM _console_installations;"
```

Check which projects exist:

```bash
docker exec appwrite-mariadb mysql -u user -ppassword appwrite -e \
  "SELECT _uid, name FROM _console_projects;"
```

If your target project is missing from `_console_installations`, that's the problem.

## Fix

### Step 1: Find a working installation record

Find an existing installation with the same GitHub org that has valid tokens:

```bash
docker exec appwrite-mariadb mysql -u user -ppassword appwrite -e \
  "SELECT _id, _uid, projectId, organization, providerInstallationId,
   personalAccessToken IS NOT NULL as hasToken
   FROM _console_installations;"
```

Note the `_uid` of a working record (one with `hasToken = 1`).

### Step 2: Get your target project's details

```bash
docker exec appwrite-mariadb mysql -u user -ppassword appwrite -e \
  "SELECT _id, _uid, name, teamId FROM _console_projects WHERE name = 'YOUR_PROJECT_NAME';"
```

Note the `_id` (projectInternalId), `_uid` (projectId), and `teamId`.

### Step 3: Insert a new installation record

Replace the values below:
- `SOURCE_UID`: The `_uid` of the working installation from Step 1
- `NEW_PROJECT_ID`: The `_uid` from Step 2 (e.g., `treasury-agent-1`)
- `NEW_PROJECT_INTERNAL_ID`: The `_id` from Step 2 (e.g., `4`)
- `TEAM_ID`: The `teamId` from Step 2

```bash
docker exec appwrite-mariadb mysql -u user -ppassword appwrite -e "
INSERT INTO _console_installations
(_uid, _createdAt, _updatedAt, _permissions, projectId, projectInternalId,
 providerInstallationId, organization, provider, personal,
 personalAccessToken, personalAccessTokenExpiry, personalRefreshToken)
SELECT
  CONCAT('fix_', SUBSTRING(MD5(RAND()), 1, 16)),
  NOW(3),
  NOW(3),
  _permissions,
  'NEW_PROJECT_ID',
  NEW_PROJECT_INTERNAL_ID,
  providerInstallationId,
  organization,
  provider,
  personal,
  personalAccessToken,
  personalAccessTokenExpiry,
  personalRefreshToken
FROM _console_installations
WHERE _uid = 'SOURCE_UID';
"
```

**Important:** The `_permissions` field must be copied exactly from a working record. If you construct it manually, ensure the JSON escaping is correct:
```
["read(\"team:TEAM_ID\")","update(\"team:TEAM_ID\/owner\")","update(\"team:TEAM_ID\/developer\")","delete(\"team:TEAM_ID\/owner\")","delete(\"team:TEAM_ID\/developer\")"]
```

### Step 4: Verify

```bash
docker exec appwrite-mariadb mysql -u user -ppassword appwrite -e \
  "SELECT _uid, projectId, organization FROM _console_installations WHERE projectId = 'NEW_PROJECT_ID';"
```

Refresh the Appwrite console and try connecting the GitHub repo again.

## Environment Details

- Appwrite Version: 1.8.0+
- Server: aw.smartpiggies.cloud
- GitHub App: SmartPiggies-Appwrite
- GitHub Installation ID (smartpiggies org): 105035285

## References

- [PR #9138: VCS Identity Collision Fix](https://github.com/appwrite/appwrite/pull/9138)
- [PR #9692: VCS Migrations Fix](https://github.com/appwrite/appwrite/pull/9692)
- [Appwrite Self-Hosting VCS Docs](https://appwrite.io/docs/advanced/self-hosting/configuration/version-control)
