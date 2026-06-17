import { GETAiConfig, POSTAiLayout } from "./handlers/ai-routes";
import {
  GETBusById,
  GETBuses,
  GETCabById,
  GETCabs,
  GETFlightById,
  GETFlights,
  GETHotelById,
  GETHotels,
  GETPersonalization,
  GETTrainById,
  GETTrains,
  GETTravelResource,
} from "./handlers/travel-routes";

function methodNotAllowed() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

function notFound() {
  return Response.json({ error: "Not found" }, { status: 404 });
}

export function normalizeApiPath(pathname: string): string {
  const withoutTrailingSlash = pathname.replace(/\/+$/, "");
  return withoutTrailingSlash || "/";
}

export async function handleApiRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);
  const path = normalizeApiPath(pathname);
  const method = request.method.toUpperCase();

  if (path === "/api/ai/config") {
    return method === "GET" ? GETAiConfig() : methodNotAllowed();
  }

  if (path === "/api/ai/layout") {
    return method === "POST" ? POSTAiLayout(request) : methodNotAllowed();
  }

  if (path === "/api/travel/flights") {
    return method === "GET" ? GETFlights(request) : methodNotAllowed();
  }

  if (path === "/api/travel/buses") {
    return method === "GET" ? GETBuses(request) : methodNotAllowed();
  }

  if (path === "/api/travel/trains") {
    return method === "GET" ? GETTrains(request) : methodNotAllowed();
  }

  if (path === "/api/travel/cabs") {
    return method === "GET" ? GETCabs(request) : methodNotAllowed();
  }

  if (path === "/api/travel/hotels") {
    return method === "GET" ? GETHotels(request) : methodNotAllowed();
  }

  if (path === "/api/travel/personalization") {
    return method === "GET" ? GETPersonalization() : methodNotAllowed();
  }

  const flightById = path.match(/^\/api\/travel\/flights\/([^/]+)$/);
  if (flightById) {
    return method === "GET"
      ? GETFlightById(flightById[1]!)
      : methodNotAllowed();
  }

  const busById = path.match(/^\/api\/travel\/buses\/([^/]+)$/);
  if (busById) {
    return method === "GET" ? GETBusById(busById[1]!) : methodNotAllowed();
  }

  const trainById = path.match(/^\/api\/travel\/trains\/([^/]+)$/);
  if (trainById) {
    return method === "GET" ? GETTrainById(trainById[1]!) : methodNotAllowed();
  }

  const cabById = path.match(/^\/api\/travel\/cabs\/([^/]+)$/);
  if (cabById) {
    return method === "GET" ? GETCabById(cabById[1]!) : methodNotAllowed();
  }

  const hotelById = path.match(/^\/api\/travel\/hotels\/([^/]+)$/);
  if (hotelById) {
    return method === "GET" ? GETHotelById(hotelById[1]!) : methodNotAllowed();
  }

  const travelResource = path.match(/^\/api\/travel\/resource\/([^/]+)\/([^/]+)$/);
  if (travelResource) {
    return method === "GET"
      ? GETTravelResource(travelResource[1]!, travelResource[2]!)
      : methodNotAllowed();
  }

  return notFound();
}
