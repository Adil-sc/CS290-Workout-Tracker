let dBresponse = [];
let host = window.location.host;




/*********************************************************************
** Function responsible for fetching the JSON object from the workouts DB endpoint
*********************************************************************/
let popTable = () => {
    //let host = window.location.host;

    return fetch(`http://${host}/workouts`).then((response) => {
        if (response.status === 200) {

            return response.json();
        } else {
            throw new Error(`Unable to fetch data from DB`);
        }
    })
}


/*********************************************************************
** Gets a JSON response from the server, stores the result in an array, and then renders the contents of the array to screen
*********************************************************************/
let getDataFromDB = () => {
    popTable().then((response) => {
       // console.log(response);
        dbResponse = response;
        renderTable(dbResponse);
    }).catch((error) => {
        console.log(error);
    })

}


/*********************************************************************
** Responsible for sending a POST request and storing the form values that the user has provided into the mySQL DB
*********************************************************************/
let submitDataToDB = async () =>{

    let pName = document.querySelector('#GET-name').value;
    let pReps = document.querySelector('#GET-reps').value;
    let pWeight = document.querySelector('#GET-weight').value;
    let pDate = document.querySelector('#GET-date').value;
    let pLbs = document.querySelector('#GET-lbs').value;

	let fetchData = {
		method: 'POST',
		headers:{'Content-Type':'application/x-www-form-urlencoded'}
		
	}

	let response = await fetch ((`http://${host}/insert?name=${pName}&reps=${pReps}&weight=${pWeight}&date=${pDate}&lbs=${pLbs}`),fetchData);
	let data = await response.json();
	console.log(data);
	//renderTable(data);
	getDataFromDB();

    //Clears the form once its been submitted
    let inputForm = document.querySelector('#main-form');
    let allElements = inputForm.elements;
    for (let i = 0; i < allElements.length - 1; i++) {
        allElements[i].value = '';
    }

}

document.querySelector('#main-form').addEventListener('submit', (e) => {

    e.preventDefault();
	submitDataToDB();
/*     let req = new XMLHttpRequest();
    let pName = e.target.elements.name.value;
    let pReps = e.target.elements.reps.value;
    let pWeight = e.target.elements.weight.value;
    let pDate = e.target.elements.date.value;
    let pLbs = e.target.elements.lbs.value;
    req.open('POST', `http://${host}/insert?name=${pName}&reps=${pReps}&weight=${pWeight}&date=${pDate}&lbs=${pLbs}`, true);
    req.send(null);
    req.addEventListener('load', function() {

        if (req.status >= 200 && req.status < 400) {
            let response = (req.responseText);
            console.log(response);
            getDataFromDB();
        } else {
            console.log(`Error in network request`);
        }

    });

    //Clears the form once its been submitted
    let inputForm = document.querySelector('#main-form');
    let allElements = inputForm.elements;
    for (let i = 0; i < allElements.length - 1; i++) {
        allElements[i].value = '';
    }
 */


});


/*********************************************************************
** Responsible for deleting a row in the DB by its ID. 
*********************************************************************/
/* let deleteDataFromDB = (deleteID) => {

    return fetch(`http://${host}/delete?id=${deleteID}`).then((response) => {
        if (response.status === 200) {

            return response.json();
        } else {
            throw new Error(`Unable to fetch data from DB`);
        }
    })
}
 */
 
 let deleteDataFromDB = async (deleteID) => {
	 
		let fetchData = {
		method: 'POST',
		headers:{'Content-Type':'application/x-www-form-urlencoded'}
		
	}

	let response = await fetch(`http://${host}/delete?id=${deleteID}`,fetchData);
	let data = await response.json();
	return data;

}

//Promise function??
/* let deleteT = (deleteData) => {

    deleteDataFromDB(deleteData).then((response) => {
        dbResponse = response;
        renderTable(dbResponse);
    }).catch((error) => {
        console.log(error);
    })

} */
let deleteT = async (deleteData) => {

    deleteDataFromDB(deleteData);
	getDataFromDB();

}	


/*********************************************************************
** Function responsible grabbing the workout details from the response object and populating the values into the edit form
*********************************************************************/
let populateEditFields = (workoutToEdit) => {
    document.querySelector('#edit-form').setAttribute('style', 'display:block');
    document.querySelector('#GET-edit-id').value = workoutToEdit.id;
    document.querySelector('#GET-edit-name').value = workoutToEdit.name;
    document.querySelector('#GET-edit-reps').value = workoutToEdit.reps;
    document.querySelector('#GET-edit-weight').value = workoutToEdit.weight;
    document.querySelector('#GET-edit-date').value = moment(workoutToEdit.date).format('YYYY-DD-MM');
    document.querySelector('#GET-edit-lbs').value = workoutToEdit.lbs;

    //Disables the Save button while the contents of a row are being edited. 
    let inputForm = document.querySelector('#main-form');
    let allElements = inputForm.elements;
    for (let i = 0; i < allElements.length; i++) {
        allElements[i].disabled = true;
    }




}


/*********************************************************************
** Async Function responsible updating the values in the DB for a specic workout in the table
*********************************************************************/
//Async function: https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp
let editTableRow = async () => {

    let editId = document.querySelector('#GET-edit-id').value;
    let editName = document.querySelector('#GET-edit-name').value;
    let editReps = document.querySelector('#GET-edit-reps').value;
    let editWeight = document.querySelector('#GET-edit-weight').value;
    let editDate = document.querySelector('#GET-edit-date').value;
    let editLbs = document.querySelector('#GET-edit-lbs').value;

	let fetchData = {
		method: 'POST',
		headers:{'Content-Type':'application/x-www-form-urlencoded'}
		
	}

    let response = await fetch(`http://${host}/update/?name=${editName}&reps=${editReps}&weight=${editWeight}&date=${editDate}&lbs=${editLbs}&id=${editId}`,fetchData);
    let data = await response.json();
    console.log(data);
    return data;

}


