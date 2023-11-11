import printf from "printf";
import { convertDateStringToDate, indexDataArr } from "./helpers";
import { ILogObject, UniqueValuesObject } from "./types";

// task 1
export const apacheTopParser = (data: string): ILogObject[] => {
    try {
      const requestsLogs = data.split(/\n/g);
      const reqParsedRecordData = requestsLogs.map((req) => {
        // Regular expression to extract information from the req string
        const logRegex =
          /^(\S+) (\S+) (\S+) \[([\w:/]+\s[+\-]\d{4})\] "(\S+ \S+ \S+)" (\d+) (\d+) "(\S+)" "([^"]+)"$/;
  
        const match = req.match(logRegex);
        if (!match) return null;
        // object with the extracted information
        const httpReqArr = match[5].split(" ");
        const logObject: ILogObject = {
          ipAddress: match[1],
          remoteUser: match[2],
          authenticatedUser: match[3],
          timestamp: convertDateStringToDate(match[4].split(":")[0]),
          httpReq: {
            type: httpReqArr[0],
            api: httpReqArr[1],
            http: httpReqArr[2],
          },
          httpStatusCode: Number(match[6]),
          responseSize: Number(match[7]),
          referer: match[8],
          userAgent: match[9],
        };
  
        return logObject;
      });
      const filteredLogs: any = reqParsedRecordData.filter(
        (value) => value !== null
      );
      return filteredLogs;
    } catch (err) {
      console.log("Error in apacheParser: ", err);
      throw err;
    }
  };
  
  // task 2
  const apacheTopPrinter = (
    heading: string,
    data: string,
    currShowing: number = 0,
    total: number = 0
  ): void => {
    try {
      const consoleStr = printf(
        "** %(heading)s   %(rcrdsShown)s** \n\n%(data)s\n\n",
        {
          heading: heading,
          data: data,
          rcrdsShown:
            currShowing > 0 && total > 0
              ? `(${currShowing > total ? total : currShowing}/${total})`
              : "",
        }
      );
      console.log(consoleStr);
    } catch (err) {
      console.log("Error in apachePrinter: ", err);
      throw err;
    }
  };
  
  export const calculateUniqueValues = (
    data: ILogObject[]
  ): UniqueValuesObject => {
    try {
      // creating unique maps for request components
      const uniqueVistorsRecord: Record<string, ILogObject[]> = {};
      const uniqueFileRecord: Record<string, ILogObject[]> = {};
      const uniqueReffersRecord: Record<string, ILogObject[]> = {};
      const uniqueDateRecord: Record<string, ILogObject[]> = {};
  
      data.forEach((req) => {
        // unique vistors record
        if (uniqueVistorsRecord[req.ipAddress]) {
          uniqueVistorsRecord[req.ipAddress].push(req);
        } else {
          uniqueVistorsRecord[req.ipAddress] = [req];
        }
  
        // unique http request
        const httpReq = req.httpReq.type
          .concat(" ")
          .concat(req.httpReq.api)
          .concat(" ")
          .concat(req.httpReq.http);
        if (uniqueFileRecord[httpReq]) {
          uniqueFileRecord[httpReq].push(req);
        } else {
          uniqueFileRecord[httpReq] = [req];
        }
  
        // unique referer request
        if (uniqueReffersRecord[req.referer]) {
          uniqueReffersRecord[req.referer].push(req);
        } else {
          uniqueReffersRecord[req.referer] = [req];
        }
  
        // unique date records
        if (uniqueDateRecord[req.timestamp]) {
          uniqueDateRecord[req.timestamp].push(req);
        } else {
          uniqueDateRecord[req.timestamp] = [req];
        }
      });
  
      return {
        uniqueFileRecord,
        uniqueVistorsRecord,
        uniqueReffersRecord,
        uniqueDateRecord,
      };
    } catch (err) {
      console.log("Error in calculate: ", err);
      throw err;
    }
  };
  
  //task 3
  export const printOverallAnaylsedReq = (
    data: ILogObject[],
    {
      logSize,
      uniqueRecords,
    }: {
      logSize: string;
      uniqueRecords: UniqueValuesObject;
    }
  ): void => {
    try {
      const totalReq = data.length;
      const uniqueVistors = Object.keys(uniqueRecords.uniqueVistorsRecord).length;
      const referers = Object.keys(uniqueRecords.uniqueReffersRecord).length;
      const logSource = "log-generator/access.log";
      const failedReq = data.reduce(
        (prev, curr) => (curr.httpStatusCode >= 400 ? prev + 1 : prev + 0),
        0
      );
      const validReq = totalReq - failedReq;
      const uniqueFiles = Object.keys(uniqueRecords.uniqueFileRecord).length;
      const unique404 = Object.values(uniqueRecords.uniqueFileRecord).reduce(
        (prev, curr) => {
          const have404Req = curr.find((value) => value.httpStatusCode === 404);
          return have404Req ? prev + 1 : prev + 0;
        },
        0
      );
      const bandwidth = (
        data.reduce((prev, curr) => prev + curr.responseSize, 0) / 1024
      ).toFixed(2);
      const logStr = `Total Request  %(totalReq)s     Unique Visitors  %(uniqueVistors)s    Refferers  %(referers)s   Log Source  %(logSource)s\nValid Request  %(validReq)s     Unique Files     %(uniqueFiles)s    Unique 404 %(unique404)s    Log Size    %(logSize)s KiB\nFailed Request %(failedReq)s      Bandwidth        %(bandwidth)s  KiB`;
      const log = printf(logStr, {
        totalReq,
        uniqueVistors,
        referers,
        logSource,
        logSize,
        validReq,
        uniqueFiles,
        unique404,
        failedReq,
        bandwidth,
      });
      apacheTopPrinter("APACHE TOP Overall Analysed Requests", log);
    } catch (err) {
      console.log("Error in printOverallAnaylsedReq: ", err);
      throw err;
    }
  };
  
  //task 4
  
  const getDetailedInfoForDate = (
    date: string,
    uniqueDateRecord: ILogObject[]
  ): {
    date: string;
    totalUniqueVisitors: number;
    size: string;
    totalReqStr: string;
  } => {
    const uniqueVistorsSet = new Set(
      uniqueDateRecord.map((item) => item.ipAddress)
    );
    const totalUniqueVisitors = uniqueVistorsSet.size;
    const size = uniqueDateRecord.reduce(
      (prev, curr) => prev + curr.responseSize,
      0
    );
    const totalReqStr = new Array(uniqueDateRecord.length).fill("|").join("");
    return {
      date,
      totalUniqueVisitors,
      size: (size / 1024).toFixed(2),
      totalReqStr,
    };
  };
  export const printUniqueVisitorsperDay = (
    uniqueDateRecord: Record<string, ILogObject[]>,
    chunckSize: number
  ): void => {
    try {
      const descDateRecord = Object.keys(uniqueDateRecord);
      const logsPicked = indexDataArr(descDateRecord, chunckSize);
      logsPicked.sort((d1, d2) => {
        const [day1, monthStr1, year1] = d1.split("/");
        const date1 = new Date(Number(year1), Number(monthStr1), Number(day1));
        const [day2, monthStr2, year2] = d2.split("/");
        const date2 = new Date(Number(year2), Number(monthStr2), Number(day2));
        return date2 > date1 ? 1 : -1;
      });
  
      // indexing and rotation logic
  
      const logStr = logsPicked.reduce((prev, curr) => {
        const detailedInfo = getDetailedInfoForDate(curr, uniqueDateRecord[curr]);
        const infoLog = printf(
          "%(totalUniqueVisitors)s   %(size)s  KiB   %(date)s   %(totalReqStr)s\n",
          detailedInfo
        );
        return prev.concat(infoLog);
      }, "");
      apacheTopPrinter(
        "1. Unique Visitors Per Day",
        logStr,
        chunckSize,
        descDateRecord.length
      );
    } catch (err) {
      console.log("Error in printUniqueVisitors: ", err);
      throw err;
    }
  };
  
  // task 5
  const getDetailedInfoForFile = (
    httpReqCombined: string,
    fileReqs: ILogObject[]
  ): {
    path: string;
    type: string;
    http: string;
    totalReqs: number;
    size: string;
  } => {
    const [type, path, http] = httpReqCombined.split(" ");
    const totalReqs = fileReqs.length;
    const size = fileReqs.reduce((prev, curr) => prev + curr.responseSize, 0);
    return {
      path,
      type,
      http,
      totalReqs,
      size: (size / 1024).toFixed(2),
    };
  };
  export const printRequestedFiles = (
    uniqueFiles: Record<string, ILogObject[]>,
    chunckSize: number
  ): void => {
    try {
      const uniqueFilesSorted = Object.keys(uniqueFiles)
        .map((file) => {
          const fileInfo = getDetailedInfoForFile(file, uniqueFiles[file]);
          return fileInfo;
        })
        .sort((a, b) => b.totalReqs - a.totalReqs);
      const logsPicked = indexDataArr(uniqueFilesSorted, chunckSize);
  
      const logStr = logsPicked.reduce((prev, curr) => {
        const fileInfolog = printf(
          `%(totalReqs)s   %(size)s KiB    %(type)s    %(http)s    %(path)s\n`,
          curr
        );
        return prev.concat(fileInfolog);
      }, "");
      apacheTopPrinter(
        "2. Requested File (URLs)",
        logStr,
        chunckSize,
        uniqueFilesSorted.length
      );
    } catch (err) {
      console.log("Error in printRequestedFiles: ", err);
      throw err;
    }
  };
  
  // task 6
  export const print404RequestedFiles = (
    uniqueFiles: Record<string, ILogObject[]>,
    chunckSize: number
  ): void => {
    try {
      // filtering only 404 request
      const unique404RequestsObj: Record<string, ILogObject[]> = Object.keys(
        uniqueFiles
      ).reduce((prev, curr) => {
        const filtered404Arr = uniqueFiles[curr].filter(
          (file) => file.httpStatusCode === 404
        );
        if (filtered404Arr.length > 0) {
          return { ...prev, [curr]: filtered404Arr };
        }
        return { ...prev };
      }, {});
  
      const uniqueFilesSorted = Object.keys(unique404RequestsObj)
        .map((file) => {
          const fileInfo = getDetailedInfoForFile(
            file,
            unique404RequestsObj[file]
          );
          return fileInfo;
        })
        .sort((a, b) => b.totalReqs - a.totalReqs);
      const logsPicked = indexDataArr(uniqueFilesSorted, chunckSize);
      const logStr = logsPicked.reduce((prev, curr) => {
        const fileInfolog = printf(
          `%(totalReqs)s   %(size)s KiB    %(type)s    %(http)s    %(path)s\n`,
          curr
        );
        return prev.concat(fileInfolog);
      }, "");
      apacheTopPrinter(
        "3. 404 Requested File (URLs)",
        logStr,
        chunckSize,
        uniqueFilesSorted.length
      );
    } catch (err) {
      console.log("Error in print404RequestedFiles: ", err);
      throw err;
    }
  };