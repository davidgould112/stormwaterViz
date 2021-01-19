const createChartCSV: any = (gridJSON: any, 
                            xAxisParam: string, 
                            decade: string, 
                            returnInt: number,
                            duration: number
                            ) => {

  const durArr: number[] = [1, 2, 6, 24, 72];
  const returnArr: number[] = [2, 5, 10, 25, 50, 100];
  const decadeList: string[] = [
    "2020-2049",
    "2030-2059",
    "2040-2069",
    "2050-2079",
    "2060-2089",
    "2070-2099"
  ];

  const decadeStrMap: any = {
    "2030": "2020-2049",
    "2040": "2030-2059",
    "2050": "2040-2069",
    "2060": "2050-2079",
    "2070": "2060-2089",
    "2080": "2070-2099"
  };

  const gcmList = [
    "access1.0_RCP8.5_wyMAX",
    "access1.3_RCP8.5_wyMAX",
    "bcc-csm1.1_RCP8.5_wyMAX",
    "canesm2_RCP8.5_wyMAX",
    "ccsm4_RCP8.5_wyMAX",
    "csiro-mk3.6.0_RCP8.5_wyMAX",
    "fgoals-g2_RCP8.5_wyMAX",
    "gfdl-cm3_RCP8.5_wyMAX",
    "giss-e2-h_RCP8.5_wyMAX",
    "miroc5_RCP8.5_wyMAX",
    "mri-cgcm3_RCP8.5_wyMAX",
    "noresm1-m_RCP8.5_wyMAX",
    "ensemble_RCP8.5_wyMAX"
  ];

  const headers = [
    "Model",
    "Return Interval(years)",
    "Duration(hours)",
    "Time Period",
    "Projected Change(%)",
  ];

  let rows : any[] = [];
  
  rows.push(headers);

  if (xAxisParam === "decade") {

    for(let i = 0; i < decadeList.length; i++) {
      let allValues: number[] = [];
      for(let j = 0; j < gcmList.length; j++) {
        const gcmVal = gridJSON[decadeList[i]][gcmList[j]][duration+"-hr"][ returnInt+"-yr"];
        if(gcmList[j] === "ensemble_RCP8.5_wyMAX") {
          rows.push(["Average", returnInt, duration, decadeList[i], gcmVal.toFixed(1)]);
        } else {
          rows.push([gcmList[j], returnInt, duration, decadeList[i], gcmVal.toFixed(1)]);
          allValues.push(gcmVal);
        }
      }
      const minMaxArr: number[] = calcMinMax(allValues);
      rows.push(["Min", returnInt, duration, decadeList[i], minMaxArr[0].toFixed(1)])
      rows.push(["Max", returnInt, duration, decadeList[i], minMaxArr[1].toFixed(1)])
    }

  } else if (xAxisParam === "duration") {
    const decadeStr = decadeStrMap[decade];
    let allValues: number[] = [];
    for(let i = 0; i < durArr.length; i++) {
      for(let j = 0; j < gcmList.length; j++) {
        const gcmVal = gridJSON[decadeStr][gcmList[j]][durArr[i]+"-hr"][ returnInt+"-yr"];
        if(gcmList[j] === "ensemble_RCP8.5_wyMAX") {
          rows.push(["Average", returnInt, durArr[i], decadeStr, gcmVal.toFixed(1)]);
        } else {
          rows.push([gcmList[j], returnInt, durArr[i], decadeStr, gcmVal.toFixed(1)]);
          allValues.push(gcmVal);
        }
      }
      const minMaxArr: number[] = calcMinMax(allValues);
      rows.push(["Min", returnInt, durArr[i], decadeStr, minMaxArr[0].toFixed(1)])
      rows.push(["Max", returnInt, durArr[i], decadeStr, minMaxArr[1].toFixed(1)])
    }

  } else if (xAxisParam === "return-int") {
    let allValues: number[] = [];
    const decadeStr = decadeStrMap[decade];
    for(let i = 0; i < returnArr.length; i++) {
      for(let j = 0; j < gcmList.length; j++) {
        const gcmVal = gridJSON[decadeStr][gcmList[j]][duration+"-hr"][ returnArr[i]+"-yr"];
        if(gcmList[j] === "ensemble_RCP8.5_wyMAX") {
          rows.push(["Average", returnArr[i], duration, decadeStr, gcmVal.toFixed(1)]);
        } else {
          rows.push([gcmList[j], returnArr[i], duration, decadeStr, gcmVal.toFixed(1)]);
          allValues.push(gcmVal);
        }
      }
      const minMaxArr: number[] = calcMinMax(allValues);
      rows.push(["Min", returnArr[i], duration, decadeStr, minMaxArr[0].toFixed(1)])
      rows.push(["Max", returnArr[i], duration, decadeStr, minMaxArr[1].toFixed(1)])
    }
  }
  return rows;
}

const calcMinMax: any = (arr: number[]) => {
  //sorts array lowest to highest value
  arr.sort((a, b) => a - b)
  return [arr[0], arr[arr.length -1]]
}

export default createChartCSV;