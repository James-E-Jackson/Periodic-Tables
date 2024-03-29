/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  //console.log(options)
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservations.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Creates a reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a reservation saved in the database.
 */

export async function createReservation(data) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  //console.log(data)
  return await fetchJson(
    url,
    { method: "POST", headers, body: JSON.stringify({ data }) },
    []
  );
}

/**
 * Creates a table.
 * @returns {Promise<[table]>}
 *  a promise that resolves to a table saved in the database.
 */

export async function createTable(data, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  //console.log(data, url)
  return await fetchJson(
    url,
    { method: "POST", headers, signal, body: JSON.stringify({ data }) },
    {}
  );
}

/**
 * Lists all existing tables.
 * @returns {Promise<[table]>}
 *  a promise that resolves to an array of tables saved in the database.
 */

export async function listTables() {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers }, []);
}

/**
 * Finds a reservation by reservation_id.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a reservation saved in the database.
 */

export async function findReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, {});
}

/**
 * Updates a table to be occupied.
 * @returns {Promise<[table]>}
 *  a promise that resolves to a table saved in the database.
 */

export async function occupyTable(table_id, reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await fetchJson(
    url,
    {
      method: "PUT",
      headers,
      signal,
      body: JSON.stringify({ data: { reservation_id } }),
    },
    {}
  );
}

/**
 * Updates a table to be unoccupied.
 * @returns {Promise<[table]>}
 *  a promise that resolves to a table saved in the database.
 */

export async function finishTable(table_id, signal) {
  //console.log(table_id)
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await fetchJson(
    url,
    {
      method: "DELETE",
      headers,
      signal,
      body: JSON.stringify({ data: { table_id } }),
    },
    {}
  );
}

/**
 * CUpdates a reservation to the status provided.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a reservation saved in the database.
 */

export async function updateReservationStatus(reservation_id, status, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  return await fetchJson(
    url,
    {
      method: "PUT",
      headers,
      signal,
      body: JSON.stringify({ data: { status } }),
    },
    {}
  );
}

/**
 * Edits a reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a reservation saved in the database.
 */

export async function editReservation(data, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${data.reservation_id}`);
  return await fetchJson(
    url,
    { method: "PUT", headers, signal, body: JSON.stringify({ data }) },
    {}
  );
}
