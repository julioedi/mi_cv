
const QRCode = window.QRCode;


async function generateQR(props = {}) {

    const size = this.props?.size ?? 240;
    const space = Math.round(size / 10);
    const $cornersColor = "red";
    const clanatts = (__) => {
        __.removeAttribute("fill");
        // __.removeAttribute("shape-rendering");
        // __.removeAttribute("stroke");
    }

    const element = document.createElement("div");
    await new Promise(res => {
        const params = {
            text: `./`, // Content
            width: 512, // Widht
            height: 512, // Height
            colorDark: "#000000", // Dark color
            // quietZone
            quietZone: space,
            correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H
            PO: $cornersColor,
            PI: $cornersColor,

            onRenderingEnd: (options, dataURL) => {
                // console.info(dataURL);
                const whites = element.querySelectorAll('[fill="#ffffff"],[fill="rgb(0,0,0)"]');
                const svg = element.querySelector("svg");
                const wrap = svg.getAttribute("width");
                svg.setAttribute("viewBox", `0 0 ${wrap} ${wrap}`);
                svg.setAttribute("height", size);
                svg.setAttribute("width", size);
                // svg.width = size;
                // svg.height = size;
                whites.forEach((__, index) => {
                    if (index > 0) {
                        __.remove();
                    }
                })

                const blacks = element.querySelectorAll('[fill="#000000"]');
                blacks.forEach((__, index) => {
                    clanatts(__);
                    // const $el = +__.getAttribute("width");
                    // const space = $el * 0.25;
                    // __.removeAttribute("fill");
                    // __.removeAttribute("shape-rendering");
                    // __.removeAttribute("stroke");
                    // __.setAttribute("rx",$el / 2);
                    // __.setAttribute("ry",$el / 2);
                    // __.setAttribute("stroke","#ffffff");
                    // __.setAttribute("stroke-width",space);
                })

                const corners = element.querySelectorAll(`[fill="${$cornersColor}"]`);
                corners.forEach((__, index) => {
                    clanatts(__);
                    __.removeAttribute("fill");
                })
                res(true);
            },

            drawer: 'svg',
            ...props
        }
        new QRCode(element, params);
    })
    return element.innerHTML;
}

