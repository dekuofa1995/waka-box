require("dotenv").config();
const { XMLHttpRequest } = require("xmlhttprequest");
const { ajax } = require("rxjs/ajax");
const { tap } = require("rxjs/operators");
const Octokit = require("@octokit/rest");
const {
  GIST_ID: gistId,
  GH_TOKEN: githubToken,
  WAKATIME_API_KEY: wakatimeApiKey
} = process.env;
const baseURL = "https://wakatime.com";
console.log("gistId: ", gistId);

const octokit = new Octokit({ auth: `token ${githubToken}` });

function weekBefore() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
}
function dateFormat(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
function btoa(message) {
  return Buffer.from(message).toString("base64");
}
function createXHR() {
  return new XMLHttpRequest();
}
async function main() {
  console.log("start main: ");
  const start = dateFormat(weekBefore());
  const end = dateFormat(new Date());
  const summary = ajax({
    createXHR,
    url: `${baseURL}/api/v1/users/current/summaries?start=2020-06-17&end=2020-06-18`,
    method: "GET",
    crossDomain: true,
    withCredentials: false,
    headers: {
      authorization: `Basic ${btoa(wakatimeApiKey)}`
    }
  }).pipe(tap(console.log));
  summary.subscribe(
    res => updateGist(res.response),
    err => console.error(err)
  );
  // try {
  //   const stats = await request.get(`/api/vi/users/current/summaries?start=2020-06-17&end=2020-06-18`)
  //   console.log('stats: ', stats)
  //   await updateGist(stats)
  // } catch (e) {
  //   console.error(e)
  // }
}
function formatSeconds(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

async function updateGist(stats) {
  let gist;
  try {
    gist = await octokit.gists.get({ gist_id: gistId });
  } catch (error) {
    console.error(`Unable to get gist\n${error}`);
  }
  const arr = stats.data.map(({ languages }) => languages).flat();
  const sum = arr.reduce((acc, curr) => acc + curr.total_seconds, 0);
  const converted = Array.from(
    arr
      .reduce((acc, curr) => {
        const accItem = acc.get(curr.name);
        if (accItem) {
          const total = accItem.total_seconds + curr.total_seconds;
          acc.set(curr.name, {
            ...accItem,
            total_seconds: total,
            percent: (total / sum) * 100
          });
        } else {
          acc.set(curr.name, curr);
        }
        return acc;
      }, new Map())
      .values()
  ).sort((a, b) => b.percent - a.percent);
  const lines = converted.map(({ name, percent, total_seconds }) =>
    [
      name.padEnd(11),
      generateBarChart(percent, 21),
      String(percent.toFixed(1)).padStart(5) + "%",
      formatSeconds(total_seconds).padEnd(14)
    ].join(" ")
  );
  if (lines.length == 0) {
    console.warn("no data to update");
    return;
  }
  const content = lines.join("\n");
  try {
    // Get original filename to update that same file
    const filename = Object.keys(gist.data.files)[0];
    await octokit.gists.update({
      gist_id: gistId,
      files: {
        [filename]: {
          filename: `📊 Weekly development breakdown`,
          content: content
        }
      }
    });
    console.log("update content: \n", content);
  } catch (error) {
    console.error(`Unable to update gist\n${error}`);
  }
}

function generateBarChart(percent, size) {
  const syms = "░▏▎▍▌▋▊▉█";

  const frac = Math.floor((size * 8 * percent) / 100);
  const barsFull = Math.floor(frac / 8);
  if (barsFull >= size) {
    return syms.substring(8, 9).repeat(size);
  }
  const semi = frac % 8;

  return [syms.substring(8, 9).repeat(barsFull), syms.substring(semi, semi + 1)]
    .join("")
    .padEnd(size, syms.substring(0, 1));
}

(async () => {
  await main();
})();
