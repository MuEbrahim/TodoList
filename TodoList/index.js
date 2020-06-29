/* ------------------------------- HOME ----------------------------------*/
//get the inputfield
let input = document.querySelector("input");
//get add button
const addButton = document.querySelector(".todoInput").childNodes[3];
//get the cotainer which we store the todos in.
let container = document.querySelector('.todos');


class todo{
    constructor(inputText,docID,checked){
        this.createTodo(inputText,docID,checked)
    }
    createTodo(inputText,docID,checked){

        //div contains todo
        let divTodo = document.createElement('div')
        divTodo.classList.add('todo');
        divTodo.setAttribute('divID',docID)

        //inputField for todo
        let inputTodo = document.createElement('input')
        inputTodo.value = inputText;
        inputTodo.type = 'text'
        inputTodo.disabled = 'true'
        if(checked){
            inputTodo.style.textDecoration = 'line-through';
        }else{
            inputTodo.style.textDecoration = 'none';
        }
        
        //Button for check the todo
        let checkTodoBtn = document.createElement('button');
        checkTodoBtn.classList.add('fas', 'fa-check-circle')

        //Button for Delete the todo
        let deleteTodoBtn = document.createElement('button');
        deleteTodoBtn.classList.add('fas', 'fa-times-circle')

        //Button for Edit the todo
        let editTodoBtn = document.createElement('button');
        editTodoBtn.classList.add('fas', 'fa-edit')

        //Button for save the todo
        let saveTodoBtn = document.createElement('button');
        saveTodoBtn.classList.add('fas', 'fa-save')
        saveTodoBtn.style.display = 'none'


        //add the inputfield and buttons to the contianer div
        container.appendChild(divTodo)

        //add the inputfield and buttons to the todo-div
        divTodo.appendChild(inputTodo)
        divTodo.appendChild(saveTodoBtn)
        divTodo.appendChild(editTodoBtn)
        divTodo.appendChild(checkTodoBtn)
        divTodo.appendChild(deleteTodoBtn)

        //Edit function
        editTodoBtn.addEventListener('click',(e) =>{
            e.preventDefault();
            if(inputTodo.disabled == true){
                inputTodo.disabled = false
                editTodoBtn.style.display = 'none'
                saveTodoBtn.style.display = 'inline'   
            }
        })
        
        //save function
        saveTodoBtn.addEventListener('click',(e) =>{
            e.preventDefault()
            if(inputTodo.disabled != true){
                let divID = e.target.parentElement.getAttribute('divID')
                firebase.firestore().collection("Todos").doc(divID).update({
                    "text": inputTodo.value,
                })
                .then(function() {
                    console.log("Document successfully updated!");
                });
                inputTodo.disabled = true
                editTodoBtn.style.display = 'inline '
                saveTodoBtn.style.display = 'none'
            }
        })

        //Check function
        checkTodoBtn.addEventListener('click' ,(e) => {
            e.preventDefault();
            let divID = e.target.parentElement.getAttribute('divID')
                firebase.firestore().collection("Todos").doc(divID).update({
                    "checked": !checked
                })
            setTimeout (()=>location.reload(),500)
        })

        //Delete function
        deleteTodoBtn.addEventListener('click',(e) => {
            e.preventDefault()
            let divID = e.target.parentElement.getAttribute('divID')
            container.removeChild(divTodo)
            firebase.firestore().collection("Todos").doc(divID).delete().then(function() {
                console.log("Document successfully deleted!");  
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        })
    }
}


//check if the inputfield isn't empty then add the todo to the firestore and then reload 
function addData() {
    if(input.value !== '' && userID !==''){
        firebase.firestore().collection("Todos").add({
            text: input.value,
            userEmail: userEmail,
            checked:checked
        })
        .then(function() {
            input.value = ''
            location.reload();

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });        

    }
}

//get data from firestore and display it.
var checked = false;
function getData() {
    firebase.firestore().collection("Todos").where("userEmail","==",userEmail).get().then((snapshot)=>{
        snapshot.docs.forEach(doc => {
            checked = doc.data().checked
            new todo(doc.data().text,doc.id,checked)
        });
    });
}

//add todo to the list by the button
addButton.addEventListener('click',() => addData())

//add todo to the list by pressing enter
window.addEventListener('keydown',e =>{
    if(e.which === 13){
        addData()
    }
})



/* ------------------------------- HOME ----------------------------------*/


/* --------------------- Switing between Auth pages-----------------------*/


var userID ='';
var userEmail ='';
var user = '';
firebase.auth().onAuthStateChanged(function(user) {
    user = firebase.auth().currentUser;
    if (user != null) {
        userID = user.uid;
        userEmail = user.email;
        var checked = false;
        // get Data
        firebase.firestore().collection("Todos").where("userEmail","==",userEmail).get().then((snapshot)=>{
        snapshot.docs.forEach(doc => {
            checked = doc.data().checked
            new todo(doc.data().text,doc.id,checked)
        });
    });
    document.querySelector('nav').childNodes[3].style.display = 'inline'
    document.querySelector('.SignIn').style.display = 'none';
    document.querySelector('.SignUp').style.display = 'none';
    document.querySelector('.ForgetPassword').style.display = 'none';


    } else {
        document.querySelector('.container1').style.display = 'none';
        document.querySelector('.SignIn').style.display = 'block';
        document.querySelector('.SignUp').style.display = 'none';
        document.querySelector('.ForgetPassword').style.display = 'none';
            //SignIn is appeared
            document.querySelector('.createAcc').addEventListener('click',()=>{
                document.querySelector('.SignIn').style.display = 'none';
                document.querySelector('.SignUp').style.display = 'block';
            })
            document.querySelector('.forgetMy').addEventListener('click',()=>{
                document.querySelector('.SignIn').style.display = 'none';
                document.querySelector('.ForgetPassword').style.display = 'block';
            })

        if(document.querySelector('.SignUp').style.display === 'block'){
            document.querySelector('.haveaccount').addEventListener('click',()=>{
                document.querySelector('.SignUp').style.display = 'none';
                document.querySelector('.SignIn').style.display = 'block';
            })
            document.querySelector('.forgetMy1').addEventListener('click',()=>{
                document.querySelector('.SignUp').style.display = 'none';
                document.querySelector('.ForgetPassword').style.display = 'block';
            })
        }
        if(document.querySelector('.ForgetPassword').style.display === 'block'){
            document.querySelector('.haveaccount1').addEventListener('click',()=>{
                document.querySelector('.ForgetPassword').style.display = 'none';
                document.querySelector('.SignIn').style.display = 'block';
            })
            document.querySelector('.createAcc1').addEventListener('click',()=>{
                document.querySelector('.ForgetPassword').style.display = 'none';
                document.querySelector('.SignUp').style.display = 'block';
            })
        }
    }
  });


/* --------------------- Switing between Auth pages-----------------------*/



/* ------------------------------- SignIn ----------------------------------*/

if(document.querySelector('.SignIn').style.display = 'block'){

    document.querySelector('.SignInForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        let email = document.querySelector(".email").value
        let password = document.querySelector('.password').value
        firebase.auth().signInWithEmailAndPassword(email, password).then(()=>{
            document.querySelector('.container1').style.display = 'block'
            document.querySelector(".email").value = ''
            document.querySelector(".password").value = ''
            document.querySelector('.SignIn').style.display = 'none'
        }).catch(function(error) {
            // Handle Errors here.
            var errorMessage = error.message;
        console.log(errorMessage)
      });
    })
}

/* ------------------------------- SignIn ----------------------------------*/



/* ------------------------------- SignUp ----------------------------------*/

if(document.querySelector('.SignUp').style.display = 'block'){

    
    document.querySelector('.SignUpForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        let email = document.querySelector('.email1').value
        let password = document.querySelector('.password1').value
        let confirmPassword = document.querySelector('.confirmPassword').value
        if(password === confirmPassword)
               
            firebase.auth().createUserWithEmailAndPassword(email, password).then(()=>{
                document.querySelector('.SignUp').style.display = 'none'
                document.querySelector('.container1').style.display = 'block'
                document.querySelector(".email").value = ''
                document.querySelector(".password").value = ''
                document.querySelector(".confirmPassword").value = ''
            }).catch(function(error) {
                // Handle Errors here.
                var errorMessage = error.message;
               console.log(errorMessage)
              });
        })
    
}

/* ------------------------------- SignUp ----------------------------------*/

/* --------------------------- Forget Password -----------------------------*/

if(document.querySelector('.ForgetPassword').style.display = 'block'){

    document.querySelector('.forgetPasswordForm').addEventListener('submit',(e)=>{
        e.preventDefault()
        let email = document.querySelector('.email2').value
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            console.log('Sent!')
            document.querySelector('.ForgetPassword').style.display = 'none'
            document.querySelector('.SignIn').style.display = 'block'
            document.querySelector(".email2").value = ''
        }).catch(function(error) {
            console.log(error.message)
        });
    })
      
}
/* --------------------------- Forget Password -----------------------------*/

/* ------------------------------- SignOut ---------------------------------*/


document.querySelector('nav').childNodes[3].addEventListener('click',()=>{
    firebase.auth().signOut().then(()=>{
        document.querySelector('.container1').style.display = 'none'
        document.querySelector('nav').childNodes[3].style.display = 'none'
        document.querySelector('.SignIn').style.display = 'block'
        container.innerHTML = "";
    }).catch((error)=>{
        console.log(error.message)
    })
})


/* ------------------------------- SignOut ---------------------------------*/