async function textToSvgBase64(text) {
  const scale = 6;
  const width = text.length * 8 * scale;
  const height = 20 * scale;
  const fontSize = 14 * scale;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <text x="0" y="${fontSize}" font-family="Roboto, sans-serif" font-size="${fontSize}" fill="black">${text}</text>
    </svg>
  `;

  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();

  const jpegData = await new Promise((resolve, reject) => {
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white"; // Background for JPEG
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = reject;
    img.src = url;
  });

  return jpegData;
}


(async () => {
    let lang = 1;
    const icons = {};

    const createDate = (stringdate) => {
        if (!stringdate) {
            return lang == 0 ? 'Actualidad' : 'Currently';
        }
        const date = new Date(stringdate);
        const locale = lang == 0 ? 'es-ES' : 'en-US';
        const format = new Intl.DateTimeFormat(locale, { month: 'short' });
        const month = format.format(date).toUpperCase(); // ABR, APR, etc.

        const year = date.getFullYear();

        return `${month} ${year}`;
    }
    const iconsData = {
        "clickup": "ClickUp",
        "company": "Company",
        "elementor": "Elementor",
        "figma": "Figma",
        "freelance": "Freelance",
        "github": "GitHub",
        "JS": "HTML/CSSJS",
        "prototype": "Prototype",
        "PS": "Photoshop",
        "react": "React",
        "wcag": "WCAG",
        "ui": "UI Desing",
        "UX": "UX",
        "VSCode": "VS Code",
        "wp": "WordPress",
        "XD": "Adobe XD"
    }
    const iconsNames = [
        "clickup",
        "company",
        "elementor",
        "figma",
        "freelance",
        "github",
        "JS",
        "prototype",
        "PS",
        "react",
        "wcag",
        "ui",
        "UX",
        "VSCode",
        "wp",
        "XD",
        "briefcase",
        "email",
        "linkedin",

    ];
    const today = new Date();
    for (let i = 0; i < iconsNames.length; i++) {
        const name = iconsNames[i];
        const element = await fetch(`./icons/${name}.svg`)
            .then(res => res.text())
            .catch(err => null);
        const preName = name.toLowerCase();
        icons[preName] = element.replaceAll(/(\r|\n)/g, "")
            //remove comments
            .replace(/\<\!--.*?--\>/, "")
            //remove scripts
            .replace(/\<script.*?script\>/, "")
            .replace("<svg",`<svg class="${preName}"`)
        iconsData[preName] = iconsData[name];
    }



    const render = async () => {
        document.body.innerHTML = "";
        document.head.parentNode.setAttribute("lang", lang == 0 ? "es_MX" : "en_US");
        const box = (tag, string, atts = null) => {
            const el = document.createElement(tag);
            el.innerHTML = string;
            if (atts) {

                for (const key in atts) {
                    el[key] = atts[key];
                }
            }
            return el;
        }

        const __ = (string, atts = null, tag = "p") => {
            if (Array.isArray(string)) {
                if (typeof string[lang] == "string") {
                    string = string[lang]
                }
                else {
                    string = string[0];
                }
            }
            const el = box(tag, string, atts);
            return el;
        }
        const insert = (el) => {
            document.body.appendChild(el);
        }


        const data = await fetch("./data.json")
            .then(res => res.json());
        document.title = "cv_juliogarcia_2025_" + (lang === 0 ? "español" : "english");
        const pre = (string) => {
            const el = box("p", string, { className: "hidden_text" });
            insert(el)
        }

        const hiddenTitle = (tag, string, atts = null, title) => {
            const el = box(tag, `<span class="hidden_text">${title}</span><span>${string}<span>`, atts);
            return el;
        }

        const name = hiddenTitle("h1", data.name, null, lang == 0 ? "Nombre: " : "Name: ")
        insert(name);

        const title = hiddenTitle("h2", data.title[lang], null, lang == 0 ? "Título: " : "Title: ")
        insert(title);

        const desc = __(data.description, { className: "body_desc" });
        desc.innerHTML = `<span class="hidden_text">${lang == 0 ? "Resumen: " : "Summary: "}</span>` + desc.innerHTML
        insert(desc);


        const skillsTitle = box("h2", lang == 0 ? "Habilidades" : "skills", { className: "skills_title" });
        insert(skillsTitle);

        const year = today.getFullYear();
        const yn = lang == 0 ? "Años" : "Years";
        const renderSkillList = (index) => {
            const skills = data.skills[index];
            let output = '';
            for (let i = 0; i < skills.data.length; i++) {
                const element = skills.data[i];
                const icon = icons[element.icon];
                const firstYear = year - element.year;
                output += `<li class="icon_skill">${icon} <span>${element.title}</span><span class="border"> - </span><span  ><b> - </b>${firstYear} ${yn}</span></li>`;
            }
            let title = `<h3>${skills.title[lang]}</h3>`;
            return `<li><ul>${output}</ul></li>`;
        }
        const skillsList = box("ul", "", { className: "skillsList" });
        skillsList.innerHTML = renderSkillList(0) + renderSkillList(1);
        insert(skillsList);




        const tools = box("h2", lang == 0 ? "Herramientas" : "Tools", { className: "tools_title" });
        insert(tools);


        const toolsList = box("ul", "", { className: "toolslist" });
        for (let i = 0; i < data.tools.length; i++) {
            const element = data.tools[i];
            const icon = icons[element];
            toolsList.innerHTML += `<li role="listitem">${icon} <span>${iconsData[element]}<span></li>`;

        }
        insert(toolsList);

        const experience = box("h2", lang == 0 ? "Experiencia" : "Experience", { className: "experience_title" });
        insert(experience);

        const expList = data.experience;
        const ul = box("ul", "", { className: "experiencelist" });
        for (let index = 0; index < expList.length; index++) {
            const element = expList[index];
            const li = document.createElement("li");
            li.innerHTML = icons[element.icon];
            let title = __(element.title, null, "h3");
            if (element.company) {
                title.innerHTML = element.company + " - " + title.innerHTML;
            }
            const record = createDate(element.dates[0]) + " - " + createDate(element.dates[1]);
            title.innerHTML = `<span>${title.innerHTML}</span><span class="border"> - </span><span class="years"><b> - </b>${record}</span>`;
            const desc = box("p", element.description[lang]);
            li.appendChild(title);
            li.appendChild(desc);
            if (index < expList.length - 1) {
                const pre = box("div", "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------", { className: "separator" });
                li.appendChild(pre);
            }
            ul.appendChild(li);
        }
        insert(ul);


        const links = box("h2", "Links", { className: "links_title" });
        insert(links);
        
        const qrCodes = box("ul", "", { className: "qrcodes" });
        for (let i = 0; i < data.links.length; i++) {
            const element = data.links[i];
            const link = typeof element.url == "string" ? element.url : element.url[lang];
            const preview = await textToSvgBase64(element.custom);
            const svg = await generateQR({text:link});
            const icon = icons[element.type]
            let preLink = link;
            if (i < data.links.length - 1) {
                preLink += ", ";
            }
            const li = box("li",icon + `<img src="${preview}"><span class="link">${preLink}</span>` + `<div class="svg">${svg}</div>`);
            li.innerHTML = `<a href="${link}" alt="${element.custom}">${li.innerHTML}</a>`;
            qrCodes.appendChild(li)
        }
        insert(qrCodes);

        // const example = generateQR();
    }
    render();
})()