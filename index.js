import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBBKv0bFftovEPZhZ_k2XbjrEoATf68O1A",
    authDomain: "coursework-7e5bd.firebaseapp.com",
    databaseURL: "https://coursework-7e5bd-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "coursework-7e5bd",
    storageBucket: "coursework-7e5bd.appspot.com",
    messagingSenderId: "627904949119",
    appId: "1:627904949119:web:85979cc4e1f0f8db0ac84a",
    measurementId: "G-F6651FD3ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)

console.log("js is runnign")

//Item details
const item_name = document.getElementById("name")
const item_date = document.getElementById("date")
const item_desc = document.getElementById("desc")
const item_location = document.getElementById("location")
const item_owner = document.getElementById("owner")

const form = document.getElementById("form")
const reportError = document.getElementById("reportError")

const loadDB = document.getElementById('loadDB')
const DB = document.getElementById('DB')
const FoundItemName = document.getElementById("FoundItemName")
const LoadFoundItem = document.getElementById("LoadFoundItem")
const foundError = document.getElementById("foundError")

//-----------------SHOW AND HIDE ON BUTTON CLICK--------------//
const reportButton = document.getElementById("ReportButton");
const viewButton = document.getElementById("ViewButton");
const FoundButton = document.getElementById("FoundButton");
const ReportDisplay = document.getElementById("ReportDisplay");
const ViewDisplay = document.getElementById("ViewDisplay");
const FoundDisplay = document.getElementById("FoundDisplay")

reportButton.onclick = () => {
  ReportDisplay.style.display = "";
  ViewDisplay.style.display = "none";
  FoundDisplay.style.display = "none";
}
viewButton.onclick = () => {
  ReportDisplay.style.display = "none";
  ViewDisplay.style.display = "";
  FoundDisplay.style.display = "none";
}
FoundButton.onclick = () => {
  ReportDisplay.style.display = "none";
  ViewDisplay.style.display = "none";
  FoundDisplay.style.display = "";
}

//--------------REPORT AND ITEM AS FOUND----------------//
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formValidation().length > 0) {
        reportError.innerText = `Missing values: ${formValidation()}`
    }
    else {
        write()
        alert("Report successful!")
    }
})

function formValidation() {
    var errors = []
    if (item_name.value == "") {errors.push("Name")}
    if (item_desc.value == "") {errors.push("Description")}
    if (item_date.value == "") {errors.push("Date")}
    if (item_location.value == "") {errors.push("Location")}
    if (item_owner.value == "") {errors.push("Owner")}
    return errors.join(", ")
}

function write() {
  set(ref(db, item_name.value),{
      date: item_date.value,
      desc: item_desc.value,
      location: item_location.value,
      owner: item_owner.value,
      isFound: false
  })
}

//---------------VIEW LOST ITEMS----------------//
loadDB.onclick = () => {
  var item_iteration = 0
  get(ref(db,'/'))
    .then((snapshot) => {
      // The snapshot.val() contains all data under the "items" node
      const data = snapshot.val();
      // Now you can iterate over the data and process it as needed
      for (const key in data) {
        item_iteration += 1;
        //Item name
        var title = document.createElement("h3")
        title.innerHTML = key
        title.setAttribute("class","ItemDisplay")
        DB.appendChild(title)
        //Item details
        var details = document.createElement("div")
        details.setAttribute("id",`Item ${item_iteration}`)
        details.setAttribute("class","ItemDetailsDisplay")
        title.appendChild(details)

        if (data.hasOwnProperty(key)) {
          const item = data[key];
          processData(JSON.stringify(item),item_iteration)
        }
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
    });
}

function processData(string,item_iteration) {
  var current_item = document.getElementById(`Item ${item_iteration}`)
  var temp = string.slice(1,-1).split(',')
  for (var x of temp) {
    var tempDisplay = document.createElement("pre")
    tempDisplay.innerHTML = x + "\n"
    tempDisplay.setAttribute("class","ItemDetails")
    current_item.appendChild(tempDisplay)
    console.log(x)
  }
}

//---------------LOAD FOUND ITEMS----------------//
LoadFoundItem.onclick = () => {
  var itemToUpdate = FoundItemName.value
  if (itemToUpdate == "") {
    foundError.innerHTML = "Please enter the name of your found item!"
  } else {
    foundError.innerHTML = ""
    const updatedData = {
      isFound: true
    }
    update(ref(db, "/" + itemToUpdate),updatedData,{merge: true})
      .then(() => {
        alert("Marked Item as found! Please double check the data base!")
      })
      .catch((error) => {
        alert(error)
      })
  }
}