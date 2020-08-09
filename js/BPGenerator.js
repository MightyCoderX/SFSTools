const partType = document.getElementById('partType');
const btnAddPart = document.getElementById('btnAddPart');
const partsElem = document.getElementById('parts');

const partTypes = {
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
        if(partTypes[value])
        {
            data = insertAtIndex(data, getPosition(data, "\n", 2)-1, ' list="variants"');
            data = insertAtIndex(data, getPosition(data, "\n", 2)+1, '\t<datalist id="variants">\n');
            data = insertAtIndex(data, getPosition(data, "\n", 3)+1, '\t</datalist>\n');

            let options = "";

            for(const type of partTypes[value])
            {
                options += '\t\t<option value="' + type + '">\n';
            }

            console.log(options);

            data = insertAtIndex(data, getPosition(data, "\n", 3)+1, options);
        }

        partsElem.insertAdjacentHTML('beforeend', data);
        console.log(data);
    });
});

function insertAtIndex(str, index, sub)
{
    const fullLength = (str+sub).length;
    const start = str.substring(0, index);
    const end = str.substring(index);
    return start + sub + end;
}

function getPosition(string, subString, index)
{
    return string.split(subString, index).join(subString).length;
}