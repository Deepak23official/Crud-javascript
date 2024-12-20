import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
const appSetting ={
    databaseURL:"https://crud-js-bfc59-default-rtdb.firebaseio.com"
} 
let app = initializeApp(appSetting)
let database = getDatabase(app)



const userList = ref(database,"Users")

const UserForm = document.querySelector("#form")
const UserId = document.querySelector("#id")
let UserNm = document.getElementById("userName")
const UserAge = document.getElementById("UserAge")
const UserCty = document.getElementById("UserCity")
const tBody = document.querySelector("#t-body")


UserForm.addEventListener("submit",function(e){
    e.preventDefault();
    
    if(!UserNm.value || !UserAge.value || !UserCty.value){
        alert("Please fill all details")
        return
    }
    if(UserId.value){
        set(ref(database,"Users/"+UserId.value),{
        name:UserNm.value,
        Age:UserAge.value,
        City:UserCty.value 
        })
        clearInput()
        return
    }
    const newUser = {
        name:UserNm.value,
        Age:UserAge.value,
        City:UserCty.value
    }
    push(userList, newUser)
    clearInput()
})
onValue(userList, function (snapshot) {
if(snapshot.exists()){
let userArray = Object.entries(snapshot.val())
console.log(userArray);
tBody.innerHTML = "";
for(let i=0;i<userArray.length;i++){
    let currentUser = userArray[i]
    let currentUserID = currentUser[0];
    let currentUserVal = currentUser[1] 
    
    tBody.innerHTML+=`
    <tr class="bg-white border *:border dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 *:px-3 md:*:px-6 *:py-4 text-center">
        <td>${i+1}</td>
        <td>${currentUserVal.name}</td>
        <td>${currentUserVal.Age}</td>
        <td>${currentUserVal.City}</td>
        <td>
        <button><i data-id="${currentUserID}" class="text-yellow-500 btn-edit fa-solid fa-pen-to-square"></i></button>
        </td>
        <td>
        <button><i data-id="${currentUserID}" class="text-red-700 fa-solid fa-trash"></i></button>
        </td>
    </tr>`;
}
}else{
    tBody.innerHTML = "<tr><td colspan='6'>No record Found</td></tr>"
}
})
document.addEventListener("click",function (e){
    if(e.target.classList.contains("btn-edit")){
        const id = e.target.dataset.id
        const td = e.target.closest("tr").children;
        UserId.value = id
        UserNm.value = td[1].textContent;
        UserAge.value = td[2].textContent;
        UserCty.value = td[3].textContent
    }else if(e.target.classList.contains("fa-trash")){
       if(confirm("Are you sure to delete?")){
        const id = e.target.dataset.id
        let data = ref(database,`Users/${id}`)
        remove(data)
       }
    }
})

function clearInput(){
    UserNm.value = ""
    UserAge.value = ""
    UserCty.value = ""
    UserId.value = ""
}