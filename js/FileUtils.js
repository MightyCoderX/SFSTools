function saveAs(fileName, content, contentType = 'text/plain')
{
    const a = document.createElement('a');

    const blob = new Blob([content], {'type': contentType})

    a.href = URL.createObjectURL(blob);
    a.download = fileName;

    document.appendChild(a);
    a.click();
    document.removeChild(a);
}