const puppeter = require("puppeteer");
const readline = require("readline-sync");
const fs = require("fs");

async function scrap(pesquisa) {
  const browser = await puppeter.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 600,
  });
  //Pesquisa do Google
  await page.goto("https://www.google.com/");
  page.setDefaultNavigationTimeout(0);
  await page.waitForSelector(
    "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input"
  );
  const InputFiled = await page.$(
    "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input"
  );
  await InputFiled.type(pesquisa);
  await page.keyboard.press("Enter");
  for (let i = 1; i < 10; i++) {
    await page.waitForNavigation();
    const results = await page.evaluate(() => {
      const searchResults = document.querySelectorAll(".d5oMvf");
      const temp = [];
      searchResults.forEach((searchItem) => {
        let item = {
          heading: searchItem.querySelector(
            "a .cfxYMc.JfZTW.c4Djg.MUxGbd.v0nnCb"
          ).innerHTML,
          link: searchItem.querySelector("a").href,
        };
        temp.push(item);
      });
      return temp;
    });
    await page.click("#pnnext");

    const result = results.map((item) => {
      return JSON.stringify(item, null, " ");
    });
    fs.appendFileSync("results.txt", result);
  }

  browser.close();
}

const pesquisa = readline.question("Procurar por: \n");

if (fs.existsSync("results.txt")) {
  const deleteFile = readline.question(
    "Deseja deletar os resultados da última pesquisa? (y/n)"
  );
  if (deleteFile === "y") {
    fs.unlinkSync("results.txt");
    scrap(pesquisa);
  } else if (deleteFile === "n") {
    scrap(pesquisa);
  }
} else {
  scrap(pesquisa);
}
