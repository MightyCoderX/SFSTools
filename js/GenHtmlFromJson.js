const dir = `../SFS_Parts_Templates/`;

var htmlComponents = new JSZip();

const files = [
    "aerodynamics",
    "capsule",
    "docking_port",
    "engine",
    "fairing",
    "fairing_cone",
    "fuel_tank",
    "landing_leg",
    "parachute",
    "probe",
    "rcs",
    "separator",
    "side_separator",
    "solar_array",
    "strut",
    "wheel"
]

for(let file of files)
{
    fetch(dir+file+".json")
    .then(res => res.json())
    .then(data =>
    {
        let name = (file[0].toUpperCase() + file.substring(1)).split("_").join(" ");
        let html = `<fieldset class="${file}">\n\t<legend>${name}</legend>\n${genHtmlFieldsFromObject(data)}\n</fieldset>`;
        //document.getElementById("parts").innerHTML += html;

        htmlComponents.file(`${file}.html`, html);
    });
}

function downloadZip()
{
    htmlComponents.generateAsync({type:"blob"})
    .then(blob =>
    {
        let download = document.createElement('a');
        download.classList.add("download_html");
        download.download = "HtmlComponents.zip";
        download.innerText = "Download Components";
        download.hidden = true;
        download.href = URL.createObjectURL(blob);

        document.body.appendChild(download);

        download.click();
    });
}

function genHtmlFieldsFromObject(object)
{
    let outputHtml = '';
    for(let key in object)
    {
        let value = object[key];
        let valueType = typeof value;

        console.log(key, value, valueType);

        switch(valueType)
        {
            case "string":
                outputHtml += `\t<label>${key}: </label><input type="text" id="${key}" autocomplete="off" value="${value}">\n`;
                break;
            case "object":
                outputHtml += "\t<fieldset>\n";
                outputHtml += `\t\t<legend>${key}</legend>\n`;
                outputHtml += "\t" + genHtmlFieldsFromObject(object[key]);
                outputHtml += "\t</fieldset>\n";
                break;
            case "number":
                outputHtml += `\t<label>${key}: </label><input type="number" id="${key}" value="${value}" step="0.1">\n`;
                break;
            
            case "boolean":
                outputHtml += `\t<input type="checkbox" id="${key}" checked="${value}"><span>${key}</span>\n`;
                break;
        }
    }

    return outputHtml;
}
