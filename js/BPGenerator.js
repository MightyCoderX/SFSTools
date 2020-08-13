const partType = document.getElementById('partType');
const btnAddPart = document.getElementById('btnAddPart');
const partsElem = document.getElementById('parts');
const output = document.getElementById('output');
const btnUpdateOutput = document.getElementById('updateOutput');

const partTypes = {
    engine: ["Engine Hawk", "Engine Valiant", "Engine Kolibri", "Engine Titan", "Engine Frontier", "Ion Engine"],
    solar_array: [2, 3],
    aerodynamics: ["Side Fuselage", "Cone", "Cone Side"],
    wheel: ["Wheel Medium", "Wheel Big"],
    parachute: ["Parachute", "Parachute Side"]
}

function genObjectFromHtml(parent)
{
    let objects = [];

    let obj = {};

    for(const child of parent.children)
    {
        // console.log(child.tagName);
        if(child.tagName.toLowerCase() == 'fieldset')
        {
            if(child.className == 'part')
            {
                objects = [...objects, ...genObjectFromHtml(child)];
                console.log(objects);
            }
            else
            {
                obj[child.name] = genObjectFromHtml(child)[0];
            }
            
            // console.log(child);
        }
        
        if(child.tagName.toLowerCase() == 'input')
        {
            obj[child.name] = child.value;
            // console.log(child.name, child.value);
        }
    }

    if(Object.keys(obj).length)
    {
        objects.push(obj);
    }

    // console.log(objects, obj);

    return objects;
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
            data = insertAtIndex(data, getPosition(data, "\n", 3)-1, ` list="${value}-variants" autocomplete="off"`);
            data = insertAtIndex(data, getPosition(data, "\n", 3)+1, `\t<datalist id="${value}-variants">\n`);
            data = insertAtIndex(data, getPosition(data, "\n", 4)+1, '\t</datalist>\n');

            let options = "";

            for(const type of partTypes[value])
            {
                options += '\t\t<option value="' + type + '">\n';
            }

            console.log(options);

            data = insertAtIndex(data, getPosition(data, "\n", 4)+1, options);
        }
        else
        {
            data = insertAtIndex(data, getPosition(data, "\n", 3)-1, ' readonly');
        }

        partsElem.insertAdjacentHTML('beforeend', data);
        partType.value = "";

        updateOutput();
    });
});

btnUpdateOutput.addEventListener('click', () =>
{
    updateOutput();    
});

function updateOutput()
{
    const obj = genObjectFromHtml(partsElem);
    console.log(partsElem);
    console.log(obj);
    output.textContent = JSON.stringify(obj, null, 4);
}

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