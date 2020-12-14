
const decadeList: string[] = [
  "2020-2049",
  "2040-2069",
  "2070-2099"
];
const durArr: number[] = [1, 2, 6, 24, 72];
const returnArr: number[] = [2, 5, 10, 25, 50]



const jsonToCSV: any = (gridJSON: any) => {
  const headers = [
    "Return Interval(years)",
    "Duration(hours)",
    "Time Period",
    "access1.0",
    "access1.3",
    "bcc-csm1.1",
    "canesm2",
    "ccsm4",
    "csiro-mk3.6.0",
    "ensemble",
    "fgoals-g2",
    "gfdl-cm3",
    "giss-e2-h",
    "miroc5",
    "mri-cgcm3",
    "noresm1-m",
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

const createRows: any = (returnArr: number[], durArr: number[]) => {
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
    "ensemble_RCP8.5_wyMAX",
    "fgoals-g2_RCP8.5_wyMAX",
    "gfdl-cm3_RCP8.5_wyMAX",
    "giss-e2-h_RCP8.5_wyMAX",
    "miroc5_RCP8.5_wyMAX",
    "mri-cgcm3_RCP8.5_wyMAX",
    "noresm1-m_RCP8.5_wyMAX"
  ];

  for (let i = 0; i < gcmList.length; i++) {
    arr.push(JSON[arr[2]][gcmList[i]][arr[1] + '-hr'][arr[0] + '-yr']);
  }
}

const addMathColumns: any = (arr: number[]) => {
  let dataArr: number [] = arr.slice(3);
  dataArr.sort((a, b) => a - b)
  // with 13 GCMS, the sorted arr has mediam at index-6, max at index-12, min at index-0
  arr.push(dataArr[6])
  arr.push(dataArr[12])
  arr.push(dataArr[0])
}




// ["firstname", "lastname", "email"],
// ["Ahmed", "Tomi", "ah@smthing.co.com"],
// ["Raed", "Labes", "rl@smthing.co.com"],
// ["Yezzi", "Min l3b", "ymin@cocococo.com"]
// ];

// headers = [
//   { label: 'First Name', key: 'details.firstName' },
//   { label: 'Last Name', key: 'details.lastName' },
//   { label: 'Job', key: 'job' },
// ];
 
// data = [
//   { details: { firstName: 'Ahmed', lastName: 'Tomi' }, job: 'manager'},
//   { details: { firstName: 'John', lastName: 'Jones' }, job: 'developer'},
// ];

export default jsonToCSV;