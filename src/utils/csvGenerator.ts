// generates csv for all grid cell data

const jsonToCSV: any = (gridJSON: any) => {

  const decadeList: string[] = [
    "2020-2049",
    "2030-2059",
    "2040-2069",
    "2050-2079",
    "2060-2089",
    "2070-2099"
  ];
  const durArr: number[] = [1, 2, 6, 24, 72];
  const returnArr: number[] = [2, 5, 10, 25, 50];
  const headers = [
    "Return Interval(years)",
    "Duration(hours)",
    "Time Period",
    "access1.0_RCP8.5",
    "access1.3_RCP8.5",
    "bcc-csm1.1_RCP8.5",
    "canesm2_RCP8.5",
    "ccsm4_RCP8.5",
    "csiro-mk3.6.0_RCP8.5",
    // "ensemble_RCP8.5",
    "fgoals-g2_RCP8.5",
    "gfdl-cm3_RCP8.5",
    "giss-e2-h_RCP8.5",
    "miroc5_RCP8.5",
    "mri-cgcm3_RCP8.5",
    "noresm1-m_RCP8.5",
    "Median",
    "Max",
    "Min"
  ]

  let rows = createRows(returnArr, durArr, decadeList);

  for (let i = 0; i < rows.length; i++) {
    addModelColumns(rows[i], gridJSON);
    addMathColumns(rows[i]);
  }

  rows.unshift(headers);

  return rows

}

const createRows: any = (returnArr: number[], durArr: number[], decadeList: string[]) => {
  let rowArr: any[] = []; 
  for(let i = 0; i < returnArr.length; i++) {
    for(let j = 0; j < durArr.length; j++) {
      for(let k = 0; k < decadeList.length; k++) {
        rowArr.push([returnArr[i], durArr[j], decadeList[k]])
      }
    }
  }
  return rowArr;
};

const addModelColumns: any = (arr: number[], JSON: any) => {
  const gcmList = [
    "access1.0_RCP8.5_wyMAX",
    "access1.3_RCP8.5_wyMAX",
    "bcc-csm1.1_RCP8.5_wyMAX",
    "canesm2_RCP8.5_wyMAX",
    "ccsm4_RCP8.5_wyMAX",
    "csiro-mk3.6.0_RCP8.5_wyMAX",
    // "ensemble_RCP8.5_wyMAX",
    "fgoals-g2_RCP8.5_wyMAX",
    "gfdl-cm3_RCP8.5_wyMAX",
    "giss-e2-h_RCP8.5_wyMAX",
    "miroc5_RCP8.5_wyMAX",
    "mri-cgcm3_RCP8.5_wyMAX",
    "noresm1-m_RCP8.5_wyMAX"
  ];

  for (let i = 0; i < gcmList.length; i++) {
    arr.push(JSON[arr[2]][gcmList[i]][arr[1] + '-hr'][arr[0] + '-yr'].toFixed(1));
  }
}

const addMathColumns: any = (arr: number[]) => {
  let dataArr: number [] = arr.slice(3);
  dataArr.sort((a, b) => a - b)
  // with 13 GCM's, the sorted arr has mediam at index-6, max at index-12, min at index-0
  arr.push(dataArr[6])
  arr.push(dataArr[11]) // index 11 w/o ensemble, 12 w/ ensemble
  arr.push(dataArr[0])
}

export default jsonToCSV;