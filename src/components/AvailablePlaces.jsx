import { useState } from "react";
import Places from "./Places.jsx";
import { useEffect } from "react";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../../../11 place picker/src/loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
        // setAvailablePlaces(resData.places);
      } catch (error) {
        setError({
          message: "Could not find places, please try again later",
        });
      }

      setIsFetching(false);
    };
    fetchPlaces();
  }, []);
  if (error) {
    return <Error title={"An error occured"} message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText={"Fetching place data..."}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
