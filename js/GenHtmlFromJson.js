const fs = require('fs');
const path = require('path');

const templates = `../SFS_Parts_Templates/`;

for(let file of fs.readdirSync(path.resolve(__dirname, templates)))
{
    let data = require(path.resolve(__dirname, templates, file));
    let name = (file[0].toUpperCase() + file.substring(1)).split("_").join(" ").replace(".json", "");
    let html = `<fieldset class="part" name="${file.split('.')[0]}">\n\t<legend>${name}</legend>\n<span class="delete-part" id="deletePart" onclick="partsElem.removeChild(this.parentElement);"><i class="fas fa-trash"></i></span>\n${genHtmlFieldsFromObject(data)}\n</fieldset>`;
    //document.getElementById("parts").innerHTML += html;

    fs.writeFileSync(path.resolve(__dirname, "../SFS_HTML_Components/", file.replace('.json', '.html')), html);
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
                outputHtml += `\t<label>${key}: </label><input type="text" name="${key}" value="${value}">\n`;
                break;
                
            case "number":
                outputHtml += `\t<label>${key}: </label><input type="number" name="${key}" value="${value}" step="0.1">\n`;
                break;
            
            case "boolean":
                outputHtml += `\t<input type="checkbox" name="${key}" checked="${value}"><span>${key}</span>\n`;
                break;

            case "object":
                outputHtml += `\t<fieldset name="${key}">\n`;
                outputHtml += `\t\t<legend>${key}</legend>\n`;
                outputHtml += genHtmlFieldsFromObject(object[key]).replace(/\t/g, "\t\t");
                outputHtml += "\t</fieldset>\n";
                break;
        }
    }

    return outputHtml;
}
