const dir = `../SFS_Parts_Templates/`;
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
    const path = dir+file+".json";
 
    console.log(file);
    fetch(path)
    .then(res => res.json())
    .then(data =>
    {
        let name = (file[0].toUpperCase() + file.substring(1)).split("_").join(" ");
        let html = `<fieldset class="part">\t<legend>${name}</legend>\n${genHtmlFieldsFromObject(data)}\n</fieldset>`;
        //document.getElementById("parts").innerHTML += html;
        let download = document.createElement('a');
        download.classList.add("download_html");
        download.download = file+".html";
        download.innerText = "Download " + file;
        download.hidden = true;

        document.body.appendChild(download);

        let blob = new Blob([html], {type: "text/plain;charset=utf-8"});
        download.href = URL.createObjectURL(blob);
    });
}

for (let link of document.querySelectorAll(".download_html"))
{
    link.click();
    console.log("Clicked", link);
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
                outputHtml += `\t<label>${key}: </label><input type="text" id="${key}" value="${value}">\n`;
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
