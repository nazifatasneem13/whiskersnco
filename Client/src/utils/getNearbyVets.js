export const getNearbyVets = async (city) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/pets/nearby-vets?city=${city}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch vet clinics");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching vet clinics:", error.message);
    return [];
  }
};
