// initilizing Inputs
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const activityInput = document.getElementById("activity");

const submit = document.getElementById("submitBtn");

// initilizing Inputs
const cardContainer = document.getElementById("cards-container");
const mealsDetails = document.getElementById("details");
const ingredientSection = document.getElementById("ingredients");
const stepsSection = document.getElementById("steps");
const equipmentSection = document.getElementById("equipment");
const recipeSection = document.getElementById("recipe-section");
const apiKey = "c445c3c4231c4298a70069788068d096";

// User Inputs
const getCalorie = () => {
    let height = heightInput.value;
    let weight = weightInput.value;
    let age = ageInput.value;
    let gender = genderInput.value;
    let physicalActivity = activityInput.value;
    let BMR;
    //Display Alert incase of empty or negative values
    if (height === "" || height <= 0 || weight === "" || weight <= 0 || age === "" || age <= 0) {
        alert(
            "All input field should not be empty and should not have negetive value"
        );
        return;
    }
    // BMR Calculation
    if (gender === "female") {
        BMR = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
    } else if (gender === "male") {
        BMR = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
    }

    // Daily Calorie Requirement
    if (physicalActivity === "light") {
        BMR *= 1.375;
    } else if (physicalActivity === "moderate") {
        BMR *= 1.55;
    } else if (physicalActivity === "active") {
        BMR *= 1.725;
    }

    getMeals(BMR);
};

// Fetching Data Using APIs
const getMeals = async(BMR) => {      //async = when html page load then parallely 
    document.getElementById("loader").style.display = "block";
    const url = `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${BMR}&apiKey=${apiKey}&includeNutrition=true`;  //$ = calling anything with backtick

    let datas;
    await fetch(url)            //await = Its wait when Promises is not fullfill
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            datas = data;
        });
    generateMealsCard(datas);
    document.getElementById("loader").style.display = "none";
};

//Creating HTML within JS 
//Netrients Section
const generateMealsCard = (datas) => {
    let cards = ``;
    mealsDetails.innerHTML = `                           
  <h1>Nutrients</h1>
  <div class="d-flex justify-content-center">
      <p class="px-2">Calories : ${datas?.nutrients?.calories}</p>
      <p class="px-2">Carbohydrates : ${datas.nutrients?.carbohydrates}</p>
      <p class="px-2">Fat : ${datas.nutrients?.fat}</p>
      <p class="px-2">Protein : ${datas.nutrients?.protein}</p>
  </div>
  `;

  //Fetching Images
    datas.meals.map(async(data) => {
        const url = `https://api.spoonacular.com/recipes/${data.id}/information?apiKey=${apiKey}&includeNutrition=false`;
        let imgURL;
        await fetch(url)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                imgURL = data.image;
            });
            //data.title & timing  how its fetching data
        cards += `
        <div class="col-md-4 d-flex justify-content-center mb-2">
            <div class="card baseBlock" style="width: 18rem;">
                <img src=${imgURL} class="card-img-top"
                    alt="meal 1">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>    
                    <p>Preparation Time - ${data.readyInMinutes}</p>
                    <button class="btn btn-outline-primary" onClick="btnRecipe(${data.id})" >Get Recipe</button>
                </div>
            </div>
        </div>
        `;
        cardContainer.innerHTML = cards;
    });
};
 
//Get Recipes
const btnRecipe = async(data) => {
    recipeSection.innerHTML = "";
    ingredientSection.innerHTML = "";
    stepsSection.innerHTML = "";
    equipmentSection.innerHTML = "";
    const url = `https://api.spoonacular.com/recipes/${data}/information?apiKey=${apiKey}&includeNutrition=false`;
    let information;

    await fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            information = data;
        });

    recipeSection.textContent = `${information.title} Recipe`;

    //   Ingridents
    let htmlData = ``;
    let inCardDiv = document.createElement("div");
    inCardDiv.classList.add("carddesign", "card", "h-100");
    let inCardBody = document.createElement("div");
    inCardBody.classList.add("card-body");
    let inOverlay = document.createElement("div");
    inOverlay.classList.add("overlay");
    let ul = document.createElement("ul");
    information.extendedIngredients.map((ingre) => {
        htmlData += `
        <li>${ingre.original}</li>
        `; 
    });
    ul.innerHTML = htmlData;
    let ingreH1 = document.createElement("h3");
    ingreH1.textContent = "INGREDIENTS";
    inCardBody.appendChild(inOverlay);      //append works 
    inCardBody.appendChild(ingreH1);
    inCardBody.appendChild(ul);
    inCardDiv.appendChild(inCardBody);
    ingredientSection.appendChild(inCardDiv);

    //   Steps
    let stepsHtml = ``;
    let stepsCardDive = document.createElement("div");
    stepsCardDive.classList.add("carddesign", "card", "h-100");
    let stepsCardBody = document.createElement("div");
    stepsCardBody.classList.add("card-body");
    let stepsOverlay = document.createElement("div");
    stepsOverlay.classList.add("overlay");
    let stepsOl = document.createElement("ol");
    information.analyzedInstructions[0].steps.map((step) => {
        stepsHtml += `
        <li>${step.step}</li>
        `;
    });
    stepsOl.innerHTML = stepsHtml;
    let stepsH1 = document.createElement("h3");
    stepsH1.textContent = "STEPS";
    stepsCardBody.appendChild(stepsOverlay);
    stepsCardBody.appendChild(stepsH1);
    stepsCardBody.appendChild(stepsOl);
    stepsCardDive.appendChild(stepsCardBody);
    stepsSection.appendChild(stepsCardDive);

    // equipmentSection
    const urlEquip = `https://api.spoonacular.com/recipes/${data}/equipmentWidget.json?apiKey=${apiKey}&includeNutrition=false`;
    let equip;

    await fetch(urlEquip)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            equip = data;
        });

    let equipData = ``;
    let eqCardDiv = document.createElement("div");
    eqCardDiv.classList.add("carddesign", "card", "h-100");
    let eqCardBody = document.createElement("div");
    eqCardBody.classList.add("card-body");
    let eqOverlay = document.createElement("div");
    eqOverlay.classList.add("overlay");
    let equipUl = document.createElement("ul");
    equip.equipment.map((equip) => {
        equipData += `
            <li>${equip.name}</li>
            `;
    });
    equipUl.innerHTML = equipData;
    let equipH1 = document.createElement("h3");
    equipH1.textContent = "EQUIPMENT";
    eqCardBody.appendChild(eqOverlay);
    eqCardBody.appendChild(equipH1);
    eqCardBody.appendChild(equipUl);
    eqCardDiv.appendChild(eqCardBody);
    equipmentSection.appendChild(eqCardDiv);
};

submit.addEventListener("click", getCalorie);


// function sendMail(event){
//     event.preventDefault();
//     alert("send successfully😊 ");
// }