// generates csv for all grid cell data

const jsonToCSV: any = (gridJSON: any) => {

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

  for(let g = 0; g < durArr.length; g++) {
    for(let h = 0; h < returnArr.length; h++) {
      for(let i = 0; i < decadeList.length; i++) {
        let durRetDecValuesArr: number[] = [];
        for(let j = 0; j < gcmList.length; j++) {
          const gcmVal = gridJSON[decadeList[i]][gcmList[j]][durArr[g]+"-hr"][ returnArr[h]+"-yr"];
          if(gcmList[j] === "ensemble_RCP8.5_wyMAX") {
            rows.push(["Average", returnArr[h], durArr[g], decadeList[i], gcmVal.toFixed(1)]);
          } else {
            rows.push([gcmList[j], returnArr[h], durArr[g], decadeList[i], gcmVal.toFixed(1)]);
            durRetDecValuesArr.push(gcmVal);
          }
        }
        const minMaxArr: number[] = calcMinMax(durRetDecValuesArr);
        rows.push(["Min", returnArr[h], durArr[g], decadeList[i], minMaxArr[0].toFixed(1)])
        rows.push(["Max", returnArr[h], durArr[g], decadeList[i], minMaxArr[1].toFixed(1)])
      }
    }
  }

  return rows;
}

const calcMinMax: any = (arr: number[]) => {
  //sorts array lowest to highest value
  arr.sort((a, b) => a - b)
  return [arr[0], arr[arr.length -1]]
}

export default jsonToCSV;