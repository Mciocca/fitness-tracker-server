import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';

// This app is not being used for profit and it's hard to argue that exercises are IP, so this scraper should be fine.
const getExercises = async (muscleGroup, maxPage) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // load more exercises
  const exercises = [];
  for (let index = 1; index < maxPage + 1; index++) {
    const url = `https://www.bodybuilding.com/exercises/finder/${index}/?muscle=${muscleGroup}`;
    await page.goto(url);
    const content = await page.content();

    const $ = cheerio.load(content);
    const els = Array.from($('.ExCategory-results .ExHeading a'));
    els.forEach((el) => {
      const title = $(el).text().trim();
      exercises.push({ title, muscleGroup: formatMuscleGroup(muscleGroup) });
    });
  }
  fs.writeFileSync(`${__dirname}/scraper_output/${muscleGroup}.json`, JSON.stringify(exercises), { flag: 'a' });
  await browser.close();
};

const formatMuscleGroup = (group) => {
  const title = group.replace('-', ' ');
  return title.replace(/\b\w/g, first=> first.toUpperCase())
};

getExercises('chest', 6);
getExercises('lats', 3);
getExercises('middle-back', 3);
getExercises('lower-back', 2);
getExercises('hamstrings', 3);
getExercises('quadriceps', 7);
getExercises('calves', 1);
getExercises('triceps', 3);
getExercises('biceps', 3);
getExercises('forearms', 1);
getExercises('glutes', 1);
getExercises('abdominals', 5);
getExercises('traps', 1);
getExercises('shoulders', 6);
