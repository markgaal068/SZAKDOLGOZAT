import React from "react";

export default function AdminTools() {
  const tags = [
    { name: "Alcím", tag: "<h3>", description: "Alcím a cikkben", example: "<h3>Alcím</h3>" },
    { name: "Áthúzott", tag: "<del>", description: "Áthúzott szöveg", example: "<del>Ez egy áthúzott szöveg!</del>" },
    { name: "Bevezető", tag: "<section class='intro'></section>", description: "Cikk bevezetője", example: "<section class='intro'>Ez egy bevezető szöveg.</section>" },
    { name: "Blokk külön", tag: "<div>", description: "Blokkszintű formázás", example: "<div style='background-color:yellow;'>Sárga háttér</div>" },
    { name: "Cikk cím", tag: "<header><h1></h1></header>", description: "Cikk címének meghatározása", example: "<header><h1>Cikk címe</h1></header>" },
    { name: "Cikk vége", tag: "<footer><p>Vége</p></footer>", description: "Cikk befejezése", example: "<footer><p>Vége</p></footer>" },
    { name: "Cikkek közötti hivatkozás", tag: "<a href=''></a>", description: "Link másik cikkhez", example: "<a href='cikk2.html'>További információk</a>" },
    { name: "Citált szöveg", tag: "<cite></cite>", description: "Hivatkozott forrás vagy citálás", example: "<cite>Wikipedia</cite>" },
    { name: "Dőlt", tag: "<em>", description: "Dőlt szöveg", example: "<em>Ez egy dőlt szöveg!</em>" },
    { name: "Elrejtett blokk", tag: "<div>", description: "Blokkszintű formázás", example: "<div style='background-color:yellow;'>Sárga háttér</div>" },
    { name: "Elrejtett szöveg", tag: "<span>", description: "Szöveg részlet formázása", example: "<span style='color:red;'>Piros</span> szöveg" },
    { name: "Félkövér", tag: "<strong>", description: "Félkövér szöveg", example: "<strong>Ez egy félkövér szöveg!</strong>" },
    { name: "Felsorolás", tag: "<ul>", description: "Rendezetlen lista", example: "<ul><li>Első elem</li><li>Második elem</li></ul>" },
    { name: "Források", tag: "<aside><p>Forrás: </p></aside>", description: "Források hivatkozása", example: "<aside><p>Forrás: Wikipedia</p></aside>" },
    { name: "Idézet", tag: "<blockquote>", description: "Blokkszintű idézet", example: "<blockquote>Ez egy idézet!</blockquote>" },
    { name: "Kép", tag: "<img>", description: "Kép beszúrása", example: "<img src='https://royalarcadenorwich.co.uk/wp-content/uploads/2017/07/150x150.png' alt='Leírás'>" },
    { name: "Kép (figura)", tag: "<figure><img src=''></figure>", description: "Kép beillesztése figura körében", example: "<figure><img src='image.jpg'><figcaption>Leírás</figcaption></figure>" },
    { name: "Képaláírás", tag: "<figcaption></figcaption>", description: "Kép aláírása", example: "<figure><img src='image.jpg'><figcaption>Ez egy képaláírás.</figcaption></figure>" },
    { name: "Kiadás dátuma", tag: "<footer><p>Dátum: </p></footer>", description: "Cikk kiadásának dátuma", example: "<footer><p>Dátum: 2025-03-02</p></footer>" },
    { name: "Kódrészlet", tag: "<code>", description: "Kódszöveg", example: "<code>console.log('Hello');</code>" },
    { name: "Link", tag: "<a>", description: "Hivatkozás létrehozása", example: "<a href='https://example.com'>Link szöveg</a>" },
    { name: "Listaelem", tag: "<li>", description: "Lista eleme", example: "<li>Ez egy lista elem!</li>" },
    { name: "Szöveg külön", tag: "<span>", description: "Szöveg részlet formázása", example: "<span style='color:red;'>Piros</span> szöveg" },
    { name: "Oldalsáv", tag: "<aside></aside>", description: "Oldalsáv hozzáadása", example: "<aside>Oldalsáv tartalom</aside>" },
    { name: "Címsor 1", tag: "<h1>", description: "Első szintű címsor", example: "<h1>Ez egy első szintű címsor!</h1>" },
    { name: "Címsor 2", tag: "<h2>", description: "Második szintű címsor", example: "<h2>Ez egy második szintű címsor!</h2>" },
    { name: "Címsor 3", tag: "<h3>", description: "Harmadik szintű címsor", example: "<h3>Ez egy harmadik szintű címsor!</h3>" },
    { name: "Címsor 4", tag: "<h4>", description: "Negyedik szintű címsor", example: "<h4>Ez egy negyedik szintű címsor!</h4>" },
    { name: "Címsor 5", tag: "<h5>", description: "Ötödik szintű címsor", example: "<h5>Ez egy ötödik szintű címsor!</h5>" },
    { name: "Címsor 6", tag: "<h6>", description: "Hatodik szintű címsor", example: "<h6>Ez egy hatodik szintű címsor!</h6>" },
    { name: "Sortörés", tag: "<br>", description: "Sortörést hoz létre", example: "Sortörés előtt<br>Sortörés után" },
    { name: "Számozott lista", tag: "<ol>", description: "Rendezett lista", example: "<ol><li>Első elem</li><li>Második elem</li></ol>" },
    { name: "Szöveg kiemelés (citálás)", tag: "<q></q>", description: "Citált szöveg", example: "<q>Ez egy citált szöveg!</q>" },
    { name: "Táblázat", tag: "<table>", description: "Táblázat létrehozása", example: "<table><tr><th>Fejléc</th></tr><tr><td>Adat</td></tr></table>" },
    { name: "Táblázat cella", tag: "<td>", description: "Táblázat cella", example: "<td>Adat</td>" },
    { name: "Táblázat fejléc", tag: "<th>", description: "Táblázat fejléc", example: "<th>Fejléc</th>" },
    { name: "Táblázat sor", tag: "<tr>", description: "Táblázat sor", example: "<tr><td>Adat</td></tr>" },
    { name: "Videó", tag: "<video controls><source src=''></video>", description: "Videó beágyazása", example: "<video controls><source src='video.mp4'></video>" }
];



  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">HTML Szövegformázási Tagek</h1>
      <table className="table-auto w-full border-collapse border border-bg">
        <thead>
          <tr className="bg-accent">
            <th className="border border-bg px-4 py-2">Tag Neve</th>
            <th className="border border-bg px-4 py-2">Tag HTML Kódja</th>
            <th className="border border-bg px-4 py-2">Mit Csinál?</th>
            <th className="border border-bg px-4 py-2">Minta</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag, index) => (
            <tr key={index} className="border border-sndbg">
              <td className="border border-sndbg px-4 py-2">{tag.name}</td>
              <td className="border border-sndbg px-4 py-2">
                <code>{tag.tag}</code>
              </td>
              <td className="border border-sndbg px-4 py-2">{tag.description}</td>
              <td className="border border-sndbg px-4 py-2" dangerouslySetInnerHTML={{ __html: tag.example }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
