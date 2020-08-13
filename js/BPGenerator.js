const partType = document.getElementById('partType');
const btnAddPart = document.getElementById('btnAddPart');
const partsElem = document.getElementById('parts');
const output = document.getElementById('output');
const btnUpdateOutput = document.getElementById('updateOutput');
const btnCopyOutput = document.getElementById('copyOutput');
const btnSaveBlueprint = document.getElementById('saveBlueprint');

const partTypes = {
    engine: ["Engine Hawk", "Engine Valiant", "Engine Kolibri", "Engine Titan", "Engine Frontier", "Ion Engine"],
    solar_array: [2, 3],
    aerodynamics: ["Side Fuselage", "Cone", "Cone Side"],
    wheel: ["Wheel Medium", "Wheel Big"],
    parachute: ["Parachute", "Parachute Side"]
}

function genBluePrintFromHtml(parent)
{
    let bluePrint = {parts: []};

    let part = {};

    for(const child of parent.children)
    {
        if(child.tagName.toLowerCase() == 'fieldset')
        {
            if(child.className == 'part')
            {
                bluePrint.parts = [...bluePrint.parts, ...genBluePrintFromHtml(child).parts];
            }
            else
            {
                part[child.name] = genBluePrintFromHtml(child).parts[0];
            }
        }
        
        if(child.tagName.toLowerCase() == 'input')
        {
            part[child.name] = child.value;
        }
    }

    if(Object.keys(part).length)
    {
        bluePrint.parts.push(part);
    }

    return bluePrint;
}

btnAddPart.addEventListener('click', () =>
{
    if(!partType.value.trim()) return;
    
    const value = document.querySelector(`.addPart #typeList option[value="${partType.value}"]`).dataset.value;
    const file = `${value}.html`;

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

btnCopyOutput.addEventListener('click', () =>
{
    output.select();
    output.setSelectionRange(0, output.textContent.length);
    document.execCommand('copy');
});

btnSaveBlueprint.addEventListener('click', () =>
{
    saveAs('Blueprint.txt', output.textContent);
});

setInterval(updateOutput, 1000);

function updateOutput()
{
    const obj = genBluePrintFromHtml(partsElem);
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