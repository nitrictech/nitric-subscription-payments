import { api, collection } from "@nitric/sdk";
import uuid from "short-uuid";
import { Account, Session, User, VerificationToken } from "../types";

const authApi = api("auth");

const usersCol = collection<Omit<User, "id">>("users").for(
  "reading",
  "writing",
  "deleting"
);
const accountsCol = collection<Omit<Account, "id">>("accounts").for(
  "reading",
  "writing",
  "deleting"
);
const sessionsCol = collection<Omit<Session, "id">>("sessions").for(
  "reading",
  "writing",
  "deleting"
);
const verificationTokensCols = collection<Omit<VerificationToken, "id">>(
  "verificationTokens"
).for("reading", "writing", "deleting");

/**
 * createUser
 */

authApi.post("/users", async (ctx) => {
  const data = ctx.req.json() as User;

  const id = uuid.generate();

  await usersCol.doc(id).set(data);

  return ctx.res.json({
    ...data,
    id,
  });
});

/**
 * updateUser
 */

authApi.patch("/users/:user_id", async (ctx) => {
  const { user_id } = ctx.req.params;
  const data = ctx.req.json() as Omit<User, "id">;

  const existingsUser = await usersCol.doc(user_id).get();

  const updatedUser = {
    ...existingsUser,
    ...data,
  };

  await usersCol.doc(user_id).set(updatedUser);

  return ctx.res.json(updatedUser);
});

/**
 * deleteUser
 */

authApi.delete("/users/:user_id", async (ctx) => {
  const { user_id } = ctx.req.params;

  // delete sessions
  const sessions = await sessionsCol
    .query()
    .where("userId", "==", user_id)
    .fetch();

  const deleteSessions = sessions.documents.map(({ id }) =>
    sessionsCol.doc(id).delete()
  );

  // delete accounts
  const accounts = await accountsCol
    .query()
    .where("userId", "==", user_id)
    .fetch();

  const deleteAccounts = accounts.documents.map(({ id }) =>
    accountsCol.doc(id).delete()
  );

  await Promise.all([
    ...deleteSessions,
    ...deleteAccounts,
    usersCol.doc(user_id).delete(),
  ]);

  return ctx;
});

/**
 * getUser and getUserByEmail
 */

authApi.get("/users", async (ctx) => {
  const { id, email } = ctx.req.query as unknown as Pick<User, "id" | "email">;

  if (email) {
    const result = await usersCol
      .query()
      .where("email", "==", email)
      .limit(1)
      .fetch();

    if (!result.documents.length) {
      return ctx.res.json(null);
    }

    const { content, id } = result.documents[0];

    return ctx.res.json({
      ...content,
      id,
    });
  }

  if (!id) {
    return ctx.res.json(null);
  }

  const user = await usersCol.doc(id).get();

  return ctx.res.json({
    ...user,
    id,
  });
});

/**
 * getUserByProviderAccountId
 */
authApi.get("/accounts", async (ctx) => {
  const { provider, provider_account_id: providerAccountId } = ctx.req
    .query as unknown as Record<string, string>;

  if (!provider || !providerAccountId) {
    return ctx.res.json(null);
  }

  const results = await accountsCol
    .query()
    .where("provider", "==", provider)
    .where("providerAccountId", "==", providerAccountId)
    .limit(1)
    .fetch();

  if (!results.documents.length) {
    return ctx.res.json({});
  }

  const { id, content } = results.documents[0];

  return ctx.res.json({
    ...content,
    id,
  });
});

/**
 *  linkAccount
 */
authApi.post("/accounts", async (ctx) => {
  const data = ctx.req.json() as Pick<Account, "id">;

  const id = uuid.generate();

  await accountsCol.doc(id).set(data);

  return ctx.res.json({
    ...data,
    id,
  });
});

/**
 *  unlinkAccount
 */
authApi.delete("/accounts", async (ctx) => {
  const { provider, provider_account_id: providerAccountId } = ctx.req
    .query as unknown as Record<string, string>;

  const results = await accountsCol
    .query()
    .where("provider", "==", provider)
    .where("providerAccountId", "==", providerAccountId)
    .limit(1)
    .fetch();

  await Promise.all(
    results.documents.map(({ id }) => accountsCol.doc(id).delete())
  );

  return ctx;
});

/**
 * getSessionAndUser
 */

authApi.get("/sessions/:session_token", async (ctx) => {
  const { session_token } = ctx.req.params;

  const results = await sessionsCol
    .query()
    .where("sessionToken", "==", session_token)
    .limit(1)
    .fetch();

  if (!results.documents.length) {
    return ctx.res.json(null);
  }

  const { id, content } = results.documents[0];

  return ctx.res.json({
    ...content,
    id,
  });
});

/**
 * createSession
 */

authApi.post("/sessions", async (ctx) => {
  const data = ctx.req.json() as Omit<Session, "id">;

  console.log("data", data);

  const id = uuid.generate();

  await sessionsCol.doc(id).set(data);

  return ctx.res.json({
    ...data,
    id,
  });
});

/**
 * updateSession
 */

authApi.patch("/sessions/:session_id", async (ctx) => {
  const { session_id } = ctx.req.params;
  const data = ctx.req.json() as Omit<Session, "id">;

  await sessionsCol.doc(session_id).set(data);

  return ctx.res.json(data);
});

/**
 * deleteSession
 */

authApi.delete("/sessions/:session_token", async (ctx) => {
  const { session_token } = ctx.req.params;

  const results = await sessionsCol
    .query()
    .where("sessionToken", "==", session_token)
    .limit(1)
    .fetch();

  if (!results.documents.length) {
    return ctx.res.json(null);
  }

  await sessionsCol.doc(results.documents[0].id).delete();

  return ctx;
});

/**
 * createVerificationRequest
 */

authApi.post("/verification_tokens", async (ctx) => {
  const data = ctx.req.json() as Omit<VerificationToken, "id">;

  const id = uuid.generate();

  await verificationTokensCols.doc(id).set(data);

  return ctx.res.json({
    ...data,
    id,
  });
});

/**
 * createVerificationRequest
 */

authApi.get("/verification_tokens", async (ctx) => {
  const { identifier, token } = ctx.req.query as unknown as Pick<
    VerificationToken,
    "identifier" | "token"
  >;

  const result = await verificationTokensCols
    .query()
    .where("identifier", "==", identifier)
    .where("token", "==", token)
    .limit(1)
    .fetch();

  if (!result.documents.length) {
    return ctx;
  }

  const verificationToken = {
    ...result.documents[0].content,
    id: result.documents[0].id,
  };

  await verificationTokensCols.doc(verificationToken.id).delete();

  return ctx.res.json(verificationToken);
});
