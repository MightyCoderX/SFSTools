const partType = document.getElementById('partType');
const btnAddPart = document.getElementById('btnAddPart');
const partsElem = document.getElementById('parts');

const parts = {
    engine: ["Engine Hawk", "Engine Valiant", "Engine Kolibri", "Engine Titan", "Engine Frontier", "Ion Engine"],
    solar_array: [2, 3],
    aerodynamics: ["Side Fuselage", "Cone", "Cone Side"],
    wheel: ["Wheel Medium", "Wheel Big"],
    parachute: ["Parachute", "Parachute Side"]
}

btnAddPart.addEventListener('click', () =>
{
    if(!partType.value.trim()) return;
    
    const value = document.querySelector(`.addPart #typeList option[value="${partType.value}"]`).dataset.value;
    const file = `${value}.html`;

    console.log(file);

    fetch(`SFS_HTML_Components/${file}`)
    .then(res  => res.text())
    .then(data =>
    {
        if(parts[value])
        {
            console.log(insertAtIndex(data, data.indexOf("\n"), "Hello"));
        }

        partsElem.insertAdjacentHTML('beforeend', data);
        console.log(data);
    });
});

function insertAtIndex(str, index, text)
{
    return str.substring(0, index) + text + str.substring(index+text.length-1);
}