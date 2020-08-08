const partType = document.getElementById('partType');
const btnAddPart = document.getElementById('btnAddPart');

const parts = {
    engine: ["Engine Hawk", "Engine Valiant", "Engine Kolibri", "Engine Titan", "Engine Frontier", "Ion Engine"],
    solar_array: [2, 3],
    aerodynamics: ["Side Fuselage", "Cone", "Cone Side"],
    wheel: ["Wheel Medium", "Wheel Big"],
    parachute: ["Parachute", "Parachute Side"]
}

btnAddPart.addEventListener('click', async () =>
{
    const file = partType;
    console.log(file);
});