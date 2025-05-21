import { tryCatch } from "@/utils";
import db from "@/utils/server/db/singleton";
import { merge } from "lodash-es";
import isNull from "lodash-es/isNull";
/**
 * Retrieves a user from the database by their unique username.
 *
 * @async
 * @function getUserByName
 * @param {string} username - The unique username used to look up the user.
 * @returns {Promise<getUserByNameResponseType>} A Promise resolving to an object that includes:
 * - `statusCode` (`200 | 404 | 500`): Represents success, not found, or internal error.
 * - `statusText` (`string`): Human-readable description of the result or error.
 * - `user` (`UserType | null`): The user object if found, otherwise null.
 * - `timeStamp` (`string`): A timestamp (localized) indicating when the response was generated
 *
 * @remarks
 * ## Behavior:
 * - Returns `500` on Prisma/database/internal failure
 * - 400: Username was not provided
 * - Returns `200` if a matching user is found
 * - Returns `404` if no user exists for the provided username
 *
 * @example
 * const result = await getUserByName("john_doe");
 * if (result.statusCode === 200) {
 *   console.log("User found:", result.user);
 * } else {
 *   console.error("Error:", result.statusText);
 * }
 *
 * @todo
 * - Add caching (e.g., Redis or in-memory for frequent lookups)
 * - Improve error engine to handle specific Prisma error codes
 */
export async function getUserByName(
  username: string | null
): Promise<getUserByNameResponseType> {
  if (username === null)
    return formatGetUserResponse(400, "No user selected", null);
  //**TODO: Add caching */
  const { response, error } = await tryCatch(
    db.user.findFirst({
      where: { userName: username },
    })
  );
  /**Prisma Error/ Status Code: 500
   * - returns the response when prisma or other internal db has an internal error for
   *   client to handle gracefully
   * - error flag set to true
   * TODO: Add Prisma Error Engine
   */
  if (error) return formatGetUserResponse(500, error, null);

  /**Happy Path
   * - returns a false error flag
   */
  if (!isNull(response))
    return formatGetUserResponse(
      200,
      "Success",
      merge(response, { timeStamp: new Date().toISOString() })
    );

  return formatGetUserResponse(404, "Could not retreive the user", null);
}

function formatGetUserResponse(
  statusCode: number,
  statusText: string,
  user: UserType | null
): getUserByNameResponseType {
  return {
    statusCode,
    statusText,
    user,
    timeStamp: new Date().toISOString(),
  };
}
