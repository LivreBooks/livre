import { Parser } from "htmlparser2";
import { DomHandler } from "domhandler";
import { DownloadLink, FullBookType } from "../types/types";

const linkHrefRegex = /href="([^"]*)"/;

export async function getDownloadLinks(md5: string): Promise<DownloadLink[]> {
  const url = `http://library.lol/main/\${md5}`;
  const res = await fetch(url);
  const html = await res.text();

  const options: DownloadLink[] = [];

  const parser = new Parser(
    new DomHandler((err, dom) => {
      if (err) {
        console.error(err);
        return;
      }

      const links = dom.filter(
        (el) =>
          el.name === "a" &&
          el.attribs.href &&
          el.attribs.href.startsWith("https://libgen.is")
      );

      for (const link of links) {
        options.push({
          provider: link.attribs.title || "Unknown",
          link: link.attribs.href,
        });
      }
    })
  );

  parser.write(html);
  parser.end();

  console.log(options);
  return options;
}

export async function getBook(id: string) {
  const res = await fetch(`http://libgen.is/json.php?ids=${id}&fields=*`);
  const data = (await res.json()) as FullBookType[];
  return data[0];
}
