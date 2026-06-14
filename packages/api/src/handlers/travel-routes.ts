import {
  getBusById,
  getCabById,
  getFlightById,
  getHotelById,
  getTrainById,
  getUserPersonalization,
  searchBuses,
  searchCabs,
  searchFlights,
  searchHotels,
  searchTrains,
} from "../services/travel";
import type {
  Bus,
  Cab,
  Flight,
  Hotel,
  Train,
  TravelResourceType,
} from "@repo/types";

function notFound(message: string) {
  return Response.json({ error: message }, { status: 404 });
}

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function GETFlights(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return badRequest("Query params 'from' and 'to' are required");
  }

  return Response.json(
    searchFlights({
      from,
      to,
      afterTime: searchParams.get("afterTime") ?? undefined,
      beforeTime: searchParams.get("beforeTime") ?? undefined,
    }),
  );
}

export async function GETFlightById(id: string) {
  const flight = getFlightById(id);

  if (!flight) {
    return notFound(`Flight '${id}' not found`);
  }

  return Response.json(flight);
}

export async function GETBuses(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return badRequest("Query params 'from' and 'to' are required");
  }

  return Response.json(
    searchBuses({
      from,
      to,
      overnight: searchParams.get("overnight") === "true" ? true : undefined,
      afterTime: searchParams.get("afterTime") ?? undefined,
    }),
  );
}

export async function GETBusById(id: string) {
  const bus = getBusById(id);

  if (!bus) {
    return notFound(`Bus '${id}' not found`);
  }

  return Response.json(bus);
}

export async function GETTrains(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return badRequest("Query params 'from' and 'to' are required");
  }

  return Response.json(
    searchTrains({
      from,
      to,
      afterTime: searchParams.get("afterTime") ?? undefined,
    }),
  );
}

export async function GETTrainById(id: string) {
  const train = getTrainById(id);

  if (!train) {
    return notFound(`Train '${id}' not found`);
  }

  return Response.json(train);
}

export async function GETCabs(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return badRequest("Query params 'from' and 'to' are required");
  }

  return Response.json(
    searchCabs({
      from,
      to,
      afterTime: searchParams.get("afterTime") ?? undefined,
    }),
  );
}

export async function GETCabById(id: string) {
  const cab = getCabById(id);

  if (!cab) {
    return notFound(`Cab '${id}' not found`);
  }

  return Response.json(cab);
}

export async function GETHotels(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  if (!location) {
    return badRequest("Query param 'location' is required");
  }

  const type = searchParams.get("type");

  return Response.json(
    searchHotels({
      location,
      type:
        type === "hotel" || type === "homestay" || type === "resort"
          ? type
          : undefined,
      applyPersonalization: searchParams.get("applyPersonalization") === "true",
    }),
  );
}

export async function GETHotelById(id: string) {
  const hotel = getHotelById(id);

  if (!hotel) {
    return notFound(`Hotel '${id}' not found`);
  }

  return Response.json(hotel);
}

export async function GETPersonalization() {
  return Response.json(getUserPersonalization());
}

const resourceGetters: Record<
  TravelResourceType,
  (id: string) => Flight | Bus | Train | Cab | Hotel | null
> = {
  flight: getFlightById,
  bus: getBusById,
  train: getTrainById,
  cab: getCabById,
  hotel: getHotelById,
};

export async function GETTravelResource(type: string, id: string) {
  if (
    type !== "flight" &&
    type !== "bus" &&
    type !== "train" &&
    type !== "cab" &&
    type !== "hotel"
  ) {
    return badRequest(`Invalid resource type '${type}'`);
  }

  const resource = resourceGetters[type](id);

  if (!resource) {
    return notFound(`${type} '${id}' not found`);
  }

  return Response.json(resource);
}
