export function h1(text) {
    return `# ${text}\n`;
}

export function h2(text) {
    return `## ${text}\n`;
}

export function h3(text) {
    return `### ${text}\n`;
}

export function h4(text) {
    return `#### ${text}\n`;
}

export function h5(text) {
    return `##### ${text}\n`;
}

export function italic(text) {
    return `__${text}__\n`;
}

export function bold(text) {
    return `**${text}**\n`;
}

export function paragraph(text) {
    return `> ${text}\n`;
}

export function paragraphTip(text) {
    return `!> ${text}\n`;
}

export function monospace(text) {
    return "`" + text + "`\n";
}

export function strikethrough(text) {
    return `~~${text}~~\n`;
}

export function bullet(text) {
    return `* ${text}\n`;
}

export function table(headData, tableData) {
    if (!headData || !tableData || headData.length == 0) {
        return "";
    }

    let tableContent = "|";
    headData.forEach(name => {
        tableContent += ` ${name} |`
    });
    tableContent += "\n";
    tableContent += "| ";
    for (let index = 0; index < headData.length; index++) {
        tableContent += " :------ |";
    }
    tableContent += "\n";
    tableData.forEach(row => {
        tableContent += "|";
        row.forEach(item => {
            tableContent += ` ${resolveUndefined(item)} |`;
        })
        tableContent += "\n";
    });

    return tableContent + "\n";
}

export function codeBlock(lang, code) {
    return "```" + `${lang}\n${code}\n` + "```";
}

export function link(text, url) {
    return `[${text}](${url})`;
}

function resolveUndefined(any) {
    return any != undefined && any != null ? any : "-";
}