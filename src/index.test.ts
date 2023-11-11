import {
  apacheTopParser,
  calculateUniqueValues,
  print404RequestedFiles,
  printOverallAnaylsedReq,
  printRequestedFiles,
  printUniqueVisitorsperDay,
} from "./app";

// to run test cases use command yarn run:test
const runAllTestCases = async () => {
  const validLogData = `66.221.193.94 - - [12/Nov/2023:17:50:18 +0000] "GET /apps/cart.jsp?appID=3836 HTTP/1.0" 200 5101 "https://jimenez-ramirez.org/category.php" "Mozilla/5.0 (compatible; MSIE 9.0; Windows 98; Win 9x 4.90; Trident/3.0)"\n116.109.227.84 - - [14/Nov/2023:08:50:19 +0000] "POST /search/tag/list HTTP/1.0" 200 5054 "http://www.fleming-graham.biz/app/category/" "Mozilla/5.0 (X11; Linux i686; rv:1.9.6.20) Gecko/2021-10-23 20:11:55 Firefox/8.0"
  `;
  const parsedLogData = apacheTopParser(validLogData);
  console.log("Test Case 1 | Should receive data array ", parsedLogData);

  const invalidLogData = `
    Invalid log data that does not match the log format.
  `;
  try {
    const wrongParsedLogData = apacheTopParser(invalidLogData);
    console.log(
      "Test Case 2 | Should receive empty array ",
      wrongParsedLogData
    );
  } catch (error) {
    console.log(error);
  }

  const logObjects = apacheTopParser(validLogData);
  const uniqueRecords = calculateUniqueValues(logObjects);
  console.log(
    "Test Case 3 | Should receive unique records Object: ",
    uniqueRecords
  );
  console.log("Test Case 4 | Should print Anaylsed info");
  printOverallAnaylsedReq(logObjects, {
    logSize: "1024",
    uniqueRecords,
  });
  console.log("Test Case 5 | Should print Anaylsed info with values as 0");
  printOverallAnaylsedReq(logObjects, {
    logSize: "0",
    uniqueRecords: {
      uniqueDateRecord: {},
      uniqueFileRecord: {},
      uniqueReffersRecord: {},
      uniqueVistorsRecord: {},
    },
  });

  const uniqueDateRecord = uniqueRecords.uniqueDateRecord;
  console.log("Test Case 6 | Should print Unique Visitors info successfully");
  printUniqueVisitorsperDay(uniqueDateRecord, 10);
  console.log("Test Case 7 | Should print nothing successfully");
  printUniqueVisitorsperDay({}, 10);

  const uniqueFileRecord = uniqueRecords.uniqueFileRecord;
  console.log("Test Case 8 | Should print Unique Files info successfully");
  printRequestedFiles(uniqueFileRecord, 10);
  console.log("Test Case 9 | Should print nothing successfully");
  printRequestedFiles({}, 10);

  const uniqueFileRecordWith404 = uniqueRecords.uniqueFileRecord;
  console.log("Test Case 10 | Should print Unique 404 Files info successfully");
  print404RequestedFiles(uniqueFileRecordWith404, 10);
  console.log("Test Case 11 | Should print nothing successfully");
  print404RequestedFiles({}, 10);
};

runAllTestCases();
