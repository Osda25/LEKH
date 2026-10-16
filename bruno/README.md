# Lab Equipment Knowledge Hub — Bruno API Collection

This collection contains the currently implemented API routes from `auth.js`, `equipment.js`, and the health endpoint in `app.js`. The API prefixes `/api/auth` and `/api/equipment` and the health route `/api/health` have been verified against the provided Express source.

## Open in Bruno

1. Start PostgreSQL and the Express backend (`cd server && npm run dev`).
2. In Bruno Desktop, choose **Open Collection** and select the folder containing `bruno.json`.
3. Choose the **Local** environment in Bruno.
4. Open the environment's **Secrets** tab, set `loginEmail` and `loginPassword` for a local test account. Do not put real credentials into version-controlled request files.
5. Run **Authentication / Register** once to create the account, then **Authentication / Login** to get a JWT.
6. Login's post-response script saves the token as a *runtime* variable (`token`). Other secured requests use `Authorization: Bearer {{token}}`.
7. For **Create equipment type**, login with a test account whose role has been changed to `CARETAKER` or `ADMIN` (e.g. in Prisma Studio). New registered accounts are always `USER`.
8. Set `equipmentId` to an existing type's numeric ID in the Local environment, or create a new type with the POST request; a successful create automatically sets a runtime `equipmentId`.

**Do not run the entire collection as a single automated test suite without reviewing it:** registration and equipment creation change database state and will return `409` if repeated with the same email/name. Some negative-case requests require a token for a specific role.

## Included requests

- Authentication: Register, Login, Current user (`/me`)
- Equipment: List types, List categories, Get type by ID, Create type
- Negative cases: Unauthorized request (401), Invalid type ID (400), Unknown type (404), Invalid category (400), USER forbidden from creating (403), Duplicate type (409)
- System: Health check (`/api/health`)

## Notes

- The sample category `Other Equipment` is an exact match in the provided `equipmentCategory.js` array.
- `token` is **not stored in a version-controlled `.bru` file**; login assigns it with `bru.setVar('token', ...)`.
- The `Login` request uses the secret environment variables `loginEmail` and `loginPassword`, not hard-coded credentials.
- Requests are based on the supplied source files but have not been executed against your local Express server. Test them in Bruno before marking the setup task complete.