/*********************************************************************
** Function responsible for creating and rendering the table and its contents
*********************************************************************/
let renderTable = (response) => {

    //let displayArea = document.createElement('div');
    //displayArea.setAttribute('id','display-area');
    let displayArea = document.getElementById('display-area');
    displayArea.innerHTML = "";

    //Table
    let table = document.createElement('table');
    table.setAttribute('class', 'table');
    table.setAttribute('id', 'main-table');

    //table.setAttribute('style','border:1px solid black');
    let thead = document.createElement('thead')
    let headerTr = document.createElement('tr');

    table.appendChild(thead);
    thead.appendChild(headerTr);

    let thName = document.createElement('th');
    let thReps = document.createElement('th');
    let thWeight = document.createElement('th');
    let thDate = document.createElement('th');
    let thLbs = document.createElement('th');
    let thDelete = document.createElement('th');
    let thEdit = document.createElement('th');
    thName.innerText = 'Name';
    thReps.innerText = 'Reps';
    thWeight.innerText = 'Weight';
    thDate.innerText = 'Date';
    thLbs.innerText = 'Lbs';
    thDelete.innerText = "Delete";
    thEdit.innerText = "Edit";

    headerTr.appendChild(thName);
    headerTr.appendChild(thReps);
    headerTr.appendChild(thWeight);
    headerTr.appendChild(thDate);
    headerTr.appendChild(thLbs);
    headerTr.appendChild(thDelete);
    headerTr.appendChild(thEdit);

    //Add the table to the display-area div, then add the div to the body
    displayArea.appendChild(table);
    document.body.appendChild(displayArea);

    //Render the DB rows
    let tableDyn = document.getElementById('main-table');
    //Source: https://stackoverflow.com/questions/5223/length-of-a-javascript-object
    let size = Object.keys(response).length;


    //Goes through the dbResponse array and renders each object on a new row
    for (let i = 0; i < size; i++) {

        //Form elements for delete button
        let deleteForm = document.createElement('form');
        deleteForm.setAttribute('id', 'delete-form');
        deleteForm.setAttribute('method', 'post');
        deleteForm.setAttribute('action', `http://${host}/delete?id=${response[i].id}`);

        let deleteFormInput = document.createElement('input');
        deleteFormInput.setAttribute('type', 'hidden'); //Change to hidden after
        deleteFormInput.setAttribute('name', 'deleteFormInput');

        let deleteFormSubmit = document.createElement('input');
        deleteFormSubmit.setAttribute('type', 'button'); 
        deleteFormSubmit.setAttribute('value', 'Delete');
        deleteFormSubmit.setAttribute('name', 'deleteFormSubmit');
        deleteFormSubmit.setAttribute('onclick', `deleteT(${response[i].id})`);

        deleteForm.appendChild(deleteFormInput);
        deleteForm.appendChild(deleteFormSubmit);

        //Form elements for Edit button
        let editForm = document.createElement('form');
        editForm.setAttribute('id', 'edit-form');
        editForm.setAttribute('method', 'post');
        editForm.setAttribute('action', ``);

        let editFormSubmit = document.createElement('input');
        editFormSubmit.setAttribute('type', 'button'); 
        editFormSubmit.setAttribute('value', 'Edit');
        editFormSubmit.setAttribute('name', 'deleteFormSubmit');
        editFormSubmit.setAttribute('onclick', `populateEditFields(${JSON.stringify(response[i])})`);


        editForm.appendChild(editFormSubmit);


        //Table row element
        let tr = document.createElement('tr');
        tableDyn.appendChild(tr);
        //Table cell elements
        let tdName = document.createElement('td');
        let tdReps = document.createElement('td');
        let tdWeight = document.createElement('td');
        let tdDate = document.createElement('td');
        let tdLbs = document.createElement('td');
        let deleteBtnCell = document.createElement('td');
        let editBtnCell = document.createElement('td');
        tdName.innerText = response[i].name;
        tdReps.innerText = response[i].reps;
        tdWeight.innerText = response[i].weight;
        tdDate.innerText = moment(response[i].date).format('MM-DD-YYYY');
        tdLbs.innerText = response[i].lbs;
        deleteFormInput.value = response[i].id;


        deleteBtnCell.appendChild(deleteForm);
        editBtnCell.appendChild(editForm);


        tr.appendChild(tdName);
        tr.appendChild(tdReps);
        tr.appendChild(tdWeight);
        tr.appendChild(tdDate);
        tr.appendChild(tdLbs);
        tr.appendChild(deleteBtnCell);
        tr.appendChild(editBtnCell);

    }


}


/*********************************************************************
** Responsible for calling the edit row function and then rendering the table with the updated values
*********************************************************************/
document.querySelector('#edit-area').addEventListener('submit', (e) => {

    dbResponse = editTableRow();
    renderTable(dbResponse);

});


/*********************************************************************
** Responsible for grabbing the initial values from the DB and rendering them
*********************************************************************/
window.addEventListener('DOMContentLoaded', (event) => {
    getDataFromDB();
});