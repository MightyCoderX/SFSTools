
const dir = `../SFS_Parts_Templates/`;
const files = ["capsule", "engine", "fuel_tank", "landing_leg", "parachute", 
                "probe", "rcs", "separator", "side_separator", "solar_array"]

for(let file of files)
{
    const path = dir+file+".json";

 
    console.log(file);
    fetch(path)
    .then(res => res.json())
    .then(data =>
    {
        let html = `<fieldset class="part">\t<legend>${data.n}</legend>\n${genHtmlInputFromObject(data)}\n</fieldset>`;
        document.getElementById("parts").innerHTML += html;
    });
}

function genHtmlInputFromObject(object)
{
    let outputHtml = '';
    for(let key in object)
    {
        let value = object[key];
        let valueType = typeof value;

        switch(valueType)
        {
            case "string":
                outputHtml += `\t<label>${key}: </label><input type="text" id="${key}" value="${value}">\n`;
                break;
            case "object":
                outputHtml += "\t<fieldset>\n";
                outputHtml += `\t<legend>${key}</legend>\n`;
                outputHtml += "\t" + genHtmlInputFromObject(object[key]);
                outputHtml += "</fieldset>\n";
                break;
            case "number":
                outputHtml += `\t<label>${key}: </label><input type="number" id="${key}" value="${value}">\n`;
                break;
        }
    }

    return outputHtml;
}
