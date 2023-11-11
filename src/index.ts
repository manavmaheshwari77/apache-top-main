import _ from "lodash";
import { setTimeout } from "node:timers/promises";
import fs from "node:fs/promises";
import {
  apacheTopParser,
  calculateUniqueValues,
  print404RequestedFiles,
  printOverallAnaylsedReq,
  printRequestedFiles,
  printUniqueVisitorsperDay,
} from "./app";



const main = async () => {
  const chunckSize = 15;
  while (true) {
    // on windows clear gives an issue, it clears onyl current viewport
    // for windows uncomment the below line
    process.stdout.write("\x1Bc");
    console.clear();
    try {
      const dataPromise = fs.readFile("log-generator/access.log", {
        encoding: "utf8",
      });
      const logStatsPromise = fs.stat("log-generator/access.log");
      const [data, logStats] = await Promise.all([
        dataPromise,
        logStatsPromise,
      ]);
      const logObjects = apacheTopParser(data);
      const uniqueRecords = calculateUniqueValues(logObjects);
      printOverallAnaylsedReq(logObjects, {
        logSize: (logStats.size / 1024).toFixed(2),
        uniqueRecords,
      });
      printUniqueVisitorsperDay(uniqueRecords.uniqueDateRecord, chunckSize);
      printRequestedFiles(uniqueRecords.uniqueFileRecord, chunckSize);
      print404RequestedFiles(uniqueRecords.uniqueFileRecord, chunckSize);
    } catch (err) {
      console.log(err);
    }
    await setTimeout(500);
  }
};

main();
